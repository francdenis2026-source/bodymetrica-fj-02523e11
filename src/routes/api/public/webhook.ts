import { createFileRoute } from '@tanstack/react-router'
import { createHmac, timingSafeEqual } from 'crypto'

function safeEqualHex(a: string, b: string) {
  if (!/^[a-f0-9]+$/i.test(a) || !/^[a-f0-9]+$/i.test(b) || a.length !== b.length) return false
  const left = Buffer.from(a, 'hex')
  const right = Buffer.from(b, 'hex')
  return left.length === right.length && timingSafeEqual(left, right)
}

function makeLicenseKey() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const block = (size: number) => Array.from({ length: size }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
  return `BMFJ-${block(5)}-${block(5)}-${block(5)}`
}

function webhookDataId(request: Request, body: any) {
  const url = new URL(request.url)
  return String(url.searchParams.get('data.id') || url.searchParams.get('data_id') || body?.data?.id || body?.resource || '')
}

function verifyMercadoPagoSignature(request: Request, body: any, secret: string) {
  const signature = request.headers.get('x-signature') || ''
  const requestId = request.headers.get('x-request-id') || ''
  const dataId = webhookDataId(request, body)
  if (!signature || !requestId || !dataId) return false

  const values = Object.fromEntries(signature.split(',').map((part) => {
    const [key, ...rest] = part.trim().split('=')
    return [key, rest.join('=')]
  }))
  const ts = values.ts
  const v1 = values.v1
  if (!ts || !v1) return false

  // Mercado Pago official manifest: id:<data.id>;request-id:<x-request-id>;ts:<ts>;
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const expected = createHmac('sha256', secret).update(manifest).digest('hex')
  return safeEqualHex(v1, expected)
}

async function markEvent(supabaseAdmin: any, eventId: string, values: Record<string, unknown>) {
  await supabaseAdmin.from('webhook_events').update(values).eq('event_id', eventId)
}

export const Route = createFileRoute('/api/public/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = request.headers.get('x-request-id') || null
        let eventId = requestId || `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`

        try {
          const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
          const bodyText = await request.text()
          let body: any
          try {
            body = JSON.parse(bodyText || '{}')
          } catch {
            return new Response('Invalid JSON', { status: 400 })
          }

          eventId = requestId || String(body?.id || eventId)
          const topic = String(body?.type || body?.topic || '')
          const resourceId = webhookDataId(request, body)

          const { data: secretSetting } = await supabaseAdmin
            .from('admin_settings')
            .select('value')
            .eq('key', 'mercadopago_webhook_secret')
            .maybeSingle()

          const webhookSecret = String(secretSetting?.value || '').trim()
          if (webhookSecret && !verifyMercadoPagoSignature(request, body, webhookSecret)) {
            console.error('[Webhook] Mercado Pago signature rejected', { eventId, resourceId })
            return new Response('Invalid signature', { status: 401 })
          }

          const { data: existingEvent } = await supabaseAdmin
            .from('webhook_events')
            .select('id,status')
            .eq('event_id', eventId)
            .maybeSingle()

          if (existingEvent?.status === 'processed') {
            return new Response('Already processed', { status: 200 })
          }

          await supabaseAdmin.from('webhook_events').upsert({
            event_id: eventId,
            topic: topic || 'unknown',
            payload: body,
            status: 'pending',
          }, { onConflict: 'event_id' })

          if (topic !== 'payment' || !resourceId) {
            await markEvent(supabaseAdmin, eventId, { status: 'processed', processed_at: new Date().toISOString() })
            return new Response('ok', { status: 200 })
          }

          const { data: tokenSetting } = await supabaseAdmin
            .from('admin_settings')
            .select('value')
            .eq('key', 'mercadopago_access_token')
            .maybeSingle()

          if (!tokenSetting?.value) {
            await markEvent(supabaseAdmin, eventId, { status: 'failed', failure_reason: 'missing_mp_token', error_message: 'Mercado Pago access token não configurado.' })
            return new Response('Mercado Pago not configured', { status: 500 })
          }

          const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(resourceId)}`, {
            headers: { Authorization: `Bearer ${tokenSetting.value}` },
          })

          if (!paymentResponse.ok) {
            await markEvent(supabaseAdmin, eventId, { status: 'failed', failure_reason: 'payment_lookup_failed', error_message: `HTTP ${paymentResponse.status}` })
            return new Response('Payment lookup failed', { status: 502 })
          }

          const payment = await paymentResponse.json() as any
          const paymentStatus = String(payment?.status || '')
          const userId = String(payment?.external_reference || payment?.metadata?.user_id || '')
          const payerEmail = String(payment?.payer?.email || payment?.metadata?.email || '').trim().toLowerCase()
          const planId = payment?.metadata?.plan_id ? String(payment.metadata.plan_id) : null
          const durationMinutes = Math.max(1, Number(payment?.metadata?.duration_minutes || 365 * 24 * 60))
          const amount = Number(payment?.transaction_amount || 0)

          if (!userId) {
            await markEvent(supabaseAdmin, eventId, { status: 'failed', failure_reason: 'missing_user_reference', error_message: 'Pagamento sem external_reference/user_id.' })
            return new Response('Missing user reference', { status: 400 })
          }

          const salePayload = {
            user_id: userId,
            plan_id: planId,
            amount,
            status: paymentStatus === 'approved' ? 'paid' : paymentStatus || 'pending',
            provider: 'mercadopago',
            provider_reference: String(payment?.id || resourceId),
            customer_email: payerEmail || null,
            sold_at: payment?.date_approved || payment?.date_created || new Date().toISOString(),
          }

          const { data: existingSale } = await supabaseAdmin
            .from('sales')
            .select('id')
            .eq('provider', 'mercadopago')
            .eq('provider_reference', salePayload.provider_reference)
            .maybeSingle()

          if (existingSale?.id) {
            await supabaseAdmin.from('sales').update(salePayload).eq('id', existingSale.id)
          } else {
            await supabaseAdmin.from('sales').insert(salePayload)
          }

          if (paymentStatus !== 'approved') {
            await markEvent(supabaseAdmin, eventId, {
              status: 'processed',
              processed_at: new Date().toISOString(),
              processed_by_user_id: userId,
            })
            return new Response('ok', { status: 200 })
          }

          const expiresAt = new Date(Date.now() + durationMinutes * 60_000).toISOString()
          const licenseKey = makeLicenseKey()

          const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId)
          const email = payerEmail || String(authUser?.user?.email || '').toLowerCase()

          const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
            id: userId,
            email: email || null,
            account_status: 'active',
            license_status: 'active',
            license_key: licenseKey,
            license_expires_at: expiresAt,
            access_tier: 'paid',
            access_source: 'subscription',
            current_plan_id: planId,
            access_updated_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' })

          if (profileError) {
            await markEvent(supabaseAdmin, eventId, { status: 'failed', failure_reason: 'profile_update_failed', error_message: profileError.message })
            return new Response('Profile update failed', { status: 500 })
          }

          let licenseId: string | null = null
          const { data: alreadyLicensed } = await supabaseAdmin
            .from('licenses')
            .select('id')
            .eq('user_id', userId)
            .eq('source', 'subscription')
            .eq('status', 'active')
            .order('activated_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          if (alreadyLicensed?.id) {
            licenseId = alreadyLicensed.id
            await supabaseAdmin.from('licenses').update({
              expires_at: expiresAt,
              duration_minutes: durationMinutes,
              access_tier: 'paid',
              label: planId ? `Plano ${planId}` : 'Assinatura Mercado Pago',
            }).eq('id', alreadyLicensed.id)
          } else {
            const { data: createdLicense, error: licenseError } = await supabaseAdmin.from('licenses').insert({
              license_key: licenseKey,
              status: 'active',
              user_id: userId,
              activated_at: new Date().toISOString(),
              expires_at: expiresAt,
              duration_minutes: durationMinutes,
              access_tier: 'paid',
              label: planId ? `Plano ${planId}` : 'Assinatura Mercado Pago',
              source: 'subscription',
            }).select('id').single()
            if (licenseError) {
              await markEvent(supabaseAdmin, eventId, { status: 'failed', failure_reason: 'license_create_failed', error_message: licenseError.message })
              return new Response('License provisioning failed', { status: 500 })
            }
            licenseId = createdLicense.id
          }

          await supabaseAdmin.from('sales').update({ access_granted_at: new Date().toISOString() })
            .eq('provider', 'mercadopago')
            .eq('provider_reference', salePayload.provider_reference)

          await supabaseAdmin.from('license_audit_logs').insert({
            license_id: licenseId,
            user_id: userId,
            action: 'payment_activation',
            details: {
              payment_id: salePayload.provider_reference,
              event_id: eventId,
              plan_id: planId,
              amount,
              duration_minutes: durationMinutes,
              expires_at: expiresAt,
              source: 'mercadopago_webhook',
            },
          })

          if (email) {
            await supabaseAdmin.auth.resetPasswordForEmail(email, {
              redirectTo: `${process.env['VITE_APP_URL'] || 'https://bodymetrica-fj.lovable.app'}/auth?reset=true`,
            }).catch((error: unknown) => console.error('[Webhook] Password setup email failed:', error))

            const { sendLicenseEmail } = await import('@/lib/email.functions')
            sendLicenseEmail({ data: { email, type: 'renewed', details: { payment_id: salePayload.provider_reference, expires_at: expiresAt } } }).catch(console.error)
          }

          await markEvent(supabaseAdmin, eventId, {
            status: 'processed',
            processed_at: new Date().toISOString(),
            processed_by_user_id: userId,
          })

          return new Response('ok', { status: 200 })
        } catch (error: any) {
          console.error('[Webhook] Error:', error)
          try {
            const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
            await markEvent(supabaseAdmin, eventId, { status: 'failed', failure_reason: 'unhandled_error', error_message: String(error?.message || error) })
          } catch {}
          return new Response('Internal Server Error', { status: 500 })
        }
      },
    },
  },
})
