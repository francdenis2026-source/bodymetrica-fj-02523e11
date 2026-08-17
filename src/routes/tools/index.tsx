import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  Dumbbell, 
  Utensils, 
  Droplets, 
  Activity, 
  LayoutDashboard, 
  BarChart3, 
  Settings,
  Zap,
  ChevronRight,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveHero } from "@/components/responsive-hero";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/")({
  component: ToolsPage,
  head: () => ({
    title: "Conhecer Ferramentas — Body Métrica FJ",
    meta: [
      { name: "description", content: "Explore os módulos profissionais de composição corporal, nutrição e treinos do Body Métrica FJ." },
      { property: "og:title", content: "Conhecer Ferramentas — Body Métrica FJ" },
      { property: "og:description", content: "Explore os módulos profissionais de composição corporal, nutrição e treinos do Body Métrica FJ." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1200" },
      { name: "twitter:card", content: "summary_large_image" },
    ]
  })
});

const TOOLS = [
  {
    id: "dashboard",
    title: "Dashboard Central",
    description: "Visão 360º da sua saúde física. Acompanhe métricas críticas, alertas de hidratação e metas do dia em um painel de controle intuitivo.",
    icon: <LayoutDashboard size={32} />,
    color: "from-blue-500/20 to-blue-600/20",
    border: "border-blue-500/20",
    path: "/dashboard"
  },
  {
    id: "body",
    title: "Composição Corporal",
    description: "Gestão detalhada de peso, percentual de gordura e medidas. Visualize sua evolução através de gráficos de tendência e fotos seguras.",
    icon: <BarChart3 size={32} />,
    color: "from-purple-500/20 to-purple-600/20",
    border: "border-purple-500/20",
    path: "/body"
  },
  {
    id: "nutrition",
    title: "Nutrição Inteligente",
    description: "Controle de macronutrientes com precisão cirúrgica. Registro de refeições, cálculo de metas e banco de dados de alimentos.",
    icon: <Utensils size={32} />,
    color: "from-orange-500/20 to-orange-600/20",
    border: "border-orange-500/20",
    path: "/nutrition"
  },
  {
    id: "training",
    title: "Treino & Performance",
    description: "Log de treinos profissional com rastreamento de volume e recordes pessoais (PR). Mapeie sua força e progresso em cada série.",
    icon: <Dumbbell size={32} />,
    color: "from-red-500/20 to-red-600/20",
    border: "border-red-500/20",
    path: "/training"
  },
  {
    id: "hydration",
    title: "Hidratação & Suplementos",
    description: "Gestão de ingestão hídrica baseada em metas dinâmicas e controle de protocolos de suplementação para máxima absorção.",
    icon: <Droplets size={32} />,
    color: "from-cyan-500/20 to-cyan-600/20",
    border: "border-cyan-500/20",
    path: "/hydration"
  },
  {
    id: "settings",
    title: "Configurações & IA",
    description: "Personalize sua experiência, gerencie notificações e ajuste algoritmos de IA para que a plataforma se adapte ao seu ritmo.",
    icon: <Settings size={32} />,
    color: "from-slate-500/20 to-slate-600/20",
    border: "border-slate-500/20",
    path: "/settings"
  }
];

function ToolsPage() {
  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden text-foreground">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=2000" 
          alt="Gym background" 
          className="w-full h-full object-cover"
        />
      </div>

      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/" search={{} as any}><ArrowLeft size={20} /></Link>
          </Button>
          <h1 className="text-lg font-bold font-display uppercase tracking-tighter italic">Nossas Ferramentas</h1>
        </div>
      </header>

      <main className="relative z-10 pt-16 container mx-auto px-4 max-w-6xl py-12 space-y-16">
        <ResponsiveHero 
          imageUrl="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1600"
          overlayOpacity={0.7}
          height="h-[40vh] min-h-[300px]"
          className="rounded-[3rem] shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-6">
            <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center text-white shadow-2xl border border-white/20">
              <Sparkles size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl font-black font-display tracking-tighter text-white uppercase italic">
                ECOSSISTEMA <span className="text-primary">ELITE</span>
              </h2>
              <p className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs max-w-lg mx-auto leading-relaxed">
                FERRAMENTAS DE PRECISÃO PARA QUEM BUSCA O MÁXIMO DA PERFORMANCE HUMANA
              </p>
            </div>
          </div>
        </ResponsiveHero>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <div 
              key={tool.id} 
              className={cn(
                "surface p-8 space-y-6 bg-card/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all group flex flex-col",
                tool.border
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-primary shadow-inner border border-white/10 shrink-0",
                tool.color
              )}>
                {tool.icon}
              </div>
              
              <div className="space-y-3 flex-grow">
                <h3 className="text-xl font-black font-display uppercase tracking-tight group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  {tool.description}
                </p>
              </div>

              <Button 
                className="w-full mt-4 h-12 rounded-xl font-black uppercase tracking-widest bg-brand-gradient hover:scale-[1.02] transition-all border-none group/btn shadow-lg"
                asChild
              >
                <Link to={tool.path}>
                  ACESSAR MÓDULO
                  <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          ))}
        </section>

        <section className="surface p-12 text-center space-y-8 bg-brand-gradient border-none rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl md:text-5xl font-black font-display text-white italic uppercase tracking-tighter leading-none">
              PRONTO PARA <br className="hidden md:block" />
              <span className="text-black">DOMINAR SEUS DADOS?</span>
            </h3>
            <p className="text-white/80 text-sm md:text-base font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto">
              Crie sua conta e comece agora a gerenciar sua evolução física com ferramentas de elite.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" className="px-10 h-14 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl w-full sm:w-auto" asChild>
                <Link to="/auth" search={{ registerMode: true, reset: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" } as any}>INICIAR CADASTRO</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-10 h-14 rounded-2xl font-black uppercase tracking-widest backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 text-white w-full sm:w-auto" asChild>
                <Link to="/help">CENTRAL DE AJUDA</Link>
              </Button>
            </div>
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
