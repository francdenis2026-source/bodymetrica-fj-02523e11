import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Code2, MapPin, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveHero } from "@/components/responsive-hero";

export const Route = createFileRoute("/about/")({
  component: AboutPage,
  head: () => ({
    title: "Sobre o Body Métrica FJ — Inovação em Performance Humana",
    meta: [
      { name: "description", content: "Conheça o Body Métrica FJ, uma plataforma de elite criada por Franc D'nis Feijó para transformar dados em resultados físicos reais usando IA." },
      { property: "og:title", content: "Sobre o Body Métrica FJ" },
      { property: "og:description", content: "Conheça a história e a tecnologia por trás da plataforma de performance física definitiva." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" },
      { name: "twitter:card", content: "summary_large_image" },
    ]
  })
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden text-foreground">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1600" 
          alt="Tech background" 
          className="w-full h-full object-cover"
        />
      </div>

      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft size={20} /></Link>
          </Button>
          <h1 className="text-lg font-bold font-display uppercase tracking-tighter italic">Sobre a Plataforma</h1>
        </div>
      </header>

      <main className="relative z-10 pt-16 container mx-auto px-4 max-w-5xl space-y-16 py-12 md:py-20">
        <ResponsiveHero 
          imageUrl="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600"
          overlayOpacity={0.7}
          height="h-[45vh] min-h-[350px]"
          className="rounded-[3rem] shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-6">
            <div className="w-20 h-20 bg-brand-gradient rounded-3xl flex items-center justify-center text-white shadow-2xl border border-white/20 animate-pulse">
              <Zap size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl font-black font-display tracking-tighter text-white uppercase italic">
                BODY MÉTTRICA <span className="text-primary">FJ</span>
              </h2>
              <p className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
                TECNOLOGIA A SERVIÇO DA PERFORMANCE HUMANA
              </p>
            </div>
          </div>
        </ResponsiveHero>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* O Projeto */}
          <section className="surface p-8 md:p-14 space-y-10 border-white/5 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl hover:shadow-primary/20 transition-all border group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/20 transition-colors" />
            
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary italic">
                  A Engenharia
                </h3>
                <h4 className="text-4xl md:text-5xl font-black font-display text-foreground italic uppercase tracking-tighter leading-[0.9] group-hover:translate-x-1 transition-transform">
                  PERFORMANCE <br /> & CIÊNCIA.
                </h4>
              </div>

              <div className="space-y-8">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                  O Body Métrica FJ consolida uma suíte de elite para a transformação física definitiva, unindo biometria e análise avançada.
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
                      <Zap size={18} className="text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-[11px] font-black uppercase tracking-widest text-foreground">Inteligência Preditiva</h5>
                      <p className="text-[12px] text-muted-foreground/80 leading-snug">Metabolismo de precisão baseado em dados reais e bioimpedância.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
                      <Globe size={18} className="text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-[11px] font-black uppercase tracking-widest text-foreground">Ecossistema Offline</h5>
                      <p className="text-[12px] text-muted-foreground/80 leading-snug">Sincronização resiliente que mantém seus registros seguros sem internet.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-6 border-t border-white/5">
              {["Performance", "Inteligência", "Offline First", "Analytics"].map(tag => (
                <span key={tag} className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* O Desenvolvedor */}
          <section className="surface p-8 md:p-14 space-y-10 border-white/5 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl hover:shadow-primary/20 transition-all border group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/20 transition-colors" />
            
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary italic">
                  O Visionário
                </h3>
                <h4 className="text-4xl md:text-5xl font-black font-display text-foreground italic uppercase tracking-tighter leading-[0.9] group-hover:translate-x-1 transition-transform">
                  FRANC D'NIS <br /> FEIJÓ.
                </h4>
              </div>

              <div className="flex items-center gap-6 py-4">
                <div className="w-24 h-24 rounded-3xl bg-brand-gradient flex items-center justify-center text-white shadow-2xl border border-white/10 shrink-0 transform group-hover:rotate-6 transition-all group-hover:scale-105">
                  <Code2 size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">Software Architect</p>
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Feijó, Acre</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                  Especialista em arquitetura de software e soluções tecnológicas de alto impacto, integrando IA avançada diretamente do coração do Acre.
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                  Sua missão é unir ciência do esporte e engenharia de dados para criar experiências que resolvem problemas reais de forma intuitiva.
                </p>
              </div>
            </div>

            <div className="flex gap-8 pt-6 border-t border-white/5">
              <a href="#" className="text-muted-foreground hover:text-primary transition-all flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest hover:translate-x-1">
                <Code2 size={18} /> GitHub
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-all flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest hover:translate-x-1">
                <Globe size={18} /> Portfolio
              </a>
            </div>
          </section>
        </div>

        {/* Vision Section */}
        <section className="surface p-12 text-center space-y-8 bg-brand-gradient border-none rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl md:text-5xl font-black font-display text-white italic uppercase tracking-tighter leading-none">
              TRANSFORMANDO DADOS EM <br className="hidden md:block" />
              <span className="text-black">RESULTADOS DE ELITE.</span>
            </h3>
            <p className="text-white/80 text-sm md:text-base font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto">
              Seja bem-vindo à nova era do acompanhamento físico.
            </p>
            <Button size="lg" variant="secondary" className="px-8 h-12 md:px-10 md:h-14 rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl text-xs md:text-sm" asChild>
              <Link to="/auth" search={{ registerMode: true, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" }}>FAZER PARTE DA ELITE</Link>
            </Button>
          </div>
        </section>

        <div className="text-center pt-8">
          <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.5em] font-black italic">
            Body Métrica FJ • dev Franc D'nis Feijó, AC • 2026
          </p>
        </div>
      </main>
    </div>
  );
}
