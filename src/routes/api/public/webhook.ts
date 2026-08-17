import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/api/public/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          
          // Mercado Pago Webhook authentication (basic check for now)
          // In a real scenario, you'd check the signature
          const body = await request.json();
          const topic = body.topic || body.type;
          const resourceId = body.resource || (body.data && body.data.id);

          console.log(`[Webhook] Received topic: ${topic}, resource: ${resourceId}`);

          if (topic === 'payment') {
            // 1. Get Access Token from admin_settings
            const { data: setting } = await supabaseAdmin
              .from('admin_settings')
              .select('value')
              .eq('key', 'mercadopago_access_token')
              .single();

            if (!setting?.value) {
              return new Response('Configuração do Mercado Pago ausente', { status: 500 });
            }

            // 2. Fetch payment details from Mercado Pago
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${resourceId}`, {
              headers: {
                'Authorization': `Bearer ${setting.value}`
              }
            });

            if (!response.ok) {
              return new Response('Erro ao buscar pagamento no Mercado Pago', { status: 502 });
            }

            const paymentData = await response.json();
            
            // 3. If payment is approved, activate/renew license
            if (paymentData.status === 'approved') {
              const userId = paymentData.external_reference; // We should pass this during checkout
              
              if (!userId) {
                console.error('[Webhook] Missing external_reference (userId) in payment');
                return new Response('Missing external_reference', { status: 400 });
              }

              // 4. Calculate new expiration (add 1 year)
              const expiresAt = new Date();
              expiresAt.setFullYear(expiresAt.getFullYear() + 1);

              // 5. Update Profile
              const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .update({ 
                  license_status: 'active',
                  license_expires_at: expiresAt.toISOString()
                })
                .eq('id', userId);

              if (profileError) {
                console.error('[Webhook] Error updating profile:', profileError);
                return new Response('Error updating profile', { status: 500 });
              }

              // 6. Find existing license or create new one
              const { data: existingLicense } = await supabaseAdmin
                .from('licenses')
                .select('id')
                .eq('user_id', userId)
                .eq('status', 'active')
                .maybeSingle();

              if (existingLicense) {
                await supabaseAdmin
                  .from('licenses')
                  .update({ expires_at: expiresAt.toISOString() })
                  .eq('id', existingLicense.id);
              }

              // 7. Audit Log
              await supabaseAdmin.from('license_audit_logs').insert({
                user_id: userId,
                action: 'payment_activation',
                details: { 
                  payment_id: resourceId, 
                  method: 'mercadopago_webhook',
                  expires_at: expiresAt.toISOString()
                }
              });

              console.log(`[Webhook] License activated/renewed for user ${userId}`);
            }
          }

          return new Response('ok', { status: 200 });
        } catch (error) {
          console.error('[Webhook] Error processing request:', error);
          return new Response('Internal Server Error', { status: 500 });
        }
      }
    }
  }
})
