import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { exportToCSV } from "@/lib/export";
import { generateComparisonPDF } from "@/lib/comparison-reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  History, 
  Scale, 
  Ruler, 
  Camera,
  TrendingUp,
  Info,
  LifeBuoy,
  FileDown
 } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { ModuleHeader } from "@/components/module-header";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton, StatsSkeleton } from "@/components/ui/loading-states";
import { EmptyState } from "@/components/ui/status-states";
import { getSession } from "@/lib/auth/auth.functions";


const mockWeightData = [
  { date: "01/08", weight: 84.5 },
  { date: "03/08", weight: 84.0 },
  { date: "05/08", weight: 83.8 },
  { date: "08/08", weight: 83.2 },
  { date: "10/08", weight: 82.7 },
  { date: "13/08", weight: 82.4 },
];

export const Route = createFileRoute("/body/")({
  component: BodyPage,
});

function BodyPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!scrollContainerRef.current) return;
    const { current } = scrollContainerRef;
    if (e.key === 'ArrowDown') current.scrollTop += 50;
    if (e.key === 'ArrowUp') current.scrollTop -= 50;
  };

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUserData(session);
    }
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const hasMetrics = userData?.profile?.weight || false;

  if (isLoading) {
    return (
      <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 bg-background animate-in fade-in duration-700">
        <PageHeaderSkeleton />
        <StatsSkeleton count={3} />
        <div className="space-y-6">
          <Skeleton className="h-80 rounded-[2.5rem]" />
          <Skeleton className="h-96 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!hasMetrics && !isLoading) {
    return (
      <div className="flex-1 p-4 md:p-12 pt-10 bg-background animate-in fade-in duration-700">
        <PageHeaderSkeleton />
        <div className="mt-20">
          <EmptyState 
            icon={Scale}
            title="SEM MÉTRICAS REGISTRADAS"
            description="Você ainda não possui dados de composição corporal. Registre seu peso e medidas para começar a acompanhar sua evolução."
            action={
              <Button className="h-14 px-10 rounded-xl bg-brand-gradient text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                <Plus size={18} className="mr-2" /> PRIMEIRO REGISTRO
              </Button>
            }
          />
        </div>
      </div>
    );
  }


  return (
    <div 
      ref={scrollContainerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="flex-1 space-y-12 p-4 md:p-12 pt-10 relative overflow-y-auto outline-none scroll-smooth bg-background"
    >
      {/* Decorative Module Hero Image */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.08] pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4">
        <Scale size={384} className="text-primary" />
      </div>

      <ModuleHeader 
        title="Performance Física"
        description="Domine sua evolução com métricas de elite e acompanhamento profissional de resultados."
        icon={Scale}
      />

      <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
        <TabsList className="inline-flex h-14 items-center justify-center rounded-2xl bg-white/5 p-1.5 text-foreground/60 w-full md:w-auto border border-white/5 backdrop-blur-3xl">
          <TabsTrigger value="overview" className="h-11 px-10 rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">GERAL</TabsTrigger>
          <TabsTrigger value="measurements" className="h-11 px-10 rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">MEDIDAS</TabsTrigger>
          <TabsTrigger value="photos" className="h-11 px-10 rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">EVOLUÇÃO</TabsTrigger>
        </TabsList>



        <AnimatePresence mode="wait">
        <TabsContent value="overview" className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <MetricCard 
              label="Peso" 
              value={`${userData?.profile?.weight || "82.4"} kg`} 
              change={userData?.profile?.weight ? "Sincronizado" : "Padrão"} 
              trend="down" 
              icon={<Scale className="h-4 w-4 text-primary" />} 
            />
            <MetricCard 
              label="Gordura" 
              value="15.2 %" 
              change="Referência" 
              trend="down" 
              icon={<TrendingUp className="h-4 w-4 text-primary" />} 
            />
            <MetricCard 
              label="Massa Muscular" 
              value="42.8 kg" 
              change="+0.5 kg" 
              trend="up" 
              icon={<TrendingUp className="h-4 w-4 text-success" />} 
            />
          </motion.div>

          <Card className="surface border-none p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-display">Histórico de Peso</CardTitle>
            </CardHeader>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockWeightData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 


                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderRadius: '12px',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: 'var(--shadow-card)',
                      color: 'hsl(var(--foreground))'
                    }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />

                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="surface border-white/5 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between p-8 gap-6">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black uppercase tracking-widest italic">HISTÓRICO DE PERFORMANCE</CardTitle>
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">REGISTROS CRONOLÓGICOS DE EVOLUÇÃO</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2 h-12 px-6 font-black uppercase tracking-widest border-2 bg-white/5 border-white/10" asChild>
                  <Link to="/help">
                    ENTENDER MÉTRICAS
                  </Link>
                </Button>
                <Button className="gap-2 h-12 px-6 font-black uppercase tracking-widest bg-brand-gradient shadow-2xl shadow-primary/40 hover:scale-105 transition-all border-none">
                  <Plus size={18} /> REGISTRAR
                </Button>
                <Button 
                  variant="outline"
                  className="gap-2 h-12 px-6 font-black uppercase tracking-widest border-2 bg-white/5 border-white/10"
                  onClick={() => exportToCSV(mockWeightData, 'Peso_BodyMetrica')}
                >
                  <FileDown size={18} /> CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-0">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between px-8 py-6 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 group">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80 group-hover:text-primary transition-colors">13 AGO, 08:30</span>
                      <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest italic">MEDIÇÃO MATINAL EM JEJUM</span>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-2xl font-black font-display tracking-tighter italic uppercase group-hover:scale-110 transition-transform">82.4 KG</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-success bg-success/10 px-2 py-0.5 rounded-full inline-block">-0.3 KG</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 text-center bg-white/[0.01]">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-foreground gap-3">
                  <History size={16} /> VER HISTÓRICO COMPLETO
                </Button>
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        <TabsContent value="measurements">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="surface border-none">
              <CardHeader>
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <Ruler size={18} className="text-primary" />
                  Circunferências (cm)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <MeasurementItem label="Cintura" value={82.5} />
                  <MeasurementItem label="Abdômen" value={86.0} />
                  <MeasurementItem label="Quadril" value={102.0} />
                  <MeasurementItem label="Peitoral" value={108.5} />
                  <MeasurementItem label="Braço Esq" value={38.5} />
                  <MeasurementItem label="Braço Dir" value={38.8} />
                  <MeasurementItem label="Pescoço" value={40.0} />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="bg-info/10 p-4 rounded-xl border border-info/20 flex gap-3">
                <Info size={20} className="text-info shrink-0" />
                <p className="text-xs text-info leading-relaxed">
                  Dica: Tente fazer as medições sempre no mesmo horário, 
                  preferencialmente ao acordar e em jejum para maior precisão.
                </p>
              </div>
              <Button className="w-full h-12 font-semibold gap-2">
                <Plus size={18} /> Adicionar Novas Medidas
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PhotoPlaceholder label="Frente" />
            <PhotoPlaceholder label="Perfil" />
            <PhotoPlaceholder label="Costas" />
            <div className="aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer">
              <Camera size={24} className="text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase">Nova Foto</span>
            </div>
          </div>
          
          <div className="mt-8 space-y-8">
            <Card className="surface border-none p-6">
              <CardTitle className="text-xl font-display uppercase italic mb-6">Relatório Comparativo (Mensal)</CardTitle>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Evolução de Peso</h4>
                  <div className="flex items-end justify-between h-32 gap-2">
                    {[85, 84, 83.5, 82.4].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                        <div className="w-full bg-primary/20 rounded-t-sm" style={{ height: `${(v/90)*100}%` }} />
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">Mês {i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-muted-foreground">Peso Médio</span>
                    <span className="text-xl font-black italic text-primary">83.2 KG</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-muted-foreground">Variação Total</span>
                    <span className="text-xl font-black italic text-success">-2.6 KG</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Compare sua evolução visual com segurança e privacidade.
              </p>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => generateComparisonPDF({
                  userName: userData?.name || "Usuário",
                  period: "Mensal",
                  bodyWeightChange: "-2.6 kg",
                  muscleMassChange: "+0.5 kg",
                  fatPercentChange: "-1.2%",
                  weightData: [],
                  macros: { calories: 2400, protein: 180, carbs: 250, fat: 80 },
                  hydrationGoal: 3000,
                  hydrationCurrent: 2100,
                  summary: "Sua aderência semanal atingiu 92%, com foco excelente na ingestão proteica. Recomendamos manter o volume de treino atual, pois a resposta muscular está acima da média para o período."
                })}
              >
                Ver Comparativo Antes e Depois
              </Button>
            </div>
          </div>
        </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

function MetricCard({ label, value, change, trend, icon }: { label: string; value: string; change: string; trend: 'up' | 'down'; icon: React.ReactNode }) {
  return (
    <Card className="surface border-white/5 bg-white/[0.03] backdrop-blur-3xl overflow-hidden group hover:scale-105 transition-all duration-500 rounded-[2rem]">
      <CardContent className="p-8 flex flex-col gap-4 relative">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform">
          {icon}
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">{label}</span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black font-display tracking-tighter italic uppercase">{value}</span>
            <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${trend === 'up' && label === 'Massa Muscular' ? 'bg-success/20 text-success' : trend === 'down' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
              {change}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


function MeasurementItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-muted/50 last:border-0">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm font-bold font-display">{value} cm</span>
    </div>
  );
}

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative aspect-[3/4] rounded-xl bg-muted overflow-hidden group border">
      <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/0 transition-colors">
        <span className="text-[10px] font-bold text-white bg-black/40 px-2 py-1 rounded backdrop-blur-sm uppercase">
          {label}
        </span>
      </div>
      {/* Mock Image Placeholder */}
      <div className="w-full h-full bg-gradient-to-b from-muted to-muted/20" />
    </div>
  );
}