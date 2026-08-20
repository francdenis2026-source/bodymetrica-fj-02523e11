import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getSession } from "@/lib/auth/auth.functions";
import {
  Activity, ArrowRight, Check, Droplets, Dumbbell, HeartPulse,
  LockKeyhole, Menu, Salad, ShieldCheck, Sparkles, X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "Body Métrica FJ — Sua rotina em uma visão completa",
    meta: [
      { name: "description", content: "Composição corporal, alimentação, hidratação e treino conectados em uma experiência privada, clara e profissional." },
      { property: "og:title", content: "Body Métrica FJ" },
      { property: "og:description", content: "Sua rotina em uma visão completa." },
      { property: "og:image", content: "/bodymetrica-hero-2026.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const authSearch = {
  registerMode: false, reset: false, name: "", birthDate: "", goal: "",
  weight: "", height: "", activityLevel: "",
} as any;

const modules = [
  { icon: HeartPulse, label: "Corpo", detail: "Peso e medidas", to: "/body" },
  { icon: Salad, label: "Nutrição", detail: "Refeições e metas", to: "/nutrition" },
  { icon: Droplets, label: "Hidratação", detail: "Meta diária", to: "/hydration" },
  { icon: Dumbbell, label: "Treinos", detail: "Força e constância", to: "/training" },
] as const;

function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-[18px] font-semibold tracking-tight">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-brand">
        <Activity className="size-[18px]" />
      </span>
      <span>Body Métrica<span className="font-normal text-white/55"> FJ</span></span>
    </span>
  );
}

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getSession());
    document.getElementById("bodymetrica-global-theme-toggle")?.remove();
  }, []);

  const startTo = isLoggedIn ? "/dashboard" : "/auth";
  const startSearch = isLoggedIn ? undefined : ({ ...authSearch, registerMode: true } as any);

  return (
    <div className="landing on-media relative min-h-[100dvh] overflow-x-hidden bg-[#0a141a] text-white selection:bg-primary/40">
      {/* Photographic hero backdrop, graded into the brand palette. */}
      <img
        src="/bodymetrica-hero-2026.jpg"
        alt="Rotina integrada de alimentação, hidratação e treino"
        className="absolute inset-0 h-full w-full object-cover object-[62%_center] [filter:saturate(0.85)_brightness(0.62)]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,16,20,.97)_0%,rgba(8,22,27,.92)_38%,rgba(9,24,29,.55)_68%,rgba(10,26,31,.22)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,20,.55)_0%,transparent_36%,rgba(6,14,18,.9)_100%)]" />
      <div className="pointer-events-none absolute left-[42%] top-[12%] size-[34rem] rounded-full bg-primary/14 blur-[110px]" />
      <div className="pointer-events-none absolute right-[6%] bottom-[8%] size-[22rem] rounded-full bg-success/10 blur-[100px]" />

      <header className="relative z-40 border-b border-white/10 bg-[#0a141a]/55 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link to="/" aria-label="Body Métrica FJ — início" className="rounded-xl focus-visible:ring-primary"><Logo /></Link>
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[.05] p-1 text-xs font-medium text-white/65 md:flex" aria-label="Navegação principal">
            <a href="#visao" className="rounded-full bg-white/10 px-4 py-2 text-white">Visão geral</a>
            <Link to="/tools" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">Ferramentas</Link>
            <Link to="/about" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">Sobre</Link>
            <Link to="/help" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">Ajuda</Link>
          </nav>
          <div className="flex items-center gap-2">
            {!isLoggedIn && <Link to="/auth" search={authSearch} className="hidden rounded-full px-4 py-2 text-xs font-semibold text-white/75 transition hover:text-white sm:block">Entrar</Link>}
            <Link to={startTo} search={startSearch} className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-brand transition hover:-translate-y-0.5 hover:brightness-110">{isLoggedIn ? "Abrir painel" : "Criar conta"}<ArrowRight className="size-3.5" /></Link>
            <button type="button" className="grid size-10 place-items-center rounded-full md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu" aria-expanded={menuOpen}>{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-white/10 bg-[#0e1c22]/97 px-5 py-4 text-sm font-medium md:hidden"><Link to="/tools" className="block py-2.5">Ferramentas</Link><Link to="/about" className="block py-2.5">Sobre</Link><Link to="/help" className="block py-2.5">Ajuda</Link></nav>}
      </header>

      <main id="visao" className="landing-viewport relative z-20 mx-auto flex max-w-[1400px] flex-col justify-center gap-6 px-5 py-6 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <section className="flex min-h-0 flex-col justify-center">
            <div className="max-w-[640px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-[#7fe0ec]">
                <Sparkles className="size-3.5" />Saúde em contexto
              </div>
              <h1 className="mt-4 font-display text-[clamp(2.1rem,4.4vw,3.6rem)] font-semibold leading-[1.04] tracking-[-.03em]">
                Sua evolução física,<br />
                <span className="text-gradient-brand">em uma visão só.</span>
              </h1>
              <p className="mt-4 max-w-[540px] text-[clamp(.92rem,1.1vw,1.02rem)] leading-7 text-white/65">
                Composição corporal, alimentação, hidratação e treino deixam de ser registros isolados. O Body Métrica FJ conecta sua rotina com clareza, privacidade e ferramentas de verdade — sem promessas vazias.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to={startTo} search={startSearch} className="inline-flex h-12 items-center gap-2.5 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-brand transition hover:-translate-y-0.5 hover:brightness-110">{isLoggedIn ? "Continuar minha jornada" : "Começar agora"}<ArrowRight className="size-4" /></Link>
                <Link to="/tools" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[.05] px-5 text-sm font-medium backdrop-blur transition hover:bg-white/10">Explorar ferramentas</Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-medium text-white/50">
                <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#7fe0ec]" />Dados sob seu controle</span>
                <span className="flex items-center gap-2"><LockKeyhole className="size-4 text-[#7fe0ec]" />Privacidade por padrão</span>
                <span className="flex items-center gap-2"><Check className="size-4 text-[#7fe0ec]" />Acesso gratuito para começar</span>
              </div>
            </div>
          </section>

          <section className="relative hidden min-h-0 items-center justify-end lg:flex" aria-label="Prévia do aplicativo">
            <div className="relative w-[min(100%,470px)] rounded-[26px] border border-white/15 bg-[#0e1c22]/80 p-4 shadow-[0_38px_100px_rgba(3,8,10,.5)] backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#7fe0ec]">Resumo de hoje</p>
                  <h2 className="mt-1 font-display text-xl font-semibold">Seu ritmo, em equilíbrio</h2>
                </div>
                <span className="grid size-9 place-items-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">F</span>
              </div>
              <div className="mt-3.5 grid grid-cols-[116px_1fr] items-center gap-4 rounded-[20px] border border-white/8 bg-black/15 p-3.5">
                <div className="grid size-[104px] place-items-center rounded-full bg-[conic-gradient(var(--primary)_78%,rgba(255,255,255,.09)_0)] p-3">
                  <div className="grid size-full place-items-center rounded-full bg-[#0e1c22] text-center">
                    <div><strong className="block font-display text-2xl font-semibold">78%</strong><small className="text-[8px] text-white/45">rotina concluída</small></div>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[.14em] text-white/40">Consistência</p>
                  <strong className="mt-1.5 block text-sm">6 de 8 hábitos</strong>
                  <div className="mt-3.5 flex h-9 items-end gap-1.5">
                    {[18, 29, 23, 34, 28, 40, 36].map((height, index) => (
                      <i key={index} style={{ height }} className={`w-2 rounded-full ${index > 4 ? "bg-primary" : "bg-white/12"}`} />
                    ))}
                  </div>
                  <p className="mt-2.5 text-[10px] font-semibold text-success">+14% nesta semana</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/8 bg-white/[.04] p-3.5">
                  <Droplets className="size-4 text-info" />
                  <small className="mt-2.5 block text-[9px] text-white/40">Água</small>
                  <strong className="text-sm">1,8 / 2,5 L</strong>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[.04] p-3.5">
                  <Dumbbell className="size-4 text-[#7fe0ec]" />
                  <small className="mt-2.5 block text-[9px] text-white/40">Próximo treino</small>
                  <strong className="text-sm">Hoje · 18:30</strong>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Áreas do aplicativo">
          {modules.map(({ icon: Icon, label, detail, to }, index) => (
            <Link key={label} to={to} className="group flex min-h-[74px] items-center gap-3 rounded-[18px] border border-white/12 bg-[#0e1c22]/65 px-4 py-3 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[#122530]/90">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-[#7fe0ec]"><Icon className="size-5" /></span>
              <span className="min-w-0"><strong className="block text-sm">{label}</strong><small className="text-[10px] text-white/40">{detail}</small></span>
              <span className="ml-auto font-mono text-[9px] text-white/20">0{index + 1}</span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
