import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { requireAdminAuth } from "./admin.middleware";

const licenseSchema = z.object({
  licenseKey: z.string().min(10, "Chave de licença inválida"),
  userId: z.string().uuid(),
});

/**
 * Internal helper to create audit logs
 */
async function createAuditLog(
  supabaseAdmin: any,
  licenseId: string | null,
  userId: string | null,
  adminId: string | null,
  action: string,
  details: any
) {
  await supabaseAdmin.from('license_audit_logs').insert({
    license_id: licenseId,
    user_id: userId,
    admin_id: adminId,
    action,
    details,
  });
}

/**
 * Validates a license key for a user and activates it if valid.
 */
export const validateLicense = createServerFn({ method: "POST" })
  .inputValidator((data) => licenseSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // 1. Check if the license exists and is unused
    const { data: license, error: fetchError } = await supabaseAdmin
      .from('licenses')
      .select('*')
      .eq('license_key', data.licenseKey)
      .eq('status', 'unused')
      .single();

    if (fetchError || !license) {
      return { success: false, message: "Chave de licença inválida, já utilizada ou inexistente." };
    }

    // 2. Activate the license in the database
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const { error: updateLicenseError } = await supabaseAdmin
      .from('licenses')
      .update({ 
        status: 'active',
        user_id: data.userId,
        activated_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .eq('id', license.id);

    if (updateLicenseError) {
      console.error("Error updating license:", updateLicenseError);
      return { success: false, message: "Erro ao ativar licença." };
    }

    // 3. Update the user profile
    const { error: updateProfileError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        license_status: 'active',
        license_key: data.licenseKey,
        license_expires_at: expiresAt.toISOString()
      })
      .eq('id', data.userId);

    if (updateProfileError) {
      console.error("Error updating profile license status:", updateProfileError);
      return { success: false, message: "Licença ativa na base, mas erro ao vincular ao seu perfil." };
    }

    // 4. Create Audit Log
    await createAuditLog(
      supabaseAdmin,
      license.id,
      data.userId,
      null, // System activation
      'activation',
      { method: 'manual_input', expires_at: expiresAt.toISOString() }
    );

    return { 
      success: true, 
      message: "Licença ativada com sucesso! Bem-vindo à experiência completa." 
    };
  });

/**
 * Admin function to generate a new license key.
 */
export const generateLicenseKey = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((data) => z.object({ 
    expiresInDays: z.number().default(365)
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    const licenseKey = `BODY-${randomPart}-${Date.now().toString(36).toUpperCase()}`;
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + data.expiresInDays);

    const { data: license, error } = await supabaseAdmin
      .from('licenses')
      .insert({
        license_key: licenseKey,
        status: 'unused',
        expires_at: expiresAt.toISOString(),
        created_by: context.userId
      })
      .select()
      .single();

    if (error) {
      console.error("Error generating license:", error);
      return { success: false, message: "Erro ao gerar chave de licença." };
    }

    // Audit log
    await createAuditLog(
      supabaseAdmin,
      license.id,
      null,
      context.userId,
      'generation',
      { expires_in_days: data.expiresInDays }
    );

    return { success: true, licenseKey: license.license_key };
  });

/**
 * Admin function to revoke a license.
 */
export const revokeLicense = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((data) => z.object({ 
    licenseId: z.string().uuid(),
    reason: z.string().optional()
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Get license details first to update user profile
    const { data: license } = await supabaseAdmin
      .from('licenses')
      .select('user_id')
      .eq('id', data.licenseId)
      .single();

    const { error } = await supabaseAdmin
      .from('licenses')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_by: context.userId
      })
      .eq('id', data.licenseId);

    if (error) return { success: false, message: "Erro ao revogar licença." };

    if (license?.user_id) {
      await supabaseAdmin
        .from('profiles')
        .update({ license_status: 'revoked' })
        .eq('id', license.user_id);
      
      // Notify user via email
      const { data: userData } = await supabaseAdmin.from('profiles').select('email').eq('id', license.user_id).single();
      if (userData?.email) {
        const { sendLicenseEmail } = await import("./email.functions");
        sendLicenseEmail({ data: { email: userData.email, type: 'revoked', details: { reason: data.reason } } }).catch(console.error);
      }
    }

    // Audit log
    await createAuditLog(
      supabaseAdmin,
      data.licenseId,
      license?.user_id || null,
      context.userId,
      'revocation',
      { reason: data.reason || 'Nenhum motivo fornecido' }
    );

    return { success: true, message: "Licença revogada com sucesso." };
  });

/**
 * Generates a checkout URL for Mercado Pago
 */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ userId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: setting } = await supabaseAdmin
      .from('admin_settings')
      .select('value')
      .eq('key', 'mercadopago_access_token')
      .single();

    if (!setting?.value) return { success: false, message: "Pagamento não configurado." };

    try {
      const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${setting.value}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: [
            {
              title: "Assinatura Anual Body Métrica FJ",
              unit_price: 299.90,
              quantity: 1,
              currency_id: "BRL"
            }
          ],
          external_reference: data.userId,
          back_urls: {
            success: `${process.env['VITE_APP_URL'] || 'http://localhost:8080'}/settings`,
            failure: `${process.env['VITE_APP_URL'] || 'http://localhost:8080'}/settings`,
            pending: `${process.env['VITE_APP_URL'] || 'http://localhost:8080'}/settings`
          },
          auto_return: "approved"
        })
      });

      const preference = await response.json();
      return { success: true, init_point: preference.init_point };
    } catch (error) {
      return { success: false, message: "Erro ao criar sessão de pagamento." };
    }
  });

/**
 * Admin function to list licenses.
 */
export const listLicenses = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    const { data, error } = await supabaseAdmin
      .from('licenses')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error listing licenses:", error);
      return { success: false, message: "Erro ao listar licenças." };
    }

    return { success: true, licenses: data };
  });

/**
 * Admin settings management
 */
export const updateAdminSetting = createServerFn({ method: "POST" })
  .middleware([requireAdminAuth])
  .inputValidator((data) => z.object({
    key: z.string(),
    value: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from('admin_settings')
      .upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() });

    if (error) return { success: false, message: "Erro ao salvar configuração." };
    return { success: true, message: "Configuração salva com sucesso." };
  });

export const getAdminSetting = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .inputValidator((data) => z.string().parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: setting, error } = await supabaseAdmin
      .from('admin_settings')
      .select('value')
      .eq('key', data)
      .maybeSingle();

    if (error) return { success: false, message: "Erro ao buscar configuração." };
    return { success: true, value: setting?.value || '' };
  });

/**
 * Check current user license status (Real-time check)
 */
export const checkLicenseStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, status: 'unauthenticated' };

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('license_status, license_expires_at')
      .eq('id', user.id)
      .single();

    if (error || !profile) return { success: false, status: 'error' };

    // Check if expired
    if (profile.license_status === 'active' && profile.license_expires_at) {
      const expires = new Date(profile.license_expires_at);
      if (expires < new Date()) {
        await supabaseAdmin
          .from('profiles')
          .update({ license_status: 'expired' })
          .eq('id', user.id);
        
        return { success: true, status: 'expired', changed: true };
      }
    }

    return { success: true, status: profile.license_status, expiresAt: profile.license_expires_at };
  });

/**
 * Audit logs list
 */
export const listAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireAdminAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from('license_audit_logs')
      .select('*, admin:admin_id(email), user:user_id(email)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) return { success: false, message: "Erro ao buscar logs." };
    return { success: true, logs: data };
  });

