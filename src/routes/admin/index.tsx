import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Activity, BadgeDollarSign, Ban, BarChart3, CheckCircle2, CircleDollarSign, CreditCard,
  Edit3, Eye, Image, KeyRound, LogOut, Mail, MoreHorizontal, Plus, RefreshCcw, Search,
  ShieldCheck, Trash2, UserCog, Users, Wifi, XCircle,
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
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { clearSession } from '@/lib/auth/auth.functions';
import {
  createCustomer, deletePlan, deleteSponsorAd, getAdminOverview, listAccessLogs, listCustomers,
  listPlans, listSales, listSponsorAds, savePlan, saveSponsorAd, sendCustomerPasswordReset,
  setCustomerStatus, updateCustomer,
} from '@/lib/admin-control';
import { generateLicenseKey, listLicenses, revokeLicense } from '@/lib/monetization.functions';
import { useServerFn } from '@tanstack/react-start';

export const Route = createFileRoute('/admin/')({ component: AdminControlCenter });

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const date = (value?: string | null) => value ? new Date(value).toLocaleString('pt-BR') : '—';

function AdminControlCenter() {
  const queryClient = useQueryClient();
  const generateLicenseFn = useServerFn(generateLicenseKey);
  const listLicensesFn = useServerFn(listLicenses);
  const revokeLicenseFn = useServerFn(revokeLicense);
  const [search, setSearch] = useState('');
  const [customerDialog, setCustomerDialog] = useState<{ mode: 'create' | 'edit'; customer?: any } | null>(null);
  const [planDialog, setPlanDialog] = useState<any | null>(null);
  const [adDialog, setAdDialog] = useState<any | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<any | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

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
      [c.name, c.email, c.cpf, c.account_status, c.license_status].some((v) => String(v || '').toLowerCase().includes(q)),
    );
  }, [customers.data, search]);

  const refreshAll = () => queryClient.invalidateQueries({ queryKey: ['admin'] });

  async function handleLogout() {
    await supabase.auth.signOut();
    clearSession();
    window.location.href = '/admin/login';
  }

  return (
    <div className="min-h-screen bg-[#06090d] text-white">
      <div className="relative overflow-hidden border-b border-white/10">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=82&w=2000" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080c] via-[#07111b]/95 to-[#07111b]/70" />
        <div className="relative mx-auto max-w-[1600px] px-5 py-7 md:px-8 md:py-9">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[.16em] text-cyan-300">
                <ShieldCheck size={14} /> Central administrativa
              </div>
              <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-.04em] md:text-5xl">Controle total da operação Body Métrica FJ</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">Contas, acessos, planos, vendas, licenças, receita, patrocínios e auditoria em uma única janela administrativa.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={refreshAll} className="border-white/15 bg-black/25 text-white hover:bg-white/10"><RefreshCcw size={15} className="mr-2" />Atualizar</Button>
              <Button variant="outline" onClick={() => setLogoutOpen(true)} className="border-red-400/20 bg-red-500/10 text-red-300 hover:bg-red-500/20"><LogOut size={15} className="mr-2" />Sair</Button>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
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
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl border border-white/10 bg-white/[.035] p-1.5">
            <Tab value="customers" label="Contas" icon={<Users size={14} />} />
            <Tab value="finance" label="Financeiro" icon={<BadgeDollarSign size={14} />} />
            <Tab value="plans" label="Planos" icon={<CreditCard size={14} />} />
            <Tab value="licenses" label="Keys" icon={<KeyRound size={14} />} />
            <Tab value="ads" label="Patrocínios" icon={<Image size={14} />} />
            <Tab value="logs" label="Logs de acesso" icon={<Activity size={14} />} />
          </TabsList>

          <TabsContent value="customers" className="space-y-4">
            <SectionTitle title="Gerenciamento de contas" description="Cadastre, edite, bloqueie, desative e recupere acessos dos clientes." action={<Button onClick={() => setCustomerDialog({ mode: 'create' })}><Plus size={15} className="mr-2" />Criar conta</Button>} />
            <div className="relative max-w-md"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar nome, e-mail, CPF ou status..." className="border-white/10 bg-white/[.04] pl-9" /></div>
            <AdminTable>
              <TableHeader><TableRow className="border-white/10"><TH>Cliente</TH><TH>Status</TH><TH>Licença</TH><TH>Última atividade</TH><TH>Cadastro</TH><TH className="text-right">Ações</TH></TableRow></TableHeader>
              <TableBody>{filteredCustomers.map((c: any) => <TableRow key={c.id} className="border-white/[.06] hover:bg-white/[.03]"><TableCell><div className="font-semibold">{c.name || 'Sem nome'}</div><div className="text-xs text-white/40">{c.email}</div></TableCell><TableCell><StatusBadge value={c.account_status || 'active'} /></TableCell><TableCell><StatusBadge value={c.license_status || 'sem licença'} /></TableCell><TableCell className="text-xs text-white/55">{date(c.last_seen_at)}</TableCell><TableCell className="text-xs text-white/55">{date(c.created_at)}</TableCell><TableCell><div className="flex justify-end gap-1"><IconButton title="Editar" onClick={() => setCustomerDialog({ mode: 'edit', customer: c })}><Edit3 size={15} /></IconButton><IconButton title="Resetar senha" onClick={async () => { try { await sendCustomerPasswordReset(c.email); toast.success('Link de redefinição enviado.'); } catch (e: any) { toast.error(e.message); } }}><Mail size={15} /></IconButton><IconButton title={c.account_status === 'suspended' ? 'Reativar' : 'Suspender'} onClick={async () => { await setCustomerStatus(c.id, c.account_status === 'suspended' ? 'active' : 'suspended'); customers.refetch(); overview.refetch(); }}><Ban size={15} /></IconButton><IconButton title="Excluir/desativar" danger onClick={() => setDeleteCustomer(c)}><Trash2 size={15} /></IconButton></div></TableCell></TableRow>)}</TableBody>
            </AdminTable>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            <SectionTitle title="Dashboard financeiro" description="Receitas, vendas e desempenho comercial dos planos." />
            <div className="grid gap-3 md:grid-cols-3"><FinanceCard title="Receita confirmada" value={money.format(overview.data?.revenue ?? 0)} icon={<CircleDollarSign />} /><FinanceCard title="Planos vendidos" value={String(overview.data?.plansSold ?? 0)} icon={<CreditCard />} /><FinanceCard title="Ticket médio" value={money.format((overview.data?.plansSold || 0) > 0 ? (overview.data?.revenue || 0) / (overview.data?.plansSold || 1) : 0)} icon={<BarChart3 />} /></div>
            <AdminTable><TableHeader><TableRow className="border-white/10"><TH>Venda</TH><TH>Status</TH><TH>Valor</TH><TH>Provedor</TH><TH>Referência</TH><TH>Data</TH></TableRow></TableHeader><TableBody>{(sales.data || []).map((s: any) => <TableRow key={s.id} className="border-white/[.06]"><TableCell className="font-mono text-xs">{s.id.slice(0, 8)}</TableCell><TableCell><StatusBadge value={s.status} /></TableCell><TableCell className="font-semibold text-emerald-300">{money.format(Number(s.amount || 0))}</TableCell><TableCell>{s.provider}</TableCell><TableCell className="text-xs text-white/45">{s.provider_reference || '—'}</TableCell><TableCell className="text-xs text-white/55">{date(s.sold_at)}</TableCell></TableRow>)}</TableBody></AdminTable>
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <SectionTitle title="Gerenciamento de planos" description="Crie ofertas, defina preço e duração e ative ou pause planos comerciais." action={<Button onClick={() => setPlanDialog({ name: '', description: '', price: 0, duration_days: 30, is_active: true })}><Plus size={15} className="mr-2" />Novo plano</Button>} />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{(plans.data || []).map((p: any) => <Card key={p.id} className="border-white/10 bg-white/[.035]"><CardHeader><div className="flex items-start justify-between gap-3"><div><CardTitle>{p.name}</CardTitle><p className="mt-1 text-sm text-white/45">{p.description || 'Sem descrição'}</p></div><StatusBadge value={p.is_active ? 'active' : 'disabled'} /></div></CardHeader><CardContent><div className="text-3xl font-semibold">{money.format(Number(p.price || 0))}</div><div className="mt-1 text-xs text-white/45">{p.duration_days} dias de acesso</div><div className="mt-5 flex gap-2"><Button size="sm" variant="outline" onClick={() => setPlanDialog(p)}><Edit3 size={14} className="mr-2" />Editar</Button><Button size="sm" variant="outline" className="text-red-300" onClick={async () => { await deletePlan(p.id); plans.refetch(); }}><Trash2 size={14} /></Button></div></CardContent></Card>)}</div>
          </TabsContent>

          <TabsContent value="licenses" className="space-y-4">
            <SectionTitle title="Chaves de acesso" description="Geração e controle das keys de licença da plataforma." action={<div className="flex gap-2"><Button onClick={async () => { await generateLicenseFn({ data: { expiresInDays: 30 } }); licenses.refetch(); overview.refetch(); toast.success('Key de 30 dias gerada.'); }}><Plus size={15} className="mr-2" />30 dias</Button><Button variant="outline" onClick={async () => { await generateLicenseFn({ data: { expiresInDays: 365 } }); licenses.refetch(); overview.refetch(); toast.success('Key anual gerada.'); }}><Plus size={15} className="mr-2" />1 ano</Button></div>} />
            <AdminTable><TableHeader><TableRow className="border-white/10"><TH>Key</TH><TH>Status</TH><TH>Cliente</TH><TH>Expiração</TH><TH className="text-right">Ação</TH></TableRow></TableHeader><TableBody>{((licenses.data as any)?.licenses || []).map((l: any) => <TableRow key={l.id} className="border-white/[.06]"><TableCell className="font-mono text-xs text-cyan-300">{l.license_key}</TableCell><TableCell><StatusBadge value={l.status} /></TableCell><TableCell className="text-xs">{l.profiles?.email || 'Não vinculada'}</TableCell><TableCell className="text-xs text-white/55">{date(l.expires_at)}</TableCell><TableCell className="text-right">{l.status !== 'revoked' && <Button size="sm" variant="ghost" className="text-red-300" onClick={async () => { await revokeLicenseFn({ data: { licenseId: l.id, reason: 'Revogação manual admin' } }); licenses.refetch(); overview.refetch(); }}><XCircle size={15} /></Button>}</TableCell></TableRow>)}</TableBody></AdminTable>
          </TabsContent>

          <TabsContent value="ads" className="space-y-4">
            <SectionTitle title="Publicidade e patrocínios" description="Cadastre banners e campanhas para exibição controlada dentro da plataforma." action={<Button onClick={() => setAdDialog({ title: '', sponsor_name: '', image_url: '', target_url: '', placement: 'dashboard', is_active: true })}><Plus size={15} className="mr-2" />Nova campanha</Button>} />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{(ads.data || []).map((ad: any) => <Card key={ad.id} className="overflow-hidden border-white/10 bg-white/[.035]">{ad.image_url && <img src={ad.image_url} alt="" className="h-32 w-full object-cover" />}<CardContent className="p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-semibold">{ad.title}</div><div className="text-xs text-white/45">{ad.sponsor_name} · {ad.placement}</div></div><StatusBadge value={ad.is_active ? 'active' : 'disabled'} /></div><div className="mt-3 text-xs text-white/40">{ad.impressions || 0} impressões · {ad.clicks || 0} cliques</div><div className="mt-4 flex gap-2"><Button size="sm" variant="outline" onClick={() => setAdDialog(ad)}><Edit3 size={14} className="mr-2" />Editar</Button><Button size="sm" variant="outline" className="text-red-300" onClick={async () => { await deleteSponsorAd(ad.id); ads.refetch(); }}><Trash2 size={14} /></Button></div></CardContent></Card>)}</div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <SectionTitle title="Logs de acesso e segurança" description="Histórico de logins, ações e eventos por cliente." />
            <AdminTable><TableHeader><TableRow className="border-white/10"><TH>Usuário</TH><TH>Ação</TH><TH>IP</TH><TH>Dispositivo</TH><TH>Data</TH><TH>Detalhes</TH></TableRow></TableHeader><TableBody>{(logs.data || []).map((l: any) => <TableRow key={l.id} className="border-white/[.06]"><TableCell className="font-mono text-xs">{String(l.user_id).slice(0, 8)}…</TableCell><TableCell><Badge variant="outline" className="border-white/10 bg-white/[.04] text-white/70">{l.action}</Badge></TableCell><TableCell className="text-xs text-white/55">{l.ip_address || '—'}</TableCell><TableCell className="max-w-[260px] truncate text-xs text-white/45">{l.user_agent || '—'}</TableCell><TableCell className="text-xs text-white/55">{date(l.created_at)}</TableCell><TableCell><IconButton title={JSON.stringify(l.details || {})}><Eye size={15} /></IconButton></TableCell></TableRow>)}</TableBody></AdminTable>
          </TabsContent>
        </Tabs>
      </main>

      <CustomerDialog state={customerDialog} onClose={() => setCustomerDialog(null)} onSaved={() => { setCustomerDialog(null); customers.refetch(); overview.refetch(); }} />
      <PlanDialog state={planDialog} onClose={() => setPlanDialog(null)} onSaved={() => { setPlanDialog(null); plans.refetch(); overview.refetch(); }} />
      <AdDialog state={adDialog} onClose={() => setAdDialog(null)} onSaved={() => { setAdDialog(null); ads.refetch(); }} />

      <AlertDialog open={!!deleteCustomer} onOpenChange={(open) => !open && setDeleteCustomer(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Desativar esta conta?</AlertDialogTitle><AlertDialogDescription>O cliente perderá o acesso e a licença será revogada. O registro fica preservado para auditoria e pode ser recuperado depois.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={async () => { if (deleteCustomer) { await setCustomerStatus(deleteCustomer.id, 'deleted'); customers.refetch(); overview.refetch(); setDeleteCustomer(null); } }}>Desativar conta</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Sair da área administrativa?</AlertDialogTitle><AlertDialogDescription>Sua sessão administrativa será encerrada neste dispositivo.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Continuar no painel</AlertDialogCancel><AlertDialogAction onClick={handleLogout}>Confirmar saída</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}

function CustomerDialog({ state, onClose, onSaved }: any) {
  const [form, setForm] = useState<any>(() => state?.customer || { name: '', email: '', cpf: '', password: '', admin_notes: '' });
  if (!state) return null;
  const set = (key: string, value: any) => setForm((f: any) => ({ ...f, [key]: value }));
  const save = async () => { try { if (state.mode === 'create') await createCustomer({ name: form.name, email: form.email, password: form.password }); else await updateCustomer(state.customer.id, { name: form.name, email: form.email, cpf: form.cpf || null, admin_notes: form.admin_notes || null }); toast.success(state.mode === 'create' ? 'Conta criada.' : 'Cliente atualizado.'); onSaved(); } catch (e: any) { toast.error(e.message || 'Não foi possível salvar.'); } };
  return <Dialog open onOpenChange={(o) => !o && onClose()}><DialogContent><DialogHeader><DialogTitle>{state.mode === 'create' ? 'Criar nova conta' : 'Editar cliente'}</DialogTitle><DialogDescription>{state.mode === 'create' ? 'Crie uma conta de cliente sem sair da sessão administrativa.' : 'Atualize os dados administrativos do cadastro.'}</DialogDescription></DialogHeader><div className="grid gap-4 py-2"><Field label="Nome"><Input value={form.name || ''} onChange={(e) => set('name', e.target.value)} /></Field><Field label="E-mail"><Input type="email" value={form.email || ''} onChange={(e) => set('email', e.target.value)} /></Field>{state.mode === 'create' ? <Field label="Senha provisória"><Input type="password" value={form.password || ''} onChange={(e) => set('password', e.target.value)} /></Field> : <><Field label="CPF"><Input value={form.cpf || ''} onChange={(e) => set('cpf', e.target.value)} /></Field><Field label="Observações administrativas"><Input value={form.admin_notes || ''} onChange={(e) => set('admin_notes', e.target.value)} /></Field></>}</div><DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={save}>Salvar</Button></DialogFooter></DialogContent></Dialog>;
}

function PlanDialog({ state, onClose, onSaved }: any) { const [form, setForm] = useState<any>(() => state || {}); if (!state) return null; const set=(k:string,v:any)=>setForm((f:any)=>({...f,[k]:v})); return <Dialog open onOpenChange={(o)=>!o&&onClose()}><DialogContent><DialogHeader><DialogTitle>{state.id?'Editar plano':'Novo plano'}</DialogTitle><DialogDescription>Defina a oferta comercial que poderá ser vendida aos clientes.</DialogDescription></DialogHeader><div className="grid gap-4"><Field label="Nome"><Input value={form.name||''} onChange={(e)=>set('name',e.target.value)} /></Field><Field label="Descrição"><Input value={form.description||''} onChange={(e)=>set('description',e.target.value)} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Preço"><Input type="number" value={form.price??0} onChange={(e)=>set('price',Number(e.target.value))} /></Field><Field label="Duração (dias)"><Input type="number" value={form.duration_days??30} onChange={(e)=>set('duration_days',Number(e.target.value))} /></Field></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_active} onChange={(e)=>set('is_active',e.target.checked)} /> Plano ativo</label></div><DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={async()=>{try{await savePlan(form);toast.success('Plano salvo.');onSaved();}catch(e:any){toast.error(e.message)}}}>Salvar plano</Button></DialogFooter></DialogContent></Dialog>; }
function AdDialog({ state, onClose, onSaved }: any) { const [form,setForm]=useState<any>(()=>state||{}); if(!state)return null; const set=(k:string,v:any)=>setForm((f:any)=>({...f,[k]:v})); return <Dialog open onOpenChange={(o)=>!o&&onClose()}><DialogContent><DialogHeader><DialogTitle>{state.id?'Editar campanha':'Nova campanha'}</DialogTitle><DialogDescription>Configure um patrocínio para exibição controlada na plataforma.</DialogDescription></DialogHeader><div className="grid gap-4"><Field label="Título"><Input value={form.title||''} onChange={(e)=>set('title',e.target.value)} /></Field><Field label="Patrocinador"><Input value={form.sponsor_name||''} onChange={(e)=>set('sponsor_name',e.target.value)} /></Field><Field label="URL da imagem"><Input value={form.image_url||''} onChange={(e)=>set('image_url',e.target.value)} /></Field><Field label="Link de destino"><Input value={form.target_url||''} onChange={(e)=>set('target_url',e.target.value)} /></Field><Field label="Posição"><Input value={form.placement||'dashboard'} onChange={(e)=>set('placement',e.target.value)} /></Field><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_active} onChange={(e)=>set('is_active',e.target.checked)} /> Campanha ativa</label></div><DialogFooter><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={async()=>{try{await saveSponsorAd(form);toast.success('Campanha salva.');onSaved();}catch(e:any){toast.error(e.message)}}}>Salvar campanha</Button></DialogFooter></DialogContent></Dialog>; }

function Metric({ icon, label, value, accent, moneyValue }: any) { return <div className={`rounded-2xl border p-3.5 ${accent ? 'border-cyan-400/20 bg-cyan-400/10' : 'border-white/10 bg-black/25'}`}><div className="flex items-center justify-between text-white/45"><span className="text-[10px] font-bold uppercase tracking-wider">{label}</span><span className={accent?'text-cyan-300':'text-white/55'}>{icon}</span></div><div className={`mt-2 font-display font-semibold tracking-tight ${moneyValue?'text-xl':'text-2xl'}`}>{value}</div></div>; }
function FinanceCard({ title, value, icon }: any) { return <Card className="border-white/10 bg-gradient-to-br from-white/[.06] to-white/[.02]"><CardContent className="p-5"><div className="flex items-center justify-between text-white/45"><span className="text-xs font-bold uppercase tracking-wider">{title}</span><span className="text-emerald-300">{icon}</span></div><div className="mt-4 text-3xl font-semibold tracking-tight">{value}</div></CardContent></Card>; }
function SectionTitle({ title, description, action }: any) { return <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-white/45">{description}</p></div>{action}</div>; }
function AdminTable({ children }: any) { return <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[.025]"><Table>{children}</Table></div>; }
function TH({ children, className='' }: any) { return <TableHead className={`text-[10px] font-bold uppercase tracking-wider text-white/40 ${className}`}>{children}</TableHead>; }
function StatusBadge({ value }: { value: string }) { const v=String(value||'').toLowerCase(); const good=['active','paid','processed','unused'].includes(v); const bad=['deleted','disabled','revoked','failed','cancelled'].includes(v); return <Badge variant="outline" className={`${good?'border-emerald-400/20 bg-emerald-400/10 text-emerald-300':bad?'border-red-400/20 bg-red-400/10 text-red-300':'border-amber-400/20 bg-amber-400/10 text-amber-300'} text-[10px] uppercase`}>{value}</Badge>; }
function IconButton({ children, title, onClick, danger }: any) { return <Button type="button" variant="ghost" size="icon" title={title} onClick={onClick} className={`h-8 w-8 ${danger?'text-red-300':'text-white/60 hover:text-white'}`}>{children}</Button>; }
function Field({ label, children }: any) { return <div className="grid gap-1.5"><Label>{label}</Label>{children}</div>; }
function Tab({ value, label, icon }: any) { return <TabsTrigger value={value} className="gap-2 rounded-xl px-3 py-2 text-xs data-[state=active]:bg-cyan-400/15 data-[state=active]:text-cyan-200">{icon}{label}</TabsTrigger>; }
