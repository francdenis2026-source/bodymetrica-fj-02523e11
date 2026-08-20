import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { requireAdminAuth } from "./admin.middleware";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const licenseSchema = z.object({
  licenseKey: z.string().min(10, "Chave de licença inválida"),
  userId: z.string().uuid(),
});

async function createAuditLog(
  supabaseAdmin: any,
  licenseId: string | null,
  userId: string | null,
  adminId: string | null,
  action: string,
  details: any,
) {
  await supabaseAdmin.from('license_audit_logs').insert({
    license_id: licenseId,
    user_id: userId,
    admin_id: adminId,
    action,
    details,
  });
}

export const validateLicense = createServerFn({ method: "POST" })
  .inputValidator((data) => licenseSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: license, error: fetchError } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('license_key', data.licenseKey.trim().toUpperCase())
      .eq('status', 'unused')
      .single();

    if (fetchError || !license) {
      return { success: false, message: "Chave de licença inválida, já utilizada ou inexistente." };
    }

    const durationMinutes = Number(license.duration_minutes || 365 * 24 * 60);
    const expiresAt = new Date(Date.now() + durationMinutes * 60_000);
    const tier = license.access_tier === 'sponsored' ? 'sponsored' : 'paid';

    const { error: updateLicenseError } = await supabaseAdmin
      .from('licenses')
      .update({
        status: 'active',
        user_id: data.userId,
        activated_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', license.id)
      .eq('status', 'unused');

    if (updateLicenseError) {
      console.error("Error updating license:", updateLicenseError);
      return { success: false, message: "Erro ao ativar licença." };
    }

    const { error: updateProfileError } = await supabaseAdmin
      .from('profiles')
      .update({
        license_status: 'active',
        license_key: data.licenseKey.trim().toUpperCase(),
        license_expires_at: expiresAt.toISOString(),
        access_tier: tier,
        access_source: 'license_key',
        access_updated_at: new Date().toISOString(),
        account_status: 'active',
      })
      .eq('id', data.userId);

    if (updateProfileError) {
      console.error("Error updating profile license status:", updateProfileError);
      return { success: false, message: "Licença ativa na base, mas erro ao vincular ao seu perfil." };
    }

    await createAuditLog(
      supabaseAdmin,
      license.id,
      data.userId,
      null,
      'activation',
      { method: 'manual_input', duration_minutes: durationMinutes, access_tier: tier, expires_at: expiresAt.toISOString() },
    );

    return {
      success: true,
      message: "Licença ativada com sucesso. O acesso já está liberado.",
      expiresAt: expiresAt.toISOString(),
      tier,
    };
  });

export const generateLicenseKey = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((data) => z.object({ expiresInDays: z.number().default(365) }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    const licenseKey = `BODY-${randomPart}-${Date.now().toString(36).toUpperCase()}`;
    const durationMinutes = data.expiresInDays * 24 * 60;

    const { data: license, error } = await supabaseAdmin.from('licenses').insert({
      license_key: licenseKey,
      status: 'unused',
      duration_minutes: durationMinutes,
      access_tier: 'paid',
      source: 'admin',
      expires_at: null,
      created_by: context.userId,
    }).select().single();

    if (error) return { success: false, message: "Erro ao gerar chave de licença." };
    await createAuditLog(supabaseAdmin, license.id, null, context.userId, 'generation', { duration_minutes: durationMinutes });
    return { success: true, licenseKey: license.license_key };
  });

export const revokeLicense = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((data) => z.object({ licenseId: z.string().uuid(), reason: z.string().optional() }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: license } = await supabaseAdmin.from('licenses').select('user_id').eq('id', data.licenseId).single();
    const { error } = await supabaseAdmin.from('licenses').update({ status: 'revoked', revoked_at: new Date().toISOString(), revoked_by: context.userId }).eq('id', data.licenseId);
    if (error) return { success: false, message: "Erro ao revogar licença." };

    if (license?.user_id) {
      await supabaseAdmin.from('profiles').update({ license_status: 'revoked', access_tier: 'free', access_updated_at: new Date().toISOString() }).eq('id', license.user_id);
      const { data: userData } = await supabaseAdmin.from('profiles').select('email').eq('id', license.user_id).single();
      if (userData?.email) {
        const { sendLicenseEmail } = await import("./email.functions");
        sendLicenseEmail({ data: { email: userData.email, type: 'revoked', details: { reason: data.reason } } }).catch(console.error);
      }
    }

    await createAuditLog(supabaseAdmin, data.licenseId, license?.user_id || null, context.userId, 'revocation', { reason: data.reason || 'Nenhum motivo fornecido' });
    return { success: true, message: "Licença revogada com sucesso." };
  });

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ userId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    if (context.userId !== data.userId) {
      return { success: false, message: "Sessão inválida para esta compra." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: setting } = await supabaseAdmin.from('admin_settings').select('value').eq('key', 'mercadopago_access_token').maybeSingle();
    if (!setting?.value) return { success: false, message: "Pagamento não configurado." };

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id,email')
      .eq('id', context.userId)
      .maybeSingle();

    const { data: plans } = await supabaseAdmin
      .from('subscription_plans')
      .select('id,name,description,price,duration_days,is_active')
      .eq('is_active', true)
      .order('duration_days', { ascending: false });

    const selectedPlan = (plans || []).find((p: any) => Number(p.duration_days) === 365) || (plans || [])[0] || null;
    const planName = selectedPlan?.name || "Assinatura Anual Body Métrica FJ";
    const planPrice = Number(selectedPlan?.price || 299.90);
    const durationDays = Number(selectedPlan?.duration_days || 365);
    const durationMinutes = durationDays * 24 * 60;
    const appUrl = process.env['VITE_APP_URL'] || 'https://bodymetrica-fj.lovable.app';

    try {
      const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${setting.value}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": `checkout-${context.userId}-${selectedPlan?.id || 'annual'}-${Date.now()}`,
        },
        body: JSON.stringify({
          items: [{
            id: selectedPlan?.id || 'bodymetrica-annual',
            title: planName,
            description: selectedPlan?.description || 'Acesso Body Métrica FJ',
            unit_price: planPrice,
            quantity: 1,
            currency_id: "BRL",
          }],
          external_reference: context.userId,
          payer: profile?.email ? { email: profile.email } : undefined,
          metadata: {
            user_id: context.userId,
            email: profile?.email || null,
            plan_id: selectedPlan?.id || null,
            duration_minutes: durationMinutes,
          },
          notification_url: `${appUrl}/api/public/webhook`,
          back_urls: {
            success: `${appUrl}/settings?payment=approved`,
            failure: `${appUrl}/settings?payment=failure`,
            pending: `${appUrl}/settings?payment=pending`,
          },
          auto_return: "approved",
        }),
      });

      const preference = await response.json();
      if (!response.ok || !preference?.init_point) {
        console.error('[Checkout] Mercado Pago rejected preference:', preference);
        return { success: false, message: preference?.message || 'Erro ao criar sessão de pagamento.' };
      }

      return {
        success: true,
        init_point: preference.init_point,
        preferenceId: preference.id,
        plan: { id: selectedPlan?.id || null, name: planName, price: planPrice, durationDays },
      };
    } catch (error) {
      console.error('[Checkout] Error:', error);
      return { success: false, message: "Erro ao criar sessão de pagamento." };
    }
  });

export const listLicenses = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from('licenses').select('*, profiles(name, email)').order('created_at', { ascending: false });
    if (error) return { success: false, message: "Erro ao listar licenças." };
    return { success: true, licenses: data };
  });

export const updateAdminSetting = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((data) => z.object({ key: z.string(), value: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from('admin_settings').upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() });
    if (error) return { success: false, message: "Erro ao salvar configuração." };
    return { success: true, message: "Configuração salva com sucesso." };
  });

export const getAdminSetting = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .inputValidator((data) => z.string().parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: setting, error } = await supabaseAdmin.from('admin_settings').select('value').eq('key', data).maybeSingle();
    if (error) return { success: false, message: "Erro ao buscar configuração." };
    return { success: true, value: setting?.value || '' };
  });

export const checkLicenseStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, status: 'unauthenticated' };

    const { data: profile, error } = await supabaseAdmin.from('profiles').select('license_status, license_expires_at, access_tier').eq('id', user.id).single();
    if (error || !profile) return { success: false, status: 'error' };

    if (profile.license_status === 'active' && profile.license_expires_at && new Date(profile.license_expires_at) < new Date()) {
      await supabaseAdmin.from('profiles').update({ license_status: 'expired', access_tier: 'free', access_updated_at: new Date().toISOString() }).eq('id', user.id);
      return { success: true, status: 'expired', tier: 'free', changed: true };
    }

    return { success: true, status: profile.license_status, tier: profile.access_tier || 'free', expiresAt: profile.license_expires_at };
  });

export const listAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from('license_audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) return { success: false, message: "Erro ao buscar logs." };
    return { success: true, logs: data };
  });

export const listWebhookEvents = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from('webhook_events').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) return { success: false, message: "Erro ao buscar eventos de webhook." };
    return { success: true, events: data };
  });
