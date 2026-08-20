import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Droplets, Dumbbell, FileDown, History, LayoutDashboard, Settings, Target, TrendingUp, User, Utensils, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth/auth.functions";
import { getAdherenceData, getAuditLogs, type AuditLog, type DailyAdherence } from "@/lib/adherence";
import { exportToCSV } from "@/lib/export";
import { generateAdherenceReport } from "@/lib/reports";
import { getHydrationWeek, getTodayHydration, normalizeClientSession } from "@/lib/client-metrics";

export const Route = createFileRoute("/dashboard/")({ component: DashboardPage });

const GOAL_LABELS: Record<string, string> = {
  loss: "Emagrecimento",
  gain: "Hipertrofia",
  maint: "Manutenção",
  maintenance: "Manutenção",
};

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [adherenceData, setAdherenceData] = useState<DailyAdherence[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [hydrationMl, setHydrationMl] = useState(0);
  const [hydrationWeek, setHydrationWeek] = useState(() => getHydrationWeek(3000));

  useEffect(() => {
    setUserData(normalizeClientSession(getSession()));
    setAdherenceData(getAdherenceData());
    setAuditLogs(getAuditLogs());
    setHydrationMl(getTodayHydration().totalMl);
    setHydrationWeek(getHydrationWeek(3000));
    setIsLoading(false);
  }, []);

  const profile = userData?.profile || {};
  const userName = userData?.name || "Usuário";
  const goal = GOAL_LABELS[profile.goal] || profile.goal || "Não informado";
  const weight = Number(profile.weight);
  const height = Number(profile.height);
  const hasWeight = Number.isFinite(weight) && weight > 0;
  const hasHeight = Number.isFinite(height) && height > 0;
  const hydrationPercent = Math.min(100, Math.round((hydrationMl / 3000) * 100));
  const hydrationAverage = useMemo(() => hydrationWeek.reduce((sum, item) => sum + item.totalMl, 0) / 7, [hydrationWeek]);
  const adherenceAverage = useMemo(() => {
    if (!adherenceData.length) return null;
    return Math.round(adherenceData.reduce((sum, item) => sum + ((item.macros || 0) + (item.water || 0)) / 2, 0) / adherenceData.length);
  }, [adherenceData]);

  if (isLoading) {
    return <div className="grid gap-5 p-5 md:p-8"><Skeleton className="h-36 rounded-3xl" /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-3xl" />)}</div><Skeleton className="h-72 rounded-3xl" /></div>;
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-background p-4 md:p-8">
      <div className="pointer-events-none absolute right-0 top-0 -z-0 opacity-[0.035]"><LayoutDashboard size={420} /></div>
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6">
        <section className="flex flex-col gap-5 rounded-[2rem] border border-border/70 bg-card/80 p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-7">
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-semibold text-primary-foreground shadow-lg">{userName.charAt(0).toUpperCase()}</Link>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">Seu painel</p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-[-0.035em] md:text-4xl">Olá, {userName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">Seus módulos estão disponíveis. Os cards abaixo mostram somente dados já cadastrados.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild><Link to="/profile"><User data-icon="inline-start" />Meu perfil</Link></Button>
            <Button asChild><Link to="/settings"><Settings data-icon="inline-start" />Ajustes</Link></Button>
          </div>
        </section>

        {userData?.licenseStatus !== "active" && (
          <section className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm font-semibold">Plano sem licença ativa</p><p className="mt-1 text-xs text-muted-foreground">Você pode usar sua área e revisar opções de plano nos ajustes. Recursos pagos podem solicitar ativação quando necessário.</p></div>
            <Button size="sm" variant="outline" asChild><Link to="/settings">Revisar plano</Link></Button>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ModuleCard to="/body" icon={<User />} title="Composição corporal" value={hasWeight ? `${weight.toFixed(1)} kg` : "Sem peso registrado"} description={hasHeight ? `Altura cadastrada: ${height.toFixed(0)} cm` : "Complete seu perfil para gerar métricas."} />
          <ModuleCard to="/goals" icon={<Target />} title="Objetivo" value={goal} description={profile.activity_level ? `Atividade: ${profile.activity_level}` : "Defina sua meta e nível de atividade."} />
          <ModuleCard to="/hydration" icon={<Droplets />} title="Hidratação hoje" value={`${(hydrationMl / 1000).toFixed(1)} L`} description={`${hydrationPercent}% da referência de 3,0 L`} progress={hydrationPercent} />
          <ModuleCard to="/training" icon={<Dumbbell />} title="Treino" value="Abrir módulo" description="Consulte e registre sua rotina de treinamento." />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Serviços da plataforma</CardTitle>
              <CardDescription>Acesso direto aos módulos. Nenhum deles depende mais do bloqueio global de licença.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ServiceLink to="/nutrition" icon={<Utensils />} title="Nutrição" description="Refeições, macros e registros." />
              <ServiceLink to="/hydration" icon={<Droplets />} title="Hidratação" description="Consumo diário persistente." />
              <ServiceLink to="/supplements" icon={<Pill />} title="Protocolos" description="Suplementação e acompanhamento." />
              <ServiceLink to="/training" icon={<Dumbbell />} title="Performance" description="Treinos e evolução." />
              <ServiceLink to="/body" icon={<TrendingUp />} title="Composição" description="Peso, medidas e evolução." />
              <ServiceLink to="/profile" icon={<User />} title="Perfil" description="Dados pessoais e métricas-base." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Resumo conectado</CardTitle><CardDescription>Somente informações derivadas dos seus registros.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <MetricRow label="Hidratação média (7 dias)" value={`${(hydrationAverage / 1000).toFixed(1)} L`} />
              <MetricRow label="Aderência média" value={adherenceAverage === null ? "Sem dados" : `${adherenceAverage}%`} />
              <MetricRow label="Eventos de auditoria" value={String(auditLogs.length)} />
              <MetricRow label="Status da conta" value={userData?.email ? "Conectada" : "Local"} />
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div><CardTitle>Histórico e exportação</CardTitle><CardDescription>Exporte apenas os dados realmente disponíveis nesta conta.</CardDescription></div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button size="sm" variant="outline" disabled={!adherenceData.length} onClick={() => generateAdherenceReport(userName, adherenceData, "pdf")}><FileDown data-icon="inline-start" />PDF</Button>
              <Button size="sm" variant="outline" disabled={!adherenceData.length} onClick={() => generateAdherenceReport(userName, adherenceData, "csv")}><FileDown data-icon="inline-start" />CSV</Button>
              <Button size="sm" variant="outline" disabled={!auditLogs.length} onClick={() => exportToCSV(auditLogs.map((log) => ({ Data: new Date(log.timestamp).toLocaleString("pt-BR"), Acao: log.action, Detalhes: log.details, Tipo: log.type })), `Auditoria_BodyMetrica_${userName.replace(/\s+/g, "_")}`)}><History data-icon="inline-start" />Auditoria</Button>
            </div>
          </CardHeader>
          <CardContent>
            {auditLogs.length ? (
              <div className="divide-y divide-border/70 overflow-hidden rounded-xl border border-border/70">
                {auditLogs.slice(0, 6).map((log) => <div key={log.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium">{log.action}</p><p className="text-xs text-muted-foreground">{log.details}</p></div><span className="text-[11px] text-muted-foreground">{new Date(log.timestamp).toLocaleString("pt-BR")}</span></div>)}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center"><History className="mx-auto text-muted-foreground" /><p className="mt-3 text-sm font-semibold">Nenhuma atividade registrada</p><p className="mt-1 text-xs text-muted-foreground">Os eventos aparecerão aqui conforme você utilizar os módulos.</p></div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ModuleCard({ to, icon, title, value, description, progress }: { to: string; icon: React.ReactNode; title: string; value: string; description: string; progress?: number }) {
  return <Link to={to as any} className="block"><Card className="h-full transition-transform hover:-translate-y-0.5"><CardHeader className="flex flex-row items-start justify-between gap-4"><div><CardDescription>{title}</CardDescription><CardTitle className="mt-2 text-2xl">{value}</CardTitle></div><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span></CardHeader><CardContent><p className="text-xs leading-5 text-muted-foreground">{description}</p>{typeof progress === "number" && <Progress value={progress} className="mt-4 h-2" />}<div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">Abrir módulo <ArrowRight size={13} /></div></CardContent></Card></Link>;
}

function ServiceLink({ to, icon, title, description }: { to: string; icon: React.ReactNode; title: string; description: string }) {
  return <Link to={to as any} className="group flex items-center gap-3 rounded-xl border border-border/70 bg-background p-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.035]"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span><div className="min-w-0"><p className="text-sm font-semibold">{title}</p><p className="truncate text-xs text-muted-foreground">{description}</p></div><ArrowRight size={14} className="ml-auto shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" /></Link>;
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"><span className="text-xs text-muted-foreground">{label}</span><span className="text-sm font-semibold">{value}</span></div>;
}
