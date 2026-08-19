import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/auth.functions";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Check,
  Droplets,
  Dumbbell,
  Flame,
  ShieldCheck,
  Smartphone,
  Target,
  Utensils,
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
    title: "Body Métrica FJ — Evolução com dados que transformam",
    meta: [
      {
        name: "description",
        content:
          "Acompanhe composição corporal, alimentação, hidratação, treino e evolução em uma experiência integrada.",
      },
      { property: "og:title", content: "Body Métrica FJ" },
      {
        property: "og:description",
        content:
          "Seu corpo, seus dados e sua evolução reunidos em uma plataforma simples e inteligente.",
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

const benefits = [
  {
    icon: ShieldCheck,
    title: "Dados confiáveis",
    description: "Informações organizadas para decisões mais claras.",
  },
  {
    icon: BarChart3,
    title: "Evolução contínua",
    description: "Visualize tendências e acompanhe mudanças ao longo do tempo.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança total",
    description: "Privacidade e controle sobre os seus registros.",
  },
  {
    icon: Smartphone,
    title: "Acesso em qualquer lugar",
    description: "Sua rotina disponível no computador e no celular.",
  },
];

const resourceCards = [
  { icon: Flame, label: "Calorias", value: "2.350 kcal", hint: "Meta personalizada" },
  { icon: Dumbbell, label: "Treinos", value: "5", hint: "Nesta semana" },
  { icon: Droplets, label: "Água", value: "2,1 L", hint: "Meta diária" },
  { icon: Activity, label: "Evolução", value: "Contínua", hint: "Histórico integrado" },
];

const workflow = [
  {
    number: "01",
    title: "Crie sua conta",
    description: "Cadastre-se com segurança e configure seu perfil.",
  },
  {
    number: "02",
    title: "Registre seus dados",
    description: "Informe medidas, objetivo, alimentação, água e treinos.",
  },
  {
    number: "03",
    title: "Evolua com inteligência",
    description: "Acompanhe tendências, metas e resultados em um só painel.",
  },
];

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getSession());
  }, []);

  return (
    <div className="home-page min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06111e]/95 text-white shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <Link to="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold shadow-[0_8px_28px_rgba(37,99,235,.35)]">B</div>
            <div className="leading-tight">
              <span className="block font-display text-base font-semibold tracking-tight md:text-lg">Body Métrica FJ</span>
              <span className="hidden text-[11px] text-slate-300 sm:block">Saúde e composição corporal</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 lg:flex" aria-label="Navegação principal">
            <a href="#recursos" className="transition-colors hover:text-white">Recursos</a>
            <a href="#beneficios" className="transition-colors hover:text-white">Benefícios</a>
            <a href="#como-funciona" className="transition-colors hover:text-white">Como funciona</a>
            <Link to="/about" className="transition-colors hover:text-white">Sobre</Link>
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button asChild className="h-10 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-500">
                <Link to="/dashboard">Abrir painel</Link>
              </Button>
            ) : (
              <Button asChild className="h-10 rounded-xl bg-blue-600 px-5 text-white shadow-[0_8px_24px_rgba(37,99,235,.25)] hover:bg-blue-500">
                <Link to="/auth" search={authSearch}>Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-[#06111e] text-white">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=88&w=2000"
            alt="Ambiente de treino profissional"
            className="absolute inset-0 -z-30 h-full w-full object-cover object-center opacity-85 saturate-110"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#030912]/98 via-[#06111e]/88 to-[#06111e]/36" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#06111e] via-transparent to-[#06111e]/30" />

          <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-sky-300 backdrop-blur-md">
                  <ShieldCheck size={14} /> Plataforma completa
                </div>
                <h1 className="font-display text-[clamp(2.7rem,6.3vw,5.35rem)] font-semibold leading-[0.97] tracking-[-0.055em] text-balance">
                  Sua evolução, com dados que <span className="text-blue-400">transformam.</span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 md:text-lg md:leading-8">
                  Acompanhe métricas corporais, alimentação, hidratação, treino e metas em um só lugar. Informações claras para entender o que muda e tomar melhores decisões sobre sua rotina.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 font-semibold text-white shadow-[0_14px_35px_rgba(37,99,235,.35)] hover:from-blue-500 hover:to-blue-400">
                    <Link to={isLoggedIn ? "/dashboard" : "/auth"} search={isLoggedIn ? undefined : authSearch} className="gap-2">
                      {isLoggedIn ? "Abrir painel" : "Começar agora"}<ArrowRight size={17} />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-white/20 bg-black/20 px-6 font-semibold text-white backdrop-blur-md hover:bg-white/10 hover:text-white">
                    <a href="#recursos" className="gap-2"><BarChart3 size={17} /> Ver recursos</a>
                  </Button>
                </div>
                <p className="mt-5 text-sm text-slate-300">Corpo, nutrição, água e treino conectados ao mesmo objetivo.</p>
              </div>

              <div className="relative">
                <div className="rounded-[1.75rem] border border-white/15 bg-[#09182a]/88 p-4 shadow-[0_32px_90px_rgba(0,0,0,.45)] backdrop-blur-xl md:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-sky-300">Visão geral</p>
                      <h2 className="mt-1 font-display text-xl font-semibold">Seu progresso em contexto</h2>
                    </div>
                    <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">Últimos 30 dias</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <MetricCard icon={Weight} label="Peso atual" value="72,5 kg" trend="-1,2 kg no período" />
                    <MetricCard icon={Activity} label="IMC" value="23,1" trend="Faixa saudável" />
                    <MetricCard icon={Target} label="Meta" value="70 kg" trend="2,5 kg para alcançar" />
                    <MetricCard icon={BarChart3} label="Consistência" value="87%" trend="Registros completos" />
                  </div>

                  <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Evolução do peso</p>
                        <p className="mt-1 text-sm font-semibold text-white">Tendência das últimas semanas</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">Dentro da meta</span>
                    </div>
                    <div className="flex h-28 items-end gap-2">
                      {[78, 68, 72, 58, 61, 51, 54, 44, 47, 39, 41, 33].map((height, index) => (
                        <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600/55 to-cyan-400/95" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="beneficios" className="mt-10 grid overflow-hidden rounded-2xl border border-white/12 bg-[#071525]/88 backdrop-blur-xl md:grid-cols-4">
              {benefits.map(({ icon: Icon, title, description }, index) => (
                <div key={title} className={`p-5 ${index > 0 ? "border-t border-white/10 md:border-l md:border-t-0" : ""}`}>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/12 text-sky-300 ring-1 ring-blue-400/20"><Icon size={19} /></div>
                  <h3 className="mt-3 font-display text-base font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="recursos" className="bg-background py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <div className="lg:sticky lg:top-24">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Inteligência a seu favor</p>
                <h2 className="mt-3 max-w-md font-display text-3xl font-semibold tracking-tight md:text-4xl">Tudo o que você precisa para evoluir de verdade</h2>
                <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">Uma visão integrada para reduzir informações soltas e transformar registros em decisões mais claras.</p>
                <div className="mt-6 space-y-3">
                  {["Métricas corporais detalhadas", "Metas e histórico de evolução", "Acompanhamento nutricional", "Controle de hidratação", "Treinos e rotina conectados"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-medium"><span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary"><Check size={14} strokeWidth={3} /></span>{item}</div>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-7 h-11 rounded-xl border-border bg-card px-5 shadow-sm">
                  <Link to="/tools" className="gap-2">Explorar ferramentas <ArrowRight size={16} /></Link>
                </Button>
              </div>

              <div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {resourceCards.map(({ icon: Icon, label, value, hint }) => (
                    <div key={label} className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-transform hover:-translate-y-0.5">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={18} /></div>
                      <p className="mt-3 text-xs font-semibold text-muted-foreground">{label}</p>
                      <p className="mt-1 font-display text-xl font-semibold tracking-tight">{value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div><p className="text-xs font-semibold text-muted-foreground">Composição corporal</p><h3 className="mt-1 font-display text-lg font-semibold">Distribuição atual</h3></div>
                      <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Atualizado</span>
                    </div>
                    <div className="mt-6 flex items-center gap-6">
                      <div className="relative flex size-32 items-center justify-center rounded-full bg-[conic-gradient(var(--primary)_0_76%,hsl(var(--muted))_76%_100%)]">
                        <div className="flex size-24 flex-col items-center justify-center rounded-full bg-card"><span className="font-display text-2xl font-semibold">72,5</span><span className="text-xs text-muted-foreground">kg</span></div>
                      </div>
                      <div className="space-y-3 text-sm"><Legend label="Massa magra" value="59,1 kg" /><Legend label="Massa gorda" value="13,4 kg" /></div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground">Ingestão calórica</p>
                    <h3 className="mt-1 font-display text-lg font-semibold">Últimos 7 dias</h3>
                    <div className="mt-7 flex h-36 items-end gap-3">
                      {[63, 52, 67, 79, 58, 69, 61].map((height, index) => (
                        <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-400" style={{ height: `${height}%` }} /><span className="text-[10px] text-muted-foreground">{["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"][index]}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="border-y border-border bg-muted/25 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Simples, rápido e eficiente</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">Como funciona</h2>
              <p className="mt-4 text-muted-foreground">Você registra o essencial e a plataforma organiza o contexto para acompanhar sua evolução.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {workflow.map((item) => (
                <div key={item.number} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between"><span className="font-display text-3xl font-semibold text-primary/35">{item.number}</span><div className="h-px flex-1 bg-border mx-4" /><ArrowRight size={17} className="text-muted-foreground" /></div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-14 md:py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="rounded-[1.75rem] border border-border bg-gradient-to-r from-[#08182b] via-[#0a2140] to-[#071728] p-6 text-white shadow-[0_22px_55px_rgba(2,8,23,.18)] md:flex md:items-center md:justify-between md:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-300">Pronto para começar?</p>
                <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">Transforme seus registros em progresso visível.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Crie sua conta, centralize suas informações e acompanhe seu objetivo de forma mais organizada.</p>
              </div>
              <Button asChild size="lg" className="mt-6 h-12 shrink-0 rounded-xl bg-blue-600 px-7 font-semibold text-white hover:bg-blue-500 md:mt-0">
                <Link to={isLoggedIn ? "/dashboard" : "/auth"} search={isLoggedIn ? undefined : authSearch} className="gap-2">{isLoggedIn ? "Abrir painel" : "Começar agora"}<ArrowRight size={17} /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[1.2fr_.8fr_.8fr_.8fr] md:px-6">
          <div>
            <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground">B</div><div><p className="font-display font-semibold">Body Métrica FJ</p><p className="text-xs text-muted-foreground">Saúde e composição corporal</p></div></div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">Tecnologia para organizar dados de corpo, alimentação, água, treino e metas em um único contexto.</p>
          </div>
          <FooterGroup title="Produto" links={[{ label: "Ferramentas", to: "/tools" }, { label: "Sobre", to: "/about" }, { label: "Ajuda", to: "/help" }]} />
          <FooterGroup title="Conta" links={[{ label: "Entrar", to: "/auth" }, { label: "Cadastro", to: "/auth/register" }, { label: "Administração", to: "/admin/login" }]} />
          <FooterGroup title="Legal" links={[{ label: "Termos", to: "/terms" }, { label: "Privacidade", to: "/privacy" }]} />
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-border px-4 pt-6 text-xs text-muted-foreground md:px-6">© 2026 Body Métrica FJ. Todos os direitos reservados.</div>
      </footer>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, trend }: { icon: React.ElementType; label: string; value: string; trend: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs text-slate-400">{label}</p><p className="mt-1 font-display text-2xl font-semibold tracking-tight text-white">{value}</p><p className="mt-1 text-xs text-emerald-400">{trend}</p></div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-sky-300"><Icon size={17} /></div>
      </div>
    </div>
  );
}

function Legend({ label, value }: { label: string; value: string }) {
  return <div><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-primary" /><span className="font-medium">{label}</span></div><p className="ml-4 mt-0.5 text-xs text-muted-foreground">{value}</p></div>;
}

function FooterGroup({ title, links }: { title: string; links: Array<{ label: string; to: string }> }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 flex flex-col gap-2.5">
        {links.map((link) => <Link key={link.label} to={link.to as any} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{link.label}</Link>)}
      </div>
    </div>
  );
}
