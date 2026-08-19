import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getSession } from "@/lib/auth/auth.functions";
import {
  Activity, ArrowRight, Check, Droplets, Dumbbell, HeartPulse,
  LockKeyhole, Menu, Salad, ShieldCheck, Sparkles, TrendingUp, X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "BodyMetrica — Sua rotina em uma visão completa",
    meta: [
      { name: "description", content: "Corpo, alimentação, hidratação e treino conectados em uma experiência privada, clara e prática." },
      { property: "og:title", content: "BodyMetrica" },
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
  return <span className="flex items-center gap-2.5 text-[19px] font-black tracking-[-.045em]"><span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-[#f07867] text-sm font-black text-[#19172d] shadow-[0_8px_24px_rgba(240,120,103,.28)]"><Activity className="size-5"/><i className="absolute inset-x-2 bottom-1 h-px bg-white/60"/></span><span>Body<span className="font-normal text-white/70">Metrica</span></span></span>;
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
    <div className="home-v2 relative min-h-[100dvh] overflow-hidden bg-[#17162b] text-white selection:bg-[#f07867]/40">
      <img src="/bodymetrica-hero-2026.jpg" alt="Rotina integrada de alimentação, hidratação e treino" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" fetchPriority="high" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,18,39,.98)_0%,rgba(28,22,46,.94)_36%,rgba(26,20,42,.52)_66%,rgba(20,18,36,.20)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,16,34,.62)_0%,transparent_38%,rgba(16,14,31,.88)_100%)]" />
      <div className="absolute left-[44%] top-[16%] size-[32rem] rounded-full bg-[#8b72d8]/12 blur-[100px]" />

      <header className="relative z-40 border-b border-white/10 bg-[#17162b]/54 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-[1540px] items-center justify-between px-5 sm:px-8 lg:px-11">
          <Link to="/" aria-label="BodyMetrica — início" className="rounded-xl focus-visible:ring-[#f07867]"><Logo /></Link>
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[.055] p-1 text-xs font-semibold text-white/68 md:flex" aria-label="Navegação principal">
            <a href="#visao" className="rounded-full bg-white/10 px-4 py-2 text-white">Visão geral</a>
            <Link to="/tools" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">Recursos</Link>
            <Link to="/about" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">Sobre</Link>
            <Link to="/help" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">Ajuda</Link>
          </nav>
          <div className="flex items-center gap-2">
            {!isLoggedIn && <Link to="/auth" search={authSearch} className="hidden rounded-full px-4 py-2 text-xs font-bold text-white/75 transition hover:text-white sm:block">Entrar</Link>}
            <Link to={startTo} search={startSearch} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f07867] px-5 text-xs font-black text-[#1a172e] shadow-[0_10px_30px_rgba(240,120,103,.25)] transition hover:-translate-y-0.5">{isLoggedIn ? "Abrir painel" : "Criar conta"}<ArrowRight className="size-4"/></Link>
            <button type="button" className="grid size-10 place-items-center rounded-full md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu" aria-expanded={menuOpen}>{menuOpen ? <X className="size-5"/> : <Menu className="size-5"/>}</button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-white/10 bg-[#211d3d]/95 px-5 py-4 text-sm font-semibold md:hidden"><Link to="/tools" className="block py-2.5">Recursos</Link><Link to="/about" className="block py-2.5">Sobre</Link><Link to="/help" className="block py-2.5">Ajuda</Link></nav>}
      </header>

      <main id="visao" className="relative z-20 mx-auto grid max-w-[1540px] gap-5 px-5 pb-5 pt-5 sm:px-8 lg:h-[calc(100dvh-4rem)] lg:grid-cols-[1.02fr_.98fr] lg:grid-rows-[1fr_auto] lg:px-11 lg:pb-6">
        <section className="flex min-h-0 flex-col justify-center py-5 lg:py-0">
          <div className="max-w-[690px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f07867]/30 bg-[#f07867]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-[#ffad9f]"><Sparkles className="size-3.5"/>Saúde em contexto</div>
            <h1 className="mt-5 font-serif text-[clamp(3rem,5.5vw,5.9rem)] font-normal leading-[.9] tracking-[-.06em]">Tudo o que move<br/>sua evolução.<span className="mt-2 block font-serif italic text-[#ff8d7b]">Na mesma visão.</span></h1>
            <p className="mt-5 max-w-[590px] text-[clamp(.92rem,1.15vw,1.1rem)] leading-7 text-white/67">Composição corporal, alimentação, água e treino deixam de ser registros isolados. O BodyMetrica revela como a sua rotina se conecta — com clareza, privacidade e sem fórmulas impossíveis.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={startTo} search={startSearch} className="inline-flex h-12 items-center gap-3 rounded-full bg-[#f07867] px-6 text-sm font-black text-[#19172d] shadow-[0_16px_44px_rgba(240,120,103,.22)] transition hover:-translate-y-0.5">{isLoggedIn ? "Continuar minha jornada" : "Começar minha jornada"}<ArrowRight className="size-4"/></Link>
              <Link to="/tools" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/16 bg-white/[.06] px-5 text-sm font-bold backdrop-blur transition hover:bg-white/10">Explorar recursos</Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-white/52"><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#ff8d7b]"/>Dados sob seu controle</span><span className="flex items-center gap-2"><LockKeyhole className="size-4 text-[#ff8d7b]"/>Privacidade por padrão</span><span className="flex items-center gap-2"><Check className="size-4 text-[#ff8d7b]"/>Acesso gratuito para começar</span></div>
          </div>
        </section>

        <section className="relative hidden min-h-0 items-center justify-end lg:flex" aria-label="Prévia do aplicativo">
          <div className="relative mr-2 w-[min(100%,520px)] rounded-[30px] border border-white/18 bg-[#1c1935]/78 p-4 shadow-[0_38px_100px_rgba(8,7,20,.45)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><p className="text-[9px] font-black uppercase tracking-[.18em] text-[#ff8d7b]">Resumo de hoje</p><h2 className="mt-1 font-serif text-2xl font-normal">Seu ritmo, em equilíbrio</h2></div><span className="grid size-10 place-items-center rounded-2xl bg-[#f07867] font-black text-[#19172d]">F</span></div>
            <div className="mt-4 grid grid-cols-[132px_1fr] items-center gap-4 rounded-[22px] border border-white/9 bg-black/15 p-4">
              <div className="grid size-[124px] place-items-center rounded-full bg-[conic-gradient(#f07867_78%,rgba(255,255,255,.09)_0)] p-3"><div className="grid size-full place-items-center rounded-full bg-[#211d3d] text-center"><div><strong className="block font-serif text-3xl font-normal">78%</strong><small className="text-[8px] text-white/48">da rotina concluída</small></div></div></div>
              <div><p className="text-[9px] font-black uppercase tracking-[.16em] text-white/40">Consistência</p><strong className="mt-2 block text-sm">6 de 8 hábitos</strong><div className="mt-5 flex h-10 items-end gap-1.5">{[18,29,23,34,28,40,36].map((height,index)=><i key={index} style={{height}} className={`w-2 rounded-full ${index>4?"bg-[#f07867]":"bg-white/12"}`}/>)}</div><p className="mt-3 text-[10px] font-semibold text-[#ffad9f]">+14% nesta semana</p></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/9 bg-white/[.045] p-3.5"><Droplets className="size-4 text-[#9ca8ff]"/><small className="mt-3 block text-[9px] text-white/42">Água</small><strong className="text-sm">1,8 / 2,5 L</strong></div><div className="rounded-2xl border border-white/9 bg-white/[.045] p-3.5"><Dumbbell className="size-4 text-[#ffad9f]"/><small className="mt-3 block text-[9px] text-white/42">Próximo treino</small><strong className="text-sm">Hoje · 18:30</strong></div></div>
          </div>
        </section>

        <section className="grid gap-2.5 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4" aria-label="Áreas do aplicativo">
          {modules.map(({icon:Icon,label,detail,to},index)=><Link key={label} to={to} className="group flex min-h-[78px] items-center gap-3 rounded-[20px] border border-white/12 bg-[#17162b]/72 px-4 py-3 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#f07867]/40 hover:bg-[#211d3d]/90"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f07867]/12 text-[#ff9a89]"><Icon className="size-5"/></span><span className="min-w-0"><strong className="block text-sm">{label}</strong><small className="text-[10px] text-white/42">{detail}</small></span><span className="ml-auto font-mono text-[9px] text-white/22">0{index+1}</span></Link>)}
        </section>
      </main>
    </div>
  );
}
