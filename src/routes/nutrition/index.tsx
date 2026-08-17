import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Utensils, 
  Leaf, 
  Flame, 
  ChevronRight, 
  Search, 
  Info,
  History as HistoryIcon,
  LifeBuoy,
  Calendar,
  Heart
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { queueOfflineAction } from "@/lib/offline-sync";
import { ModuleHeader } from "@/components/module-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton, StatsSkeleton } from "@/components/ui/loading-states";
import { EmptyState } from "@/components/ui/status-states";
import { getSession } from "@/lib/auth/auth.functions";


export const Route = createFileRoute("/nutrition/")({
  component: NutritionPage,
});

function NutritionPage() {
  const [activeTab, setActiveTab] = useState("plan");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUserData(session);
    }
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const macros = {
    calories: { current: 1850, goal: 2400 },
    protein: { current: 145, goal: 180 },
    carbs: { current: 160, goal: 250 },
    fat: { current: 65, goal: 80 },
  };

  useEffect(() => {
    // Alert if macros are near limit but not reached
    const checkMacroStatus = () => {
      const proteinPercent = (macros.protein.current / macros.protein.goal);
      if (proteinPercent >= 0.8 && proteinPercent < 1.0) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Body Métrica FJ", {
            body: "Você está próximo da sua meta de proteínas. Falta pouco!",
            icon: "/favicon.svg"
          });
        }
      }
    };
    
    if (!isLoading) {
      checkMacroStatus();
    }
  }, [isLoading, macros.protein.current, macros.protein.goal]);

  const hasMacros = false; // Mock data absence for demonstration

  if (isLoading) {
    return (
      <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 bg-background animate-in fade-in duration-700">
        <PageHeaderSkeleton />
        <StatsSkeleton count={4} />
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-56 rounded-[2.5rem]" />)}
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-[2.5rem]" />
            <Skeleton className="h-48 rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    );
  }

  // Placeholder logic for empty state
  const isDiaryEmpty = true; 

  if (isDiaryEmpty && activeTab === "diary" && !isLoading) {
    return (
      <div className="flex-1 p-4 md:p-12 pt-10 bg-background animate-in fade-in duration-700">
         <ModuleHeader 
          title="Nutrição"
          description="Planejamento estratégico de ingestão calórica e macronutrientes para performance máxima."
          icon={Utensils}
        />
        <div className="mt-20">
          <EmptyState 
            icon={Utensils}
            title="DIÁRIO VAZIO"
            description="Nenhuma refeição registrada hoje. Mantenha a disciplina e registre seu primeiro consumo."
            action={
              <Button className="h-14 px-10 rounded-xl bg-brand-gradient text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                <Plus size={18} className="mr-2" /> REGISTRAR REFEIÇÃO
              </Button>
            }
          />
        </div>
      </div>
    );
  }


  return (
    <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 relative overflow-hidden bg-background">
      {/* Decorative Module Hero Image */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.08] pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4">
        <Utensils size={384} className="text-primary" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10 animate-in fade-in slide-in-from-left-4 duration-700">
        <ModuleHeader 
          title="Nutrição"
          description="Planejamento estratégico de ingestão calórica e macronutrientes para performance máxima."
          icon={Utensils}
        />
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="gap-2 h-14 px-8 font-black uppercase tracking-widest border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all" asChild>
            <Link to="/help">
              CENTRAL DE AJUDA
            </Link>
          </Button>
          <Button className="gap-3 h-14 px-8 font-black uppercase tracking-widest bg-brand-gradient shadow-2xl shadow-primary/40 hover:scale-105 transition-all border-none">
            <Search size={20} /> BUSCAR ALIMENTOS
          </Button>
        </div>
      </div>



      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MacroCard label="Calorias" current={macros.calories.current} goal={macros.calories.goal} unit="kcal" icon={<Flame size={14} className="text-orange-500" />} />
        <MacroCard label="Proteínas" current={macros.protein.current} goal={macros.protein.goal} unit="g" icon={<Heart size={14} className="text-red-500" />} />
        <MacroCard label="Carboidratos" current={macros.carbs.current} goal={macros.carbs.goal} unit="g" icon={<Leaf size={14} className="text-green-500" />} />
        <MacroCard label="Gorduras" current={macros.fat.current} goal={macros.fat.goal} unit="g" icon={<Flame size={14} className="text-yellow-500" />} />
      </div>

      <Tabs defaultValue="plan" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
          <TabsTrigger value="plan">Plano Alimentar</TabsTrigger>
          <TabsTrigger value="diary">Diário & Macros</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora Macros</TabsTrigger>
        </TabsList>

        <TabsContent value="diary" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="surface border-none p-6 md:col-span-2">
              <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black font-display uppercase italic tracking-tighter">REGISTRAR REFEIÇÃO</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60 italic">INTELIGÊNCIA ALIMENTAR E CONTROLE DE MACROS</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-white/10 bg-white/5">
                    <HistoryIcon size={14} className="mr-2" /> HISTÓRICO
                  </Button>
                  <Button size="sm" variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-white/10 bg-white/5">
                    <Calendar size={14} className="mr-2" /> AGENDA
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                <form className="space-y-8" onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Refeição registrada com sucesso!", {
                    description: "Os macronutrientes foram sincronizados com sua meta diária."
                  });
                }}>
                  <div className="space-y-3 relative">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">BUSCA RÁPIDA DE ALIMENTOS</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                      <Input 
                        required
                        placeholder="Ex: 200g Peito de Frango, 150g Arroz..." 
                        className="pl-14 h-16 bg-white/5 border-2 border-white/10 focus:border-primary/50 transition-all rounded-[1.5rem] font-bold text-lg italic tracking-tight" 
                        onChange={(e) => {
                          if (e.target.value.length > 2) {
                            toast.info("Sugestão: Peito de Frango (31g P | 0g C | 3g G)", { 
                              duration: 2000,
                              icon: <Utensils className="text-primary" size={14} />
                            });
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MacroInputItem label="CALORIAS" color="text-primary" value="--" unit="kcal" />
                    <MacroInputItem label="PROTEÍNAS" color="text-success" value="--g" unit="" />
                    <MacroInputItem label="CARBOS" color="text-info" value="--g" unit="" />
                    <MacroInputItem label="GORDURAS" color="text-warning" value="--g" unit="" />
                  </div>

                  <Button type="submit" className="w-full bg-brand-gradient border-none font-black uppercase tracking-[0.3em] h-20 rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all group relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                      REGISTRAR PERFORMANCE ALIMENTAR
                      <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="surface border-none bg-primary/5 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">STATUS DO DIA</div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span>CALORIAS</span>
                      <span>{macros.calories.current} / {macros.calories.goal} kcal</span>
                    </div>
                    <Progress value={(macros.calories.current/macros.calories.goal)*100} className="h-1.5" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span>PROTEÍNAS</span>
                      <span>{macros.protein.current} / {macros.protein.goal}g</span>
                    </div>
                    <Progress value={(macros.protein.current/macros.protein.goal)*100} className="h-1.5" indicatorClassName="bg-success" />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mt-8">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">INSIGHT NUTRICIONAL</p>
                <p className="text-[11px] font-bold leading-relaxed italic opacity-80">
                  "Você já atingiu 80% da sua meta de proteínas. Mantenha os carboidratos baixos no jantar para otimizar a oxidação de gordura."
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card className="surface border-none p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-black font-display uppercase tracking-tighter italic">Simulador de Macros</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Ajuste fino para seus objetivos de elite</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Peso Atual (kg)</label>
                  <Input type="number" placeholder="Ex: 80" className="h-12 bg-white/5 border-white/10" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Objetivo</label>
                  <select className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Perda de Gordura</option>
                    <option>Ganho de Massa (Bulking)</option>
                    <option>Manutenção</option>
                  </select>
                </div>
              </div>
              <Button className="w-full h-14 font-black uppercase tracking-widest bg-brand-gradient border-none">Calcular Estratégia</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <MealCard 
                name="Café da Manhã" 
                time="07:30" 
                items={[
                  { name: "Ovo cozido", amount: "2 unidades", kcal: 156 },
                  { name: "Pão integral", amount: "2 fatias", kcal: 120 },
                  { name: "Mamão", amount: "150g", kcal: 60 }
                ]}
                confirmed={true}
              />
              <MealCard 
                name="Almoço" 
                time="12:30" 
                items={[
                  { name: "Arroz integral", amount: "150g", kcal: 180 },
                  { name: "Feijão carioca", amount: "100g", kcal: 76 },
                  { name: "Frango grelhado", amount: "120g", kcal: 198 },
                  { name: "Salada verde", amount: "À vontade", kcal: 20 }
                ]}
                confirmed={false}
              />
              <MealCard 
                name="Lanche" 
                time="16:00" 
                items={[
                  { name: "Iogurte natural", amount: "170g", kcal: 110 },
                  { name: "Aveia em flocos", amount: "30g", kcal: 117 }
                ]}
                confirmed={false}
              />
            </div>
            
            <div className="space-y-4">
              <Card className="surface border-none bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg font-display">Resumo do Plano</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Seu plano foi calculado com base no objetivo de <strong>Hipertrofia</strong>. 
                    As quantidades são estimadas.
                  </div>
                  <Button variant="outline" className="w-full text-xs h-9">Ver lista de compras</Button>
                  <Button variant="outline" className="w-full text-xs h-9">Substituições inteligentes</Button>
                </CardContent>
              </Card>

              <Card className="surface border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <Info size={16} className="text-info" />
                    Restrições
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-md bg-destructive/10 text-destructive text-[10px] font-bold uppercase">Lactose</span>
                    <span className="px-2 py-1 rounded-md bg-destructive/10 text-destructive text-[10px] font-bold uppercase">Amendoim</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MacroCard({ label, current, goal, unit, icon }: { label: string; current: number; goal: number; unit: string; icon: React.ReactNode }) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  return (
    <Card className="surface border-none p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold font-display">{current}{unit}</span>
          <span className="text-[10px] text-muted-foreground">meta {goal}{unit}</span>
        </div>
        <Progress value={percentage} className="h-1.5" />
      </div>
    </Card>
  );
}

function MacroInputItem({ label, color, value, unit }: { label: string; color: string; value: string; unit: string }) {
  return (
    <div className="p-5 rounded-[1.5rem] bg-white/5 border border-white/10 hover:border-primary/30 transition-all group">
      <div className={`text-[9px] font-black uppercase tracking-widest ${color} mb-2`}>{label}</div>
      <div className="text-2xl font-black italic tracking-tighter uppercase group-hover:scale-105 transition-transform">{value} {unit}</div>
    </div>
  );
}

function MealCard({ name, time, items, confirmed: initialConfirmed }: { name: string; time: string; items: any[]; confirmed: boolean }) {
  const [confirmed, setConfirmed] = useState(initialConfirmed);
  
  const handleConfirm = () => {
    setConfirmed(true);
    queueOfflineAction({
      type: 'MEAL_CONFIRM',
      data: { name, time }
    });
  };

  return (
    <Card className={`surface border-none overflow-hidden ${confirmed ? 'opacity-80' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${confirmed ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
            {time}
          </div>
          <CardTitle className="text-base font-display">{name}</CardTitle>
        </div>
        {confirmed ? (
          <span className="text-[10px] font-bold text-success uppercase">Concluído</span>
        ) : (
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={handleConfirm}>Confirmar</Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 px-6 hover:bg-muted/10 transition-colors">
              <div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-[10px] text-muted-foreground">{item.amount}</div>
              </div>
              <div className="text-[10px] font-bold text-muted-foreground">{item.kcal} kcal</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
