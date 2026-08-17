import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Droplets, 
  Zap, 
  Settings, 
  History,
  Calendar,
  AlertTriangle,
  Info,
  LifeBuoy
} from "lucide-react";
import { queueOfflineAction } from "@/lib/offline-sync";
import { ModuleHeader } from "@/components/module-header";

export const Route = createFileRoute("/hydration/")({
  component: HydrationPage,
});

function HydrationPage() {
  const [currentAmount, setCurrentAmount] = useState(1200);
  const goalAmount = 3000;
  const percentage = Math.round((currentAmount / goalAmount) * 100);

  const addWater = (amount: number) => {
    setCurrentAmount(prev => Math.min(prev + amount, 5000));
    queueOfflineAction({
      type: 'WATER_LOG',
      data: { amount, currentTotal: currentAmount + amount }
    });
  };

  return (
    <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 relative overflow-hidden bg-background">
      {/* Decorative Module Hero Image */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.08] pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4">
        <Droplets size={384} className="text-info" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10 animate-in fade-in slide-in-from-left-4 duration-700">
        <ModuleHeader 
          title="Hidratação"
          description="Controle rigoroso de ingestão de fluídos para otimização metabólica e performance."
          icon={Droplets}
          iconClassName="bg-info text-info-foreground shadow-info/40 border-info/20"
        />
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="gap-2 h-14 px-8 font-black uppercase tracking-widest border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all" asChild>
            <Link to="/help">CENTRAL DE AJUDA</Link>
          </Button>
          <Button variant="outline" size="icon" className="rounded-2xl h-14 w-14 border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all">
            <Settings size={22} />
          </Button>
        </div>
      </div>



      <div className="grid gap-6 md:grid-cols-2">
        <Card className="surface border-none flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="oklch(var(--info) / 0.1)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="oklch(var(--info))"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - percentage / 100)}
                strokeLinecap="round"
                className="transition-all duration-700 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets className="text-info mb-1" size={24} />
              <span className="text-3xl font-bold font-display">{percentage}%</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">da meta diária</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold font-display">{(currentAmount / 1000).toFixed(1)}L / {(goalAmount / 1000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">Faltam {( (goalAmount - currentAmount) / 1000 ).toFixed(1)}L para concluir</p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            <Button variant="outline" className="flex flex-col h-auto py-5 gap-1 min-h-[64px]" onClick={() => addWater(200)}>
              <span className="text-xs font-bold">200ml</span>
              <span className="text-[10px] text-muted-foreground uppercase">Copo</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-5 gap-1 min-h-[64px]" onClick={() => addWater(500)}>
              <span className="text-xs font-bold">500ml</span>
              <span className="text-[10px] text-muted-foreground uppercase">Garrafa</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-5 gap-1 min-h-[64px]" onClick={() => addWater(1000)}>
              <span className="text-xs font-bold">1L</span>
              <span className="text-[10px] text-muted-foreground uppercase">Extra</span>
            </Button>

          </div>
        </Card>

        <div className="space-y-4">
          <Card className="surface border-none p-5 space-y-4">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Zap size={18} className="text-warning" />
              Sequência e Hábitos
            </CardTitle>
            <div className="flex justify-between p-3 rounded-xl bg-muted/50">
              <div className="text-center space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Atual</span>
                <div className="text-xl font-bold font-display">5 dias</div>
              </div>
              <div className="w-px bg-border my-2" />
              <div className="text-center space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Recorde</span>
                <div className="text-xl font-bold font-display">12 dias</div>
              </div>
              <div className="w-px bg-border my-2" />
              <div className="text-center space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Média</span>
                <div className="text-xl font-bold font-display">2.8L</div>
              </div>
            </div>
          </Card>

          <Card className="surface border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <History size={18} className="text-primary" />
                Registros de Hoje
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-xs">Ver tudo</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <WaterLogEntry time="08:15" amount="300ml" />
                <WaterLogEntry time="09:45" amount="500ml" />
                <WaterLogEntry time="11:30" amount="400ml" />
              </div>
            </CardContent>
          </Card>

          {currentAmount > 4500 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="text-destructive shrink-0" size={20} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-destructive">Atenção ao excesso</p>
                <p className="text-xs text-destructive/80 leading-relaxed">
                  Beber água demais em um intervalo curto pode ser prejudicial. 
                  Mantenha a hidratação equilibrada.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Card className="surface border-none">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            Visão Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end h-24 gap-1.5">
            {[90, 100, 85, 95, 40, 0, 0].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={`w-full rounded-t-sm transition-all ${val >= 90 ? 'bg-info' : 'bg-info/30'}`} 
                  style={{ height: `${val || 5}%` }}
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

function WaterLogEntry({ time, amount }: { time: string; amount: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-muted/50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-info/10 text-info flex items-center justify-center">
          <Droplets size={14} />
        </div>
        <span className="text-sm font-medium">{time}</span>
      </div>
      <span className="text-sm font-bold font-display">{amount}</span>
    </div>
  );
}