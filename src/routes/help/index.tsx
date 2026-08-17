import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { 
  Search, 
  ChevronRight, 
  HelpCircle, 
  Book, 
  Droplets, 
  Zap, 
  BarChart3, 
  Target, 
  ArrowLeft,
  LifeBuoy
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/help/")({
  component: HelpCenterPage,
});

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    id: "1",
    category: "Nutrição",
    question: "Como o aplicativo calcula meus macros?",
    answer: "Utilizamos a fórmula de Harris-Benedict revisada por Mifflin-St Jeor para calcular sua Taxa Metabólica Basal (TMB), multiplicada pelo seu fator de atividade. A divisão de proteínas, gorduras e carboidratos é ajustada conforme seu objetivo (Ex: 2.0g/kg de proteína para hipertrofia)."
  },
  {
    id: "2",
    category: "Nutrição",
    question: "Posso substituir alimentos sugeridos?",
    answer: "Sim! No módulo de Nutrição, cada refeição tem uma opção de 'Substitutos Inteligentes'. O sistema sugere alimentos com densidade calórica e perfil de macronutrientes similares para manter a dieta flexível."
  },
  {
    id: "3",
    category: "Treino",
    question: "O que significa RPE nos registros de treino?",
    answer: "RPE significa 'Rate of Perceived Exertion' (Escala de Esforço Percebido). Vai de 1 a 10, onde 10 é esforço máximo e 1 seria um aquecimento leve. Ajuda a monitorar a intensidade e evitar o sobretreinamento."
  },
  {
    id: "4",
    category: "Treino",
    question: "Como registro recordes pessoais (PR)?",
    answer: "Ao finalizar uma série com uma carga maior ou mais repetições que o histórico anterior para aquele exercício, o sistema detecta e marca automaticamente como um 'PR' no seu histórico."
  },
  {
    id: "5",
    category: "Hidratação",
    question: "Qual a quantidade ideal de água para mim?",
    answer: "A recomendação base é de 35ml a 50ml por quilo de peso corporal, ajustada para cima se você pratica exercícios intensos ou vive em climas quentes. O aplicativo sugere uma meta inicial baseada no seu perfil."
  },
  {
    id: "6",
    category: "Corpo",
    question: "Com que frequência devo me pesar?",
    answer: "Para maior precisão nas médias semanais, recomendamos pesar-se diariamente em jejum após usar o banheiro. O sistema foca na tendência de 7 dias e não em oscilações diárias isoladas."
  },
  {
    id: "7",
    category: "Geral",
    question: "O aplicativo funciona offline?",
    answer: "Sim! Você pode registrar treinos, água e refeições mesmo sem internet. Os dados são salvos localmente e sincronizados automaticamente assim que uma conexão for detectada."
  }
];

const CATEGORIES = [
  { id: "all", label: "Todos", icon: <HelpCircle size={16} /> },
  { id: "Nutrição", label: "Nutrição", icon: <Book size={16} /> },
  { id: "Treino", label: "Treino", icon: <Zap size={16} /> },
  { id: "Hidratação", label: "Hidratação", icon: <Droplets size={16} /> },
  { id: "Corpo", label: "Corpo", icon: <BarChart3 size={16} /> },
];

function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    return FAQS.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=80&w=1600" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <button onClick={() => window.history.back()}><ArrowLeft size={20} /></button>
          </Button>
          <div className="flex items-center gap-2">
            <LifeBuoy className="text-primary" size={20} />
            <h1 className="text-lg font-bold font-display">Central de Ajuda</h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-16 container mx-auto px-0 max-w-3xl space-y-8">
        <section className="relative h-[30vh] min-h-[250px] flex flex-col items-center justify-center overflow-hidden mb-8 px-4 text-center">
          <img 
            src="https://images.unsplash.com/photo-1434494878577-86c23bddad63?auto=format&fit=crop&q=80&w=1600"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Help Center Hero"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          
          <div className="relative z-10 space-y-4 w-full max-w-md">
            <h2 className="text-3xl font-black font-display tracking-tighter text-white uppercase italic">COMO PODEMOS <span className="text-primary">AJUDAR?</span></h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <Input 
                placeholder="Busque por termos (ex: macros, treino...)" 
                className="pl-12 h-14 text-lg bg-black/40 border-white/10 rounded-2xl focus:ring-primary focus:border-primary transition-all placeholder:text-white/20 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="px-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              className="gap-2 whitespace-nowrap rounded-full"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon}
              {cat.label}
            </Button>
          ))}
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Perguntas Frequentes
            <span className="bg-muted px-2 py-0.5 rounded-full text-[10px]">
              {filteredFaqs.length}
            </span>
          </h3>

          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(faq => (
                <div 
                  key={faq.id}
                  className={cn(
                    "surface border border-transparent transition-all duration-300",
                    openItems.includes(faq.id) && "border-primary/20 ring-1 ring-primary/10"
                  )}
                >
                  <button 
                    className="w-full p-4 flex items-center justify-between text-left"
                    onClick={() => toggleItem(faq.id)}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-primary uppercase">{faq.category}</span>
                      <h4 className="font-bold text-sm pr-4 leading-tight">{faq.question}</h4>
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center bg-muted transition-transform duration-300",
                      openItems.includes(faq.id) && "rotate-90 bg-primary/10 text-primary"
                    )}>
                      <ChevronRight size={18} />
                    </div>
                  </button>
                  
                  {openItems.includes(faq.id) && (
                    <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-3 rounded-lg bg-muted/30 border border-muted/50">
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 surface border-dashed border-2 border-muted bg-transparent">
                <p className="text-muted-foreground">Nenhum resultado encontrado para "{searchQuery}"</p>
                <Button 
                  variant="link" 
                  className="text-primary mt-2"
                  onClick={() => {setSearchQuery(""); setSelectedCategory("all");}}
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="surface p-6 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold">Ainda tem dúvidas?</h4>
            <p className="text-xs text-muted-foreground">Nossa equipe de suporte está pronta para ajudar.</p>
          </div>
          <Button size="sm">Falar com Suporte</Button>
        </section>
      </main>
    </div>
  );
}
