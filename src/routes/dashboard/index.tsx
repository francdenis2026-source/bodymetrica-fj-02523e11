import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { generatePDFReport, generateAdherenceReport } from "@/lib/reports";
import { generateWeeklyAdherenceReport } from "@/lib/weekly-adherence";
import { WeeklySummaryPreview } from "@/components/weekly-summary-preview";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton, StatsSkeleton } from "@/components/ui/loading-states";
import { getSession } from "@/lib/auth/auth.functions";
import { getAdherenceData, DailyAdherence, saveAdherenceRecord, getAuditLogs, AuditLog } from "@/lib/adherence";

import { 
  ArrowRight, 
  Droplets, 
  Utensils, 
  Pill, 
  Dumbbell, 
  User, 
  Plus, 
  ChevronRight,
  TrendingUp,
  Calendar,
  FileDown,
  LifeBuoy,
  LayoutDashboard,
  History as HistoryIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [adherenceData, setAdherenceData] = useState<DailyAdherence[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setAdherenceData(getAdherenceData());
    setAuditLogs(getAuditLogs());
    const session = getSession();
    if (session) {
      setUserData(session);
    }
    // Simulating initial load
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 bg-background animate-in fade-in duration-700">
        <PageHeaderSkeleton />
        <StatsSkeleton />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 rounded-[2.5rem]" />
          <Skeleton className="h-80 rounded-[2.5rem]" />
        </div>
        <Skeleton className="h-64 rounded-[2.5rem] w-full" />
      </div>
    );
  }

  const userName = userData?.name || "Visitante";
  const currentGoalMap: Record<string, string> = {
    'loss': 'Emagrecimento',
    'gain': 'Hipertrofia',
    'maint': 'Manutenção'
  };
  const currentGoal = currentGoalMap[userData?.profile?.goal] || "Hipertrofia";
  const weightChange = -0.5;

  return (
    <div className="client-dashboard flex-1 space-y-7 p-4 pt-6 md:p-8 md:pt-7 relative overflow-hidden bg-background">
      {/* Decorative Module Hero Image */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.08] pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4">
        <LayoutDashboard size={384} className="text-primary" />
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Link to="/profile" search={{} as any} className="group">
            <div className="w-20 h-20 bg-brand-gradient rounded-3xl flex items-center justify-center text-white text-3xl font-semibold shadow-2xl border-2 border-white/20 transform group-hover:scale-105 transition-transform duration-500">
              {userName[0]}
            </div>
          </Link>

          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-[10px] font-semibold uppercase tracking-[0.2em] mb-1 border border-primary/30">
              SISTEMA DE PERFORMANCE
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-.045em] font-display text-foreground leading-none">
              OLÁ, <span className="text-gradient-brand">{userName}</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base font-medium leading-6">
              Seu resumo diário está pronto. Registre o que importa e acompanhe o progresso no seu ritmo.
            </p>
            {userData?.profile?.license_status !== 'active' && (
              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl inline-block text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-primary mb-2">LICENÇA PENDENTE</p>
                <p className="text-xs text-foreground/70 font-bold mb-3 max-w-xs">
                  Adquira sua licença para desbloquear todas as ferramentas de elite e suporte direto.
                </p>
                <Button size="sm" className="h-8 text-[10px] font-semibold uppercase tracking-wide bg-brand-gradient" asChild>
                  <Link to="/settings">ATIVAR AGORA</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2 h-14 px-8 font-semibold uppercase tracking-wide border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all" asChild>
            <Link to="/help">CENTRAL DE AJUDA</Link>
          </Button>
          <Button 
            className="gap-3 h-14 px-8 font-semibold uppercase tracking-wide bg-brand-gradient shadow-2xl shadow-primary/40 hover:scale-105 transition-all border-none"
            onClick={() => generatePDFReport({
              userName: userName,
              period: "Últimos 30 dias",
              weightData: [
                { date: "01/08", weight: 84.5 },
                { date: "15/08", weight: 82.4 }
              ],
              macros: { calories: 2400, protein: 180, carbs: 250, fat: 80 },
              hydrationGoal: 3000,
              hydrationCurrent: 1200
            })}
          >
            <FileDown size={20} /> RELATÓRIO PDF
          </Button>
          <Button 
            className="gap-3 h-14 px-8 font-semibold uppercase tracking-wide bg-brand-gradient shadow-2xl shadow-primary/40 hover:scale-105 transition-all border-none"
            onClick={() => generateAdherenceReport(userName, adherenceData, 'pdf')}
          >
            <FileDown size={20} /> ADERÊNCIA PDF
          </Button>
          <Button 
            variant="outline"
            className="gap-3 h-14 px-8 font-semibold uppercase tracking-wide border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all"
            onClick={() => {
              const data = auditLogs.map(log => ({
                Data: new Date(log.timestamp).toLocaleString(),
                Acao: log.action,
                Detalhes: log.details,
                Tipo: log.type
              }));
              exportToCSV(data, `Auditoria_BodyMetrica_${userName.replace(/\s+/g, '_')}`);
            }}
          >
            <HistoryIcon size={20} /> AUDITORIA CSV
          </Button>
          <Button 
            variant="outline"
            className="gap-3 h-14 px-8 font-semibold uppercase tracking-wide border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all"
            onClick={() => generateAdherenceReport(userName, adherenceData, 'csv')}
          >
            <FileDown size={20} /> ADERÊNCIA CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 relative z-10">
        <Link to="/body" className="block transition-transform active:scale-[0.98]">
          <Card className="surface border-none hover:bg-accent/5 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
              <User className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold font-display  tracking-tighter uppercase">{userData?.profile?.weight || "82.4"} kg</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp size={12} className="text-success" />
                {weightChange}kg desde a última semana
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/body" className="block transition-transform active:scale-[0.98]">
          <Card className="surface border-none hover:bg-accent/5 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objetivo</CardTitle>
              <ArrowRight className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold font-display  tracking-tighter uppercase">{currentGoal}</div>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] mb-1">
                  <span>Progresso</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/hydration" className="block transition-transform active:scale-[0.98]">
          <Card className="surface border-none hover:bg-accent/5 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hidratação</CardTitle>
              <Droplets className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold font-display  tracking-tighter uppercase">1.2L / 3.0L</div>
              <div className="mt-2">
                <Progress value={40} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/training" className="block transition-transform active:scale-[0.98]">
          <Card className="surface border-none hover:bg-accent/5 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treino</CardTitle>
              <Dumbbell className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold font-display  tracking-tighter uppercase">Puxada (A)</div>
              <p className="text-xs text-muted-foreground mt-1">
                Programado para hoje às 18:00
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 relative z-10">
        <Card className="surface border-none">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Utensils size={20} className="text-primary" />
              Próximas Refeições
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/nutrition" className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-bold text-xs">
                  12h
                </div>
                <div>
                  <div className="text-sm font-semibold">Almoço</div>
                  <div className="text-xs text-muted-foreground">Arroz, Frango, Salada</div>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="group-hover:bg-primary/10 group-hover:text-primary">Registrar</Button>
            </Link>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-bold text-xs">
                  16h
                </div>
                <div>
                  <div className="text-sm font-semibold">Lanche</div>
                  <div className="text-xs text-muted-foreground">Fruta + Whey</div>
                </div>
              </div>
              <ChevronRight size={18} />
            </div>
          </CardContent>
        </Card>

        <Card className="surface border-none">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Pill size={20} className="text-primary" />
              Suplementação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-success/20 bg-success/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 text-success flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold">Creatina</div>
                  <div className="text-xs text-muted-foreground">5g - Tomado</div>
                </div>
              </div>
              <span className="text-[10px] text-success font-medium">08:00</span>
            </div>
            <Link to="/supplements" className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                  <Pill size={18} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Multivitamínico</div>
                  <div className="text-xs text-muted-foreground">1 cap - Próximo</div>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="group-hover:bg-primary/10 group-hover:text-primary">Tomar</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="surface border-none relative z-10">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            Adesão e Recomendação
            <div className="flex gap-2 ml-auto">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[9px] font-semibold uppercase tracking-wide hover:bg-primary/10"
                onClick={() => generateAdherenceReport(userName, adherenceData, 'pdf')}
              >
                <FileDown size={14} className="mr-1" /> PDF
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[9px] font-semibold uppercase tracking-wide hover:bg-primary/10"
                onClick={() => generateAdherenceReport(userName, adherenceData, 'csv')}
              >
                <FileDown size={14} className="mr-1" /> CSV
              </Button>
              <WeeklySummaryPreview userName={userName} data={adherenceData} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex justify-between items-end h-40 gap-3">
              {adherenceData.length > 0 ? adherenceData.map((record, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div className="w-full flex flex-col gap-1 justify-end h-full">
                    <div 
                      className="w-full bg-info/20 rounded-t-sm transition-all hover:bg-info/40 cursor-pointer border-t border-info/40" 
                      style={{ height: `${record.water * 0.5}%` }}
                      title={`Água: ${record.water}%`}
                      onClick={() => {
                        toast.custom((t) => {
                          const status = record.macros < 80 || record.water < 80 ? 'abaixo' : record.macros > 100 ? 'acima' : 'na meta';
                          const color = status === 'abaixo' ? 'text-warning' : status === 'acima' ? 'text-destructive' : 'text-success';
                          
                          return (
                            <SVGToast 
                              type="info"
                              title={`ANÁLISE DO DIA ${record.date.split('-')[2]}`}
                              message={
                                <div className="space-y-2">
                                  <p className="text-[13px]">Performance: <span className={color}>{record.macros}% Macros</span> e <span className={record.water < 80 ? 'text-warning' : 'text-info'}>{record.water}% Água</span>.</p>
                                  <div className="mt-2 pt-2 border-t border-white/5">
                                    <p className="text-[10px] font-semibold uppercase text-primary mb-1">Tendência Semanal</p>
                                    <div className="flex items-center gap-2">
                                      <TrendingUp size={12} className={record.macros > 80 ? "text-success" : "text-warning"} />
                                      <span className="text-[9px] font-bold ">
                                        {record.macros > 80 ? "+12% acima da média da semana" : "-5% abaixo da média da semana"}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-[11px] opacity-70 ">
                                    {status === 'abaixo' 
                                      ? "Dica: Tente aumentar a ingestão de proteínas na próxima refeição." 
                                      : "Parabéns! Você manteve a disciplina de elite hoje."}
                                  </p>
                                </div>
                              }
                              onClose={() => toast.dismiss(t)}
                            />
                          );
                        });
                      }}
                    />
                    <div 
                      className="w-full bg-primary/30 rounded-t-sm transition-all hover:bg-primary/50 cursor-pointer border-t border-primary/50" 
                      style={{ height: `${record.macros * 0.5}%` }}
                      title={`Macros: ${record.macros}%`}
                      onClick={() => {
                        toast.custom((t) => {
                          const status = record.macros < 80 || record.water < 80 ? 'abaixo' : record.macros > 100 ? 'acima' : 'na meta';
                          const color = status === 'abaixo' ? 'text-warning' : status === 'acima' ? 'text-destructive' : 'text-success';
                          
                          return (
                            <SVGToast 
                              type="info"
                              title={`ANÁLISE DO DIA ${record.date.split('-')[2]}`}
                              message={
                                <div className="space-y-2">
                                  <p className="text-[13px]">Performance: <span className={color}>{record.macros}% Macros</span> e <span className={record.water < 80 ? 'text-warning' : 'text-info'}>{record.water}% Água</span>.</p>
                                  <p className="text-[11px] opacity-70 ">
                                    {status === 'abaixo' 
                                      ? "Dica: Tente aumentar a ingestão de proteínas na próxima refeição." 
                                      : "Parabéns! Você manteve a disciplina de elite hoje."}
                                  </p>
                                </div>
                              }
                              onClose={() => toast.dismiss(t)}
                            />
                          );
                        });
                      }}
                    />
                  </div>
                  <div className="absolute bottom-full mb-3 bg-card border border-white/10 p-3 rounded-xl text-[9px] font-semibold uppercase tracking-wide invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-50 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${record.macros > 80 ? 'bg-success' : 'bg-warning'}`} />
                        MACROS: {record.macros}%
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${record.water > 80 ? 'bg-info' : 'bg-warning'}`} />
                        ÁGUA: {record.water}%
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${record.training ? 'bg-success' : 'bg-muted'}`} />
                        TREINO: {record.training ? 'SIM' : 'NÃO'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tighter">
                    {record.date.split('-')[2]}
                  </span>
                </div>
              )) : (
                [60, 85, 45, 92, 100, 75, 88].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div 
                      className="w-full bg-primary/20 rounded-t-xl transition-all hover:bg-primary/40 cursor-help border-t-2 border-primary/40" 
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tighter">
                      {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'][i]}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="md:w-72 space-y-4">
              <div className="p-4 rounded-[2rem] bg-white/[0.03] border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Consistência</span>
                  <span className="text-sm font-semibold text-primary">82%</span>
                </div>
                <Progress value={82} className="h-2" />
              </div>
              
              <div className="p-4 rounded-[2rem] bg-success/5 border border-success/10 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="text-success" size={14} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-success">Recomendação</span>
                </div>
                <p className="text-[11px] font-bold text-foreground/80 leading-relaxed ">
                  "Sua performance matinal está 15% acima da média. Considere concentrar seus treinos de força neste período para maximizar ganhos."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="surface border-none relative z-10 mt-12">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <HistoryIcon size={20} className="text-primary" />
            Histórico de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {auditLogs.length > 0 ? auditLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wide",
                      log.type === 'meal' ? 'bg-info/20 text-info' :
                      log.type === 'goal' ? 'bg-warning/20 text-warning' :
                      log.type === 'weight' ? 'bg-success/20 text-success' :
                      'bg-primary/20 text-primary'
                    )}>
                      {log.type}
                    </span>
                    <span className="text-sm font-semibold  tracking-tight">{log.action}</span>
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-[11px] text-foreground/60 leading-relaxed ">
                  {log.details}
                </p>
              </div>
            )) : (
              <div className="text-center py-12 opacity-40  text-sm">
                Nenhuma atividade registrada no sistema de auditoria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CheckCircle2({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
