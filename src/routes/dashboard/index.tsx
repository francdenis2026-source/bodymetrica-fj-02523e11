import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { generatePDFReport } from "@/lib/reports";
import { exportToCSV } from "@/lib/export";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton, StatsSkeleton } from "@/components/ui/loading-states";
import { getSession } from "@/lib/auth/auth.functions";

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
  LayoutDashboard
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUserData(session);
    }
    // Simulating initial load
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const userName = userData?.name || "Visitante";
  const currentGoalMap: Record<string, string> = {
    'loss': 'Emagrecimento',
    'gain': 'Hipertrofia',
    'maint': 'Manutenção'
  };
  const currentGoal = currentGoalMap[userData?.profile?.goal] || "Hipertrofia";
  const weightChange = -0.5;

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

  return (
    <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 relative overflow-hidden bg-background">
      {/* Decorative Module Hero Image */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.08] pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4">
        <LayoutDashboard size={384} className="text-primary" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-brand-gradient rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl border-2 border-white/20 transform hover:scale-105 transition-transform duration-500">
            {userName[0]}
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-1 border border-primary/30">
              SISTEMA DE PERFORMANCE
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter font-display text-foreground uppercase italic leading-none">
              OLÁ, <span className="text-gradient-brand">{userName}</span>
            </h2>
            <p className="text-foreground/60 text-lg md:text-2xl font-black tracking-tight leading-none uppercase italic">
              SUA EVOLUÇÃO ESTÁ EM ALTA. O FOCO HOJE É O SEGREDO DO SUCESSO.
            </p>
            {userData?.profile?.license_status !== 'active' && (
              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl inline-block text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">LICENÇA PENDENTE</p>
                <p className="text-xs text-foreground/70 font-bold mb-3 max-w-xs">
                  Adquira sua licença para desbloquear todas as ferramentas de elite e suporte direto.
                </p>
                <Button size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest bg-brand-gradient" asChild>
                  <Link to="/settings">ATIVAR AGORA</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="gap-2 h-14 px-8 font-black uppercase tracking-widest border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all" asChild>
            <Link to="/help">CENTRAL DE AJUDA</Link>
          </Button>
          <Button 
            className="gap-3 h-14 px-8 font-black uppercase tracking-widest bg-brand-gradient shadow-2xl shadow-primary/40 hover:scale-105 transition-all border-none"
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
            variant="outline"
            className="gap-3 h-14 px-8 font-black uppercase tracking-widest border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all"
            onClick={() => exportToCSV([
              { Data: "01/08", Peso: 84.5, Hidratacao: "1.2L", Proteina: "180g" },
              { Data: "15/08", Peso: 82.4, Hidratacao: "2.1L", Proteina: "185g" }
            ], 'Evolucao_BodyMetrica')}
          >
            <FileDown size={20} /> EXPORTAR CSV
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
              <div className="text-3xl font-black font-display italic tracking-tighter uppercase">{userData?.profile?.weight || "82.4"} kg</div>
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
              <div className="text-3xl font-black font-display italic tracking-tighter uppercase">{currentGoal}</div>
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
              <div className="text-3xl font-black font-display italic tracking-tighter uppercase">1.2L / 3.0L</div>
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
              <div className="text-3xl font-black font-display italic tracking-tighter uppercase">Puxada (A)</div>
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
            Consistência Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end h-32 gap-2">
            {[60, 80, 45, 90, 100, 75, 85].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary/20 rounded-t-sm transition-all hover:bg-primary/40" 
                  style={{ height: `${val}%` }}
                />
                <span className="text-[10px] text-muted-foreground font-medium">
                  {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}
                </span>
              </div>
            ))}
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
