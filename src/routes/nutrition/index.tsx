import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
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
  Heart,
  FileDown,
  Download,
  TrendingUp,
  Target
} from "lucide-react";


import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { queueOfflineAction } from "@/lib/offline-sync";
import { ModuleHeader } from "@/components/module-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton, StatsSkeleton } from "@/components/ui/loading-states";
import { EmptyState } from "@/components/ui/status-states";
import { getSession } from "@/lib/auth/auth.functions";


import { getAdherenceData, saveAdherenceRecord, DailyAdherence, addAuditLog } from "@/lib/adherence";
import { alertOnDeviation } from "@/lib/deviation-alerts";

export const Route = createFileRoute("/nutrition/")({
  component: NutritionPage,
});

function NutritionPage() {
  const [activeTab, setActiveTab] = useState("plan");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [portionGrams, setPortionGrams] = useState<number>(100);
  const [baseMacros, setBaseMacros] = useState({ kcal: 165, p: 31, c: 0, g: 3.6 }); // Base macros per 100g (Chicken)


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
            title="Diário vazio"
            description="Nenhuma refeição registrada hoje. Mantenha a disciplina e registre seu primeiro consumo."
            action={
              <Button className="h-14 px-10 rounded-xl bg-brand-gradient text-xs font-semibold uppercase tracking-wide shadow-2xl hover:scale-105 transition-all">
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
          <Button variant="outline" className="gap-2 h-14 px-8 font-semibold uppercase tracking-wide border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all" asChild>
            <Link to="/help">
              CENTRAL DE AJUDA
            </Link>
          </Button>
          <Button className="gap-3 h-14 px-8 font-semibold uppercase tracking-wide bg-brand-gradient shadow-2xl shadow-primary/40 hover:scale-105 transition-all border-none">
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
          <TabsTrigger value="daily-plan">Planejamento Diário</TabsTrigger>
        </TabsList>

        <TabsContent value="diary" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="surface border-none p-6 md:col-span-2">
              <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold font-display   tracking-tighter">Registrar Refeição</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-wide opacity-60 ">INTELIGÊNCIA ALIMENTAR E CONTROLE DE MACROS</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-[10px] font-bold uppercase tracking-wide border-white/10 bg-white/5"
                    onClick={() => {
                      const mockData = [
                        { Refeicao: "Café da Manhã", Calorias: 450, Proteina: "30g", Status: "Concluído", Data: "2026-08-18" },
                        { Refeicao: "Almoço", Calorias: 750, Proteina: "50g", Status: "Pendente", Data: "2026-08-18" }
                      ];
                      const { exportToPDF } = require("@/lib/export");
                      exportToPDF(mockData, "Planejamento_Diario", "Planejamento e Checklist - Body Métrica FJ");
                    }}
                  >
                    <FileDown size={14} className="mr-2" /> PDF
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-[10px] font-bold uppercase tracking-wide border-white/10 bg-white/5"
                    onClick={() => {
                       const mockData = [
                        { Refeicao: "Café da Manhã", Calorias: 450, Proteina: "30g", Status: "Concluído", Data: "2026-08-18" },
                        { Refeicao: "Almoço", Calorias: 750, Proteina: "50g", Status: "Pendente", Data: "2026-08-18" }
                      ];
                      const { exportToCSV } = require("@/lib/export");
                      exportToCSV(mockData, "Planejamento_Diario");
                    }}
                  >
                    <Download size={14} className="mr-2" /> CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                <form className="space-y-8" onSubmit={(e) => {
                  e.preventDefault();
                  toast.custom((t) => (
                    <SVGToast 
                      type="success"
                      title="REFEIÇÃO REGISTRADA"
                      message="Os macronutrientes foram sincronizados com sua meta diária de elite."
                      onClose={() => toast.dismiss(t)}
                    />
                  ));
                }}>
                  <div className="space-y-3 relative">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">BUSCA RÁPIDA DE ALIMENTOS</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                      <Input 
                        required
                        placeholder="Ex: 200g Peito de Frango, 150g Arroz..." 
                        className="pl-14 h-16 bg-white/5 border-2 border-white/10 focus:border-primary/50 transition-all rounded-[1.5rem] font-bold text-lg  tracking-tight" 
                        onChange={(e) => {
                          if (e.target.value.length > 2) {
                            toast.custom((t) => (
                              <SVGToast 
                                type="info"
                                title="SUGESTÃO ALIMENTAR"
                                message="Peito de Frango detectado (31g P | 0g C | 3.6g G)."
                                onClose={() => toast.dismiss(t)}
                              />
                            ), { duration: 3000 });
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MacroInputItem label="CALORIAS" color="text-primary" value={Math.round((baseMacros.kcal * portionGrams) / 100).toString()} unit="kcal" />
                    <MacroInputItem label="PROTEÍNAS" color="text-success" value={Math.round((baseMacros.p * portionGrams) / 100).toString()} unit="g" />
                    <MacroInputItem label="CARBOS" color="text-info" value={Math.round((baseMacros.c * portionGrams) / 100).toString()} unit="g" />
                    <MacroInputItem label="GORDURAS" color="text-warning" value={Math.round((baseMacros.g * portionGrams) / 100).toString()} unit="g" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">QUANTIDADE (GRAMAS)</label>
                    <Input 
                      type="number" 
                      value={portionGrams}
                      onChange={(e) => setPortionGrams(Number(e.target.value))}
                      className="h-14 bg-white/5 border-2 border-white/10 focus:border-primary/50 transition-all rounded-[1.5rem] font-bold text-lg  tracking-tight"
                    />
                  </div>


                  <Button type="submit" className="w-full bg-brand-gradient border-none font-semibold uppercase tracking-[0.3em] h-20 rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all group relative overflow-hidden">
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
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">STATUS DO DIA</div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
                      <span>CALORIAS</span>
                      <span>{macros.calories.current} / {macros.calories.goal} kcal</span>
                    </div>
                    <Progress value={(macros.calories.current/macros.calories.goal)*100} className="h-1.5" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
                      <span>PROTEÍNAS</span>
                      <span>{macros.protein.current} / {macros.protein.goal}g</span>
                    </div>
                    <Progress value={(macros.protein.current/macros.protein.goal)*100} className="h-1.5" indicatorClassName="bg-success" />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mt-8">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">INSIGHT NUTRICIONAL</p>
                <p className="text-[11px] font-bold leading-relaxed  opacity-80">
                  "Você já atingiu 80% da sua meta de proteínas. Mantenha os carboidratos baixos no jantar para otimizar a oxidação de gordura."
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card className="surface border-none p-8">
            <CardHeader className="px-0 pt-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-semibold font-display tracking-tighter ">Calculadora de Elite</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-wide opacity-60">Ajuste fino e recomendações automáticas de performance</CardDescription>
                </div>
                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 max-w-xs animate-pulse">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="text-primary" size={14} />
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-primary">Recomendação IA</span>
                  </div>
                  <p className="text-[10px] font-bold text-foreground/80 leading-tight ">
                    "Baseado no seu peso (-0.5kg/semana), sugerimos aumentar a proteína para 2.2g/kg para preservar massa magra."
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-semibold uppercase tracking-wide opacity-60">Peso Atual (kg)</label>
                  <Input type="number" placeholder="Ex: 80" className="h-12 bg-white/5 border-white/10" defaultValue="82.4" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-semibold uppercase tracking-wide opacity-60">Objetivo Estratégico</label>
                  <select className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="loss">Perda de Gordura (Déficit)</option>
                    <option value="gain" selected>Ganho de Massa (Superávit)</option>
                    <option value="maint">Manutenção (Normocalórica)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="text-[8px] font-semibold text-muted-foreground uppercase mb-1">CALORIAS REC.</div>
                    <div className="text-xl font-semibold  text-primary">2.450</div>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="text-[8px] font-semibold text-muted-foreground uppercase mb-1">PROTEÍNAS</div>
                    <div className="text-xl font-semibold  text-success">185g</div>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="text-[8px] font-semibold text-muted-foreground uppercase mb-1">CARBOS</div>
                    <div className="text-xl font-semibold  text-info">240g</div>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="text-[8px] font-semibold text-muted-foreground uppercase mb-1">GORDURAS</div>
                    <div className="text-xl font-semibold  text-warning">75g</div>
                 </div>
              </div>

              <Button className="w-full h-16 font-semibold uppercase tracking-[0.2em] bg-brand-gradient border-none rounded-2xl hover:scale-[1.02] transition-all">
                APLICAR RECOMENDAÇÃO AO PLANO
              </Button>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="plan" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <MealGoalCard name="Café da Manhã" kcal={550} p={40} c={60} g={15} />
            <MealGoalCard name="Almoço" kcal={850} p={60} c={90} g={25} />
            <MealGoalCard name="Jantar" kcal={700} p={55} c={50} g={20} />
          </div>
          
          <div className="flex justify-end gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-[9px] font-semibold uppercase tracking-wide bg-white/5"
              onClick={() => {
                const confirmLote = confirm("Marcar todas as refeições de hoje como concluídas?");
                if (confirmLote) {
                  addAuditLog({
                    action: 'Ação em Lote',
                    details: 'Todas as refeições marcadas como consumidas via Plano Alimentar.',
                    type: 'meal'
                  });
                  toast.success("Ação em lote realizada com sucesso.");
                }
              }}
            >
              Concluir Todas
            </Button>
          </div>
          
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
        <TabsContent value="daily-plan" className="space-y-6">
          <Card className="surface border-none p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl font-semibold font-display tracking-tighter ">Planejamento do Dia</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-wide opacity-60 ">Distribuição de macros e checklist de consumo</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">VISUALIZAÇÃO DE CALENDÁRIO</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-[9px] uppercase font-semibold tracking-wide bg-white/5">AGOSTO 2026</Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-3">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
                    <div key={day} className="text-center text-[9px] font-semibold text-muted-foreground py-2">{day}</div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const status = day < 18 ? (day % 3 === 0 ? 'warning' : 'success') : day === 18 ? 'current' : 'pending';
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "aspect-square rounded-xl md:rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer hover:scale-105",
                          status === 'success' ? "bg-success/10 border-success/20 text-success" :
                          status === 'warning' ? "bg-warning/10 border-warning/20 text-warning" :
                          status === 'current' ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30" :
                          "bg-white/5 border-white/10 text-muted-foreground/50"
                        )}
                        onClick={() => {
                          if (status !== 'pending') {
                            toast.custom((t) => (
                              <SVGToast 
                                type="info"
                                title={`STATUS DO DIA ${day}/08`}
                                message={
                                  <div className="space-y-2">
                                    <p>Consumo: Café (OK), Almoço (OK), Jantar (Pendente).</p>
                                    <div className="pt-2 border-t border-white/5 flex gap-2">
                                      <Button 
                                        size="sm" 
                                        className="h-7 text-[8px] uppercase font-semibold tracking-wide bg-primary hover:bg-primary/80"
                                        onClick={() => {
                                          const newGrams = prompt("Ajustar gramas da porção principal:", "200");
                                          if (newGrams) {
                                            const dateStr = `2026-08-${day.toString().padStart(2, '0')}`;
                                            const factor = Math.max(0, Number(newGrams) || 0) / 200;
                                            const recalculated = {
                                              date: dateStr,
                                              macros: Math.round(Math.min(200, factor * 100)),
                                              water: getAdherenceData().find(r => r.date === dateStr)?.water ?? 100,
                                              training: getAdherenceData().find(r => r.date === dateStr)?.training ?? false
                                            };
                                            saveAdherenceRecord(recalculated);
                                            addAuditLog({
                                              action: 'Edição Rápida',
                                              details: `Porção do dia ${day}/08 alterada para ${newGrams}g (macros recalculados: ${recalculated.macros}%).`,
                                              type: 'meal'
                                            });
                                            toast.dismiss();
                                            toast.success("Porção atualizada!");
                                            alertOnDeviation(recalculated, `Edição de porção do dia ${day}/08`);
                                          }
                                        }}
                                      >
                                        Ajustar Porção
                                      </Button>
                                    </div>
                                  </div>
                                }
                                onClose={() => toast.dismiss(t)}
                              />
                            ));
                          } else {
                            // User can mark future/pending days as consumed if they want to pre-log
                            const confirmMark = confirm(`Deseja marcar o dia ${day}/08 como consumido (100% macros/água)?`);
                            if (confirmMark) {
                              saveAdherenceRecord({
                                date: `2026-08-${day.toString().padStart(2, '0')}`,
                                macros: 100,
                                water: 100,
                                training: true
                              });
                              toast.success(`Dia ${day} marcado como concluído.`);
                              // Force a reload or update state if necessary
                              window.location.reload();
                            }
                          }
                        }}
                      >
                        <span className="text-[10px] font-semibold">{day}</span>
                        {status !== 'pending' && status !== 'current' && (
                          <div className="flex gap-0.5">
                            <div className="w-1 h-1 rounded-full bg-current opacity-40" />
                            <div className="w-1 h-1 rounded-full bg-current opacity-40" />
                            <div className="w-1 h-1 rounded-full bg-current opacity-40" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-wide">Metas Batidas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-wide">Abaixo do Plano</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-wide">Hoje</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
      <div className={`text-[9px] font-semibold uppercase tracking-wide ${color} mb-2`}>{label}</div>
      <div className="text-2xl font-semibold  tracking-tighter uppercase group-hover:scale-105 transition-transform">{value} {unit}</div>
    </div>
  );
}

function MealCard({ name, time, items, confirmed: initialConfirmed }: { name: string; time: string; items: any[]; confirmed: boolean }) {
  const [confirmed, setConfirmed] = useState(initialConfirmed);
  
  const handleConfirm = () => {
    setConfirmed(true);
    addAuditLog({
      action: 'Refeição Confirmada',
      details: `Refeição: ${name} (${time}) marcada como consumida.`,
      type: 'meal'
    });
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

function MealGoalCard({ name, kcal, p, c, g }: { name: string; kcal: number; p: number; c: number; g: number }) {
  return (
    <div className="flex-1 p-6 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden group hover:bg-primary/5 transition-all">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Target size={48} className="text-primary" />
      </div>
      <div className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mb-2">META POR REFEIÇÃO</div>
      <h3 className="text-lg font-semibold  uppercase tracking-tighter mb-4">{name}</h3>
      <div className="grid grid-cols-2 gap-y-3 gap-x-6">
        <div className="space-y-0.5">
          <div className="text-[8px] font-semibold text-muted-foreground uppercase">KCAL</div>
          <div className="text-sm font-semibold ">{kcal}</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[8px] font-semibold text-muted-foreground uppercase">PROT</div>
          <div className="text-sm font-semibold  text-success">{p}g</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[8px] font-semibold text-muted-foreground uppercase">CARB</div>
          <div className="text-sm font-semibold  text-info">{c}g</div>
        </div>
        <div className="space-y-0.5">
          <div className="text-[8px] font-semibold text-muted-foreground uppercase">GORD</div>
          <div className="text-sm font-semibold  text-warning">{g}g</div>
        </div>
      </div>
    </div>
  );
}

