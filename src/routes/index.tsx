import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getSession } from "@/lib/auth/auth.functions";
import {
  Activity, ArrowRight, Check, ChevronDown, Droplets, Dumbbell,
  HeartPulse, LockKeyhole, Menu, Salad, ShieldCheck, TrendingUp, X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "BodyMetrica — Saúde e progresso com contexto",
    meta: [
      { name: "description", content: "Acompanhe composição corporal, alimentação, hidratação e treinos em uma visão simples, privada e integrada." },
      { property: "og:title", content: "BodyMetrica" },
      { property: "og:description", content: "Saúde e progresso com contexto." },
      { property: "og:image", content: "/og-bodymetrica.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const authSearch = {
  registerMode: false, reset: false, name: "", birthDate: "", goal: "",
  weight: "", height: "", activityLevel: "",
} as any;

const panels = [
  { label: "Hoje", value: "78%", detail: "da rotina concluída", stat: "6 de 8 hábitos" },
  { label: "Semana", value: "5 dias", detail: "em movimento", stat: "+12% de consistência" },
  { label: "Evolução", value: "−3,4 kg", detail: "nos últimos 60 dias", stat: "ritmo sustentável" },
];

const tools = [
  { icon: HeartPulse, title: "Corpo & medidas", text: "Registre peso e medidas, compare períodos e acompanhe tendências com contexto.", to: "/body" },
  { icon: Droplets, title: "Hidratação", text: "Defina uma meta ajustável e registre a água do dia com apenas um toque.", to: "/hydration" },
  { icon: Salad, title: "Alimentação", text: "Organize refeições e preferências sem dietas genéricas ou restrições silenciosas.", to: "/nutrition" },
  { icon: Dumbbell, title: "Treinos", text: "Registre séries, cargas e constância para visualizar sua evolução de desempenho.", to: "/training" },
] as const;

function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-xl font-black tracking-[-.04em]">
      <span className="grid size-8 grid-cols-3 items-end gap-0.5 rounded-[10px] bg-[#a3ed72] px-2 py-2" aria-hidden="true">
        <i className="h-2 rounded-full bg-[#062a29]"/><i className="h-4 rounded-full bg-[#062a29]"/><i className="h-3 rounded-full bg-[#062a29]"/>
      </span>
      <span>Body<span className="font-normal">Metrica</span></span>
    </span>
  );
}

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(0);

  useEffect(() => {
    setIsLoggedIn(!!getSession());
    document.getElementById("bodymetrica-global-theme-toggle")?.remove();
  }, []);

  const primaryTo = isLoggedIn ? "/dashboard" : "/auth";
  const primarySearch = isLoggedIn ? undefined : ({ ...authSearch, registerMode: true } as any);

  return (
    <div className="bm-landing min-h-[100dvh] bg-[#fbfaf6] text-[#0a2827] selection:bg-[#a3ed72]/40">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#062a29]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link to="/" aria-label="BodyMetrica — início" className="rounded-xl focus-visible:ring-[#a3ed72]"><Logo /></Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/75 md:flex" aria-label="Navegação principal">
            <a href="#metodo" className="transition-colors hover:text-white">Como funciona</a>
            <a href="#recursos" className="transition-colors hover:text-white">Recursos</a>
            <a href="#seguranca" className="transition-colors hover:text-white">Privacidade</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            {isLoggedIn ? (
              <Link to="/dashboard" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#a3ed72] px-5 text-sm font-extrabold text-[#062a29] transition hover:-translate-y-0.5">Abrir painel <ArrowRight className="size-4"/></Link>
            ) : (
              <>
                <Link to="/auth" search={authSearch} className="hidden px-3 py-2 text-sm font-bold text-white/80 transition hover:text-white sm:block">Entrar</Link>
                <Link to="/auth" search={{ ...authSearch, registerMode: true } as any} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#a3ed72] px-5 text-sm font-extrabold text-[#062a29] transition hover:-translate-y-0.5">Começar <ArrowRight className="size-4"/></Link>
              </>
            )}
            <button type="button" className="grid size-11 place-items-center rounded-full text-white md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu" aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-white/10 bg-[#0b3835] px-5 py-5 text-sm font-bold md:hidden"><a href="#metodo" onClick={()=>setMenuOpen(false)} className="block py-3">Como funciona</a><a href="#recursos" onClick={()=>setMenuOpen(false)} className="block py-3">Recursos</a><a href="#seguranca" onClick={()=>setMenuOpen(false)} className="block py-3">Privacidade</a></nav>}
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#062a29] text-white">
          <div className="pointer-events-none absolute -left-72 top-28 size-[520px] rounded-full border border-[#a3ed72]/15 shadow-[0_0_0_75px_rgba(163,237,114,.025),0_0_0_150px_rgba(163,237,114,.018)]"/>
          <div className="relative mx-auto grid min-h-[700px] max-w-[1500px] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[.96fr_1.04fr] lg:px-12 lg:py-24">
            <div className="relative z-10 max-w-3xl">
              <p className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[.2em] text-[#a3ed72]"><span className="h-px w-6 bg-current"/> Saúde em uma visão completa</p>
              <h1 className="mt-6 font-serif text-[clamp(3.1rem,5.4vw,5.5rem)] font-normal leading-[.98] tracking-[-.055em]">Seu corpo conta uma história.<br/><em className="font-normal text-[#a3ed72]">Entenda cada capítulo.</em></h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[#c5d3ce] sm:text-lg">Reúna medidas, alimentação, hidratação e treinos em um só lugar — e transforme registros diários em decisões que fazem sentido para você.</p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link to={primaryTo} search={primarySearch} className="inline-flex h-13 items-center gap-3 rounded-full bg-[#a3ed72] px-6 text-sm font-extrabold text-[#062a29] shadow-xl transition hover:-translate-y-0.5">{isLoggedIn ? "Ir para meu painel" : "Criar minha jornada"}<ArrowRight className="size-4"/></Link>
                <a href="#metodo" className="inline-flex items-center gap-2 px-3 py-3 text-sm font-bold">Conhecer o método <ChevronDown className="size-4"/></a>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-xs text-white/65"><span className="flex items-center gap-2"><Check className="size-4 text-[#a3ed72]"/>Dados sempre seus</span><span className="flex items-center gap-2"><Check className="size-4 text-[#a3ed72]"/>Sem cobrança no cadastro</span></div>
            </div>

            <div className="relative mx-auto w-full max-w-[680px]">
              <div className="relative min-h-[560px] overflow-hidden rounded-[38px_10px] shadow-[0_45px_110px_rgba(0,0,0,.34)]">
                <img src="/hero-bodymetrica.jpg" alt="Pessoa acompanhando sua rotina de treino pelo relógio" className="absolute inset-0 h-full w-full object-cover object-center" fetchPriority="high"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#031d1c]/50 via-transparent to-transparent"/>
                <div className="absolute bottom-6 left-4 right-4 max-w-[390px] rounded-[24px] border border-white/30 bg-[#f8faf6]/95 p-5 text-[#0a2827] shadow-2xl backdrop-blur-xl sm:bottom-9 sm:left-[-24px]">
                  <div className="flex items-center justify-between"><div><small className="block text-[10px] text-[#71807b]">Bom dia, Franc</small><strong className="font-serif text-2xl font-normal">Seu progresso</strong></div><span className="grid size-9 place-items-center rounded-full bg-[#062a29] text-xs font-extrabold text-[#a3ed72]">F</span></div>
                  <div className="mt-4 flex rounded-xl bg-[#e8ede6] p-1" role="tablist" aria-label="Período do resumo">{panels.map((p,i)=><button key={p.label} type="button" role="tab" aria-selected={activePanel===i} onClick={()=>setActivePanel(i)} className={`flex-1 rounded-lg px-2 py-2 text-[10px] font-extrabold transition ${activePanel===i ? "bg-white shadow-sm" : "text-[#71807b]"}`}>{p.label}</button>)}</div>
                  <div className="mt-4 grid grid-cols-[112px_1fr] items-center gap-5">
                    <div className="grid aspect-square place-items-center rounded-full bg-[conic-gradient(#a3ed72_78%,#dfe5dc_0)] p-3"><div className="grid size-full place-items-center rounded-full bg-[#f9faf6] text-center"><div><strong className="block font-serif text-2xl font-normal">{panels[activePanel].value}</strong><small className="block max-w-16 text-[8px] leading-tight text-[#71807b]">{panels[activePanel].detail}</small></div></div></div>
                    <div><span className="text-[8px] font-extrabold tracking-[.16em] text-[#7f8c87]">STATUS</span><strong className="mt-2 block text-xs">{panels[activePanel].stat}</strong><div className="mt-5 flex h-10 items-end gap-1.5">{[12,22,17,29,24,38,32].map((h,i)=><i key={i} style={{height:h}} className={`w-2 rounded-full ${i>4 ? "bg-[#8cdd5b]" : "bg-[#d8e0d6]"}`}/>)}</div></div>
                  </div>
                </div>
                <div className="absolute right-3 top-8 rounded-xl bg-white px-4 py-3 text-[10px] font-bold text-[#062a29] shadow-xl sm:-right-2"><span className="mr-2 inline-block size-2 rounded-full bg-[#a3ed72] shadow-[0_0_0_5px_rgba(163,237,114,.2)]"/>Rotina em equilíbrio</div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#d8ded7] bg-[#e9eee6]" aria-label="Pilares"><div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 px-5 py-7 sm:px-8 md:flex-row md:items-center lg:px-12"><p className="text-xs text-[#71807b]">Uma visão integrada de</p><div className="flex flex-wrap items-center gap-4 font-serif text-sm sm:gap-7"><span>Composição corporal</span><i className="size-1 rounded-full bg-[#82cd52]"/><span>Nutrição</span><i className="size-1 rounded-full bg-[#82cd52]"/><span>Hidratação</span><i className="size-1 rounded-full bg-[#82cd52]"/><span>Treino</span></div></div></section>

        <section id="metodo" className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#6f9068]">01 — Clareza</p>
          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1fr_.8fr]"><h2 className="font-serif text-[clamp(2.8rem,4.5vw,4.2rem)] font-normal leading-[1.02] tracking-[-.045em]">Menos números soltos.<br/><em className="font-normal text-[#4c7450]">Mais contexto.</em></h2><p className="max-w-xl text-base leading-8 text-[#62706c]">O BodyMetrica conecta os pontos da sua rotina. Assim, você enxerga o que está funcionando e avança com decisões possíveis — sem culpa, atalhos ou promessas irreais.</p></div>
          <div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            <article className="rounded-[28px] bg-[#e7ece5] p-7 sm:p-10 lg:row-span-2"><span className="text-[9px] font-extrabold tracking-[.18em]">EVOLUÇÃO CORPORAL</span><h3 className="mt-5 font-serif text-3xl font-normal leading-tight">Veja a mudança<br/>além da balança.</h3><p className="mt-4 max-w-md text-sm leading-7 text-[#62706c]">Peso, medidas e fotos privadas organizados em uma linha do tempo simples de compreender.</p><div className="mt-12 rounded-2xl bg-[#fafbf7] p-6 shadow-xl"><small className="text-[10px] text-[#71807b]">Últimos 6 meses</small><div className="mt-2 flex items-center justify-between"><strong className="font-serif text-3xl font-normal">− 6,8 kg</strong><span className="rounded-full bg-[#e3f5d8] px-3 py-1 text-[9px] font-bold text-[#398344]">ritmo consistente</span></div><svg viewBox="0 0 500 150" className="mt-5 h-36 w-full" aria-hidden="true"><path d="M0 20 C70 35 95 45 150 54 S235 68 282 98 S365 94 418 125 S470 138 500 142" fill="none" stroke="#65a940" strokeWidth="4"/><path d="M0 20 C70 35 95 45 150 54 S235 68 282 98 S365 94 418 125 S470 138 500 142 L500 150 L0 150Z" fill="rgba(163,237,114,.2)"/></svg></div></article>
            <article className="rounded-[28px] bg-[#062a29] p-7 text-white sm:p-9"><span className="text-[9px] font-extrabold tracking-[.18em] text-[#a3ed72]">ROTINA DE HOJE</span><h3 className="mt-5 font-serif text-3xl font-normal leading-tight">O próximo passo,<br/>na hora certa.</h3><div className="mt-7 space-y-1">{[[Check,"Hidratação","7 de 10 copos","70%"],[Activity,"Treino de força","18:30 · 45 min","Hoje"],[TrendingUp,"Registrar almoço","Adicione em segundos","Agora"]].map(([Icon,label,sub,end]:any,i)=><div key={label} className="grid grid-cols-[38px_1fr_auto] items-center gap-3 border-t border-white/10 py-3"><span className={`grid size-8 place-items-center rounded-full ${i===0?"bg-[#a3ed72] text-[#062a29]":"bg-white/10"}`}><Icon className="size-4"/></span><p><strong className="block text-xs">{label}</strong><small className="text-[10px] text-white/50">{sub}</small></p><b className="text-[10px] text-white/65">{end}</b></div>)}</div></article>
            <article className="rounded-[28px] bg-[#a3ed72] p-7 sm:p-9"><span className="text-[9px] font-extrabold tracking-[.18em]">CONSISTÊNCIA</span><h3 className="mt-5 font-serif text-3xl font-normal leading-tight">Pequenos hábitos.<br/>Progresso real.</h3><p className="mt-4 max-w-md text-sm leading-7 text-[#365246]">Acompanhe sua frequência sem transformar a rotina em uma cobrança.</p><div className="mt-7 grid grid-cols-7 gap-2">{["S","T","Q","Q","S","S","D"].map((d,i)=><div key={i} className="text-center"><small className="text-[9px] font-bold">{d}</small><span className={`mt-2 grid h-8 place-items-center rounded-lg border border-[#062a29]/20 text-xs ${i<5?"bg-[#062a29] text-[#a3ed72]":""}`}>{i<5&&<Check className="size-3"/>}</span></div>)}</div></article>
          </div>
        </section>

        <section id="recursos" className="bg-[#f0f1eb] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto max-w-[1500px]"><p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#6f9068]">02 — Tudo conectado</p><h2 className="mt-8 font-serif text-[clamp(2.7rem,4.5vw,4.2rem)] font-normal leading-[1.03] tracking-[-.045em]">Uma ferramenta para cada parte.<br/><em className="font-normal text-[#4c7450]">Uma visão para o todo.</em></h2><div className="mt-14 grid border-y border-[#cbd3ca] sm:grid-cols-2 lg:grid-cols-4">{tools.map(({icon:Icon,title,text,to})=><Link key={title} to={to} className="group flex min-h-72 flex-col border-b border-[#cbd3ca] p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl sm:border-r lg:border-b-0"><span className="grid size-11 place-items-center rounded-full bg-[#dfe9da] text-[#416c45]"><Icon className="size-5"/></span><h3 className="mt-8 font-serif text-2xl font-normal">{title}</h3><p className="mt-3 text-sm leading-7 text-[#62706c]">{text}</p><span className="mt-auto grid size-9 place-items-center rounded-full border border-[#cbd3ca]"><ArrowRight className="size-4 transition group-hover:translate-x-0.5"/></span></Link>)}</div></div></section>

        <section id="seguranca" className="bg-[#062a29] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto grid max-w-[1300px] items-center gap-16 lg:grid-cols-[.85fr_1.15fr]"><div className="relative mx-auto grid aspect-square w-full max-w-[390px] place-items-center rounded-full border border-[#a3ed72]/25"><div className="grid size-[72%] place-items-center rounded-full border border-[#a3ed72]/20"><div className="grid size-[58%] place-items-center rounded-full bg-[#a3ed72]/10"><LockKeyhole className="size-14 text-[#a3ed72]"/></div></div><i className="absolute left-[8%] top-[20%] size-2 rounded-full bg-[#a3ed72] shadow-[0_0_20px_#a3ed72]"/><i className="absolute right-[12%] top-[40%] size-2 rounded-full bg-[#a3ed72] shadow-[0_0_20px_#a3ed72]"/></div><div><p className="flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[.2em] text-[#a3ed72]"><span className="h-px w-6 bg-current"/>Privacidade desde o princípio</p><h2 className="mt-6 font-serif text-[clamp(2.8rem,4.5vw,4.2rem)] font-normal leading-[1.02] tracking-[-.045em]">Sua saúde é pessoal.<br/><em className="font-normal text-[#a3ed72]">Seus dados também.</em></h2><p className="mt-6 max-w-xl text-base leading-8 text-[#b5c8c2]">Você controla o que registra, quem pode acessar e quando deseja excluir. Fotos e informações sensíveis são privadas por padrão.</p><div className="mt-8 flex flex-wrap gap-5 text-xs text-white/80"><span className="flex gap-2"><ShieldCheck className="size-4 text-[#a3ed72]"/>Controle dos seus dados</span><span className="flex gap-2"><Check className="size-4 text-[#a3ed72]"/>Privacidade por padrão</span></div><Link to="/privacy" className="mt-9 inline-flex h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-extrabold text-[#062a29]">Conheça nossa abordagem <ArrowRight className="size-4"/></Link></div></div></section>

        <section className="bg-[#a3ed72] px-5 py-16 sm:px-8 lg:px-12 lg:py-20"><div className="mx-auto flex max-w-[1300px] flex-col items-start justify-between gap-9 lg:flex-row lg:items-end"><div><p className="text-[9px] font-extrabold tracking-[.2em]">COMECE PELO QUE IMPORTA</p><h2 className="mt-5 font-serif text-[clamp(2.7rem,4.2vw,4rem)] font-normal leading-none tracking-[-.045em]">Seu próximo capítulo<br/>começa com clareza.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-[#365246]">Crie sua conta e monte uma jornada que respeita seu ritmo, seus objetivos e a sua realidade.</p></div><Link to={primaryTo} search={primarySearch} className="inline-flex h-13 shrink-0 items-center gap-3 rounded-full bg-[#062a29] px-7 text-sm font-extrabold text-white">{isLoggedIn?"Abrir meu painel":"Começar gratuitamente"}<ArrowRight className="size-4"/></Link></div></section>
      </main>

      <footer className="bg-[#041f1e] px-5 py-10 text-white sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1500px] gap-7 md:grid-cols-[1fr_auto] md:items-center"><Logo/><nav className="flex flex-wrap gap-6 text-xs text-white/60" aria-label="Rodapé"><Link to="/privacy">Privacidade</Link><Link to="/terms">Termos</Link><Link to="/help">Ajuda</Link><Link to="/admin/login">Área administrativa</Link></nav><p className="border-t border-white/10 pt-6 text-[10px] text-white/40 md:col-span-2">© 2026 BodyMetrica. Informações de apoio, não substituem orientação profissional.</p></div></footer>
    </div>
  );
}
