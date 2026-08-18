import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { isAuthenticated, getSession } from "@/lib/auth/auth.functions";
import { 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Target,
  Plus,
  Droplets as WaterIcon,
  Utensils as FoodIcon,
  Dumbbell as GymIcon,
  Clock
} from "lucide-react";
import { ResponsiveHero } from "@/components/responsive-hero";

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      registerMode: (search['registerMode'] as boolean) || undefined,
      reset: (search['reset'] as boolean) || undefined,
      name: (search['name'] as string) || undefined,
      birthDate: (search['birthDate'] as string) || undefined,
      goal: (search['goal'] as string) || undefined,
      weight: (search['weight'] as string) || undefined,
      height: (search['height'] as string) || undefined,
      activityLevel: (search['activityLevel'] as string) || undefined,
    } as any;
  },
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setIsLoggedIn(!!session);
    setUserName(session?.user?.name || "");
    // Simulate loading for skeletons
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background relative overflow-hidden">
      {/* Optimized Background Image - priority load */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40 transition-opacity duration-700"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'contrast(1.1) brightness(0.5)'
        }}
      />
      
      {/* Professional Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-tr from-background via-background/60 to-primary/10" />

      <div className="flex flex-col h-full bg-transparent relative overflow-y-auto custom-scrollbar">

      
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
                <Link to="/auth" search={{ registerMode: false, reset: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" } as any}>ENTRAR</Link>
              </Button>
            )}
          </div>
        </header>


        {/* Main Content Area */}
        <main className="flex-1 flex flex-col pt-16">
          {/* Hero Section - Optimized for Single Page View */}
          <section className="relative flex-1 flex items-center py-2 md:py-6 px-4 md:px-6 overflow-hidden min-h-0">
            <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-2 lg:gap-8 items-center h-full">
              <div className="text-left space-y-2 md:space-y-4 relative z-10 flex flex-col justify-center h-full">
                {isLoading ? (
                  <Skeleton className="h-8 w-48 rounded-full bg-white/5" />
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] w-fit animate-in fade-in slide-in-from-left-4 duration-700 border border-primary/20 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span>Alta Performance & Precisão</span>
                  </div>
                )}
                
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-14 w-full max-w-md bg-white/5" />
                    <Skeleton className="h-14 w-3/4 bg-white/5" />
                  </div>
                ) : (
                  <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display text-foreground leading-[0.85] tracking-tighter animate-in fade-in slide-in-from-left-4 duration-700 delay-100 uppercase">
                    DOMINE SUA <br />
                    <span className="text-gradient-brand">EVOLUÇÃO.</span>
                  </h1>
                )}
                
                {isLoading ? (
                  <Skeleton className="h-10 w-full max-w-sm bg-white/5" />
                ) : (
                  <p className="text-sm md:text-base text-foreground/70 max-w-sm leading-relaxed font-medium animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                    A engenharia definitiva para quem busca a perfeição física. 
                    Sincronize sua biometria com inteligência preditiva.
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-12 w-full sm:w-48 bg-white/5" />
                      <Skeleton className="h-12 w-full sm:w-48 bg-white/5" />
                    </>
                  ) : (
                    <>
                      <QuickOnboarding isLoggedIn={isLoggedIn} />
                      <Button variant="outline" size="lg" className="h-12 px-8 text-[10px] font-black uppercase tracking-[0.2em] w-full sm:w-auto backdrop-blur-xl bg-white/[0.02] border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none shadow-xl" asChild>
                        <Link to="/about">ENGENHARIA</Link>
                      </Button>
                    </>
                  )}
                </div>

                {/* Quick stats / Features inline to save space */}
                <div className="grid grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-8 border-t border-white/5 animate-in fade-in duration-1000 delay-400">
                  <div className="space-y-1">
                    <div className="text-primary font-black text-xl md:text-2xl italic uppercase tracking-tighter">PWA</div>
                    <div className="text-[8px] md:text-[9px] font-black text-foreground/40 uppercase tracking-widest leading-none">Offline Ready</div>
                  </div>
                  <div className="space-y-1 border-x border-white/5 px-4 md:px-6">
                    <div className="text-primary font-black text-xl md:text-2xl italic uppercase tracking-tighter">100%</div>
                    <div className="text-[8px] md:text-[9px] font-black text-foreground/40 uppercase tracking-widest leading-none">Privacidade</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-primary font-black text-xl md:text-2xl italic uppercase tracking-tighter">AI</div>
                    <div className="text-[8px] md:text-[9px] font-black text-foreground/40 uppercase tracking-widest leading-none">Biometria</div>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:flex h-full items-center justify-center animate-in fade-in zoom-in-95 duration-1000 delay-300">
                <div className="relative w-full max-w-[420px] z-10 rounded-[3.5rem] overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.7)] border border-white/10 transform hover:scale-[1.01] transition-transform duration-700 bg-card/10 backdrop-blur-3xl aspect-[4/5]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent z-20 pointer-events-none mix-blend-overlay" />
                  <img 
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1200" 
                    alt="High Performance Athlete" 
                    className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[3000ms]"
                    fetchPriority="high"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent z-10" />
                  <div className="absolute bottom-12 left-12 right-12 z-20">
                    <div className="space-y-3">
                      <p className="text-white text-4xl font-black font-display tracking-tighter uppercase italic leading-[0.9]">
                        ENGENHARIA <br /> BIOMÉTRICA
                      </p>
                      <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest leading-relaxed max-w-[280px]">
                        Monitoramento de nível olímpico para aprimoramento constante da composição corporal.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[140px] -z-10 opacity-60" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-success/20 rounded-full blur-[140px] -z-10 opacity-60" />
              </div>
            </div>
          </section>

          {/* Simplified Features Grid - Tighter layout */}
          <section className="py-2 md:py-8 bg-white/[0.01] backdrop-blur-3xl border-t border-white/5 mt-auto">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                {[
                  { icon: <Target size={20} />, title: "Objetivos", desc: "Planos adaptados ao seu biotipo.", color: "primary" },
                  { icon: <Zap size={20} />, title: "Performance", desc: "Métricas de precisão absoluta.", color: "success" },
                  { icon: <ShieldCheck size={20} />, title: "Segurança", desc: "Privacidade e sigilo total.", color: "info" }
                ].map((f, i) => (
                  <Link key={i} to="/about" className="group block focus-visible:ring-2 focus-visible:ring-primary outline-none rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
                    <FeatureCard 
                      icon={f.icon}
                      title={f.title}
                      description={f.desc}
                      className={cn(
                        "transition-all duration-300 p-4 md:p-6 h-full",
                        i === 0 && "group-hover:border-primary/40 group-hover:bg-primary/5",
                        i === 1 && "group-hover:border-success/40 group-hover:bg-success/5",
                        i === 2 && "group-hover:border-info/40 group-hover:bg-info/5"
                      )}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer - Scaled down */}
        <footer className="mt-auto py-2 md:py-6 border-t border-white/5 bg-background/50 backdrop-blur-md">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 text-center md:text-left">
              <div className="flex items-center gap-2 opacity-80 grayscale hover:grayscale-0 transition-all">
                <div className="w-5 h-5 bg-brand-gradient rounded flex items-center justify-center text-[9px] text-white font-bold">B</div>
                <span className="text-xs md:text-sm font-semibold font-display tracking-tight">Body Métrica FJ</span>
              </div>
              
              <nav className="flex gap-4 md:gap-8 text-[11px] md:text-sm text-muted-foreground font-medium">
                <Link to="/about" className="hover:text-primary transition-colors">Sobre</Link>
                <Link to="/tools" className="hover:text-primary transition-colors">Ferramentas</Link>
                <Link to="/help" className="hover:text-primary transition-colors">Ajuda</Link>
                <Link to="/terms" className="hover:text-primary transition-colors">Termos</Link>
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
    </div>
  );
}

function FeatureCard({ icon, title, description, className }: { icon: React.ReactNode; title: string; description: string; className?: string }) {
  return (
    <div className={cn("surface p-3 md:p-4 space-y-2 md:space-y-3 border border-white/5 backdrop-blur-3xl bg-white/[0.03] relative overflow-hidden h-full group rounded-[1.2rem] md:rounded-[1.5rem]", className)}>
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-brand-gradient flex items-center justify-center shadow-lg border border-white/10 transform group-hover:rotate-6 transition-transform text-white mb-1 md:mb-2">
        {icon}
      </div>
      <h3 className="text-lg font-black font-display tracking-tight text-primary uppercase italic leading-none">{title}</h3>
      <p className="text-xs text-muted-foreground leading-tight font-medium">
        {description}
      </p>
    </div>
  );
}

function QuickOnboarding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ type: '', value: '' });

  // Persistence logic for the mini onboarding
  useEffect(() => {
    const saved = localStorage.getItem('bodymetrica_quick_onboarding');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.step > 1 || parsed.data.type) {
          setStep(parsed.step);
          setData(parsed.data);
          // Don't auto-open, but keep state ready
        }
      } catch (e) {
        console.error("Failed to restore onboarding state", e);
      }
    }
  }, []);

  useEffect(() => {
    if (step > 1 || data.type || data.value) {
      localStorage.setItem('bodymetrica_quick_onboarding', JSON.stringify({ step, data }));
    } else {
      localStorage.removeItem('bodymetrica_quick_onboarding');
    }
  }, [step, data]);

  const handleAction = () => {
    if (!isLoggedIn) {
      toast.custom((t) => (
        <SVGToast 
          type="error"
          title="AUTENTICAÇÃO NECESSÁRIA"
          message="Acesse sua conta para registrar suas métricas de performance."
          action={{ 
            label: "LOGIN", 
            onClick: () => {
              toast.dismiss(t);
              window.location.href = "/auth";
            }
          }}
          onClose={() => toast.dismiss(t)}
        />
      ), { duration: 5000 });
      return;
    }
    setOpen(true);
  };

  const finish = () => {
    toast.success("Registro simulado com sucesso!");
    setOpen(false);
    setStep(1);
    setData({ type: '', value: '' });
    localStorage.removeItem('bodymetrica_quick_onboarding');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          onClick={handleAction}
          className="h-12 px-8 text-[10px] font-black uppercase tracking-[0.2em] group w-full sm:w-auto bg-brand-gradient hover:scale-105 transition-all border-none shadow-[0_20px_40px_rgba(oklch(0.65_0.22_260),0.4)] focus-visible:ring-2 focus-visible:ring-primary outline-none"
        >
          {isLoggedIn ? "NOVO REGISTRO" : "ACESSAR SUÍTE"}
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-background/95 backdrop-blur-2xl border-white/10 p-0 overflow-hidden rounded-[2.5rem]">
        <div className="p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black font-display text-primary italic uppercase tracking-tighter">
              {step === 1 ? "O QUE VAMOS FAZER?" : "REGISTRAR AGORA"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">
              {step === 1 ? "Selecione uma ação rápida para hoje" : `Configurando seu registro de ${data.type}`}
            </DialogDescription>
          </DialogHeader>

          {step === 1 ? (
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <WaterIcon size={20} />, label: "ÁGUA", type: 'hidratação', color: 'text-info' },
                { icon: <FoodIcon size={20} />, label: "REFEIÇÃO", type: 'alimentação', color: 'text-success' },
                { icon: <GymIcon size={20} />, label: "TREINO", type: 'exercício', color: 'text-primary' },
                { icon: <Clock size={20} />, label: "HISTÓRICO", type: 'análise', color: 'text-foreground' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setData({ ...data, type: item.type }); setStep(2); }}
                  className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group gap-3"
                >
                  <div className={cn("transition-transform group-hover:scale-110", item.color)}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase">{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Inserir valor aproximado</p>
                <input 
                  autoFocus
                  type="text"
                  placeholder="Ex: 500ml, 200g, 1h..."
                  className="w-full bg-transparent border-b-2 border-primary/20 focus:border-primary text-2xl font-black font-display uppercase tracking-tight outline-none py-2 text-foreground"
                  value={data.value}
                  onChange={(e) => setData({ ...data, value: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest">VOLTAR</Button>
                <Button onClick={finish} disabled={!data.value} className="flex-[2] bg-brand-gradient rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest shadow-lg">CONFIRMAR</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
