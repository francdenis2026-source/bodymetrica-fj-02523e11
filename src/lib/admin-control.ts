import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { customerMetadata, normalizeCpf, type UnifiedCustomerInput } from '@/lib/customer-registration';

const db = supabase as any;
const SUPABASE_URL = import.meta.env['VITE_SUPABASE_URL'];
const SUPABASE_KEY = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'];

export async function getAdminOverview() {
  const [profilesRes, licensesRes, salesRes, logsRes, plansRes] = await Promise.all([
    db.from('profiles').select('id,account_status,created_at'),
    db.from('licenses').select('id,status'),
    db.from('sales').select('id,amount,status,plan_id,sold_at'),
    db.from('security_logs').select('user_id,created_at').gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()),
    db.from('subscription_plans').select('id,is_active'),
  ]);

  const profiles = profilesRes.data || [];
  const licenses = licensesRes.data || [];
  const sales = salesRes.data || [];
  const logs = logsRes.data || [];
  const plans = plansRes.data || [];
  const paidSales = sales.filter((sale: any) => sale.status === 'paid');

  return {
    customers: profiles.filter((p: any) => p.account_status !== 'deleted').length,
    online: new Set(logs.map((log: any) => log.user_id)).size,
    activeLicenses: licenses.filter((l: any) => l.status === 'active').length,
    availableKeys: licenses.filter((l: any) => l.status === 'unused').length,
    revenue: paidSales.reduce((sum: number, sale: any) => sum + Number(sale.amount || 0), 0),
    plansSold: paidSales.length,
    activePlans: plans.filter((p: any) => p.is_active).length,
    createdThisMonth: profiles.filter((p: any) => {
      if (!p.created_at) return false;
      const d = new Date(p.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  };
}

export async function listCustomers() {
  const { data, error } = await db
    .from('profiles')
    .select('id,name,email,cpf,birth_date,biological_sex,goal,weight,height,activity_level,registration_source,license_status,license_expires_at,account_status,admin_notes,created_at,updated_at,last_seen_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateCustomer(id: string, values: Record<string, unknown>) {
  const patch = { ...values } as any;
  if (typeof patch.cpf === 'string') patch.cpf = normalizeCpf(patch.cpf);
  if (typeof patch.email === 'string') patch.email = patch.email.trim().toLowerCase();
  const { error } = await db.from('profiles').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

export async function setCustomerStatus(id: string, status: 'active' | 'suspended' | 'disabled' | 'deleted') {
  const patch: Record<string, unknown> = { account_status: status, updated_at: new Date().toISOString() };
  if (status !== 'active') patch.license_status = 'revoked';
  const { error } = await db.from('profiles').update(patch).eq('id', id);
  if (error) throw error;
}

function generateTemporaryPassword() {
  const bytes = new Uint32Array(4);
  crypto.getRandomValues(bytes);
  return `Bm!${Array.from(bytes).map((n) => n.toString(36)).join('')}9a`;
}

export async function createCustomer(input: UnifiedCustomerInput) {
  const normalizedCpf = normalizeCpf(input.cpf);
  const { data: cpfOwner, error: cpfError } = await db.from('profiles').select('id').eq('cpf', normalizedCpf).maybeSingle();
  if (cpfError) throw cpfError;
  if (cpfOwner) throw new Error('Este CPF já está cadastrado.');

  const transient = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const temporaryPassword = generateTemporaryPassword();
  const email = input.email.trim().toLowerCase();
  const { data, error } = await transient.auth.signUp({
    email,
    password: temporaryPassword,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/verify`,
      data: customerMetadata(input, 'admin'),
    },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Não foi possível criar a conta.');

  await db.from('profiles').update({
    ...customerMetadata(input, 'admin'),
    account_status: 'active',
    updated_at: new Date().toISOString(),
  }).eq('id', data.user.id);

  const { error: resetError } = await transient.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth?reset=true`,
  });
  if (resetError) throw resetError;

  return data.user;
}

export async function sendCustomerPasswordReset(email: string) {
  const redirectTo = `${window.location.origin}/auth?reset=true`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

export async function listAccessLogs() {
  const { data, error } = await db
    .from('security_logs')
    .select('id,user_id,action,ip_address,user_agent,details,created_at')
    .order('created_at', { ascending: false })
    .limit(250);
  if (error) throw error;
  return data || [];
}

export async function listPlans() {
  const { data, error } = await db.from('subscription_plans').select('*').order('price', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function savePlan(plan: any) {
  const payload = { ...plan, updated_at: new Date().toISOString() };
  const query = plan.id ? db.from('subscription_plans').update(payload).eq('id', plan.id) : db.from('subscription_plans').insert(payload);
  const { error } = await query;
  if (error) throw error;
}

export async function deletePlan(id: string) {
  const { error } = await db.from('subscription_plans').delete().eq('id', id);
  if (error) throw error;
}

export async function listSales() {
  const { data, error } = await db.from('sales').select('*').order('sold_at', { ascending: false }).limit(250);
  if (error) throw error;
  return data || [];
}

export async function listSponsorAds() {
  const { data, error } = await db.from('sponsor_ads').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function saveSponsorAd(ad: any) {
  const payload = { ...ad, updated_at: new Date().toISOString() };
  const query = ad.id ? db.from('sponsor_ads').update(payload).eq('id', ad.id) : db.from('sponsor_ads').insert(payload);
  const { error } = await query;
  if (error) throw error;
}

export async function deleteSponsorAd(id: string) {
  const { error } = await db.from('sponsor_ads').delete().eq('id', id);
  if (error) throw error;
}
