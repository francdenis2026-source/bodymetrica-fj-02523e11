import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Bell, CalendarDays, Droplets, History, Info, Plus, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { queueOfflineAction } from "@/lib/offline-sync";
import { getSession } from "@/lib/auth/auth.functions";
import { addHydration, getHydrationWeek, getTodayHydration, normalizeClientSession, type HydrationDay } from "@/lib/client-metrics";

export const Route = createFileRoute("/hydration/")({ component: HydrationPage });

const GOAL_ML = 3000;
const DAY_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];

function HydrationPage() {
  const [today, setToday] = useState<HydrationDay>({ date: "", totalMl: 0, entries: [] });
  const [week, setWeek] = useState(() => getHydrationWeek(GOAL_ML));
  const [isSyncing, setIsSyncing] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    setToday(getTodayHydration());
    setWeek(getHydrationWeek(GOAL_ML));
    setUserData(normalizeClientSession(getSession()));
  }, []);

  const currentAmount = today.totalMl;
  const percentage = useMemo(() => Math.min(100, Math.round((currentAmount / GOAL_ML) * 100)), [currentAmount]);
  const remainingAmount = Math.max(GOAL_ML - currentAmount, 0);

  const addWater = async (amount: number) => {
    setIsSyncing(true);
    const previous = today.totalMl;
    const next = addHydration(amount);
    setToday(next);
    setWeek(getHydrationWeek(GOAL_ML));
    queueOfflineAction({ type: "WATER_LOG", data: { amount, currentTotal: next.totalMl } });

    if (next.totalMl >= GOAL_ML * 0.9 && previous < GOAL_ML * 0.9) toast.success("Você chegou a 90% da sua meta diária de hidratação.");
    window.setTimeout(() => setIsSyncing(false), 450);

    if (next.totalMl < GOAL_ML && next.totalMl >= GOAL_ML * 0.8 && "Notification" in window && Notification.permission === "granted") {
      new Notification("Body Métrica FJ", { body: `Você atingiu ${Math.round((next.totalMl / GOAL_ML) * 100)}% da sua meta de água.`, icon: "/favicon.svg" });
    }
  };

  const enableReminders = () => {
    if (!("Notification" in window)) { toast.info("Seu navegador não oferece suporte a notificações."); return; }
    Notification.requestPermission().then((permission) => permission === "granted" ? toast.success("Lembretes de hidratação ativados.") : toast.info("Permissão de notificações não concedida."));
  };

  return (
    <div className="min-h-full bg-background text-foreground">
      <section className="relative isolate overflow-hidden border-b border-border/70">
        <img src="/bodymetrica-hero-2026.jpg" alt="Garrafa de água em ambiente fitness" className="absolute inset-0 -z-30 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-20 bg-background/48 dark:bg-background/58" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/98 via-background/84 to-background/44 dark:from-background dark:via-background/91 dark:to-background/56" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 md:py-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-end lg:py-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background/92 px-3.5 py-1.5 text-sm font-semibold shadow-sm"><Sparkles size={15} className="text-primary" /> Hidratação diária</div>
            <h1 className="mt-4 font-display text-[clamp(2.7rem,6vw,5rem)] font-semibold leading-[1.01] tracking-[-0.045em] text-balance">Água no ritmo certo, <span className="text-primary">sem complicação.</span></h1>
            <p className="mt-4 max-w-xl text-base font-medium leading-7 text-foreground/72 md:text-lg md:leading-8">Registre sua ingestão, acompanhe sua meta e mantenha o histórico disponível mesmo depois de sair e entrar novamente.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3"><Button onClick={() => addWater(500)} className="h-11 rounded-xl px-5 font-semibold"><Plus size={16} className="mr-2" />Adicionar 500 ml</Button><Button variant="outline" onClick={enableReminders} className="h-11 rounded-xl bg-background/92 px-5 font-semibold"><Bell size={16} className="mr-2" />Lembretes</Button><Button variant="ghost" asChild className="h-11 rounded-xl px-4"><Link to="/dashboard">Voltar ao dashboard</Link></Button></div>
          </div>
          <div className="rounded-[1.6rem] border border-border/80 bg-background/94 p-5 shadow-xl shadow-black/10 md:p-6">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Progresso de hoje</p><p className="mt-1 text-sm text-foreground/52">Meta diária de {(GOAL_ML / 1000).toFixed(1)} L</p></div><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Droplets size={20} /></div></div>
            <div className="mt-5 flex items-end justify-between gap-4"><div><p className="font-display text-5xl font-semibold tracking-[-0.04em]">{(currentAmount / 1000).toFixed(1)} L</p><p className="mt-1 text-sm text-foreground/52">{percentage}% da meta</p></div><p className="text-right text-sm font-medium text-foreground/62">{remainingAmount > 0 ? `${(remainingAmount / 1000).toFixed(1)} L restantes` : "Meta concluída"}</p></div>
            <Progress value={percentage} className="mt-5 h-2.5" />
            <div className="mt-4 flex items-center justify-between text-xs text-foreground/45"><span>{isSyncing ? "Salvando registro..." : "Dados persistidos"}</span><span>{userData?.email ? "Conta conectada" : "Modo local"}</span></div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-7 md:px-6 md:py-9">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className="rounded-[1.6rem] border border-border/80 bg-card p-5 md:p-6">
              <div className="flex items-center justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Registro rápido</p><h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Quanto você bebeu?</h2></div><span className="hidden items-center gap-2 text-xs font-medium text-foreground/45 sm:flex"><ShieldCheck size={15} className="text-primary" />Salvo neste dispositivo</span></div>
              <div className="mt-5 grid grid-cols-3 gap-3">{[{ amount: 200, label: "Copo", value: "200 ml" }, { amount: 500, label: "Garrafa", value: "500 ml" }, { amount: 1000, label: "Volume maior", value: "1,0 L" }].map((item) => <button key={item.amount} type="button" onClick={() => addWater(item.amount)} className="rounded-2xl border border-border/75 bg-background px-4 py-5 text-left transition-colors hover:border-primary/30 hover:bg-primary/[0.035]"><span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Droplets size={17} /></span><p className="mt-4 font-display text-xl font-semibold">{item.value}</p><p className="mt-1 text-xs text-foreground/45">{item.label}</p></button>)}</div>
            </div>
            <div className="rounded-[1.6rem] border border-border/80 bg-card p-5 md:p-6">
              <div className="flex items-center justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Visão semanal</p><h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Consistência da semana</h2></div><CalendarDays size={20} className="text-primary" /></div>
              <div className="mt-6 grid grid-cols-7 items-end gap-2 sm:gap-3">{week.map((item, index) => <div key={item.date} className="flex flex-col items-center gap-2"><div className="flex h-28 w-full items-end overflow-hidden rounded-xl bg-muted/35"><div className="w-full rounded-xl bg-primary/70 transition-[height]" style={{ height: `${Math.max(item.percentage, item.totalMl > 0 ? 6 : 0)}%` }} /></div><span className="text-[11px] font-semibold text-foreground/45">{DAY_LABELS[index]}</span><span className="text-[10px] text-foreground/32">{item.percentage}%</span></div>)}</div>
            </div>
          </section>
          <aside className="space-y-6">
            <div className="rounded-[1.6rem] border border-border/80 bg-card p-5 md:p-6"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><TrendingUp size={19} /></span><div><p className="text-sm font-semibold">Resumo real</p><p className="text-xs text-foreground/45">Calculado a partir dos seus registros</p></div></div><div className="mt-5 grid grid-cols-2 divide-x divide-border/70 rounded-xl border border-border/70 bg-background/65"><div className="px-3 py-4 text-center"><p className="font-display text-lg font-semibold">{week.filter((item) => item.percentage >= 80).length} dias</p><p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-foreground/40">≥ 80% da meta</p></div><div className="px-3 py-4 text-center"><p className="font-display text-lg font-semibold">{(week.reduce((sum, item) => sum + item.totalMl, 0) / 7 / 1000).toFixed(1)} L</p><p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-foreground/40">Média diária</p></div></div></div>
            <div className="rounded-[1.6rem] border border-border/80 bg-card p-5 md:p-6"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><History size={19} /></span><div><p className="text-sm font-semibold">Registros de hoje</p><p className="text-xs text-foreground/45">Últimas adições</p></div></div>{currentAmount > 0 && <span className="text-xs font-semibold text-primary">{(currentAmount / 1000).toFixed(1)} L</span>}</div>{today.entries.length === 0 ? <div className="py-9 text-center"><span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-muted/50 text-foreground/35"><Droplets size={20} /></span><p className="mt-3 text-sm font-semibold">Nenhum registro hoje</p><p className="mt-1 text-xs text-foreground/45">Adicione seu primeiro consumo para iniciar o acompanhamento.</p></div> : <div className="mt-5 overflow-hidden rounded-xl border border-border/70 bg-background/65">{today.entries.slice(-5).reverse().map((entry) => <WaterLogEntry key={entry.at} time={new Date(entry.at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} amount={`${entry.amount} ml`} />)}</div>}</div>
            <div className="rounded-[1.4rem] border border-border/80 bg-muted/35 p-4"><div className="flex gap-3"><Info size={18} className="mt-0.5 shrink-0 text-primary" /><div><p className="text-sm font-semibold">Use a meta como referência</p><p className="mt-1 text-xs leading-5 text-foreground/50">Necessidades de hidratação variam com clima, treino, alimentação e características individuais.</p></div></div></div>
            {currentAmount > 4500 && <div className="rounded-[1.4rem] border border-destructive/25 bg-destructive/5 p-4"><div className="flex gap-3"><AlertTriangle size={18} className="mt-0.5 shrink-0 text-destructive" /><div><p className="text-sm font-semibold text-destructive">Atenção ao excesso</p><p className="mt-1 text-xs leading-5 text-destructive/80">Grandes volumes em pouco tempo podem ser inadequados. Mantenha a ingestão distribuída ao longo do dia.</p></div></div></div>}
          </aside>
        </div>
      </main>
    </div>
  );
}

function WaterLogEntry({ time, amount }: { time: string; amount: string }) {
  return <div className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-3.5 last:border-b-0"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Droplets size={14} /></span><span className="text-sm font-medium">{time}</span></div><span className="text-sm font-semibold text-foreground/70">{amount}</span></div>;
}
