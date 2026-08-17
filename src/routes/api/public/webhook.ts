import { createFileRoute } from '@tanstack/react-router'
import { createHmac, timingSafeEqual } from 'crypto'
import { z } from 'zod'

export const Route = createFileRoute('/api/public/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          
          // 1. Get Secret from admin_settings for verification
          const { data: secretSetting } = await supabaseAdmin
            .from('admin_settings')
            .select('value')
            .eq('key', 'mercadopago_webhook_secret')
            .maybeSingle();

          const webhookSecret = secretSetting?.value;

          // 2. Verify Mercado Pago Signature (if secret is configured)
          // Documentation: https://www.mercadopago.com.br/developers/pt/docs/notifications/webhooks/signature
          const signature = request.headers.get('x-signature');
          const requestId = request.headers.get('x-request-id');
          
          if (webhookSecret && signature) {
            const bodyText = await request.text();
            // Verify HMAC-SHA256 signature
            // Example pattern: x-signature: ts=...,v1=...
            const parts = signature.split(',');
            const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];
            const v1 = parts.find(p => p.startsWith('v1='))?.split('=')[1];

            if (ts && v1) {
              const manifest = `id:${requestId};ts:${ts};`;
              const hmac = createHmac('sha256', webhookSecret)
                .update(manifest)
                .update(bodyText)
                .digest('hex');

              if (!timingSafeEqual(Buffer.from(v1), Buffer.from(hmac))) {
                 console.error('[Webhook] Invalid signature match');
                 return new Response('Invalid signature', { status: 401 });
              }
            }
          }

          // Read body once (careful with stream consumption if already read as text)
          const body = typeof (await request.clone().text()) === 'string' 
            ? JSON.parse(await request.clone().text()) 
            : await request.json();

          const topic = body.topic || body.type || (body.data && body.data.type);
          const resourceId = body.resource || (body.data && body.data.id);
          const eventId = requestId || body.id || `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;

          console.log(`[Webhook] Received topic: ${topic}, resource: ${resourceId}, event: ${eventId}`);

          // 3. Idempotency Check
          const { data: existingEvent } = await supabaseAdmin
            .from('webhook_events')
            .select('id, status')
            .eq('event_id', eventId)
            .maybeSingle();

          if (existingEvent?.status === 'processed') {
            return new Response('Already processed', { status: 200 });
          }

          // 4. Record event
          await supabaseAdmin.from('webhook_events').upsert({
            event_id: eventId,
            topic: topic || 'unknown',
            payload: body,
            status: 'pending'
          }, { onConflict: 'event_id' });

          if (topic === 'payment') {
            const { data: tokenSetting } = await supabaseAdmin
              .from('admin_settings')
              .select('value')
              .eq('key', 'mercadopago_access_token')
              .single();

            if (!tokenSetting?.value) {
              return new Response('Configuração do Mercado Pago ausente', { status: 500 });
            }

            // 5. Fetch payment details
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${resourceId}`, {
              headers: { 'Authorization': `Bearer ${tokenSetting.value}` }
            });

            if (!response.ok) {
              return new Response('Erro ao buscar pagamento', { status: 502 });
            }

            const paymentData = await response.json();
            
            if (paymentData.status === 'approved') {
              const userId = paymentData.external_reference;
              
              if (!userId) {
                console.error('[Webhook] Missing external_reference');
                await supabaseAdmin.from('webhook_events').update({ status: 'failed' }).eq('event_id', eventId);
                return new Response('Missing external_reference', { status: 400 });
              }

              const expiresAt = new Date();
              expiresAt.setFullYear(expiresAt.getFullYear() + 1);

              // Update Profile
              await supabaseAdmin.from('profiles').update({ 
                license_status: 'active',
                license_expires_at: expiresAt.toISOString()
              }).eq('id', userId);

              // Update License
              const { data: license } = await supabaseAdmin.from('licenses').select('id').eq('user_id', userId).eq('status', 'active').maybeSingle();
              if (license) {
                await supabaseAdmin.from('licenses').update({ expires_at: expiresAt.toISOString() }).eq('id', license.id);
              }

              // Audit Log
              await supabaseAdmin.from('license_audit_logs').insert({
                user_id: userId,
                action: 'payment_activation',
                details: { payment_id: resourceId, event_id: eventId, source: 'mercadopago_webhook' }
              });

              // Notify User
              const { data: userData } = await supabaseAdmin.from('profiles').select('email').eq('id', userId).single();
              if (userData?.email) {
                const { sendLicenseEmail } = await import("@/lib/email.functions");
                sendLicenseEmail({ data: { email: userData.email, type: 'renewed', details: { payment_id: resourceId } } }).catch(console.error);
              }

              // Mark as processed
              await supabaseAdmin.from('webhook_events').update({ 
                status: 'processed', 
                processed_at: new Date().toISOString() 
              }).eq('event_id', eventId);
            }
          }

          return new Response('ok', { status: 200 });
        } catch (error) {
          console.error('[Webhook] Error:', error);
          return new Response('Internal Server Error', { status: 500 });
        }
      }
    }
  }
})

