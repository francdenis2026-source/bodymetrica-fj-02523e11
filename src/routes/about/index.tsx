import { createFileRoute } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  ShieldCheck, 
  BarChart3, 
  Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about/")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft size={20} /></Link>
          </Button>
          <h1 className="text-lg font-bold font-display">Conhecer Ferramentas</h1>
        </div>
      </header>

      <main className="pt-24 container mx-auto px-4 max-w-4xl space-y-12">
        <section className="text-center space-y-4">
          <h2 className="text-3xl font-bold font-display tracking-tight text-primary">A suíte completa para sua evolução</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            O Body Métrica FJ foi projetado para transformar dados em resultados. 
            Conheça os módulos que compõem nosso ecossistema.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <ToolItem 
            icon={<Target className="text-primary" />} 
            title="Gestão de Objetivos"
            description="Defina metas de emagrecimento, hipertrofia ou manutenção com indicadores claros de progresso."
          />
          <ToolItem 
            icon={<BarChart3 className="text-success" />} 
            title="Composição Corporal"
            description="Acompanhamento detalhado de peso, medidas (circunferências) e percentual de gordura com gráficos de tendência."
          />
          <ToolItem 
            icon={<Zap className="text-warning" />} 
            title="Treinamento"
            description="Registro de treinos, controle de carga, séries e RPE para garantir que você esteja sempre evoluindo."
          />
          <ToolItem 
            icon={<ShieldCheck className="text-info" />} 
            title="Privacidade Pessoal"
            description="Seus dados de saúde e fotos de evolução são privados, criptografados e acessíveis apenas por você."
          />
          <ToolItem 
            icon={<BookOpen className="text-primary" />} 
            title="Nutrição Integrada"
            description="Planejamento de refeições, lista de compras e substituições inteligentes adaptadas à sua realidade."
          />
          <ToolItem 
            icon={<Zap className="text-info" />} 
            title="Hidratação e Hábitos"
            description="Monitoramento constante de ingestão hídrica e adesão aos protocolos de suplementação."
          />
        </div>

        <section className="surface p-8 text-center space-y-6 bg-primary/5">
          <h3 className="text-xl font-bold font-display">Pronto para começar?</h3>
          <p className="text-sm text-muted-foreground">
            Crie sua conta e tenha todas essas ferramentas na palma da sua mão.
          </p>
          <Button size="lg" className="px-8 font-semibold" asChild>
            <Link to="/auth">Criar Conta</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}

function ToolItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="surface p-6 space-y-3">
      <div className="w-10 h-10 rounded-full bg-background border flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h3 className="font-bold font-display">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
