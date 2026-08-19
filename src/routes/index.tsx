import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/auth.functions";
import {
  Activity,
  ArrowRight,
  Droplets,
  Dumbbell,
  HeartPulse,
  LockKeyhole,
  Salad,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "Body Métrica FJ — Saúde, rotina e evolução",
    meta: [
      {
        name: "description",
        content:
          "Corpo, nutrição, hidratação, treino e metas organizados em uma experiência clara para acompanhar sua evolução.",
      },
    ],
  }),
});

const authSearch = {
  registerMode: false,
  reset: false,
  name: "",
  birthDate: "",
  goal: "",
  weight: "",
  height: "",
  activityLevel: "",
} as any;

const modules = [
  {
    icon: HeartPulse,
    title: "Corpo",
    text: "Medidas e composição com histórico contínuo.",
  },
  {
    icon: Salad,
    title: "Nutrição",
    text: "Rotina alimentar e metas no mesmo contexto.",
  },
  {
    icon: Droplets,
    title: "Hidratação",
    text: "Acompanhamento diário sem perder consistência.",
  },
  {
    icon: Dumbbell,
    title: "Treino",
    text: "Sessões, frequência e evolução organizadas.",
  },
];

const signalRows = [
  { icon: Activity, label: "Rotina", value: "Visão integrada" },
  { icon: Target, label: "Metas", value: "Objetivos claros" },
  { icon: TrendingUp, label: "Evolução", value: "Tendências legíveis" },
];

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getSession());

    const globalThemeToggle = document.getElementById("bodymetrica-global-theme-toggle");
    globalThemeToggle?.remove();

    const statusIndicator = document.querySelector<HTMLElement>(".fixed.bottom-24.right-4, .fixed.top-20.right-3");
    if (statusIndicator) {
      statusIndicator.style.top = "auto";
      statusIndicator.style.right = "auto";
      statusIndicator.style.bottom = "14px";
      statusIndicator.style.left = "14px";
      statusIndicator.style.opacity = "0.68";
      statusIndicator.style.transform = "scale(0.78)";
      statusIndicator.style.transformOrigin = "bottom left";
    }

    return () => {
      if (statusIndicator) {
        statusIndicator.style.top = "";
        statusIndicator.style.right = "";
        statusIndicator.style.bottom = "";
        statusIndicator.style.left = "";
        statusIndicator.style.opacity = "";
        statusIndicator.style.transform = "";
        statusIndicator.style.transformOrigin = "";
      }
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/20">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1500px] flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex h-[76px] shrink-0 items-center justify-between gap-5 border-b border-border/70">
          <Link
            to="/"
            aria-label="Body Métrica FJ — início"
            className="group flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary font-black text-primary-foreground shadow-sm transition-transform duration-200 group-active:scale-[.96]">
              B
            </div>
            <div className="leading-none">
              <div className="font-display text-base font-black tracking-[-0.035em] sm:text-lg">
                BODY MÉTRICA
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                saúde • rotina • evolução
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-border bg-card/70 p-1 backdrop-blur-xl md:flex" aria-label="Navegação principal">
            <Link to="/tools" className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Recursos</Link>
            <Link to="/about" className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Sobre</Link>
            <Link to="/help" className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Ajuda</Link>
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button asChild className="rounded-full px-5">
                <Link to="/dashboard">Abrir painel</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden rounded-full px-5 sm:inline-flex">
                  <Link to="/auth" search={authSearch}>Entrar</Link>
                </Button>
                <Button asChild className="rounded-full px-5">
                  <Link to="/auth" search={{ ...authSearch, registerMode: true } as any}>Criar conta</Link>
                </Button>
              </>
            )}
          </div>
        </header>

        <main className="grid min-h-0 flex-1 gap-5 py-5 lg:grid-cols-[1.04fr_.96fr] lg:gap-6">
          <section className="flex min-h-0 flex-col justify-between rounded-[32px] border border-border bg-card px-6 py-7 shadow-sm sm:px-8 lg:px-10 lg:py-10">
            <div className="max-w-[760px]">
              <Badge variant="secondary" className="rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.14em]">
                <Sparkles data-icon="inline-start" />
                Plataforma integrada
              </Badge>

              <h1 className="mt-7 max-w-[760px] font-display text-[clamp(3.1rem,6.3vw,6.6rem)] font-black leading-[0.9] tracking-[-0.065em] text-balance">
                Entenda sua rotina.
                <span className="block text-primary">Evolua com clareza.</span>
              </h1>

              <p className="mt-6 max-w-[640px] text-base font-medium leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Corpo, alimentação, água, treino e metas deixam de ser informações soltas e passam a formar uma visão única da sua evolução.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 rounded-full px-6 font-semibold shadow-sm transition-transform active:scale-[.98]">
                  <Link
                    to={isLoggedIn ? "/dashboard" : "/auth"}
                    search={isLoggedIn ? undefined : ({ ...authSearch, registerMode: true } as any)}
                    className="gap-2"
                  >
                    {isLoggedIn ? "Ir para meu painel" : "Começar agora"}
                    <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-6 font-semibold active:scale-[.98]">
                  <Link to="/about">Conhecer a plataforma</Link>
                </Button>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck /></div>
                <div>
                  <p className="text-sm font-semibold">Dados sob controle</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Acesso associado à sua própria conta.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><LockKeyhole /></div>
                <div>
                  <p className="text-sm font-semibold">Acesso protegido</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Autenticação para separar seus registros.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><TrendingUp /></div>
                <div>
                  <p className="text-sm font-semibold">Progresso legível</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Tendências sem excesso de informação.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid min-h-0 gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-[1.18fr_.82fr]">
            <Card className="group relative min-h-[320px] overflow-hidden rounded-[32px] border border-border shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=90&w=1800"
                alt="Pessoa acompanhando a rotina de treino na academia"
                className="absolute inset-0 h-full w-full object-cover object-[62%_center] transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transform-none"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <CardContent className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                <Badge variant="secondary" className="rounded-full border-white/10 bg-black/35 text-white backdrop-blur-md">
                  Visão diária
                </Badge>
                <h2 className="mt-4 max-w-md font-display text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                  Um único lugar para ler seus sinais.
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">
                  Organize a rotina sem transformar o acompanhamento em um painel complicado.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.14em]">Leitura integrada</CardDescription>
                <CardTitle className="font-display text-2xl tracking-[-0.035em]">O essencial em contexto</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {signalRows.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-2xl border border-border bg-background/65 p-4">
                    <Icon className="text-primary" />
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </main>

        <section className="grid shrink-0 gap-3 pb-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Principais áreas da plataforma">
          {modules.map(({ icon: Icon, title, text }) => (
            <Link key={title} to="/tools" className="group rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Card className="h-full rounded-[24px] border border-border shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-[.99] motion-reduce:transform-none">
                <CardHeader className="flex-row items-start justify-between gap-4 pb-2">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon /></div>
                  <ArrowRight className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="font-display text-xl tracking-[-0.03em]">{title}</CardTitle>
                  <CardDescription className="mt-2 leading-5">{text}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
