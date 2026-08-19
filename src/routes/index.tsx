import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { getSession } from "@/lib/auth/auth.functions";
import { ArrowRight, BarChart3, Clock, Droplets as WaterIcon, Dumbbell as GymIcon, ShieldCheck, Target, Utensils as FoodIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search: Record<string, unknown>) => ({
    registerMode: (search["registerMode"] as boolean) || undefined,
    reset: (search["reset"] as boolean) || undefined,
    name: (search["name"] as string) || undefined,
    birthDate: (search["birthDate"] as string) || undefined,
    goal: (search["goal"] as string) || undefined,
    weight: (search["weight"] as string) || undefined,
    height: (search["height"] as string) || undefined,
    activityLevel: (search["activityLevel"] as string) || undefined,
  } as any),
  head: () => ({
    title: "Body Métrica FJ — Composição corporal, nutrição e treino",
    meta: [
      { name: "description", content: "Acompanhe composição corporal, alimentação, hidratação e treinos em um só lugar." },
      { property: "og:title", content: "Body Métrica FJ" },
      { property: "og:description", content: "Acompanhe composição corporal, alimentação, hidratação e treinos em um só lugar." },
    ],
  }),
});

const HOME_FEATURES = [
  { icon: BarChart3, eyebrow: "PROGRESSO", title: "Evolução clara", description: "Tendências e registros em uma leitura simples." },
  { icon: Target, eyebrow: "OBJETIVOS", title: "Metas conectadas", description: "Peso, medidas, alimentação e treino no mesmo objetivo." },
  { icon: ShieldCheck, eyebrow: "PRIVACIDADE", title: "Dados sob controle", description: "Acompanhamento pessoal com foco em privacidade." },
];

const easeOut = [0.23, 1, 0.32, 1] as const;

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setIsLoggedIn(!!session);
    const timer = window.setTimeout(() => setIsLoading(false), 180);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="home-page min-h-[100dvh] bg-background text-foreground" style={{ height: "auto", minHeight: "100dvh", overflow: "visible" }}>
      <header className="relative z-50 border-b border-border/90 bg-background/96 shadow-[0_1px_0_rgba(0,0,0,.03)] backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link to="/" aria-label="Ir para a página inicial" className="group flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm ring-1 ring-primary/15">B</div>
            <div className="leading-tight">
              <span className="block font-display text-base font-semibold tracking-tight md:text-lg">Body Métrica FJ</span>
              <span className="hidden text-xs text-muted-foreground sm:block">Saúde e composição corporal</span>
            </div>
          </Link>
          {isLoggedIn ? (
            <Button asChild size="sm" variant="outline" className="min-h-11 rounded-xl border-border bg-card px-4 shadow-sm active:scale-[0.98]"><Link to="/dashboard">Abrir painel</Link></Button>
          ) : (
            <Button asChild size="sm" variant="outline" className="min-h-11 rounded-xl border-border bg-card px-4 shadow-sm active:scale-[0.98]"><Link to="/auth" search={{ registerMode: false, reset: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" } as any}>Entrar</Link></Button>
          )}
        </div>
      </header>

      <main className="relative isolate min-h-[calc(100dvh-4rem)] overflow-visible" style={{ height: "auto", minHeight: "calc(100dvh - 4rem)", overflow: "visible" }}>
        <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1800" alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover object-center saturate-[.88] dark:saturate-[.72]" />
        <div className="absolute inset-0 -z-20 bg-background/58 dark:bg-background/64" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/42 dark:from-background dark:via-background/94 dark:to-background/56" />

        <section className="container mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col px-4 md:px-6" style={{ height: "auto", minHeight: "calc(100dvh - 4rem)", overflow: "visible" }}>
          <div className="grid flex-1 items-center gap-7 py-6 md:py-8 lg:grid-cols-[1.06fr_0.94fr] lg:gap-10 lg:py-7">
            <div className="max-w-2xl rounded-[1.75rem] border border-border/90 bg-background/88 p-5 shadow-[0_18px_60px_rgba(0,0,0,.08)] backdrop-blur-xl sm:p-6 lg:p-7 dark:bg-card/78 dark:shadow-[0_18px_60px_rgba(0,0,0,.28)]">
              {isLoading ? (
                <div className="space-y-5" aria-label="Carregando conteúdo principal"><Skeleton className="h-7 w-48 rounded-lg" /><Skeleton className="h-14 w-full max-w-xl" /><Skeleton className="h-14 w-4/5 max-w-lg" /><Skeleton className="h-16 w-full max-w-xl" /></div>
              ) : (
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-foreground shadow-sm"><span className="size-2 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_14%,transparent)]" aria-hidden="true" />Sua evolução em uma única visão</div>
                  <h1 className="max-w-3xl font-display text-[clamp(2.35rem,5.8vw,4.15rem)] font-semibold leading-[1.01] tracking-[-0.045em] text-balance">Entenda seu corpo. <span className="text-primary">Acompanhe o que realmente muda.</span></h1>
                  <p className="mt-4 max-w-[37rem] text-base font-medium leading-7 text-foreground/82 md:text-lg md:leading-8">Composição corporal, alimentação, hidratação e treino reunidos em uma experiência direta, visual e fácil de acompanhar todos os dias.</p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                {isLoading ? <><Skeleton className="h-12 w-full rounded-xl sm:w-44" /><Skeleton className="h-12 w-full rounded-xl sm:w-40" /></> : (
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><QuickOnboarding isLoggedIn={isLoggedIn} /><Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-border bg-card px-6 font-semibold text-foreground shadow-sm hover:border-primary/35 hover:bg-muted/65 active:scale-[0.98]"><Link to="/about" className="group gap-2">Conhecer o projeto<ArrowRight size={16} /></Link></Button></div>
                )}
              </div>

              <div className="mt-6 grid max-w-2xl overflow-hidden rounded-2xl border border-border bg-card/96 shadow-sm sm:grid-cols-3">
                {HOME_FEATURES.map(({ icon: Icon, eyebrow, title, description }, index) => (
                  <div key={title} className={`p-4 transition-colors hover:bg-muted/55 ${index > 0 ? "border-t border-border sm:border-l sm:border-t-0" : ""}`}><div className="flex items-center gap-2.5"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/12 text-primary" aria-hidden="true"><Icon size={18} strokeWidth={2} /></div><span className="text-[10px] font-bold tracking-[0.14em] text-primary">{eyebrow}</span></div><h2 className="mt-3 font-display text-base font-semibold tracking-tight text-card-foreground">{title}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[430px] lg:max-w-[480px] xl:max-w-[510px]">
              <div className="overflow-hidden rounded-[1.75rem] border border-border/90 bg-card shadow-[0_24px_70px_rgba(0,0,0,.18)] ring-1 ring-foreground/5 dark:shadow-[0_24px_70px_rgba(0,0,0,.42)]">
                <div className="on-media relative aspect-[4/4.7] overflow-hidden bg-muted sm:aspect-[4/4.6] lg:aspect-[4/4.45]">
                  <img src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=82&w=1100" alt="Pessoa treinando em ambiente profissional" className="h-full w-full object-cover object-[center_38%] saturate-[.92] brightness-[.86]" fetchPriority="high" loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/94 via-black/35 to-black/12" />
                  <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/20 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-white/25 bg-black/68 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md md:left-5 md:top-5"><BarChart3 size={14} aria-hidden="true" />Visão de progresso</div>
                  <div className="absolute right-4 top-4 rounded-2xl border border-white/25 bg-black/68 p-3 text-white shadow-sm backdrop-blur-md md:right-5 md:top-5"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/78">Acompanhe</p><div className="mt-2 flex items-center gap-3 text-xs font-semibold"><span className="flex items-center gap-1.5"><Target size={14} /> Metas</span><span className="h-4 w-px bg-white/30" /><span className="flex items-center gap-1.5"><BarChart3 size={14} /> Evolução</span></div></div>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6"><div className="mb-3 h-1 w-12 rounded-full bg-primary" aria-hidden="true" /><p className="text-xs font-semibold text-white/82 md:text-sm">Acompanhamento que cabe na rotina</p><p className="mt-1.5 max-w-sm font-display text-xl font-semibold leading-tight text-balance text-white md:text-2xl">Dados organizados para transformar registros em progresso visível.</p><div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-white/90"><span className="rounded-lg border border-white/20 bg-black/42 px-2.5 py-1 backdrop-blur-sm">Corpo</span><span className="rounded-lg border border-white/20 bg-black/42 px-2.5 py-1 backdrop-blur-sm">Nutrição</span><span className="rounded-lg border border-white/20 bg-black/42 px-2.5 py-1 backdrop-blur-sm">Hidratação</span><span className="rounded-lg border border-white/20 bg-black/42 px-2.5 py-1 backdrop-blur-sm">Treino</span></div></div>
                </div>
              </div>
            </div>
          </div>

          <footer className="flex flex-col gap-2 border-t border-border/80 bg-background/72 py-3.5 text-xs text-muted-foreground backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <p>Body Métrica FJ · Feijó, Acre · desenvolvido por Franc D'nis</p>
            <nav className="flex flex-wrap items-center gap-x-1" aria-label="Rodapé">
              <Link to="/about" className="inline-flex min-h-10 items-center rounded-lg px-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Sobre</Link>
              <Link to="/tools" className="inline-flex min-h-10 items-center rounded-lg px-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Ferramentas</Link>
              <Link to="/help" className="inline-flex min-h-10 items-center rounded-lg px-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Ajuda</Link>
              <Link to="/terms" className="inline-flex min-h-10 items-center rounded-lg px-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Termos</Link>
              <span className="mx-1 hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
              <Link to="/admin/login" className="inline-flex min-h-10 items-center rounded-lg px-2 text-[11px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Acesso institucional">Acesso institucional</Link>
            </nav>
          </footer>
        </section>
      </main>
    </div>
  );
}

function QuickOnboarding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ type: "", value: "" });

  useEffect(() => {
    const saved = localStorage.getItem("bodymetrica_quick_onboarding");
    if (!saved) return;
    try { const parsed = JSON.parse(saved); if (parsed.step > 1 || parsed.data?.type) { setStep(parsed.step); setData(parsed.data); } } catch (error) { console.error("Failed to restore onboarding state", error); }
  }, []);

  useEffect(() => {
    if (step > 1 || data.type || data.value) localStorage.setItem("bodymetrica_quick_onboarding", JSON.stringify({ step, data }));
    else localStorage.removeItem("bodymetrica_quick_onboarding");
  }, [step, data]);

  const handleAction = () => {
    if (!isLoggedIn) {
      toast.custom((t) => (<SVGToast type="error" title="Acesso necessário" message="Entre na sua conta para registrar suas métricas." action={{ label: "Entrar", onClick: () => { toast.dismiss(t); window.location.href = "/auth"; } }} onClose={() => toast.dismiss(t)} />), { duration: 5000 });
      return;
    }
    setOpen(true);
  };

  const finish = () => {
    toast.success("Registro simulado com sucesso!");
    setOpen(false); setStep(1); setData({ type: "", value: "" });
    localStorage.removeItem("bodymetrica_quick_onboarding");
  };

  const quickActions = [
    { icon: WaterIcon, label: "Água", type: "hidratação" },
    { icon: FoodIcon, label: "Refeição", type: "alimentação" },
    { icon: GymIcon, label: "Treino", type: "exercício" },
    { icon: Clock, label: "Histórico", type: "análise" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="lg" onClick={handleAction} className="h-12 w-full rounded-xl px-6 font-semibold shadow-sm active:scale-[0.98] sm:w-auto">{isLoggedIn ? "Novo registro" : "Começar agora"}<ArrowRight className="ml-2" size={16} /></Button></DialogTrigger>
      <DialogContent className="overflow-hidden rounded-2xl border-border bg-background p-0 sm:max-w-[430px]">
        <div className="p-6 md:p-7">
          <DialogHeader><DialogTitle className="font-display text-2xl font-semibold tracking-tight">{step === 1 ? "O que você quer registrar?" : "Adicionar registro"}</DialogTitle><DialogDescription className="text-sm leading-6">{step === 1 ? "Escolha uma ação rápida para continuar." : `Informe um valor aproximado para ${data.type}.`}</DialogDescription></DialogHeader>
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 ? (
              <motion.div key="actions" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.18, ease: easeOut }} className="mt-6 grid grid-cols-2 gap-3">
                {quickActions.map(({ icon: Icon, label, type }) => (<button key={label} type="button" onClick={() => { setData({ ...data, type }); setStep(2); }} className="flex min-h-28 flex-col items-start justify-between rounded-2xl border border-border bg-card p-4 text-left hover:border-primary/30 hover:bg-muted/40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"><div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true"><Icon size={18} /></div><span className="text-sm font-medium">{label}</span></button>))}
              </motion.div>
            ) : (
              <motion.div key="value" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }} transition={{ duration: 0.18, ease: easeOut }} className="mt-6 space-y-5">
                <label className="block rounded-2xl border border-border bg-card p-4"><span className="text-sm font-medium">Valor aproximado</span><input autoFocus type="text" inputMode="text" placeholder="Ex.: 500 ml, 200 g, 1 h" className="mt-3 min-h-11 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-xl font-semibold outline-none placeholder:text-muted-foreground/50 focus:border-primary" value={data.value} onChange={(event) => setData({ ...data, value: event.target.value })} /></label>
                <div className="flex gap-3"><Button variant="ghost" onClick={() => setStep(1)} className="min-h-11 flex-1 rounded-xl active:scale-[0.98]">Voltar</Button><Button onClick={finish} disabled={!data.value} className="min-h-11 flex-[2] rounded-xl active:scale-[0.98]">Confirmar</Button></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
