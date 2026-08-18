import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { getSession } from "@/lib/auth/auth.functions";
import {
  ArrowRight,
  BarChart3,
  Clock,
  Droplets as WaterIcon,
  Dumbbell as GymIcon,
  ShieldCheck,
  Target,
  Utensils as FoodIcon,
} from "lucide-react";

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
      {
        name: "description",
        content:
          "Acompanhe composição corporal, alimentação, hidratação e treinos em um só lugar.",
      },
      { property: "og:title", content: "Body Métrica FJ" },
      {
        property: "og:description",
        content:
          "Acompanhe composição corporal, alimentação, hidratação e treinos em um só lugar.",
      },
    ],
  }),
});

const HOME_FEATURES = [
  {
    icon: BarChart3,
    title: "Evolução clara",
    description: "Tendências e registros em uma leitura simples.",
  },
  {
    icon: Target,
    title: "Metas conectadas",
    description: "Peso, medidas, alimentação e treino no mesmo objetivo.",
  },
  {
    icon: ShieldCheck,
    title: "Dados sob controle",
    description: "Acompanhamento pessoal com foco em privacidade.",
  },
];

const easeOut = [0.23, 1, 0.32, 1] as const;

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setIsLoggedIn(!!session);

    const timer = window.setTimeout(() => setIsLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="relative z-50 border-b border-border/70 bg-background/92 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link
            to="/"
            aria-label="Ir para a página inicial"
            className="group flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-active:scale-[0.97] motion-reduce:transition-none">
              B
            </div>
            <div className="leading-tight">
              <span className="block font-display text-base font-semibold tracking-tight md:text-lg">
                Body Métrica FJ
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                Saúde e composição corporal
              </span>
            </div>
          </Link>

          {isLoggedIn ? (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="min-h-11 rounded-xl bg-background/75 px-4 transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none"
            >
              <Link to="/dashboard">Abrir painel</Link>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="min-h-11 rounded-xl px-4 transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none"
            >
              <Link
                to="/auth"
                search={{
                  registerMode: false,
                  reset: false,
                  name: "",
                  birthDate: "",
                  goal: "",
                  weight: "",
                  height: "",
                  activityLevel: "",
                } as any}
              >
                Entrar
              </Link>
            </Button>
          )}
        </div>
      </header>

      <main className="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=82&w=2200"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-background/84 dark:bg-background/90" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/94 to-background/68" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-background via-background/74 to-transparent" />

        <section className="container mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col px-4 md:px-6">
          <div className="grid flex-1 items-center gap-8 py-7 md:py-9 lg:grid-cols-[1.06fr_0.94fr] lg:gap-12 lg:py-8">
            <div className="max-w-2xl">
              {isLoading ? (
                <div className="space-y-5" aria-label="Carregando conteúdo principal">
                  <Skeleton className="h-7 w-48 rounded-full" />
                  <Skeleton className="h-14 w-full max-w-xl" />
                  <Skeleton className="h-14 w-4/5 max-w-lg" />
                  <Skeleton className="h-16 w-full max-w-xl" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, ease: easeOut }}
                >
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/86 px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-md">
                    <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                    Sua evolução em uma única visão
                  </div>

                  <h1 className="max-w-3xl font-display text-[clamp(2.55rem,6.4vw,4.45rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">
                    Entenda seu corpo. Acompanhe o que realmente muda.
                  </h1>

                  <p className="mt-5 max-w-[38rem] text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                    Composição corporal, alimentação, hidratação e treino reunidos em uma experiência direta, visual e fácil de acompanhar todos os dias.
                  </p>
                </motion.div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                {isLoading ? (
                  <>
                    <Skeleton className="h-12 w-full rounded-xl sm:w-44" />
                    <Skeleton className="h-12 w-full rounded-xl sm:w-40" />
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.36, delay: 0.08, ease: easeOut }}
                    className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
                  >
                    <QuickOnboarding isLoggedIn={isLoggedIn} />
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="h-12 rounded-xl border-border/85 bg-background/78 px-6 font-medium shadow-sm backdrop-blur-md transition-[transform,border-color,background-color,box-shadow] duration-150 ease-out hover:border-primary/30 hover:bg-background/90 hover:shadow-md active:scale-[0.97] motion-reduce:transition-none"
                    >
                      <Link to="/about" className="group gap-2">
                        Conhecer o projeto
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                        />
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: 0.12, ease: easeOut }}
                className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-3"
              >
                {HOME_FEATURES.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-border/80 bg-background/78 p-4 shadow-sm backdrop-blur-md transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:bg-background/90 hover:shadow-md motion-reduce:transition-none"
                  >
                    <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary" aria-hidden="true">
                      <Icon size={18} strokeWidth={2} />
                    </div>
                    <h2 className="font-display text-sm font-semibold tracking-tight md:text-base">
                      {title}
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.985, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.48, delay: 0.06, ease: easeOut }}
              className="relative mx-auto w-full max-w-[430px] lg:max-w-[480px] xl:max-w-[510px]"
            >
              <div className="group overflow-hidden rounded-[1.75rem] border border-white/20 bg-card shadow-2xl shadow-black/20">
                <div className="relative aspect-[4/4.7] overflow-hidden bg-muted sm:aspect-[4/4.6] lg:aspect-[4/4.45]">
                  <img
                    src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=88&w=1400"
                    alt="Pessoa treinando em ambiente profissional"
                    className="h-full w-full object-cover object-[center_38%] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.015] motion-reduce:transition-none"
                    fetchPriority="high"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                    <p className="text-xs font-medium text-white/80 md:text-sm">
                      Acompanhamento que cabe na rotina
                    </p>
                    <p className="mt-1.5 max-w-sm font-display text-xl font-semibold leading-tight text-balance md:text-2xl">
                      Dados organizados para mostrar progresso com clareza.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 hidden max-w-[220px] rounded-2xl border border-border/85 bg-background/96 p-3.5 shadow-xl backdrop-blur md:block">
                <p className="text-xs font-medium text-muted-foreground">Visão integrada</p>
                <p className="mt-1 text-sm font-semibold leading-5">Corpo, nutrição, água e treino no mesmo fluxo.</p>
              </div>
            </motion.div>
          </div>

          <footer className="flex flex-col gap-2 border-t border-border/65 py-3.5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>Body Métrica FJ · Feijó, Acre · desenvolvido por Franc D'nis</p>
            <nav className="flex flex-wrap items-center gap-x-1" aria-label="Rodapé">
              <Link to="/about" className="inline-flex min-h-10 items-center rounded-lg px-2 transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Sobre</Link>
              <Link to="/tools" className="inline-flex min-h-10 items-center rounded-lg px-2 transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Ferramentas</Link>
              <Link to="/help" className="inline-flex min-h-10 items-center rounded-lg px-2 transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Ajuda</Link>
              <Link to="/terms" className="inline-flex min-h-10 items-center rounded-lg px-2 transition-colors duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Termos</Link>
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

    try {
      const parsed = JSON.parse(saved);
      if (parsed.step > 1 || parsed.data?.type) {
        setStep(parsed.step);
        setData(parsed.data);
      }
    } catch (error) {
      console.error("Failed to restore onboarding state", error);
    }
  }, []);

  useEffect(() => {
    if (step > 1 || data.type || data.value) {
      localStorage.setItem("bodymetrica_quick_onboarding", JSON.stringify({ step, data }));
    } else {
      localStorage.removeItem("bodymetrica_quick_onboarding");
    }
  }, [step, data]);

  const handleAction = () => {
    if (!isLoggedIn) {
      toast.custom(
        (t) => (
          <SVGToast
            type="error"
            title="Acesso necessário"
            message="Entre na sua conta para registrar suas métricas."
            action={{
              label: "Entrar",
              onClick: () => {
                toast.dismiss(t);
                window.location.href = "/auth";
              },
            }}
            onClose={() => toast.dismiss(t)}
          />
        ),
        { duration: 5000 },
      );
      return;
    }

    setOpen(true);
  };

  const finish = () => {
    toast.success("Registro simulado com sucesso!");
    setOpen(false);
    setStep(1);
    setData({ type: "", value: "" });
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
      <DialogTrigger asChild>
        <Button
          size="lg"
          onClick={handleAction}
          className="h-12 w-full rounded-xl px-6 font-medium shadow-sm transition-[transform,box-shadow] duration-150 ease-out hover:shadow-md active:scale-[0.97] sm:w-auto motion-reduce:transition-none"
        >
          {isLoggedIn ? "Novo registro" : "Começar agora"}
          <ArrowRight className="ml-2" size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-hidden rounded-2xl border-border bg-background p-0 sm:max-w-[430px]">
        <div className="p-6 md:p-7">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-semibold tracking-tight">
              {step === 1 ? "O que você quer registrar?" : "Adicionar registro"}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              {step === 1
                ? "Escolha uma ação rápida para continuar."
                : `Informe um valor aproximado para ${data.type}.`}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait" initial={false}>
            {step === 1 ? (
              <motion.div
                key="actions"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18, ease: easeOut }}
                className="mt-6 grid grid-cols-2 gap-3"
              >
                {quickActions.map(({ icon: Icon, label, type }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setData({ ...data, type });
                      setStep(2);
                    }}
                    className="flex min-h-28 flex-col items-start justify-between rounded-2xl border border-border bg-card p-4 text-left transition-[transform,border-color,background-color,box-shadow] duration-150 ease-out hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                  >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="value"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.18, ease: easeOut }}
                className="mt-6 space-y-5"
              >
                <label className="block rounded-2xl border border-border bg-card p-4">
                  <span className="text-sm font-medium">Valor aproximado</span>
                  <input
                    autoFocus
                    type="text"
                    inputMode="text"
                    placeholder="Ex.: 500 ml, 200 g, 1 h"
                    className="mt-3 min-h-11 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-xl font-semibold outline-none transition-colors duration-150 ease-out placeholder:text-muted-foreground/50 focus:border-primary"
                    value={data.value}
                    onChange={(event) => setData({ ...data, value: event.target.value })}
                  />
                </label>

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)} className="min-h-11 flex-1 rounded-xl transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none">
                    Voltar
                  </Button>
                  <Button onClick={finish} disabled={!data.value} className="min-h-11 flex-[2] rounded-xl transition-transform duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none">
                    Confirmar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}