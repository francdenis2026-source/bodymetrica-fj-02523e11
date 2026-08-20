import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Activity, BadgeDollarSign, Ban, BarChart3, CheckCircle2, CircleDollarSign, CreditCard,
  Edit3, Eye, Image, KeyRound, LogOut, Mail, Plus, RefreshCcw, Search,
  ShieldCheck, Trash2, UserCog, Users, Wifi, XCircle, Crown, Gift, Clock3, Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { clearSession } from '@/lib/auth/auth.functions';
import {
  createCustomer, deletePlan, deleteSponsorAd, getAdminOverview, listAccessLogs, listCustomers,
  listPlans, listSales, listSponsorAds, savePlan, saveSponsorAd, sendCustomerPasswordReset,
  setCustomerStatus, updateCustomer,
} from '@/lib/admin-control';
import { listLicenses, revokeLicense } from '@/lib/monetization.functions';
import { generateFlexibleLicenseKey, provisionPaidCustomer, setCustomerAccess } from '@/lib/admin-access.functions';
import { ACTIVITY_OPTIONS, GOAL_OPTIONS, formatCpf, isValidCpf, normalizeCpf } from '@/lib/customer-registration';
import { useServerFn } from '@tanstack/react-start';

export const Route = createFileRoute('/admin/')({ component: AdminControlCenter });

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const date = (value?: string | null) => value ? new Date(value).toLocaleString('pt-BR') : '—';

const KEY_PRESETS = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '1 hora', minutes: 60 },
  { label: '7 dias', minutes: 7 * 24 * 60 },
  { label: '15 dias', minutes: 15 * 24 * 60 },
  { label: '30 dias', minutes: 30 * 24 * 60 },
  { label: '6 meses', minutes: 183 * 24 * 60 },
  { label: '1 ano', minutes: 365 * 24 * 60 },
];

function AdminControlCenter() {
  const queryClient = useQueryClient();
  const listLicensesFn = useServerFn(listLicenses);
  const revokeLicenseFn = useServerFn(revokeLicense);
  const generateKeyFn = useServerFn(generateFlexibleLicenseKey);
  const setAccessFn = useServerFn(setCustomerAccess);
  const provisionPaidFn = useServerFn(provisionPaidCustomer);
  const [search, setSearch] = useState('');
  const [customerDialog, setCustomerDialog] = useState<{ mode: 'create' | 'edit'; customer?: any } | null>(null);
  const [planDialog, setPlanDialog] = useState<any | null>(null);
  const [adDialog, setAdDialog] = useState<any | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<any | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [keyTier, setKeyTier] = useState<'paid' | 'sponsored'>('paid');

  const overview = useQuery({ queryKey: ['admin-overview'], queryFn: getAdminOverview, refetchInterval: 60000 });
  const customers = useQuery({ queryKey: ['admin-customers'], queryFn: listCustomers });
  const logs = useQuery({ queryKey: ['admin-access-logs'], queryFn: listAccessLogs });
  const plans = useQuery({ queryKey: ['admin-plans'], queryFn: listPlans });
  const sales = useQuery({ queryKey: ['admin-sales'], queryFn: listSales });
  const ads = useQuery({ queryKey: ['admin-ads'], queryFn: listSponsorAds });
  const licenses = useQuery({ queryKey: ['admin-licenses-control'], queryFn: () => listLicensesFn() });

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers.data || [];
    return (customers.data || []).filter((c: any) =>
      [c.name, c.email, c.cpf, c.account_status, c.license_status, c.access_tier].some((v) => String(v || '').toLowerCase().includes(q)),
    );
  }, [customers.data, search]);

  const refreshAll = () => {
    ['admin-overview','admin-customers','admin-access-logs','admin-plans','admin-sales','admin-ads','admin-licenses-control']
      .forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    clearSession();
    window.location.href = '/admin/login';
  }

  async function makeKey(minutes: number) {
    const result = await generateKeyFn({ data: { durationMinutes: minutes, tier: keyTier } });
    if (!result.success || !result.license) return toast.error(result.message || 'Não foi possível gerar a key.');
    await navigator.clipboard?.writeText(result.license.license_key).catch(() => undefined);
    toast.success(`Key ${KEY_PRESETS.find((p) => p.minutes === minutes)?.label || ''} criada e copiada.`);
    licenses.refetch(); overview.refetch();
  }

  return (
    <div className="admin-control-center min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden border-b border-border">
        <img src="/bodymetrica-admin-2026.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-20 dark:opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/75" />
        <div className="relative mx-auto max-w-[1600px] px-5 py-6 md:px-8 md:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[.16em] text-primary"><ShieldCheck size={14} /> Central administrativa</div>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-.04em] md:text-4xl">Centro de controle BodyMetrica</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Clientes, planos, acessos pagos ou patrocinados, keys temporárias, receita, campanhas e auditoria.</p>
            </div>
            <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={refreshAll}><RefreshCcw size={15} className="mr-2" />Atualizar</Button><Button variant="outline" onClick={() => setLogoutOpen(true)} className="text-destructive"><LogOut size={15} className="mr-2" />Sair</Button></div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <Metric icon={<Users size={17} />} label="Clientes" value={overview.data?.customers ?? 0} />
            <Metric icon={<Wifi size={17} />} label="Online agora" value={overview.data?.online ?? 0} accent />
            <Metric icon={<UserCog size={17} />} label="Novos no mês" value={overview.data?.createdThisMonth ?? 0} />
            <Metric icon={<CheckCircle2 size={17} />} label="Licenças ativas" value={overview.data?.activeLicenses ?? 0} />
            <Metric icon={<KeyRound size={17} />} label="Keys livres" value={overview.data?.availableKeys ?? 0} />
            <Metric icon={<CreditCard size={17} />} label="Planos vendidos" value={overview.data?.plansSold ?? 0} />
            <Metric icon={<BarChart3 size={17} />} label="Planos ativos" value={overview.data?.activePlans ?? 0} />
            <Metric icon={<CircleDollarSign size={17} />} label="Receita" value={money.format(overview.data?.revenue ?? 0)} moneyValue />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] px-4 py-5 md:px-8 md:py-7">
        <Tabs defaultValue="customers" className="space-y-5">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl border border-border bg-card/70 p-1.5">
            <Tab value="customers" label="Contas" icon={<Users size={14} />} />
            <Tab value="finance" label="Financeiro" icon={<BadgeDollarSign size={14} />} />
            <Tab value="plans" label="Planos" icon={<CreditCard size={14} />} />
            <Tab value="licenses" label="Keys" icon={<KeyRound size={14} />} />
            <Tab value="ads" label="Patrocínios" icon={<Image size={14} />} />
            <Tab value="logs" label="Logs" icon={<Activity size={14} />} />
          </TabsList>

          <TabsContent value="customers" className="space-y-4">
            <SectionTitle title="Gerenciamento de contas" description="Clique em qualquer cliente para editar dados, licença, versão paga ou patrocinada." action={<Button onClick={() => setCustomerDialog({ mode: 'create' })}><Plus size={15} className="mr-2" />Criar conta</Button>} />
            <div className="relative max-w-md"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar nome, e-mail, CPF, tier ou status..." className="pl-9" /></div>
            <AdminTable><TableHeader><TableRow><TH>Cliente</TH><TH>Conta</TH><TH>Versão</TH><TH>Licença</TH><TH>Expira</TH><TH className="text-right">Ações</TH></TableRow></TableHeader><TableBody>{filteredCustomers.map((c: any) => <TableRow key={c.id} className="cursor-pointer hover:bg-muted/45" onClick={() => setCustomerDialog({ mode: 'edit', customer: c })}><TableCell><div className="font-semibold text-primary hover:underline">{c.name || 'Sem nome'}</div><div className="text-xs text-muted-foreground">{c.email}</div><div className="text-[10px] text-muted-foreground">{c.cpf ? formatCpf(c.cpf) : 'CPF não informado'}</div></TableCell><TableCell><StatusBadge value={c.account_status || 'active'} /></TableCell><TableCell><TierBadge value={c.access_tier || (c.license_status === 'active' ? 'paid' : 'free')} /></TableCell><TableCell><StatusBadge value={c.license_status || 'sem licença'} /></TableCell><TableCell className="text-xs text-muted-foreground">{date(c.license_expires_at)}</TableCell><TableCell onClick={(e) => e.stopPropagation()}><div className="flex justify-end gap-1"><IconButton title="Editar conta e acesso" onClick={() => setCustomerDialog({ mode: 'edit', customer: c })}><Edit3 size={15} /></IconButton><IconButton title="Enviar redefinição de senha" onClick={async () => { try { await sendCustomerPasswordReset(c.email); toast.success('E-mail de redefinição enviado.'); } catch (e: any) { toast.error(e.message); } }}><Mail size={15} /></IconButton><IconButton title={c.account_status === 'suspended' ? 'Reativar' : 'Suspender'} onClick={async () => { await setCustomerStatus(c.id, c.account_status === 'suspended' ? 'active' : 'suspended'); customers.refetch(); overview.refetch(); }}><Ban size={15} /></IconButton><IconButton title="Excluir/desativar" danger onClick={() => setDeleteCustomer(c)}><Trash2 size={15} /></IconButton></div></TableCell></TableRow>)}</TableBody></AdminTable>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4"><SectionTitle title="Dashboard financeiro" description="Receitas, vendas e desempenho comercial dos planos." /><div className="grid gap-3 md:grid-cols-3"><FinanceCard title="Receita confirmada" value={money.format(overview.data?.revenue ?? 0)} icon={<CircleDollarSign />} /><FinanceCard title="Planos vendidos" value={String(overview.data?.plansSold ?? 0)} icon={<CreditCard />} /><FinanceCard title="Ticket médio" value={money.format((overview.data?.plansSold || 0) > 0 ? (overview.data?.revenue || 0) / (overview.data?.plansSold || 1) : 0)} icon={<BarChart3 />} /></div><AdminTable><TableHeader><TableRow><TH>Venda</TH><TH>Status</TH><TH>Valor</TH><TH>Provedor</TH><TH>Referência</TH><TH>Data</TH></TableRow></TableHeader><TableBody>{(sales.data || []).map((s: any) => <TableRow key={s.id}><TableCell className="font-mono text-xs">{s.id.slice(0, 8)}</TableCell><TableCell><StatusBadge value={s.status} /></TableCell><TableCell className="font-semibold text-success">{money.format(Number(s.amount || 0))}</TableCell><TableCell>{s.provider}</TableCell><TableCell className="text-xs text-muted-foreground">{s.provider_reference || '—'}</TableCell><TableCell className="text-xs text-muted-foreground">{date(s.sold_at)}</TableCell></TableRow>)}</TableBody></AdminTable></TabsContent>

          <TabsContent value="plans" className="space-y-4"><SectionTitle title="Gerenciamento de planos" description="Crie ofertas, defina preço e duração e ative ou pause planos comerciais." action={<Button onClick={() => setPlanDialog({ name: '', description: '', price: 0, duration_days: 30, is_active: true })}><Plus size={15} className="mr-2" />Novo plano</Button>} /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{(plans.data || []).map((p: any) => <Card key={p.id}><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>{p.name}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{p.description || 'Sem descrição'}</p></div><StatusBadge value={p.is_active ? 'active' : 'disabled'} /></div></CardHeader><CardContent><div className="text-3xl font-semibold">{money.format(Number(p.price || 0))}</div><div className="mt-1 text-xs text-muted-foreground">{p.duration_days} dias de acesso</div><div className="mt-5 flex gap-2"><Button size="sm" variant="outline" onClick={() => setPlanDialog(p)}><Edit3 size={14} className="mr-2" />Editar</Button><Button size="sm" variant="outline" className="text-destructive" onClick={async () => { await deletePlan(p.id); plans.refetch(); }}><Trash2 size={14} /></Button></div></CardContent></Card>)}</div></TabsContent>

          <TabsContent value="licenses" className="space-y-4">
            <SectionTitle title="Chaves de acesso" description="A duração começa quando a key é inserida pelo cliente. Gere acessos de minutos a um ano." />
            <Card><CardContent className="p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-2"><Label>Tipo da key</Label><select value={keyTier} onChange={(e) => setKeyTier(e.target.value as any)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="paid">Paga</option><option value="sponsored">Patrocinada</option></select></div><div className="flex flex-wrap gap-2">{KEY_PRESETS.map((preset) => <Button key={preset.label} size="sm" variant={preset.minutes === 30 * 24 * 60 ? 'default' : 'outline'} onClick={() => makeKey(preset.minutes)}><Clock3 size={13} className="mr-1.5" />{preset.label}</Button>)}</div></div></CardContent></Card>
            <AdminTable><TableHeader><TableRow><TH>Key</TH><TH>Tipo</TH><TH>Duração</TH><TH>Status</TH><TH>Cliente</TH><TH>Expiração</TH><TH className="text-right">Ação</TH></TableRow></TableHeader><TableBody>{((licenses.data as any)?.licenses || []).map((l: any) => <TableRow key={l.id}><TableCell><button className="flex items-center gap-2 font-mono text-xs text-primary hover:underline" onClick={() => navigator.clipboard?.writeText(l.license_key).then(() => toast.success('Key copiada.'))}>{l.license_key}<Copy size={12} /></button></TableCell><TableCell><TierBadge value={l.access_tier || 'paid'} /></TableCell><TableCell className="text-xs">{formatDuration(l.duration_minutes)}</TableCell><TableCell><StatusBadge value={l.status} /></TableCell><TableCell className="text-xs">{l.profiles?.email || 'Não vinculada'}</TableCell><TableCell className="text-xs text-muted-foreground">{date(l.expires_at)}</TableCell><TableCell className="text-right">{l.status !== 'revoked' && <Button size="sm" variant="ghost" className="text-destructive" onClick={async () => { await revokeLicenseFn({ data: { licenseId: l.id, reason: 'Revogação manual admin' } }); licenses.refetch(); overview.refetch(); }}><XCircle size={15} /></Button>}</TableCell></TableRow>)}</TableBody></AdminTable>
          </TabsContent>

          <TabsContent value="ads" className="space-y-4"><SectionTitle title="Publicidade e patrocínios" description="Cadastre banners e campanhas para exibição controlada dentro da plataforma." action={<Button onClick={() => setAdDialog({ title: '', sponsor_name: '', image_url: '', target_url: '', placement: 'dashboard', is_active: true })}><Plus size={15} className="mr-2" />Nova campanha</Button>} /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{(ads.data || []).map((ad: any) => <Card key={ad.id} className="overflow-hidden">{ad.image_url && <img src={ad.image_url} alt="" className="h-32 w-full object-cover" />}<CardContent className="p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-semibold">{ad.title}</div><div className="text-xs text-muted-foreground">{ad.sponsor_name} · {ad.placement}</div></div><StatusBadge value={ad.is_active ? 'active' : 'disabled'} /></div><div className="mt-3 text-xs text-muted-foreground">{ad.impressions || 0} impressões · {ad.clicks || 0} cliques</div><div className="mt-4 flex gap-2"><Button size="sm" variant="outline" onClick={() => setAdDialog(ad)}><Edit3 size={14} className="mr-2" />Editar</Button><Button size="sm" variant="outline" className="text-destructive" onClick={async () => { await deleteSponsorAd(ad.id); ads.refetch(); }}><Trash2 size={14} /></Button></div></CardContent></Card>)}</div></TabsContent>

          <TabsContent value="logs" className="space-y-4"><SectionTitle title="Logs de acesso e segurança" description="Histórico de logins, ações e eventos por cliente." /><AdminTable><TableHeader><TableRow><TH>Usuário</TH><TH>Ação</TH><TH>IP</TH><TH>Dispositivo</TH><TH>Data</TH><TH>Detalhes</TH></TableRow></TableHeader><TableBody>{(logs.data || []).map((l: any) => <TableRow key={l.id}><TableCell className="font-mono text-xs">{String(l.user_id).slice(0, 8)}…</TableCell><TableCell><Badge variant="outline">{l.action}</Badge></TableCell><TableCell className="text-xs text-muted-foreground">{l.ip_address || '—'}</TableCell><TableCell className="max-w-[260px] truncate text-xs text-muted-foreground">{l.user_agent || '—'}</TableCell><TableCell className="text-xs text-muted-foreground">{date(l.created_at)}</TableCell><TableCell><IconButton title={JSON.stringify(l.details || {})}><Eye size={15} /></IconButton></TableCell></TableRow>)}</TableBody></AdminTable></TabsContent>
        </Tabs>
      </main>

      <CustomerDialog state={customerDialog} plans={plans.data || []} setAccessFn={setAccessFn} provisionPaidFn={provisionPaidFn} onClose={() => setCustomerDialog(null)} onSaved={() => { setCustomerDialog(null); customers.refetch(); licenses.refetch(); overview.refetch(); }} />
      <PlanDialog state={planDialog} onClose={() => setPlanDialog(null)} onSaved={() => { setPlanDialog(null); plans.refetch(); overview.refetch(); }} />
      <AdDialog state={adDialog} onClose={() => setAdDialog(null)} onSaved={() => { setAdDialog(null); ads.refetch(); }} />
      <AlertDialog open={!!deleteCustomer} onOpenChange={(open) => !open && setDeleteCustomer(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Desativar esta conta?</AlertDialogTitle><AlertDialogDescription>O cliente perderá o acesso e a licença será revogada. O registro fica preservado para auditoria.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={async () => { if (deleteCustomer) { await setCustomerStatus(deleteCustomer.id, 'deleted'); customers.refetch(); overview.refetch(); setDeleteCustomer(null); } }}>Desativar conta</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Sair da área administrativa?</AlertDialogTitle><AlertDialogDescription>Sua sessão administrativa será encerrada neste dispositivo.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Continuar no painel</AlertDialogCancel><AlertDialogAction onClick={handleLogout}>Confirmar saída</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}

function CustomerDialog({ state, plans, setAccessFn, provisionPaidFn, onClose, onSaved }: any) {
  const customer = state?.customer;
  const [form, setForm] = useState<any>(() => ({
    name: customer?.name || '', email: customer?.email || '', cpf: customer?.cpf ? formatCpf(customer.cpf) : '',
    birthDate: customer?.birth_date || '', biologicalSex: customer?.biological_sex || 'not_informed',
    goal: customer?.goal || '', weight: customer?.weight || 70, height: customer?.height || 170,
    activityLevel: customer?.activity_level || '', admin_notes: customer?.admin_notes || '',
  }));
  const [tier, setTier] = useState<'free'|'paid'|'sponsored'>(customer?.access_tier || (customer?.license_status === 'active' ? 'paid' : 'free'));
  const [durationMinutes, setDurationMinutes] = useState<number>(30 * 24 * 60);
  const [planId, setPlanId] = useState<string>(customer?.current_plan_id || '');
  const [busy, setBusy] = useState(false);
  if (!state) return null;
  const set = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));

  const save = async () => {
    try {
      if (!form.name?.trim() || !form.email?.includes('@') || !isValidCpf(form.cpf) || !form.birthDate || !form.goal || !form.activityLevel) return toast.error('Preencha nome, e-mail, CPF válido, nascimento, objetivo e atividade.');
      if (Number(form.weight) < 25 || Number(form.height) < 100) return toast.error('Confira peso e altura.');
      if (state.mode === 'create') {
        await createCustomer({ name: form.name.trim(), email: form.email.trim().toLowerCase(), cpf: normalizeCpf(form.cpf), birthDate: form.birthDate, biologicalSex: form.biologicalSex, goal: form.goal, weight: Number(form.weight), height: Number(form.height), activityLevel: form.activityLevel });
        toast.success('Conta criada. O cliente receberá um e-mail seguro para definir a senha.');
      } else {
        await updateCustomer(state.customer.id, { name: form.name.trim(), email: form.email.trim().toLowerCase(), cpf: normalizeCpf(form.cpf), birth_date: form.birthDate || null, biological_sex: form.biologicalSex || 'not_informed', goal: form.goal || null, weight: Number(form.weight), height: Number(form.height), activity_level: form.activityLevel || null, admin_notes: form.admin_notes || null });
        toast.success('Cliente atualizado.');
      }
      onSaved();
    } catch (e: any) { toast.error(e.message || 'Não foi possível salvar.'); }
  };

  async function applyAccess() {
    if (!customer) return;
    setBusy(true);
    try {
      const result = await setAccessFn({ data: { userId: customer.id, tier, durationMinutes: tier === 'free' ? undefined : durationMinutes, planId: planId || null, note: `Alterado no painel administrativo` } });
      result.success ? toast.success(result.message) : toast.error(result.message);
      if (result.success) onSaved();
    } finally { setBusy(false); }
  }

  async function provisionPaid() {
    setBusy(true);
    try {
      const result = await provisionPaidFn({ data: { email: form.email.trim().toLowerCase(), planId: planId || null, durationMinutes } });
      result.success ? toast.success(result.message) : toast.error(result.message);
      if (result.success) onSaved();
    } finally { setBusy(false); }
  }

  return <Dialog open onOpenChange={(o) => !o && onClose()}><DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl"><DialogHeader><DialogTitle>{state.mode === 'create' ? 'Criar conta de cliente' : `Gerenciar ${customer?.name || customer?.email}`}</DialogTitle><DialogDescription>{state.mode === 'create' ? 'Cadastro unificado. A senha é definida pelo próprio cliente por e-mail.' : 'Edite os dados e controle imediatamente o nível de acesso.'}</DialogDescription></DialogHeader>
    <div className="grid gap-5 py-2">
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Nome completo"><Input value={form.name} onChange={(e) => set('name', e.target.value)} /></Field><Field label="E-mail"><Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field><Field label="CPF"><Input inputMode="numeric" value={form.cpf} onChange={(e) => set('cpf', formatCpf(e.target.value))} placeholder="000.000.000-00" /></Field><Field label="Data de nascimento"><Input type="date" value={form.birthDate} onChange={(e) => set('birthDate', e.target.value)} /></Field></div>
      <div className="rounded-xl border border-border bg-muted/20 p-4"><div className="mb-3"><div className="font-semibold">Dados para métricas</div><div className="text-xs text-muted-foreground">Usados por cálculos, metas e ferramentas.</div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Sexo biológico"><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.biologicalSex} onChange={(e) => set('biologicalSex', e.target.value)}><option value="not_informed">Prefiro não informar</option><option value="female">Feminino</option><option value="male">Masculino</option></select></Field><Field label="Objetivo"><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.goal} onChange={(e) => set('goal', e.target.value)}><option value="">Selecione...</option>{GOAL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></Field><Field label="Atividade"><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.activityLevel} onChange={(e) => set('activityLevel', e.target.value)}><option value="">Selecione...</option>{ACTIVITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></Field><Field label="Peso (kg)"><Input type="number" min="25" max="400" step="0.1" value={form.weight} onChange={(e) => set('weight', e.target.value)} /></Field><Field label="Altura (cm)"><Input type="number" min="100" max="250" value={form.height} onChange={(e) => set('height', e.target.value)} /></Field></div></div>
      {state.mode === 'edit' && <><Field label="Observações administrativas"><Input value={form.admin_notes} onChange={(e) => set('admin_notes', e.target.value)} /></Field><div className="rounded-2xl border border-primary/20 bg-primary/[.045] p-4"><div className="flex items-center gap-2"><Crown size={17} className="text-primary"/><div><div className="font-semibold">Acesso e licença</div><div className="text-xs text-muted-foreground">Mudanças entram em vigor imediatamente.</div></div></div><div className="mt-4 grid gap-3 md:grid-cols-3"><Field label="Versão"><select value={tier} onChange={(e) => setTier(e.target.value as any)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="free">Gratuita</option><option value="paid">Paga</option><option value="sponsored">Patrocinada</option></select></Field><Field label="Duração"><select value={durationMinutes} disabled={tier === 'free'} onChange={(e) => setDurationMinutes(Number(e.target.value))} className="h-10 rounded-md border border-input bg-background px-3 text-sm">{KEY_PRESETS.map((p) => <option key={p.minutes} value={p.minutes}>{p.label}</option>)}</select></Field><Field label="Plano"><select value={planId} disabled={tier === 'free'} onChange={(e) => setPlanId(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="">Sem plano específico</option>{plans.map((p:any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field></div><div className="mt-4 flex flex-wrap gap-2"><Button onClick={applyAccess} disabled={busy}>{tier === 'free' ? <Ban size={14} className="mr-2"/> : tier === 'sponsored' ? <Gift size={14} className="mr-2"/> : <Crown size={14} className="mr-2"/>}{busy ? 'Aplicando...' : 'Aplicar acesso agora'}</Button><Button variant="outline" onClick={provisionPaid} disabled={busy || tier === 'free'}><Mail size={14} className="mr-2"/>Liberar pago + enviar acesso</Button></div></div></>}
    </div>
    <DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>{state.mode === 'create' ? 'Criar e enviar acesso' : 'Salvar dados'}</Button></DialogFooter></DialogContent></Dialog>;
}

function PlanDialog({ state, onClose, onSaved }: any) { const [form, setForm] = useState<any>(() => state || {}); if (!state) return null; const set=(k:string,v:any)=>setForm((f:any)=>({...f,[k]:v})); return <Dialog open onOpenChange={(o)=>!o&&onClose()}><DialogContent><DialogHeader><DialogTitle>{state.id?'Editar plano':'Novo plano'}</DialogTitle><DialogDescription>Defina a oferta comercial que poderá ser vendida aos clientes.</DialogDescription></DialogHeader><div className="grid gap-4"><Field label="Nome"><Input value={form.name||''} onChange={(e)=>set('name',e.target.value)} /></Field><Field label="Descrição"><Input value={form.description||''} onChange={(e)=>set('description',e.target.value)} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Preço"><Input type="number" value={form.price??0} onChange={(e)=>set('price',Number(e.target.value))} /></Field><Field label="Duração (dias)"><Input type="number" value={form.duration_days??30} onChange={(e)=>set('duration_days',Number(e.target.value))} /></Field></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_active} onChange={(e)=>set('is_active',e.target.checked)} /> Plano ativo</label></div><DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={async()=>{try{await savePlan(form);toast.success('Plano salvo.');onSaved();}catch(e:any){toast.error(e.message)}}}>Salvar plano</Button></DialogFooter></DialogContent></Dialog>; }
function AdDialog({ state, onClose, onSaved }: any) { const [form,setForm]=useState<any>(()=>state||{}); if(!state)return null; const set=(k:string,v:any)=>setForm((f:any)=>({...f,[k]:v})); return <Dialog open onOpenChange={(o)=>!o&&onClose()}><DialogContent><DialogHeader><DialogTitle>{state.id?'Editar campanha':'Nova campanha'}</DialogTitle><DialogDescription>Configure um patrocínio para exibição controlada na plataforma.</DialogDescription></DialogHeader><div className="grid gap-4"><Field label="Título"><Input value={form.title||''} onChange={(e)=>set('title',e.target.value)} /></Field><Field label="Patrocinador"><Input value={form.sponsor_name||''} onChange={(e)=>set('sponsor_name',e.target.value)} /></Field><Field label="URL da imagem"><Input value={form.image_url||''} onChange={(e)=>set('image_url',e.target.value)} /></Field><Field label="Link de destino"><Input value={form.target_url||''} onChange={(e)=>set('target_url',e.target.value)} /></Field><Field label="Posição"><Input value={form.placement||'dashboard'} onChange={(e)=>set('placement',e.target.value)} /></Field><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_active} onChange={(e)=>set('is_active',e.target.checked)} /> Campanha ativa</label></div><DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={async()=>{try{await saveSponsorAd(form);toast.success('Campanha salva.');onSaved();}catch(e:any){toast.error(e.message)}}}>Salvar campanha</Button></DialogFooter></DialogContent></Dialog>; }

function formatDuration(minutes?: number | null) { if (!minutes) return '—'; if (minutes < 60) return `${minutes} min`; if (minutes < 1440) return `${Math.round(minutes/60)} h`; const days = Math.round(minutes/1440); if (days >= 360) return '1 ano'; if (days >= 180) return '6 meses'; return `${days} dias`; }
function TierBadge({ value }: { value: string }) { const v=String(value||'free'); const cls=v==='paid'?'border-primary/20 bg-primary/10 text-primary':v==='sponsored'?'border-warning/25 bg-warning/10 text-warning':'border-border bg-muted/40 text-muted-foreground'; return <Badge variant="outline" className={`${cls} text-[10px] uppercase`}>{v==='paid'?'Paga':v==='sponsored'?'Patrocinada':'Gratuita'}</Badge>; }
function Metric({ icon, label, value, accent, moneyValue }: any) { return <div className={`rounded-2xl border p-3.5 ${accent ? 'border-primary/20 bg-primary/10' : 'border-border bg-card/75'}`}><div className="flex items-center justify-between text-muted-foreground"><span className="text-[10px] font-bold uppercase tracking-wider">{label}</span><span className={accent?'text-primary':'text-muted-foreground'}>{icon}</span></div><div className={`mt-2 font-display font-semibold tracking-tight ${moneyValue?'text-xl':'text-2xl'}`}>{value}</div></div>; }
function FinanceCard({ title, value, icon }: any) { return <Card><CardContent className="p-5"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-bold uppercase tracking-wider">{title}</span><span className="text-success">{icon}</span></div><div className="mt-4 text-3xl font-semibold tracking-tight">{value}</div></CardContent></Card>; }
function SectionTitle({ title, description, action }: any) { return <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>{action}</div>; }
function AdminTable({ children }: any) { return <div className="overflow-x-auto rounded-2xl border border-border bg-card/50"><Table>{children}</Table></div>; }
function TH({ children, className='' }: any) { return <TableHead className={`text-[10px] font-bold uppercase tracking-wider text-muted-foreground ${className}`}>{children}</TableHead>; }
function StatusBadge({ value }: { value: string }) { const v=String(value||'').toLowerCase(); const good=['active','paid','processed','unused'].includes(v); const bad=['deleted','disabled','revoked','failed','cancelled'].includes(v); return <Badge variant="outline" className={`${good?'border-success/20 bg-success/10 text-success':bad?'border-destructive/20 bg-destructive/10 text-destructive':'border-warning/20 bg-warning/10 text-warning'} text-[10px] uppercase`}>{value}</Badge>; }
function IconButton({ children, title, onClick, danger }: any) { return <Button type="button" variant="ghost" size="icon" title={title} onClick={onClick} className={`h-8 w-8 ${danger?'text-destructive':'text-muted-foreground hover:text-foreground'}`}>{children}</Button>; }
function Field({ label, children }: any) { return <div className="grid gap-1.5"><Label>{label}</Label>{children}</div>; }
function Tab({ value, label, icon }: any) { return <TabsTrigger value={value} className="gap-2 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-primary/15 data-[state=active]:text-primary">{icon}{label}</TabsTrigger>; }
