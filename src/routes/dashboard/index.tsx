import { createFileRoute, Link } from "@tanstack/react-router";
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
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const userName = "Visitante"; // Mock data
  const currentGoal = "Hipertrofia";
  const weightChange = -0.5;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight font-display">Olá, {userName}! 👋</h2>
          <p className="text-muted-foreground text-sm">
            Seu progresso está incrível hoje. Mantenha o foco!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 h-9 text-xs" asChild>
            <Link to="/about">
              <Filter size={14} /> Como Funciona
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
            <FileDown size={14} /> Relatórios PDF
          </Button>
        </div>
        <Button size="icon" className="rounded-full w-12 h-12 shadow-lg bg-brand-gradient md:hidden fixed bottom-20 right-4 z-40">
          <Plus size={24} />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/body" className="block transition-transform active:scale-[0.98]">
          <Card className="surface border-none hover:bg-accent/5 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
              <User className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82.4 kg</div>
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
              <div className="text-2xl font-bold">{currentGoal}</div>
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
              <div className="text-2xl font-bold">1.2L / 3.0L</div>
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
              <div className="text-2xl font-bold">Puxada (A)</div>
              <p className="text-xs text-muted-foreground mt-1">
                Programado para hoje às 18:00
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                  <Pill size={18} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Multivitamínico</div>
                  <div className="text-xs text-muted-foreground">1 cap - Próximo</div>
                </div>
              </div>
              <Button size="sm" variant="ghost">Tomar</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="surface border-none">
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