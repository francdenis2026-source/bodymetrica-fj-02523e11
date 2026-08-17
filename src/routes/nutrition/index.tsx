import { createFileRoute, Link } from "@tanstack/react-router";
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
  LifeBuoy,
  Calendar,
  Heart
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { queueOfflineAction } from "@/lib/offline-sync";
import { ModuleHeader } from "@/components/module-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth/auth.functions";


export const Route = createFileRoute("/nutrition/")({
  component: NutritionPage,
});

function NutritionPage() {
  const [activeTab, setActiveTab] = useState("plan");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const macros = {
    calories: { current: 1850, goal: 2400 },
    protein: { current: 145, goal: 180 },
    carbs: { current: 160, goal: 250 },
    fat: { current: 65, goal: 80 },
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 bg-background">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <Skeleton className="w-20 h-20 rounded-3xl" />
            <div className="space-y-2">
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-64 h-12" />
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
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
          <TabsTrigger value="diary">Diário</TabsTrigger>
        </TabsList>

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
