import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/auth.functions";
import { ArrowRight, Droplets, Dumbbell, HeartPulse, Play, Salad, ShieldCheck, Weight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "Body Métrica FJ — Saúde e evolução em um só lugar",
    meta: [{ name: "description", content: "Corpo, nutrição, hidratação e treino integrados para acompanhar sua evolução." }],
  }),
});

const authSearch = { registerMode: false, reset: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" } as any;

const modules = [
  { icon: HeartPulse, title: "Corpo", text: "Medidas, composição e evolução física.", accent: "text-cyan-300", iconBg: "bg-cyan-400/10" },
  { icon: Salad, title: "Nutrição", text: "Metas alimentares e rotina organizada.", accent: "text-emerald-300", iconBg: "bg-emerald-400/10" },
  { icon: Droplets, title: "Hidratação", text: "Controle diário de água e consistência.", accent: "text-sky-300", iconBg: "bg-sky-400/10" },
  { icon: Dumbbell, title: "Treino", text: "Sessões, histórico e progresso reunidos.", accent: "text-violet-300", iconBg: "bg-violet-400/10" },
];

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => setIsLoggedIn(!!getSession()), []);

  return (
    <div className="h-[100dvh] min-h-[620px] overflow-hidden bg-[#06101e] text-white selection:bg-sky-400/30">
      <div className="relative flex h-full flex-col overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=90&w=2200"
          alt="Pessoa acompanhando sua rotina de treino na academia"
          className="absolute inset-0 h-full w-full object-cover object-[66%_center]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,20,.99)_0%,rgba(5,15,29,.95)_34%,rgba(5,15,29,.60)_61%,rgba(5,15,29,.26)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,9,18,.45)_0%,transparent_45%,rgba(3,9,18,.94)_100%)]" />

        <header className="relative z-20 shrink-0 border-b border-white/10 bg-[#06101e]/72 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
            <Link to="/" className="flex items-center gap-3" aria-label="Body Métrica FJ">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 font-black shadow-lg shadow-blue-500/20">B</div>
              <div className="leading-none">
                <div className="text-lg font-black tracking-[-.03em]">BODY<span className="text-sky-400">MÉTRICA</span></div>
                <div className="mt-1 text-[9px] font-semibold tracking-wide text-slate-400">SAÚDE • NUTRIÇÃO • HIDRATAÇÃO • TREINO</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex" aria-label="Navegação principal">
              <span className="text-white">Início</span>
              <Link to="/tools" className="transition hover:text-white">Recursos</Link>
              <Link to="/about" className="transition hover:text-white">Sobre</Link>
              <Link to="/tools" className="transition hover:text-white">Ferramentas</Link>
              <Link to="/help" className="transition hover:text-white">Ajuda</Link>
            </nav>

            <div className="flex items-center gap-2.5">
              {isLoggedIn ? (
                <Button asChild className="h-10 rounded-xl bg-sky-500 px-5 font-bold hover:bg-sky-400"><Link to="/dashboard">Abrir painel</Link></Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="hidden h-10 rounded-xl border-white/30 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white sm:inline-flex"><Link to="/auth" search={authSearch}>Entrar</Link></Button>
                  <Button asChild className="h-10 rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 px-5 font-bold shadow-lg shadow-blue-600/20"><Link to="/auth" search={{ ...authSearch, registerMode: true } as any}>Criar conta</Link></Button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col justify-center px-5 py-4 lg:px-10">
          <div className="grid min-h-0 flex-1 items-center lg:grid-cols-[.95fr_1.05fr]">
            <div className="max-w-[660px] py-4">
              <div className="inline-flex items-center rounded-full border border-sky-400/50 bg-sky-400/10 px-4 py-2 text-xs font-semibold text-sky-200 backdrop-blur">Plataforma inteligente</div>
              <h1 className="mt-5 text-[clamp(2.7rem,5vw,5.1rem)] font-black leading-[.98] tracking-[-.055em] text-balance">
                Seu corpo. Sua saúde.<br />Seu <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">melhor resultado.</span>
              </h1>
              <p className="mt-5 max-w-[590px] text-[clamp(.95rem,1.3vw,1.2rem)] leading-7 text-slate-300">Acompanhe sua evolução com métricas organizadas, metas personalizadas e uma visão integrada da sua rotina.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-sky-400 px-7 font-bold shadow-xl shadow-blue-600/20">
                  <Link to={isLoggedIn ? "/dashboard" : "/auth"} search={isLoggedIn ? undefined : ({ ...authSearch, registerMode: true } as any)} className="gap-3">{isLoggedIn ? "Abrir meu painel" : "Começar agora"}<ArrowRight size={17} /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-white/35 bg-black/15 px-7 font-semibold text-white backdrop-blur hover:bg-white/10 hover:text-white"><Link to="/about" className="gap-3">Saiba mais <Play size={16} /></Link></Button>
              </div>
            </div>
            <div className="hidden lg:block" aria-hidden="true" />
          </div>

          <section className="shrink-0 pb-4" aria-label="Principais recursos">
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {modules.map(({ icon: Icon, title, text, accent, iconBg }) => (
                <Link key={title} to="/tools" className="group rounded-[20px] border border-white/20 bg-[#0a1a30]/72 p-4 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/35 hover:bg-[#10243e]/85">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex size-10 items-center justify-center rounded-xl ${iconBg} ${accent}`}><Icon size={20} /></div>
                    <ArrowRight size={16} className="mt-2 text-slate-400 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <h2 className={`mt-3 text-lg font-bold ${accent}`}>{title}</h2>
                  <p className="mt-1 hidden text-xs leading-5 text-slate-300 sm:block">{text}</p>
                </Link>
              ))}
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-4 rounded-[18px] border border-white/15 bg-[#0a1a30]/68 px-4 py-3 backdrop-blur-xl">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><ShieldCheck size={18} /></div>
                <div className="min-w-0">
                  <p className="text-sm font-bold">Seus dados, seu controle</p>
                  <p className="truncate text-[11px] text-slate-400">Experiência protegida e informações associadas à sua própria conta.</p>
                </div>
              </div>
              <Link to="/about" className="hidden shrink-0 items-center gap-2 text-xs font-semibold text-sky-300 hover:text-sky-200 sm:flex">Conheça a plataforma <ArrowRight size={14} /></Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
