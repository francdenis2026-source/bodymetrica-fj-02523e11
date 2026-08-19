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
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "Body Métrica FJ — Sua evolução em perspectiva",
    meta: [
      {
        name: "description",
        content:
          "Corpo, nutrição, hidratação e treino organizados em uma experiência clara para acompanhar sua evolução.",
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
  { icon: HeartPulse, title: "Corpo", detail: "Composição e medidas" },
  { icon: Salad, title: "Nutrição", detail: "Rotina alimentar" },
  { icon: Droplets, title: "Hidratação", detail: "Meta diária" },
  { icon: Dumbbell, title: "Treino", detail: "Histórico e constância" },
];

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getSession());

    // A homepage usa um cabeçalho próprio; o seletor global de tema é removido
    // para evitar controles duplicados e preservar a hierarquia visual.
    document.getElementById("bodymetrica-global-theme-toggle")?.remove();

    // O status de conectividade permanece disponível, mas passa para a área
    // superior direita, abaixo do cabeçalho, com presença visual reduzida.
    const statusIndicator = document.querySelector<HTMLElement>(".fixed.z-\[100\]");
    if (statusIndicator) {
      statusIndicator.style.top = "82px";
      statusIndicator.style.bottom = "auto";
      statusIndicator.style.right = "14px";
      statusIndicator.style.opacity = "0.5";
      statusIndicator.style.transform = "scale(0.76)";
      statusIndicator.style.transformOrigin = "top right";
    }

    return () => {
      if (statusIndicator) {
        statusIndicator.style.top = "";
        statusIndicator.style.bottom = "";
        statusIndicator.style.right = "";
        statusIndicator.style.opacity = "";
        statusIndicator.style.transform = "";
        statusIndicator.style.transformOrigin = "";
      }
    };
  }, []);

  return (
    <div className="home-page h-[100dvh] min-h-[640px] overflow-hidden bg-[#07100c] text-white selection:bg-emerald-300/30">
      <div className="relative flex h-full flex-col overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=90&w=2200"
          alt="Pessoa acompanhando sua rotina de treino na academia"
          className="absolute inset-0 h-full w-full object-cover object-[72%_center] scale-[1.02]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,12,8,.995)_0%,rgba(6,18,12,.97)_32%,rgba(7,18,14,.76)_55%,rgba(5,12,10,.30)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,7,.66)_0%,rgba(3,10,7,.10)_45%,rgba(3,10,7,.94)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_52%,rgba(52,211,153,.10),transparent_30%)]" />

        <header className="relative z-30 shrink-0 border-b border-white/10 bg-[#07100c]/68 backdrop-blur-2xl">
          <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between gap-6 px-5 lg:px-10">
            <Link to="/" aria-label="Body Métrica FJ" className="group flex items-center gap-3">
              <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-[14px] border border-emerald-300/25 bg-emerald-300 text-sm font-black text-[#07100c] shadow-[0_10px_35px_rgba(52,211,153,.18)] transition-transform duration-300 group-hover:-rotate-3">
                B
              </div>
              <div className="leading-none">
                <div className="text-[17px] font-black tracking-[-.035em]">BODY<span className="text-emerald-300">MÉTRICA</span></div>
                <div className="mt-1.5 text-[9px] font-semibold tracking-[.14em] text-white/38">SAÚDE EM CONTEXTO</div>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[.035] p-1 text-[13px] font-semibold text-white/62 lg:flex" aria-label="Navegação principal">
              <span className="rounded-full bg-white/10 px-4 py-2 text-white">Início</span>
              <Link to="/tools" className="rounded-full px-4 py-2 transition hover:bg-white/[.06] hover:text-white">Recursos</Link>
              <Link to="/about" className="rounded-full px-4 py-2 transition hover:bg-white/[.06] hover:text-white">Sobre</Link>
              <Link to="/help" className="rounded-full px-4 py-2 transition hover:bg-white/[.06] hover:text-white">Ajuda</Link>
            </nav>

            <div className="flex items-center gap-2.5">
              {isLoggedIn ? (
                <Button asChild className="h-10 rounded-full bg-emerald-300 px-5 font-bold text-[#07100c] hover:bg-emerald-200">
                  <Link to="/dashboard">Abrir painel</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" className="hidden h-10 rounded-full px-4 text-white/80 hover:bg-white/10 hover:text-white sm:inline-flex">
                    <Link to="/auth" search={authSearch}>Entrar</Link>
                  </Button>
                  <Button asChild className="h-10 rounded-full bg-emerald-300 px-5 font-bold text-[#07100c] shadow-[0_12px_34px_rgba(52,211,153,.18)] hover:bg-emerald-200">
                    <Link to="/auth" search={{ ...authSearch, registerMode: true } as any}>Criar conta</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="relative z-20 mx-auto grid min-h-0 w-full max-w-[1480px] flex-1 grid-rows-[1fr_auto] px-5 pb-4 pt-3 lg:px-10 lg:pb-5">
          <div className="grid min-h-0 items-center gap-8 lg:grid-cols-[1.04fr_.96fr]">
            <section className="max-w-[720px] self-center py-4">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/[.08] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[.16em] text-emerald-200 backdrop-blur-xl">
                <Sparkles size={14} /> Plataforma integrada
              </div>

              <h1 className="max-w-[700px] text-[clamp(3rem,6.1vw,6rem)] font-black leading-[.9] tracking-[-.065em] text-balance">
                Entenda seu corpo.
                <span className="mt-2 block text-emerald-300">Evolua com clareza.</span>
              </h1>

              <p className="mt-6 max-w-[590px] text-[clamp(.98rem,1.4vw,1.16rem)] font-medium leading-7 text-white/68">
                Uma visão única para acompanhar composição corporal, alimentação, hidratação e treino sem transformar sua rotina em um labirinto de dados.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 rounded-full bg-emerald-300 px-7 font-bold text-[#07100c] shadow-[0_16px_44px_rgba(52,211,153,.20)] hover:bg-emerald-200">
                  <Link to={isLoggedIn ? "/dashboard" : "/auth"} search={isLoggedIn ? undefined : ({ ...authSearch, registerMode: true } as any)} className="gap-2.5">
                    {isLoggedIn ? "Ir para meu painel" : "Começar agora"}<ArrowRight size={17} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-white/20 bg-white/[.035] px-6 font-semibold text-white backdrop-blur hover:bg-white/[.08] hover:text-white">
                  <Link to="/tools" className="gap-2">Explorar recursos <ChevronRight size={17} /></Link>
                </Button>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-white/45">
                <span className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-300" /> Dados organizados</span>
                <span className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-300" /> Conta individual</span>
                <span className="inline-flex items-center gap-2"><Check size={14} className="text-emerald-300" /> Histórico integrado</span>
              </div>
            </section>

            <section className="hidden self-center lg:block" aria-label="Prévia da experiência Body Métrica">
              <div className="ml-auto max-w-[510px] overflow-hidden rounded-[30px] border border-white/14 bg-[#0a1711]/76 p-4 shadow-[0_35px_100px_rgba(0,0,0,.38)] backdrop-blur-2xl">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.16em] text-emerald-300">Visão geral</p>
                    <h2 className="mt-1 text-lg font-bold tracking-[-.025em]">Sua rotina, no mesmo contexto</h2>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[.045] text-emerald-300"><Activity size={19} /></div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {modules.map(({ icon: Icon, title, detail }, index) => (
                    <Link key={title} to="/tools" className="group rounded-[19px] border border-white/9 bg-white/[.045] p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/25 hover:bg-white/[.07]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-300/[.09] text-emerald-300"><Icon size={17} /></div>
                        <span className="font-mono text-[9px] text-white/24">0{index + 1}</span>
                      </div>
                      <p className="mt-3 text-sm font-bold">{title}</p>
                      <p className="mt-1 text-[10px] text-white/40">{detail}</p>
                    </Link>
                  ))}
                </div>

                <div className="mt-2.5 rounded-[19px] border border-white/9 bg-black/15 p-3.5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] text-white/38">Leitura de evolução</p>
                      <p className="mt-1 text-xs font-semibold text-white/78">Tendências para apoiar sua rotina</p>
                    </div>
                    <BarChart3 size={17} className="text-emerald-300" />
                  </div>
                  <div className="mt-3 flex h-10 items-end gap-1" aria-hidden="true">
                    {[34, 52, 45, 61, 56, 72, 67, 82, 75, 91, 84, 96].map((height, index) => (
                      <div key={index} className="flex-1 rounded-t-[3px] bg-emerald-300/55" style={{ height: `${height}%`, opacity: .38 + index * .04 }} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="shrink-0" aria-label="Destaques da plataforma">
            <div className="grid gap-2.5 sm:grid-cols-[1.15fr_.85fr]">
              <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                {modules.map(({ icon: Icon, title, detail }) => (
                  <Link key={title} to="/tools" className="group flex min-h-[88px] items-center gap-3 rounded-[18px] border border-white/12 bg-[#091611]/72 px-3.5 py-3 backdrop-blur-xl transition duration-300 hover:border-emerald-300/22 hover:bg-[#102119]/82">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-300/[.08] text-emerald-300"><Icon size={17} /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{title}</p>
                      <p className="mt-1 truncate text-[10px] text-white/38">{detail}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="hidden items-center justify-between gap-4 rounded-[18px] border border-white/12 bg-[#091611]/72 px-4 backdrop-blur-xl sm:flex">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-300/[.08] text-emerald-300"><ShieldCheck size={17} /></div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold">Privacidade por princípio</p>
                    <p className="mt-1 truncate text-[10px] text-white/38">Seus registros associados à sua própria conta.</p>
                  </div>
                </div>
                <LockKeyhole size={15} className="shrink-0 text-white/25" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
