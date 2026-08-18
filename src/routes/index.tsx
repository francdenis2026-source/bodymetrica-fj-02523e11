import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
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
    description: "Visualize tendências e compare seus registros sem ruído visual.",
  },
  {
    icon: Target,
    title: "Metas conectadas",
    description: "Peso, medidas, nutrição e treino organizados em torno do seu objetivo.",
  },
  {
    icon: ShieldCheck,
    title: "Dados sob controle",
    description: "Uma experiência pensada para acompanhamento pessoal e privacidade.",
  },
];

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setIsLoggedIn(!!session);
    setUserName(session?.user?.name || "");

    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-transform group-hover:-translate-y-0.5">
              B
            </div>
            <div className="leading-tight">
              <span className="block font-display text-base font-semibold tracking-tight md:text-lg">Body Métrica FJ</span>
              <span className="hidden text-xs text-muted-foreground sm:block">Saúde e composição corporal</span>
            </div>
          </Link>

          {isLoggedIn ? (
            <Button asChild size="sm" variant="outline" className="rounded-xl">
              <Link to="/dashboard">Abrir painel</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="ghost" className="rounded-xl">
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

      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 -z-20 bg-background" />
          <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-gradient-to-b from-primary/[0.07] via-primary/[0.02] to-transparent" />

          <div className="container mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:py-24">
            <div className="max-w-2xl">
              {isLoading ? (
                <div className="space-y-5">
                  <Skeleton className="h-7 w-48 rounded-full" />
                  <Skeleton className="h-16 w-full max-w-xl" />
                  <Skeleton className="h-16 w-4/5 max-w-lg" />
                  <Skeleton className="h-20 w-full max-w-xl" />
                </div>
              ) : (
                <>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
                    <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                    Acompanhamento integrado da sua evolução
                  </div>

                  <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.03] tracking-[-0.035em] sm:text-5xl md:text-6xl lg:text-7xl">
                    Entenda seu corpo. Acompanhe o que realmente muda.
                  </h1>

                  <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                    Reúna composição corporal, alimentação, hidratação e treino em uma rotina simples de acompanhar — com dados organizados para ajudar você a tomar decisões melhores ao longo do tempo.
                  </p>
                </>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                {isLoading ? (
                  <>
                    <Skeleton className="h-12 w-full rounded-xl sm:w-44" />
                    <Skeleton className="h-12 w-full rounded-xl sm:w-40" />
                  </>
                ) : (
                  <>
                    <QuickOnboarding isLoggedIn={isLoggedIn} />
                    <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-6">
                      <Link to="/about" className="gap-2">
                        Conhecer o projeto
                        <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 border-t border-border/70 pt-6 sm:grid-cols-3">
                <Metric label="Funciona offline" value="PWA" />
                <Metric label="Visão integrada" value="4 áreas" />
                <Metric label="Foco" value="Evolução" />
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
              <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/10">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=85&w=1400"
                    alt="Pessoa treinando com acompanhamento de composição corporal"
                    className="h-full w-full object-cover"
                    fetchPriority="high"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                    <p className="text-sm font-medium text-white/75">Dados que fazem sentido no dia a dia</p>
                    <p className="mt-2 max-w-sm font-display text-2xl font-semibold leading-tight md:text-3xl">
                      Menos ruído. Mais clareza sobre a sua evolução.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 hidden max-w-[240px] rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur md:block">
                <p className="text-xs font-medium text-muted-foreground">Acompanhamento</p>
                <p className="mt-1 text-sm font-semibold">Composição, nutrição, água e treino no mesmo fluxo.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-medium text-primary">O que você acompanha</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Uma visão completa sem transformar sua rotina em uma planilha.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {HOME_FEATURES.map(({ icon: Icon, title, description }) => (
              <Link
                key={title}
                to="/about"
                className="group rounded-2xl border border-border bg-card p-6 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={20} />
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Saiba mais
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 bg-muted/20">
        <div className="container mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="font-display font-semibold">Body Métrica FJ</p>
            <p className="mt-1 text-sm text-muted-foreground">Feijó, Acre · desenvolvido por Franc D'nis</p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground" aria-label="Rodapé">
            <Link to="/about" className="transition-colors hover:text-foreground">Sobre</Link>
            <Link to="/tools" className="transition-colors hover:text-foreground">Ferramentas</Link>
            <Link to="/help" className="transition-colors hover:text-foreground">Ajuda</Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">Termos</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-lg font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{label}</p>
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
          className="h-12 w-full rounded-xl px-6 shadow-sm sm:w-auto"
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

          {step === 1 ? (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {quickActions.map(({ icon: Icon, label, type }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setData({ ...data, type });
                    setStep(2);
                  }}
                  className="flex min-h-28 flex-col items-start justify-between rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/30 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={18} />
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <label className="block rounded-2xl border border-border bg-card p-4">
                <span className="text-sm font-medium">Valor aproximado</span>
                <input
                  autoFocus
                  type="text"
                  placeholder="Ex.: 500 ml, 200 g, 1 h"
                  className="mt-3 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-xl font-semibold outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary"
                  value={data.value}
                  onChange={(event) => setData({ ...data, value: event.target.value })}
                />
              </label>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 rounded-xl">
                  Voltar
                </Button>
                <Button onClick={finish} disabled={!data.value} className="flex-[2] rounded-xl">
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
