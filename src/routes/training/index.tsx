import { createFileRoute } from "@tanstack/react-router";
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
  Zap
} from "lucide-react";

export const Route = createFileRoute("/training/")({
  component: TrainingPage,
});

function TrainingPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight font-display text-primary">Treinos</h2>
          <p className="text-muted-foreground text-sm">
            Evolução de carga e consistência nos treinos.
          </p>
        </div>
        <Button size="sm" className="gap-2 bg-brand-gradient">
          <Play size={16} fill="currentColor" /> Iniciar Treino
        </Button>
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
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

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
