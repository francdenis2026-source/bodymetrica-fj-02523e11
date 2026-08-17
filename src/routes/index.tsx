import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { isAuthenticated, getSession } from "@/lib/auth/auth.functions";
import { 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Target 
} from "lucide-react";
import { ResponsiveHero } from "@/components/responsive-hero";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    title: "Body Métrica FJ — Suíte de Composição Corporal e Saúde",
    meta: [
      { name: "description", content: "Acompanhamento profissional de composição corporal, alimentação e treinos." },
      { property: "og:title", content: "Body Métrica FJ" },
      { property: "og:description", content: "Acompanhamento profissional de composição corporal, alimentação e treinos." },
    ]
  })
});

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const session = getSession();
    setIsLoggedIn(!!session);
    setUserName(session?.user?.name || "");
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-x-hidden">
      {/* Professional Full Background Image with better contrast */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40 transition-opacity duration-700"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1599058917232-d750c1859d7c?auto=format&fit=crop&q=80&w=2000)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'contrast(1.2) brightness(0.6)'
        }}
      />
      
      {/* Professional Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-tr from-background via-background/80 to-primary/20" />

      
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-xl border border-white/10">
                B
              </div>
              <span className="text-2xl font-bold font-display text-foreground tracking-tighter">
                BODY MÉTTRICA FJ
              </span>
            </div>
            
            {isLoggedIn ? (
              <Button variant="ghost" size="sm" asChild className="text-foreground/80 font-semibold hover:text-primary hover:bg-white/5">
                <Link to="/dashboard">DASHBOARD</Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild className="text-foreground/80 font-semibold hover:text-primary hover:bg-white/5">
                <Link to="/auth" search={{ registerMode: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" }}>ENTRAR</Link>
              </Button>
            )}
          </div>
        </header>


        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-xs font-black uppercase tracking-widest mb-2 animate-in fade-in slide-in-from-left-4 duration-700 border border-primary/30">
                <Activity size={14} />
                <span>Alta Performance & Precisão</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black font-display text-foreground leading-[0.95] tracking-tighter animate-in fade-in slide-in-from-left-4 duration-700 delay-75 uppercase">
                DOMINE SUA <br />
                <span className="text-gradient-brand">EVOLUÇÃO.</span>
              </h1>
              
              <p className="text-xl text-foreground/70 max-w-xl leading-relaxed font-semibold animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
                A plataforma definitiva para atletas que buscam a perfeição.
                Acompanhamento de elite para composição corporal e performance.
              </p>

              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <Button size="lg" className="h-14 px-10 text-base font-black uppercase tracking-widest group w-full sm:w-auto bg-brand-gradient hover:scale-105 transition-all border-none shadow-2xl shadow-primary/40" asChild>
                  <Link to={isLoggedIn ? "/dashboard" : "/onboarding"}>
                    {isLoggedIn ? "MEU DASHBOARD" : "COMEÇAR AGORA"}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-10 text-base font-black uppercase tracking-widest w-full sm:w-auto backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10" asChild>
                  <Link to="/about">DETALHES</Link>
                </Button>

              </div>
            </div>

            <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-1000">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1599058917232-d750c1859d7c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Performance Training" 
                  className="w-full h-auto object-cover aspect-[4/3] scale-105 hover:scale-100 transition-transform duration-1000"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-lg font-bold font-display drop-shadow-md">
                    Alta precisão em dados corporais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-muted/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 max-w-6xl text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4 text-primary uppercase">Evolução Inteligente</h2>
            <p className="text-muted-foreground font-medium max-w-2xl mx-auto">
              Tudo o que você precisa para dominar sua saúde física em um único lugar.
            </p>
          </div>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/about" className="group block">
                <FeatureCard 
                  icon={<Target size={28} />}
                  title="Objetivos Claros"
                  description="Emagrecimento, hipertrofia ou manutenção. Planos adaptados para sua meta real."
                  className="group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:shadow-xl transition-all duration-300"
                />
              </Link>
              <Link to="/about" className="group block">
                <FeatureCard 
                  icon={<Zap size={28} />}
                  title="Acompanhamento Ágil"
                  description="Registre peso, medidas e fotos de evolução em segundos. Gráficos de tendência precisos."
                  className="group-hover:border-success/40 group-hover:bg-success/5 group-hover:shadow-xl transition-all duration-300"
                />
              </Link>
              <Link to="/about" className="group block">
                <FeatureCard 
                  icon={<ShieldCheck size={28} />}
                  title="Dados Protegidos"
                  description="Privacidade total para suas fotos e informações de saúde com criptografia de ponta."
                  className="group-hover:border-info/40 group-hover:bg-info/5 group-hover:shadow-xl transition-all duration-300"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto py-12 border-t bg-background/50 backdrop-blur-md">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
              <div className="flex items-center gap-2 opacity-80 grayscale hover:grayscale-0 transition-all">
                <div className="w-6 h-6 bg-brand-gradient rounded flex items-center justify-center text-[10px] text-white font-bold">B</div>
                <span className="text-sm font-semibold font-display tracking-tight">Body Métrica FJ</span>
              </div>
              
              <nav className="flex gap-8 text-sm text-muted-foreground font-medium">
                <Link to="/terms" className="hover:text-primary transition-colors">Termos</Link>
                <Link to="/privacy" className="hover:text-primary transition-colors">Privacidade</Link>
                <Link to="/admin/login" className="hover:text-primary transition-colors">Administrativo</Link>
              </nav>
              
              <div className="flex flex-col items-center md:items-end gap-1">
                <p className="text-xs text-muted-foreground/80 font-medium">
                  © {new Date().getFullYear()} Body Métrica FJ.
                </p>
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold">
                  dev Franc D'nis Feijó, AC
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, className }: { icon: React.ReactNode; title: string; description: string; className?: string }) {
  return (
    <div className={cn("surface p-8 space-y-4 border-2 border-transparent backdrop-blur-md bg-card/60 relative overflow-hidden h-full group", className)}>
      <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-lg border border-white/20 transform group-hover:rotate-6 transition-transform text-white mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold font-display tracking-tight text-primary uppercase">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-medium">
        {description}
      </p>
      <ul className="space-y-3 pt-4">
        <li className="flex items-center gap-3 text-sm text-muted-foreground font-semibold">
          <CheckCircle2 size={16} className="text-success" />
          <span>Fácil de usar</span>
        </li>
        <li className="flex items-center gap-3 text-sm text-muted-foreground font-semibold">
          <CheckCircle2 size={16} className="text-success" />
          <span>Mobile-first</span>
        </li>
      </ul>
    </div>
  );
}
