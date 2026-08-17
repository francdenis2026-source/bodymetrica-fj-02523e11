import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Dumbbell, 
  Play, 
  History, 
  Calendar, 
  TrendingUp,
  Clock,
  Zap,
  Info,
  LifeBuoy
} from "lucide-react";
import { ModuleHeader } from "@/components/module-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { getSession } from "@/lib/auth/auth.functions";



export const Route = createFileRoute("/training/")({
  component: TrainingPage,
});

function TrainingPage() {
  const [activeTab, setActiveTab] = useState("routine");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUserData(session);
    }
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

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
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 relative overflow-hidden bg-background">

      {/* Decorative Module Hero Image */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.08] pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4">
        <Dumbbell size={384} className="text-primary" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10 animate-in fade-in slide-in-from-left-4 duration-700">
        <ModuleHeader 
          title="Performance"
          description="Evolução estratégica de carga, consistência e potência nos seus treinamentos de elite."
          icon={Dumbbell}
        />
        <div className="flex flex-wrap justify-center gap-4 relative z-10">
          <Button variant="outline" className="gap-2 h-14 px-8 font-black uppercase tracking-widest border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all" asChild>
            <Link to="/help">
              CENTRAL DE AJUDA
            </Link>
          </Button>
          <Button className="gap-3 h-14 px-8 font-black uppercase tracking-widest bg-brand-gradient shadow-2xl shadow-primary/40 hover:scale-105 transition-all border-none">
            <Play size={20} fill="currentColor" /> INICIAR TREINO
          </Button>
        </div>
      </div>



      <div className="grid gap-4 md:grid-cols-3">
        <Card className="surface border-none p-4 flex flex-col items-center justify-center text-center space-y-2">
          <Calendar size={20} className="text-primary opacity-50" />
          <div className="text-2xl font-bold font-display">24</div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Treinos este mês</p>
        </Card>
        <Card className="surface border-none p-4 flex flex-col items-center justify-center text-center space-y-2">
          <Zap size={20} className="text-warning opacity-50" />
          <div className="text-2xl font-bold font-display">12d</div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Sequência atual</p>
        </Card>
        <Card className="surface border-none p-4 flex flex-col items-center justify-center text-center space-y-2">
          <TrendingUp size={20} className="text-success opacity-50" />
          <div className="text-2xl font-bold font-display">+15%</div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Volume de carga</p>
        </Card>
      </div>

        <Tabs defaultValue="routine" className="space-y-4">
          <TabsList>
            <TabsTrigger value="routine">Fichas</TabsTrigger>
            <TabsTrigger value="history">Progresso & Gráficos</TabsTrigger>
            <TabsTrigger value="manage">Gerenciar Exercícios</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-6">
            <Card className="surface border-none p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <CardTitle className="text-xl font-display uppercase italic">Evolução de Performance</CardTitle>
                <div className="flex gap-2">
                  <select className="h-8 bg-white/5 border border-white/10 rounded px-2 text-[10px] font-bold uppercase focus:outline-none">
                    <option>Peitoral</option>
                    <option>Costas</option>
                    <option>Pernas</option>
                  </select>
                  <Button variant="outline" size="sm" className="h-8 text-[9px] font-black uppercase">Comparar Semanas</Button>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                 {[40, 60, 50, 75, 80, 70, 95].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                        <div className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40" style={{ height: `${val}%` }} />
                        <div className="absolute bottom-full mb-2 bg-background border border-white/10 p-2 rounded text-[8px] invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                          Volume: {val * 10}kg
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase">Sem {i+1}</span>
                    </div>
                 ))}
              </div>
            </Card>
          </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card className="surface border-none p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl font-display uppercase italic">Cadastrar Novo Exercício</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome do Exercício</label>
                  <Input placeholder="Ex: Supino Reto" className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Grupo Muscular</label>
                  <Input placeholder="Ex: Peitoral" className="bg-white/5 border-white/10" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Séries</label>
                  <Input type="number" placeholder="4" className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Repetições</label>
                  <Input placeholder="8-12" className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Carga Inicial (kg)</label>
                  <Input type="number" placeholder="20" className="bg-white/5 border-white/10" />
                </div>
              </div>
              <Button className="w-full bg-brand-gradient border-none font-black uppercase tracking-widest h-12">Salvar Exercício na Ficha</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routine" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <WorkoutCard 
              name="Treino A - Puxada" 
              focus="Costas e Bíceps" 
              exercises={6} 
              lastPerformed="Ontem"
            />
            <WorkoutCard 
              name="Treino B - Empurrada" 
              focus="Peito, Ombro e Tríceps" 
              exercises={7} 
              lastPerformed="2 dias atrás"
            />
            <WorkoutCard 
              name="Treino C - Inferiores" 
              focus="Quadríceps e Glúteos" 
              exercises={6} 
              lastPerformed="Hoje"
              isActive={true}
            />
          </div>

          <Card className="surface border-none">
            <CardHeader>
              <CardTitle className="text-lg font-display">Detalhes do Treino Atual (C)</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y">
                <ExerciseItem 
                  name="Agachamento Livre" 
                  sets="4 x 10-12" 
                  load="80kg" 
                  rpe="8"
                />
                <ExerciseItem 
                  name="Leg Press 45" 
                  sets="3 x 12-15" 
                  load="160kg" 
                  rpe="9"
                />
                <ExerciseItem 
                  name="Extensora" 
                  sets="3 x 15" 
                  load="45kg" 
                  rpe="10"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WorkoutCard({ name, focus, exercises, lastPerformed, isActive = false }: { name: string; focus: string; exercises: number; lastPerformed: string; isActive?: boolean }) {
  return (
    <Card className={`surface border-none overflow-hidden ${isActive ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Dumbbell size={20} />
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase">{lastPerformed}</span>
        </div>
        <div className="space-y-1">
          <h3 className="font-bold font-display text-lg">{name}</h3>
          <p className="text-xs text-muted-foreground">{focus}</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
            <Clock size={12} />
            {exercises} EXERCÍCIOS
          </div>
          <Button size="sm" variant={isActive ? "default" : "outline"} className="h-8 text-xs">
            {isActive ? "Continuar" : "Selecionar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExerciseItem({ name, sets, load, rpe }: { name: string; sets: string; load: string; rpe: string }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/10 transition-colors">
      <div className="space-y-0.5">
        <div className="text-sm font-bold">{name}</div>
        <div className="text-xs text-muted-foreground">{sets}</div>
      </div>
      <div className="flex items-center gap-4 text-right">
        <div>
          <div className="text-xs font-bold">{load}</div>
          <div className="text-[10px] text-muted-foreground uppercase font-medium tracking-tighter">Carga</div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-muted flex flex-col items-center justify-center">
          <span className="text-xs font-bold">{rpe}</span>
          <span className="text-[8px] text-muted-foreground font-medium">RPE</span>
        </div>
      </div>
    </div>
  );
}
