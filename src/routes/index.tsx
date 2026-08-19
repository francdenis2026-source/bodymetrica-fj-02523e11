import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/auth.functions";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Droplets,
  Dumbbell,
  HeartPulse,
  LockKeyhole,
  Salad,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRoundCheck,
  Weight,
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
    title: "Body Métrica FJ — Seu progresso, organizado",
    meta: [
      {
        name: "description",
        content:
          "Organize composição corporal, nutrição, hidratação, treinos e metas em uma experiência clara e integrada.",
      },
      { property: "og:title", content: "Body Métrica FJ" },
      {
        property: "og:description",
        content:
          "Uma visão integrada da sua rotina para acompanhar evolução com mais clareza.",
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
    icon: Weight,
    title: "Corpo",
    description: "Peso, medidas, composição e histórico em uma leitura contínua.",
    detail: "Métricas conectadas",
  },
  {
    icon: Salad,
    title: "Nutrição",
    description: "Registros alimentares e metas nutricionais organizados no mesmo fluxo.",
    detail: "Rotina alimentar",
  },
  {
    icon: Droplets,
    title: "Hidratação",
    description: "Acompanhe ingestão de água sem perder o contexto do seu objetivo.",
    detail: "Meta diária",
  },
  {
    icon: Dumbbell,
    title: "Treino",
    description: "Sessões, constância e evolução reunidas para facilitar o acompanhamento.",
    detail: "Histórico de treino",
  },
];

const principles = [
  {
    icon: TrendingUp,
    title: "Evolução compreensível",
    description: "Informação organizada para você identificar tendências sem se perder em telas ou números soltos.",
  },
  {
    icon: Target,
    title: "Metas com contexto",
    description: "Objetivos, registros e rotina aparecem conectados para deixar o progresso mais fácil de interpretar.",
  },
  {
    icon: ShieldCheck,
    title: "Privacidade por princípio",
    description: "A experiência foi pensada para manter seus registros pessoais sob controle e com acesso protegido.",
  },
];

const steps = [
  {
    number: "01",
    title: "Defina seu ponto de partida",
    description: "Crie sua conta e informe os dados básicos que ajudam a personalizar sua experiência.",
  },
  {
    number: "02",
    title: "Registre sua rotina",
    description: "Adicione corpo, alimentação, água e treino de forma simples, no ritmo do seu dia.",
  },
  {
    number: "03",
    title: "Leia sua evolução",
    description: "Use histórico, metas e tendências para entender o que está mudando com mais clareza.",
  },
];

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getSession());
  }, []);

  return (
    <div className="home-page min-h-[100dvh] overflow-x-hidden bg-background text-foreground selection:bg-primary/20">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <Link
            to="/"
            aria-label="Body Métrica FJ — página inicial"
            className="group flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="flex size-10 items-center justify-center rounded-[14px] bg-foreground text-sm font-black text-background shadow-sm transition-transform duration-300 group-hover:-rotate-3">
              B
            </div>
            <div className="leading-tight">
              <span className="block font-display text-[15px] font-semibold tracking-[-0.02em] sm:text-base">Body Métrica FJ</span>
              <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">Saúde, rotina e evolução</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-border/80 bg-card/80 p-1 text-sm font-medium md:flex" aria-label="Navegação principal">
            <a href="#plataforma" className="rounded-full px-4 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Plataforma</a>
            <a href="#como-funciona" className="rounded-full px-4 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Como funciona</a>
            <Link to="/about" className="rounded-full px-4 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">Sobre</Link>
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button asChild className="h-10 rounded-full px-5 font-semibold">
                <Link to="/dashboard">Abrir painel</Link>
              </Button>
            ) : (
              <Button asChild className="h-10 rounded-full px-5 font-semibold">
                <Link to="/auth" search={authSearch}>Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-[#08111d] text-white">
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=88&w=2200"
            alt="Pessoa treinando em academia com equipamentos ao fundo"
            className="absolute inset-0 -z-30 h-full w-full object-cover object-[center_42%] saturate-[.92]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(4,10,18,.98)_0%,rgba(6,16,29,.92)_43%,rgba(6,16,29,.42)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,12,21,.15)_0%,rgba(5,12,21,.12)_55%,rgba(5,12,21,.92)_100%)]" />

          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20 lg:py-24">
            <div className="grid items-end gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
              <div className="max-w-[700px]">
                <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
                  <span className="h-px w-9 bg-sky-300/70" aria-hidden="true" />
                  Uma visão integrada da sua rotina
                </div>

                <h1 className="font-display text-[clamp(3.1rem,7.2vw,6.6rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-balance">
                  Seu corpo conta uma história.
                  <span className="mt-2 block text-sky-300">Organize os sinais.</span>
                </h1>

                <p className="mt-7 max-w-[610px] text-base font-medium leading-7 text-slate-200 md:text-lg md:leading-8">
                  Corpo, alimentação, hidratação, treino e metas deixam de ser registros isolados e passam a formar uma leitura mais clara da sua evolução.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {isLoggedIn ? (
                    <Button asChild size="lg" className="h-12 rounded-full bg-white px-6 font-semibold text-[#08111d] shadow-[0_14px_36px_rgba(0,0,0,.22)] hover:bg-slate-100">
                      <Link to="/dashboard" className="gap-2">Ir para meu painel <ArrowRight size={17} /></Link>
                    </Button>
                  ) : (
                    <Button asChild size="lg" className="h-12 rounded-full bg-white px-6 font-semibold text-[#08111d] shadow-[0_14px_36px_rgba(0,0,0,.22)] hover:bg-slate-100">
                      <Link to="/auth" search={authSearch} className="gap-2">Começar agora <ArrowRight size={17} /></Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-white/25 bg-white/5 px-6 font-semibold text-white backdrop-blur-md hover:bg-white/10 hover:text-white">
                    <a href="#plataforma" className="gap-2">Conhecer a plataforma <ChevronRight size={17} /></a>
                  </Button>
                </div>
              </div>

              <div className="lg:pb-1">
                <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#0b1726]/82 p-4 shadow-[0_35px_95px_rgba(0,0,0,.45)] backdrop-blur-xl sm:p-5">
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-300">Visão integrada</p>
                      <h2 className="mt-1 font-display text-xl font-semibold tracking-[-0.025em]">O essencial, no mesmo contexto</h2>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300">Prévia da experiência</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {modules.map(({ icon: Icon, title, detail }) => (
                      <div key={title} className="rounded-2xl border border-white/10 bg-white/[.055] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex size-9 items-center justify-center rounded-xl bg-sky-300/10 text-sky-300"><Icon size={18} /></div>
                          <span className="size-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
                        </div>
                        <p className="mt-4 font-display text-lg font-semibold">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-2xl border border-white/10 bg-black/15 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Linha de evolução</p>
                        <p className="mt-1 text-sm font-semibold">Tendências sem números fora de contexto</p>
                      </div>
                      <BarChart3 size={18} className="text-sky-300" />
                    </div>
                    <div className="mt-5 flex h-16 items-end gap-1.5" aria-hidden="true">
                      {[34, 48, 42, 58, 54, 68, 63, 75, 72, 84, 79, 92].map((height, index) => (
                        <div key={index} className="flex-1 rounded-t-[4px] bg-gradient-to-t from-sky-500/20 to-sky-300/85" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="plataforma" className="border-b border-border bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Plataforma</p>
                <h2 className="mt-4 max-w-md font-display text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-5xl">Menos telas soltas. Mais entendimento.</h2>
                <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">O Body Métrica FJ reúne os principais registros da rotina para facilitar acompanhamento e consistência sem transformar o processo em um painel complicado.</p>
                <Button asChild variant="outline" className="mt-7 h-11 rounded-full border-border bg-card px-5 font-semibold shadow-sm">
                  <Link to="/tools" className="gap-2">Explorar ferramentas <ArrowRight size={16} /></Link>
                </Button>
              </div>

              <div className="grid gap-px overflow-hidden rounded-[28px] border border-border bg-border sm:grid-cols-2">
                {modules.map(({ icon: Icon, title, description }, index) => (
                  <article key={title} className="group bg-card p-6 transition-colors hover:bg-muted/45 md:p-7">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-background text-primary shadow-sm"><Icon size={20} /></div>
                      <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
                    </div>
                    <h3 className="mt-8 font-display text-2xl font-semibold tracking-[-0.035em]">{title}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/35 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-10 max-w-2xl md:mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Por que funciona melhor</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.045em] md:text-5xl">Clareza antes de complexidade.</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {principles.map(({ icon: Icon, title, description }, index) => (
                <article key={title} className={`rounded-[26px] border border-border bg-card p-6 shadow-sm md:p-7 ${index === 1 ? "lg:translate-y-6" : ""}`}>
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon size={20} /></div>
                  <h3 className="mt-7 font-display text-2xl font-semibold tracking-[-0.035em]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-start lg:gap-20">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Como funciona</p>
                <h2 className="mt-4 max-w-md font-display text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-5xl">Comece simples. Evolua com consistência.</h2>
                <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">Sem exigir que você preencha tudo de uma vez. O sistema acompanha sua rotina conforme os registros ganham contexto.</p>
              </div>

              <div className="space-y-3">
                {steps.map((step) => (
                  <article key={step.number} className="grid gap-5 rounded-[24px] border border-border bg-card p-5 shadow-sm sm:grid-cols-[70px_1fr] sm:p-6">
                    <div className="font-display text-3xl font-semibold tracking-[-0.04em] text-primary/55">{step.number}</div>
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{step.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card py-12 md:py-16">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-3 md:px-6">
            <TrustItem icon={LockKeyhole} title="Acesso protegido" text="Autenticação separa seus registros pessoais da experiência pública." />
            <TrustItem icon={UserRoundCheck} title="Conta individual" text="Cada usuário acompanha apenas os dados associados ao próprio perfil." />
            <TrustItem icon={HeartPulse} title="Apoio à rotina" text="A plataforma organiza informações; decisões de saúde exigem orientação adequada quando necessário." />
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#08111d] py-16 text-white md:py-20">
          <div className="absolute -right-24 -top-24 size-80 rounded-full bg-sky-400/10 blur-3xl" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:px-6 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-300"><Sparkles size={15} /> Próximo passo</div>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-5xl">Transforme registros em uma rotina que você entende.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Crie sua conta para começar a reunir seus dados e acompanhar sua evolução em um só lugar.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              {isLoggedIn ? (
                <Button asChild size="lg" className="h-12 rounded-full bg-white px-7 font-semibold text-[#08111d] hover:bg-slate-100">
                  <Link to="/dashboard" className="gap-2">Abrir painel <ArrowRight size={17} /></Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="h-12 rounded-full bg-white px-7 font-semibold text-[#08111d] hover:bg-slate-100">
                  <Link to="/auth" search={authSearch} className="gap-2">Criar minha conta <ArrowRight size={17} /></Link>
                </Button>
              )}
              <Button asChild variant="outline" className="h-11 rounded-full border-white/20 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                <Link to="/about">Conhecer o projeto</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_.7fr] md:px-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-xs font-black text-background">B</div>
              <div>
                <p className="font-display text-sm font-semibold">Body Métrica FJ</p>
                <p className="text-xs text-muted-foreground">Saúde e composição corporal</p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">Uma plataforma para organizar registros de corpo, alimentação, hidratação, treino e evolução em uma experiência integrada.</p>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm" aria-label="Links do rodapé">
            <Link to="/about" className="rounded-md py-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Sobre</Link>
            <Link to="/tools" className="rounded-md py-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Ferramentas</Link>
            <Link to="/help" className="rounded-md py-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Ajuda</Link>
            <Link to="/terms" className="rounded-md py-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Termos</Link>
            <Link to="/admin/login" className="rounded-md py-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Área administrativa</Link>
          </nav>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-6">
            <p>© 2026 Body Métrica FJ.</p>
            <p>Feijó, Acre · desenvolvido por Franc D'nis</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TrustItem({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="flex gap-4 rounded-2xl p-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={18} /></div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
