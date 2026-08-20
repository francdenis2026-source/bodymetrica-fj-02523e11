import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireAdminAuth } from './admin.middleware';

const tierSchema = z.enum(['free', 'paid', 'sponsored']);

const durationSchema = z.number().int().positive().max(60 * 24 * 366 * 5);

function expirationFromMinutes(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function makeKey() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const block = (n: number) => Array.from({ length: n }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  return `BMFJ-${block(5)}-${block(5)}-${block(5)}`;
}

export const setCustomerAccess = createServerFn({ method: 'POST' })
  .middleware([requireAdminAuth])
  .inputValidator((data) => z.object({
    userId: z.string().uuid(),
    tier: tierSchema,
    durationMinutes: durationSchema.optional(),
    planId: z.string().uuid().nullable().optional(),
    note: z.string().max(500).optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

    if (data.tier === 'free') {
      const { error } = await supabaseAdmin.from('profiles').update({
        access_tier: 'free',
        access_source: 'admin',
        current_plan_id: null,
        license_status: 'revoked',
        license_expires_at: null,
        access_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('id', data.userId);
      if (error) return { success: false as const, message: error.message };
      return { success: true as const, message: 'Acesso alterado para versão gratuita.' };
    }

    if (!data.durationMinutes) {
      return { success: false as const, message: 'Informe a duração do acesso.' };
    }

    const expiresAt = expirationFromMinutes(data.durationMinutes);
    const licenseKey = makeKey();

    const { data: license, error: licenseError } = await supabaseAdmin.from('licenses').insert({
      license_key: licenseKey,
      status: 'active',
      user_id: data.userId,
      activated_at: new Date().toISOString(),
      expires_at: expiresAt,
      duration_minutes: data.durationMinutes,
      access_tier: data.tier,
      label: data.note || `Ativação ${data.tier}`,
      source: 'admin',
      created_by: context.userId,
    }).select('id,license_key').single();

    if (licenseError) return { success: false as const, message: licenseError.message };

    const { error: profileError } = await supabaseAdmin.from('profiles').update({
      access_tier: data.tier,
      access_source: 'admin',
      current_plan_id: data.planId || null,
      license_status: 'active',
      license_key: licenseKey,
      license_expires_at: expiresAt,
      account_status: 'active',
      access_updated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', data.userId);

    if (profileError) {
      await supabaseAdmin.from('licenses').delete().eq('id', license.id);
      return { success: false as const, message: profileError.message };
    }

    await supabaseAdmin.from('license_audit_logs').insert({
      license_id: license.id,
      user_id: data.userId,
      admin_id: context.userId,
      action: 'admin_access_change',
      details: { tier: data.tier, duration_minutes: data.durationMinutes, expires_at: expiresAt, plan_id: data.planId || null },
    });

    return { success: true as const, message: 'Acesso liberado imediatamente.', licenseKey, expiresAt };
  });

export const generateFlexibleLicenseKey = createServerFn({ method: 'POST' })
  .middleware([requireAdminAuth])
  .inputValidator((data) => z.object({
    durationMinutes: durationSchema,
    tier: tierSchema.exclude(['free']).default('paid'),
    label: z.string().max(120).optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const licenseKey = makeKey();
    const { data: license, error } = await supabaseAdmin.from('licenses').insert({
      license_key: licenseKey,
      status: 'unused',
      duration_minutes: data.durationMinutes,
      access_tier: data.tier,
      label: data.label || null,
      source: 'admin',
      created_by: context.userId,
      expires_at: null,
    }).select('id,license_key,duration_minutes,access_tier').single();

    if (error) return { success: false as const, message: error.message };

    await supabaseAdmin.from('license_audit_logs').insert({
      license_id: license.id,
      admin_id: context.userId,
      action: 'generation',
      details: { duration_minutes: data.durationMinutes, access_tier: data.tier, label: data.label || null },
    });

    return { success: true as const, license };
  });

export const provisionPaidCustomer = createServerFn({ method: 'POST' })
  .middleware([requireAdminAuth])
  .inputValidator((data) => z.object({
    email: z.string().email(),
    planId: z.string().uuid().nullable().optional(),
    durationMinutes: durationSchema,
    providerReference: z.string().max(200).optional(),
  }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const email = data.email.trim().toLowerCase();

    const { data: listed, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listError) return { success: false as const, message: listError.message };
    let user = listed.users.find((u: any) => String(u.email || '').toLowerCase() === email) || null;

    if (!user) {
      const temporaryPassword = `Bm!${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}9`;
      const created = await supabaseAdmin.auth.admin.createUser({
        email,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: { registration_source: 'paid_subscription' },
      });
      if (created.error || !created.data.user) return { success: false as const, message: created.error?.message || 'Não foi possível criar a conta.' };
      user = created.data.user;
    }

    const expiresAt = expirationFromMinutes(data.durationMinutes);
    const licenseKey = makeKey();

    await supabaseAdmin.from('profiles').upsert({
      id: user.id,
      email,
      account_status: 'active',
      access_tier: 'paid',
      access_source: 'subscription',
      current_plan_id: data.planId || null,
      license_status: 'active',
      license_key: licenseKey,
      license_expires_at: expiresAt,
      access_updated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    const { data: license } = await supabaseAdmin.from('licenses').insert({
      license_key: licenseKey,
      status: 'active',
      user_id: user.id,
      activated_at: new Date().toISOString(),
      expires_at: expiresAt,
      duration_minutes: data.durationMinutes,
      access_tier: 'paid',
      source: 'subscription',
      created_by: context.userId,
    }).select('id').single();

    await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env['VITE_APP_URL'] || 'https://bodymetrica-fj.lovable.app'}/auth?reset=true`,
    });

    if (data.providerReference) {
      await supabaseAdmin.from('sales').update({
        access_granted_at: new Date().toISOString(),
        customer_email: email,
      }).eq('provider_reference', data.providerReference);
    }

    if (license?.id) {
      await supabaseAdmin.from('license_audit_logs').insert({
        license_id: license.id,
        user_id: user.id,
        admin_id: context.userId,
        action: 'subscription_provisioned',
        details: { plan_id: data.planId || null, provider_reference: data.providerReference || null, expires_at: expiresAt },
      });
    }

    return {
      success: true as const,
      userId: user.id,
      email,
      expiresAt,
      message: 'Plano liberado e e-mail seguro para definição/redefinição de senha enviado.',
    };
  });
