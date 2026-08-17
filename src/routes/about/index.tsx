import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  ShieldCheck, 
  BarChart3, 
  Zap,
  Droplets,
  LifeBuoy
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about/")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1600" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <button onClick={() => window.history.back()}><ArrowLeft size={20} /></button>
          </Button>
          <h1 className="text-lg font-bold font-display">Conhecer Ferramentas</h1>
          <Button variant="outline" size="sm" className="ml-auto gap-2" asChild>
            <Link to="/help">
              <LifeBuoy size={16} /> Central de Ajuda
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 pt-16 container mx-auto px-0 max-w-4xl space-y-12">
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-12">
          <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1600"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Hero tools"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="relative z-10 text-center space-y-4 px-4">
            <h2 className="text-4xl md:text-5xl font-black font-display tracking-tighter text-white uppercase italic">
              A SUÍTE <span className="text-primary">COMPLETA</span>
            </h2>
            <p className="text-white/70 font-bold uppercase tracking-[0.2em] text-xs max-w-xl mx-auto">
              O Body Métrica FJ foi projetado para transformar dados em resultados de alta performance.
            </p>
          </div>
        </section>

        <div className="px-4 grid gap-6 md:grid-cols-2">
          <ToolItem 
            icon={<Target className="text-primary" />} 
            title="Gestão de Objetivos"
            description="Defina metas de emagrecimento, hipertrofia ou manutenção com indicadores claros de progresso."
            details="Nossa ferramenta utiliza fórmulas validadas para calcular suas necessidades calóricas baseadas em seu nível de atividade e objetivos. Você pode ajustar sua meta a qualquer momento, e o sistema recalcula automaticamente seus macronutrientes."
          />
          <ToolItem 
            icon={<BarChart3 className="text-success" />} 
            title="Composição Corporal"
            description="Acompanhamento detalhado de peso, medidas (circunferências) e percentual de gordura com gráficos de tendência."
            details="Mantenha um histórico visual e numérico de sua evolução. O módulo permite o registro de peso diário, 7 medidas corporais chave e armazenamento seguro de fotos para comparativos de 'antes e depois' com total privacidade."
          />
          <ToolItem 
            icon={<Zap className="text-warning" />} 
            title="Treinamento"
            description="Registro de treinos, controle de carga, séries e RPE para garantir que você esteja sempre evoluindo."
            details="Crie rotinas personalizadas e registre cada série em tempo real. O sistema rastreia o volume total de treino e destaca seus Recordes Pessoais (PRs), garantindo que o princípio da sobrecarga progressiva seja aplicado."
          />
          <ToolItem 
            icon={<ShieldCheck className="text-info" />} 
            title="Privacidade Pessoal"
            description="Seus dados de saúde e fotos de evolução são privados, criptografados e acessíveis apenas por você."
            details="Segurança em primeiro lugar. Utilizamos criptografia de ponta e autenticação segura (PIN de 6 dígitos) para garantir que suas informações sensíveis e fotos privadas nunca sejam acessadas por terceiros."
          />
          <ToolItem 
            icon={<BookOpen className="text-primary" />} 
            title="Nutrição Integrada"
            description="Planejamento de refeições, lista de compras e substituições inteligentes adaptadas à sua realidade."
            details="Registre sua ingestão diária e compare com seu plano. Nossa base de dados permite consultas rápidas de alimentos e o sistema de substituição ajuda a manter a dieta mesmo quando você não tem o alimento planejado em mãos."
          />
          <ToolItem 
            icon={<Droplets className="text-info" />} 
            title="Hidratação e Hábitos"
            description="Monitoramento constante de ingestão hídrica e adesão aos protocolos de suplementação."
            details="Calcule sua meta de água ideal e receba lembretes inteligentes. O rastreador de suplementação ajuda a manter a consistência com vitaminas e ergogênicos, essencial para resultados de longo prazo."
          />
        </div>

        <section className="surface p-8 text-center space-y-6 bg-primary/5">
          <h3 className="text-xl font-bold font-display">Pronto para começar?</h3>
          <p className="text-sm text-muted-foreground">
            Crie sua conta e tenha todas essas ferramentas na palma da sua mão.
          </p>
          <Button size="lg" className="px-8 font-semibold" asChild>
            <Link to="/auth" search={{ registerMode: true, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" }}>Criar Conta</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}

function ToolItem({ icon, title, description, details }: { icon: React.ReactNode; title: string; description: string; details: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={cn(
        "surface p-6 space-y-3 cursor-pointer transition-all duration-300 hover:shadow-md border border-transparent",
        isOpen && "border-primary/20 bg-primary/5 shadow-sm"
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-full bg-background border flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div className={cn(
          "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border transition-colors",
          isOpen ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-transparent"
        )}>
          {isOpen ? 'Ocultar' : 'Saiba mais'}
        </div>
      </div>
      <h3 className="font-bold font-display">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      
      {isOpen && (
        <div className="pt-4 mt-4 border-t border-primary/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-foreground/80 leading-relaxed italic">
            {details}
          </p>
        </div>
      )}
    </div>
  );
}
