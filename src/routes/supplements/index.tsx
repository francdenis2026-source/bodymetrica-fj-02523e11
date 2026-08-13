import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Pill, 
  AlertCircle, 
  History,
  CalendarDays
} from "lucide-react";

export const Route = createFileRoute("/supplements")({
  component: SupplementsPage,
});

function SupplementsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight font-display text-primary">Suplementação</h2>
          <p className="text-muted-foreground text-sm">
            Gestão inteligente do seu estoque e consumo.
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus size={16} /> Adicionar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="surface border-none">
            <CardHeader>
              <CardTitle className="text-lg font-display">Protocolo Atual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SupplementItem 
                name="Creatina Monohidratada" 
                dosage="5g" 
                schedule="08:00" 
                taken={true} 
              />
              <SupplementItem 
                name="Whey Protein" 
                dosage="30g" 
                schedule="16:00" 
                taken={false} 
              />
              <SupplementItem 
                name="Ômega 3" 
                dosage="1000mg" 
                schedule="12:00" 
                taken={true} 
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="surface border-none p-5">
            <CardTitle className="text-lg font-display mb-4">Estoque</CardTitle>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Creatina (300g)</span>
                  <span className="text-muted-foreground">15 dias restantes</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Whey (900g)</span>
                  <span className="text-muted-foreground">3 dias restantes</span>
                </div>
                <Progress value={15} className="h-2 bg-destructive/10" />
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6 text-xs text-destructive hover:bg-destructive/10">
              <AlertCircle size={14} className="mr-2" />
              Solicitar reposição
            </Button>
          </Card>

          <Card className="surface border-none p-5">
            <CardTitle className="text-lg font-display mb-4 flex items-center gap-2">
              <CalendarDays size={18} className="text-primary" />
              Adesão Semanal
            </CardTitle>
            <div className="text-center">
              <div className="text-4xl font-bold font-display text-primary">92%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Taxa de consumo dentro do horário
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SupplementItem({ name, dosage, schedule, taken }: { name: string; dosage: string; schedule: string; taken: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${taken ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
          <Pill size={20} />
        </div>
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-muted-foreground">{dosage} — {schedule}</div>
        </div>
      </div>
      <Button size="sm" variant={taken ? "outline" : "default"}>
        {taken ? "Realizado" : "Registrar"}
      </Button>
    </div>
  );
}