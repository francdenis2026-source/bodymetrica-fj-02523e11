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

      <main className="relative z-10 pt-16 container mx-auto px-4 max-w-6xl space-y-24 py-12 md:py-24">
        <ResponsiveHero 
          imageUrl="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600"
          overlayOpacity={0.7}
          height="h-[50vh] min-h-[400px]"
          className="rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/5"
        >
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 px-6 relative z-10">
            <div className="w-24 h-24 bg-brand-gradient rounded-3xl flex items-center justify-center text-white shadow-2xl border border-white/20 animate-in zoom-in duration-1000">
              <Zap size={48} />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl md:text-8xl font-black font-display tracking-tighter text-white uppercase italic leading-none">
                BODY MÉTTRICA <span className="text-primary">FJ</span>
              </h2>
              <p className="text-white/60 font-black uppercase tracking-[0.4em] text-[10px] md:text-sm">
                TECNOLOGIA A SERVIÇO DA PERFORMANCE HUMANA
              </p>
            </div>
          </div>
        </ResponsiveHero>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* A Engenharia */}
          <section className="surface p-10 md:p-16 space-y-12 border-white/5 bg-card/30 backdrop-blur-3xl rounded-[3rem] shadow-2xl hover:shadow-primary/20 transition-all border group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-primary/20 transition-colors" />
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                  <Zap size={14} className="fill-primary" />
                  <span>A Engenharia</span>
                </div>
                <h3 className="text-5xl lg:text-6xl font-black font-display text-foreground italic uppercase tracking-tighter leading-[0.85] group-hover:translate-x-1 transition-transform">
                  PERFORMANCE <br /> & CIÊNCIA.
                </h3>
              </div>

              <div className="space-y-10">
                <p className="text-xl text-foreground/60 leading-tight font-medium">
                  O Body Métrica FJ consolida uma suíte de elite para a transformação física definitiva, unindo biometria e análise avançada.
                </p>
                
                <div className="space-y-8">
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                      <Zap size={20} className="text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground">Inteligência Preditiva</h5>
                      <p className="text-[14px] text-foreground/40 leading-snug font-medium">Metabolismo de precisão baseado em dados reais e bioimpedância avançada.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                      <Globe size={20} className="text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground">Ecossistema Offline</h5>
                      <p className="text-[14px] text-foreground/40 leading-snug font-medium">Sincronização resiliente que mantém seus registros seguros sem necessidade de conexão.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-10 border-t border-white/5">
              {["Performance", "Inteligência", "Offline First", "Analytics"].map(tag => (
                <span key={tag} className="bg-white/5 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 text-foreground/40 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* O Visionário */}
          <section className="surface p-10 md:p-16 space-y-12 border-white/5 bg-card/30 backdrop-blur-3xl rounded-[3rem] shadow-2xl hover:shadow-primary/20 transition-all border group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-primary/20 transition-colors" />
            
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                  <MapPin size={14} />
                  <span>O Visionário</span>
                </div>
                <h3 className="text-5xl lg:text-6xl font-black font-display text-foreground italic uppercase tracking-tighter leading-[0.85] group-hover:translate-x-1 transition-transform">
                  FRANC D'NIS <br /> FEIJÓ.
                </h3>
              </div>

              <div className="flex items-center gap-8 py-4">
                <div className="w-28 h-28 rounded-[2rem] bg-brand-gradient flex items-center justify-center text-white shadow-2xl border border-white/10 shrink-0 transform group-hover:rotate-3 transition-all group-hover:scale-105">
                  <Code2 size={56} />
                </div>
                <div className="space-y-3">
                  <p className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground">Software Architect</p>
                  <div className="flex items-center gap-3 text-primary">
                    <MapPin size={16} />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">Feijó, Acre</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-xl text-foreground/60 leading-tight font-medium">
                  Especialista em arquitetura de software e soluções tecnológicas de alto impacto, integrando IA avançada diretamente do coração do Acre.
                </p>
                <p className="text-lg text-foreground/40 leading-relaxed font-medium">
                  Sua missão é unir ciência do esporte e engenharia de dados para criar experiências que resolvem problemas reais de forma intuitiva e performante.
                </p>
              </div>
            </div>

            <div className="flex gap-10 pt-10 border-t border-white/5">
              <a href="#" className="text-foreground/40 hover:text-primary transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:translate-x-1">
                <Code2 size={20} /> GitHub
              </a>
              <a href="#" className="text-foreground/40 hover:text-primary transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:translate-x-1">
                <Globe size={20} /> Portfolio
              </a>
            </div>
          </section>
        </div>

        {/* Vision Section */}
        <section className="surface p-16 md:p-24 text-center space-y-10 bg-brand-gradient border-none rounded-[4rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 space-y-10">
            <h3 className="text-4xl md:text-7xl font-black font-display text-white italic uppercase tracking-tighter leading-[0.85]">
              TRANSFORMANDO DADOS EM <br className="hidden md:block" />
              <span className="text-black">RESULTADOS DE ELITE.</span>
            </h3>
            <p className="text-white/70 text-sm md:text-xl font-bold uppercase tracking-[0.3em] max-w-3xl mx-auto leading-relaxed">
              Seja bem-vindo à nova era do monitoramento físico. Uma ferramenta construída para quem não aceita o medíocre.
            </p>
            <div className="pt-6">
              <Button size="lg" variant="secondary" className="px-12 h-14 md:px-16 md:h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl text-xs md:text-sm" asChild>
                <Link to="/auth" search={{ registerMode: true, reset: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" }}>FAZER PARTE DA ELITE</Link>
              </Button>
            </div>
          </div>
          
          {/* Decorative background accent */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-[120px] pointer-events-none" />
        </section>

        <div className="text-center pb-12">
          <p className="text-[10px] text-foreground/20 uppercase tracking-[0.6em] font-black italic">
            Body Métrica FJ • dev Franc D'nis Feijó, AC • 2026
          </p>
        </div>
      </main>
    </div>
  );
}
