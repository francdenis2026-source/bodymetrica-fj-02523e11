import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import { getSession } from "@/lib/auth/auth.functions";
import { ModuleHeader } from "@/components/module-header";

export const Route = createFileRoute("/hydration/")({
  component: HydrationPage,
});

function HydrationPage() {
  const [currentAmount, setCurrentAmount] = useState(0); // Iniciar zerado para simular empty state
  const [isSyncing, setIsSyncing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const goalAmount = 3000;
  const percentage = Math.round((currentAmount / goalAmount) * 100);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUserData(session);
    }
  }, []);

  const addWater = async (amount: number) => {
    setIsSyncing(true);
    const newTotal = currentAmount + amount;
    setCurrentAmount(prev => Math.min(newTotal, 5000));
    
    if (newTotal >= goalAmount * 0.9 && currentAmount < goalAmount * 0.9) {
      toast.success("Parabéns! Você atingiu 90% da sua meta de hidratação!", {
        description: "Mais um pouco e você conclui o dia.",
      });
    }

    queueOfflineAction({
      type: 'WATER_LOG',
      data: { amount, currentTotal: newTotal }
    });

    // Simular delay de sincronização
    setTimeout(() => setIsSyncing(false), 800);

    // Check for goal proximity for notifications
    if (newTotal < goalAmount && newTotal >= goalAmount * 0.8) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Body Métrica FJ", {
          body: `Você atingiu ${percentage}% da sua meta de água. Quase lá!`,
          icon: "/favicon.svg"
        });
      }
    }
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
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-2xl h-14 w-14 border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all"
            onClick={() => {
              if ("Notification" in window) {
                Notification.requestPermission().then(permission => {
                  if (permission === "granted") {
                    alert("Lembretes de hidratação ativados!");
                  }
                });
              }
            }}
          >
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
              <Droplets className={isSyncing ? "text-primary animate-pulse" : "text-info"} size={24} />
              <span className="text-3xl font-black font-display italic tracking-tighter uppercase">{percentage}%</span>
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{isSyncing ? "SINCRONIZANDO..." : "DIÁRIO"}</span>
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
              {currentAmount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-[10px] font-black uppercase tracking-widest"
                  onClick={() => {
                    if ("Notification" in window && Notification.permission === "granted") {
                      new Notification("Body Métrica FJ", {
                        body: "Não esqueça de beber água! Sua meta é 3L hoje.",
                        icon: "/favicon.ico"
                      });
                    } else {
                      alert("Ative as notificações nas configurações para receber lembretes.");
                    }
                  }}
                >
                  TESTAR LEMBRETE
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {currentAmount === 0 ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
                    <Droplets className="text-muted-foreground/30" size={20} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">NENHUM REGISTRO HOJE</p>
                  <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest hover:text-primary" onClick={() => addWater(200)}>
                    REGISTRAR AGORA
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <WaterLogEntry time="Agora" amount={`${currentAmount}ml (Total)`} />
                </div>
              )}
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