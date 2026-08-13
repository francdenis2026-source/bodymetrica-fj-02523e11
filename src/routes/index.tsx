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
    <div className="flex flex-col min-h-screen bg-background">
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
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Activity size={16} />
            <span>Sua evolução, documentada com precisão</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold font-display text-foreground leading-[1.1] mb-6">
            Métricas que impulsionam <br className="hidden md:block" />
            <span className="text-gradient-brand">seu potencial físico.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A suíte definitiva para acompanhar composição corporal, alimentação, 
            suplementação e treinos. Design profissional para objetivos reais.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base font-semibold group w-full sm:w-auto" asChild>
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
