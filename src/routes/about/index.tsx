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

      <main className="relative z-10 pt-16 container mx-auto px-4 max-w-4xl space-y-12 py-12">
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* O Projeto */}
          <section className="surface p-8 md:p-10 space-y-6 border-white/5 bg-card/40 backdrop-blur-2xl rounded-[2.5rem] shadow-xl hover:shadow-primary/5 transition-all">
            <h3 className="text-2xl font-black font-display text-primary italic uppercase tracking-tighter">
              O PROJETO
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              O Body Métrica FJ nasceu da necessidade de consolidar em uma única suíte de elite todas as ferramentas necessárias para a transformação física definitiva. 
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Combinamos algoritmos de precisão para nutrição, monitoramento de carga em treinos e visão 360º da composição corporal, tudo operando em uma infraestrutura PWA de última geração que funciona inclusive offline.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">Performance</span>
              <span className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">Inteligência</span>
              <span className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">Offline First</span>
            </div>
          </section>

          {/* O Desenvolvedor */}
          <section className="surface p-8 md:p-10 space-y-6 border-white/5 bg-card/40 backdrop-blur-2xl rounded-[2.5rem] shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Code2 size={120} />
            </div>
            <h3 className="text-2xl font-black font-display text-primary italic uppercase tracking-tighter">
              DEVELOPER
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-lg border border-white/10 shrink-0">
                <Code2 size={32} />
              </div>
              <div>
                <h4 className="text-lg font-black font-display uppercase tracking-tight">Franc D'nis Feijó</h4>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={10} /> Feijó, Acre - Brasil
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Especialista em arquitetura de software e desenvolvimento de soluções tecnológicas de alto impacto. Franc vem transformando o cenário digital diretamente de Feijó, no Acre, integrando Inteligência Artificial avançada com as stacks mais modernas do mercado (React, TanStack, Supabase).
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Sua missão é democratizar o acesso a ferramentas de precisão, unindo ciência do esporte e engenharia de dados para criar experiências que resolvem problemas reais de forma elegante e intuitiva. Este projeto reflete sua paixão por performance, tanto em código quanto em resultados físicos.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"><Github size={16} /> GitHub</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"><Globe size={16} /> Portfolio</a>
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
            <Button size="lg" variant="secondary" className="px-10 h-14 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl" asChild>
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
