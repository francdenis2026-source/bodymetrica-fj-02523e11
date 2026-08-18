import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { generateComparisonPDF, exportReportAsImage } from "@/lib/comparison-reports";
import { generateMonthlyPDF } from "@/lib/monthly-reports";


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
  FileDown,
  Share2,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Download,
  Search,
  Filter,
  Lock,
  Eye,
  Calendar
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
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";


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
  const [exportHistory, setExportHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [isExportSettingsOpen, setIsExportSettingsOpen] = useState(false);
  const [pendingExportType, setPendingExportType] = useState<'PDF' | 'PNG' | null>(null);
  const [exportPassword, setExportPassword] = useState("");
  const [exportViewLimit, setExportViewLimit] = useState("0");
  const [exportExpiration, setExportExpiration] = useState("7");
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
    const timer = setTimeout(() => {
      setIsLoading(false);
      const history = JSON.parse(localStorage.getItem('bodymetrica_export_history') || '[]');
      setExportHistory(history);
    }, 900);

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


  const filteredHistory = exportHistory.filter(item => {
    const matchesSearch = (item.fileName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "ALL" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleExportClick = (type: 'PDF' | 'PNG') => {
    setPendingExportType(type);
    setIsExportSettingsOpen(true);
  };

  const executeExport = async () => {
    const options = {
      password: exportPassword || undefined,
      viewLimit: parseInt(exportViewLimit) > 0 ? parseInt(exportViewLimit) : undefined,
      expirationDays: parseInt(exportExpiration) > 0 ? parseInt(exportExpiration) : 7
    };

    if (pendingExportType === 'PDF') {
      await generateComparisonPDF({
        userName: userData?.name || "Usuário",
        period: "Mensal",
        bodyWeightChange: "-2.6 kg",
        muscleMassChange: "+0.5 kg",
        fatPercentChange: "-1.2%",
        weightData: [],
        macros: { calories: 2400, protein: 180, carbs: 250, fat: 80 },
        hydrationGoal: 3000,
        hydrationCurrent: 2100,
        summary: "Sua aderência semanal atingiu 92%, com foco excelente na ingestão proteica. Recomendamos manter o volume de treino atual, pois a resposta muscular está acima da média para o período.",
        ...options
      });
    } else if (pendingExportType === 'PNG') {
      await exportReportAsImage('comparison-report-content', 'Evolucao_BodyMetrica', options);
    }

    // Refresh history
    const history = JSON.parse(localStorage.getItem('bodymetrica_export_history') || '[]');
    setExportHistory(history);
    
    setIsExportSettingsOpen(false);
    setExportPassword("");
    setExportViewLimit("0");
    setExportExpiration("7");
    toast.custom((t) => (
      <SVGToast 
        type="success"
        title="EXPORTAÇÃO CONCLUÍDA"
        message={`${pendingExportType} gerado com sucesso para sua evolução física.`}
        onClose={() => toast.dismiss(t)}
      />
    ));
  };

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
          <TabsTrigger value="comparison" className="h-11 px-10 rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">COMPARATIVO MENSAL</TabsTrigger>
          <TabsTrigger value="exports" className="h-11 px-10 rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">EXPORTAÇÕES</TabsTrigger>
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
                <Button 
                  variant="outline" 
                  className="gap-2 h-12 px-6 font-black uppercase tracking-widest border-2 bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary"
                  onClick={() => {
                    generateMonthlyPDF({
                      userName: userData?.name || "Usuário",
                      month: "Agosto 2026",
                      nutrition: {
                        calories: [{ date: "01/08", value: 2450 }, { date: "10/08", value: 2380 }, { date: "15/08", value: 2420 }],
                        protein: [{ date: "01/08", value: 185 }, { date: "10/08", value: 175 }, { date: "15/08", value: 180 }],
                        carbs: [{ date: "01/08", value: 250 }, { date: "10/08", value: 240 }, { date: "15/08", value: 245 }],
                        fat: [{ date: "01/08", value: 75 }, { date: "10/08", value: 80 }, { date: "15/08", value: 78 }],
                        goals: { calories: 2400, protein: 180, carbs: 250, fat: 80 }
                      },
                      hydration: {
                        data: [{ date: "01/08", value: 2800 }, { date: "10/08", value: 3200 }, { date: "15/08", value: 3000 }],
                        goal: 3000
                      },
                      evolution: {
                        weight: mockWeightData.map(d => ({ date: d.date, value: d.weight }))
                      }
                    });
                    toast.custom((t) => (
                      <SVGToast 
                        type="success"
                        title="RELATÓRIO MENSAL"
                        message="O relatório de performance mensal foi gerado com sucesso."
                        onClose={() => toast.dismiss(t)}
                      />
                    ));
                  }}
                >
                  <FileDown size={18} /> RELATÓRIO MENSAL PDF
                </Button>
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
        
        <TabsContent value="comparison" className="space-y-6">
          <Card className="surface border-none p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-black font-display uppercase tracking-tighter italic">Variação Mês a Mês</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Análise técnica de variação percentual e consistência</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <VariationItem label="Peso Corporal" value="-2.6kg" percent="-3.1%" trend="down" />
                <VariationItem label="Calorias (Média)" value="+120 kcal" percent="+5.2%" trend="up" />
                <VariationItem label="Ingestão Hídrica" value="+450ml" percent="+18.5%" trend="up" />
                <VariationItem label="Massa Muscular" value="+0.5kg" percent="+1.2%" trend="up" />
              </div>
              
              <div className="p-6 rounded-[2.5rem] bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-primary" size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest italic">Diagnóstico de Evolução</h3>
                </div>
                <p className="text-xs font-bold leading-relaxed text-foreground/70 italic">
                  "Sua variação de peso está alinhada com o aumento da ingestão hídrica, sugerindo uma melhora na composição corporal e redução de retenção. O aumento de 5.2% nas calorias foi convertido em massa magra (+1.2%), validando a estratégia atual de superávit controlado."
                </p>
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
            <Card className="surface border-none p-6" id="comparison-report-content">
              <div className="flex items-center justify-between mb-6">
                <CardTitle className="text-xl font-display uppercase italic">Relatório Comparativo (Mensal)</CardTitle>
                <div className="flex gap-2 no-print">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Copiar Resumo"
                    onClick={() => {
                      const text = `Relatório Body Métrica FJ - ${userData?.name}\nEvolução: -2.6 kg de peso, +0.5 kg de massa.\nResumo: Sua aderência semanal atingiu 92%, com foco excelente na ingestão proteica.`;
                      navigator.clipboard.writeText(text);
                      toast.success("Resumo copiado para a área de transferência!");
                    }}
                  >
                    <Share2 size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Exportar como Imagem"
                  onClick={() => handleExportClick('PNG')}
                  >
                    <ImageIcon size={16} />
                  </Button>
                </div>
              </div>

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
                onClick={() => handleExportClick('PDF')}
              >
                Ver Comparativo Antes e Depois
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <Card className="surface border-none p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl font-black font-display uppercase italic tracking-tighter">HISTÓRICO DE EXPORTAÇÕES</CardTitle>
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    placeholder="BUSCAR NO HISTÓRICO..." 
                    className="pl-12 h-12 bg-white/5 border-white/10 text-[10px] font-black uppercase tracking-widest"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-[180px] h-12 bg-white/5 border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest px-6">
                    <div className="flex items-center gap-2">
                      <Filter size={14} />
                      <SelectValue placeholder="FILTRAR" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-background border-white/10 rounded-xl">
                    <SelectItem value="ALL" className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/20">TODOS</SelectItem>
                    <SelectItem value="PDF" className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/20">PDF</SelectItem>
                    <SelectItem value="PNG" className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/20">IMAGEM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="px-0 pt-6">
              {filteredHistory.length === 0 ? (
                <EmptyState 
                  icon={FileDown}
                  title={searchQuery || filterType !== "ALL" ? "NENHUM RESULTADO" : "NENHUMA EXPORTAÇÃO"}
                  description={searchQuery || filterType !== "ALL" ? "Tente ajustar seus filtros ou busca." : "Seus relatórios gerados aparecerão aqui para acesso rápido e compartilhamento."}
                />
              ) : (
                <div className="space-y-4">
                  {filteredHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/[0.03] border border-white/5 group hover:bg-white/5 transition-all">
                      <div className="flex gap-4 items-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'PDF' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
                          {item.type === 'PDF' ? <FileDown size={20} /> : <ImageIcon size={20} />}
                        </div>
                        <div>
                          <div className="text-xs font-black uppercase tracking-widest">{item.fileName}</div>
                          <div className="text-[9px] font-bold text-muted-foreground uppercase mt-1">
                            {new Date(item.date).toLocaleDateString()} • Expira em: {new Date(item.expiresAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2 mt-2">
                            {item.password && (
                              <div className="flex items-center gap-1 text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
                                <Lock size={10} /> PROTEGIDO
                              </div>
                            )}
                            {item.viewLimit && (
                              <div className="flex items-center gap-1 text-[8px] font-black text-info uppercase tracking-widest bg-info/10 px-2 py-0.5 rounded-full">
                                <Eye size={10} /> {item.viewsCount || 0}/{item.viewLimit} VISUALIZAÇÕES
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                          onClick={() => {
                            navigator.clipboard.writeText(item.publicLink);
                            toast.success("Link público copiado!");
                          }}
                        >
                          <LinkIcon size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
                          onClick={() => {
                            const newHistory = exportHistory.filter(i => i.id !== item.id);
                            localStorage.setItem('bodymetrica_export_history', JSON.stringify(newHistory));
                            setExportHistory(newHistory);
                            toast.success("Acesso revogado com sucesso!");
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-success/10 hover:text-success transition-all"
                        >
                          <Download size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        </AnimatePresence>
      </Tabs>

      <Dialog open={isExportSettingsOpen} onOpenChange={setIsExportSettingsOpen}>
        <DialogContent className="surface border-white/10 bg-background/95 backdrop-blur-3xl rounded-[2.5rem] p-8 max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-black font-display tracking-tighter italic uppercase text-primary">Configurações de Segurança</DialogTitle>
            <DialogDescription className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-relaxed">
              Adicione uma camada extra de proteção ao seu link público de {pendingExportType}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/60 flex items-center gap-2">
                <Lock size={14} className="text-primary" /> Senha de Acesso (Opcional)
              </label>
              <Input 
                type="password"
                placeholder="DIGITE UMA SENHA..."
                className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-xs font-black tracking-[0.2em]"
                value={exportPassword}
                onChange={(e) => setExportPassword(e.target.value)}
              />
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/60 flex items-center gap-2">
                <Calendar size={14} className="text-warning" /> Expiração do Link
              </label>
              <Select value={exportExpiration} onValueChange={setExportExpiration}>
                <SelectTrigger className="h-14 bg-white/5 border-white/10 focus:border-warning/50 text-[10px] font-black uppercase tracking-[0.2em] px-6">
                  <SelectValue placeholder="7 DIAS (PADRÃO)" />
                </SelectTrigger>
                <SelectContent className="bg-background border-white/10 rounded-xl">
                  <SelectItem value="1" className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/20">24 HORAS</SelectItem>
                  <SelectItem value="7" className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/20">7 DIAS</SelectItem>
                  <SelectItem value="30" className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/20">30 DIAS</SelectItem>
                  <SelectItem value="0" className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/20">NUNCA EXPIRA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          </div>

          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              className="h-14 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] border-white/10 hover:bg-white/5"
              onClick={() => setIsExportSettingsOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="h-14 flex-1 rounded-xl font-black uppercase tracking-widest text-[10px] bg-brand-gradient shadow-2xl hover:scale-[1.02] transition-all"
              onClick={executeExport}
            >
              Gerar {pendingExportType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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