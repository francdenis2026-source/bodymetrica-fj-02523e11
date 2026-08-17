import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Target 
} from "lucide-react";

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
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-x-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 grayscale-[0.2]"
        style={{
          backgroundImage: 'url(/assets/homepage-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
      
      <div className="relative z-10 flex flex-col flex-1">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              B
            </div>
            <span className="text-xl font-bold font-display text-primary tracking-tight">
              Body Métrica FJ
            </span>
          </div>
          
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground font-medium">
            <Link to="/auth">Entrar</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Abstract 3D-like background shapes */}
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] bg-success/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Activity size={16} />
              <span>Sua evolução, documentada com precisão</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-display text-foreground leading-[1.1] mb-6">
              Métricas que impulsionam <br />
              <span className="text-gradient-brand">seu potencial físico.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
              A suíte definitiva para acompanhar composição corporal, alimentação, 
              suplementação e treinos. Design profissional para objetivos reais.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button size="lg" className="h-12 px-8 text-base font-semibold group w-full sm:w-auto bg-brand-gradient hover:opacity-90 border-none" asChild>
                <Link to="/auth">
                  Começar Agora
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold w-full sm:w-auto" asChild>
                <Link to="/about">Conhecer Ferramentas</Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 transform hover:scale-[1.02] transition-transform duration-500">
              <img 
                src="/assets/3d/fitness-hero.jpg" 
                alt="Fitness Training" 
                className="w-full h-auto object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            {/* Decorative 3D elements (CSS simulated) */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand-gradient rounded-2xl rotate-12 shadow-xl flex items-center justify-center animate-bounce duration-[3000ms]">
              <Target size={40} className="text-white" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-success rounded-full -rotate-12 shadow-xl flex items-center justify-center animate-pulse">
              <Zap size={32} className="text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Target className="text-primary" />}
              title="Objetivos Claros"
              description="Emagrecimento, hipertrofia ou manutenção. Planos adaptados para sua meta real."
            />
            <FeatureCard 
              icon={<Zap className="text-success" />}
              title="Acompanhamento Ágil"
              description="Registre peso, medidas e fotos de evolução em segundos. Gráficos de tendência precisos."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-info" />}
              title="Dados Protegidos"
              description="Privacidade total para suas fotos e informações de saúde com criptografia de ponta."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 opacity-80 grayscale">
              <span className="text-sm font-semibold font-display">Body Métrica FJ</span>
            </div>
            
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-foreground">Termos</Link>
              <Link to="/privacy" className="hover:text-foreground">Privacidade</Link>
              <Link to="/admin/login" className="hover:text-foreground">Área administrativa</Link>
            </nav>
            
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} Body Métrica FJ. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="surface p-8 space-y-4">
      <div className="w-12 h-12 rounded-xl bg-background border flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-display">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 size={14} className="text-success" />
          <span>Fácil de usar</span>
        </li>
        <li className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 size={14} className="text-success" />
          <span>Mobile-first</span>
        </li>
      </ul>
    </div>
  );
}
