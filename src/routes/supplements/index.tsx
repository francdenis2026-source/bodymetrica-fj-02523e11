import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Pill, 
  AlertCircle, 
  History,
  CalendarDays,
  Clock,
  ListChecks,
  Info
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/supplements/")({
  component: SupplementsPage,
});

function SupplementsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight font-display text-primary">Suplementação</h2>
          <p className="text-muted-foreground text-sm">
            Gerenciamento de suplementos com lista, protocolos, logs de uso e lembretes por horário.
          </p>
        </div>
        <Button size="sm" className="gap-2 bg-brand-gradient">
          <Plus size={16} /> Adicionar
        </Button>
      </div>

      <Tabs defaultValue="protocol" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="protocol">Protocolos</TabsTrigger>
          <TabsTrigger value="inventory">Estoque</TabsTrigger>
          <TabsTrigger value="history">Logs de Uso</TabsTrigger>
        </TabsList>

        <TabsContent value="protocol" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card className="surface border-none">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <Clock size={18} className="text-primary" />
                    Protocolo Diário
                  </CardTitle>
                  <CardDescription>Acompanhe e registre seus suplementos por horário.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SupplementItem 
                    name="Creatina Monohidratada" 
                    dosage="5g" 
                    schedule="08:00" 
                    taken={true} 
                  />
                  <SupplementItem 
                    name="Multivitamínico" 
                    dosage="1 cápsula" 
                    schedule="12:00" 
                    taken={false} 
                  />
                  <SupplementItem 
                    name="Ômega 3" 
                    dosage="1000mg" 
                    schedule="12:00" 
                    taken={false} 
                  />
                  <SupplementItem 
                    name="Whey Protein" 
                    dosage="30g" 
                    schedule="16:00" 
                    taken={false} 
                  />
                </CardContent>
              </Card>

              <Card className="surface border-none p-5 bg-primary/5">
                <div className="flex gap-4">
                  <Info className="text-primary shrink-0" size={20} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold">Observações do Protocolo</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      A creatina pode ser consumida em qualquer horário, mas a consistência é chave. 
                      O multivitamínico deve ser ingerido com a maior refeição para melhor absorção.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="surface border-none p-5">
                <CardTitle className="text-lg font-display mb-4 flex items-center gap-2">
                  <ListChecks size={18} className="text-primary" />
                  Status Global
                </CardTitle>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                      <span>Consumo Hoje</span>
                      <span className="text-primary">1 de 4</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div className="pt-4 border-t space-y-4">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Adesão Semanal</div>
                    <div className="text-4xl font-bold font-display text-primary">92%</div>
                  </div>
                </div>
              </Card>

              <Card className="surface border-none p-5">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-base font-display">Alertas de Estoque</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">Whey Protein</span>
                    <Badge variant="destructive" className="text-[8px] px-1 py-0">Crítico</Badge>
                  </div>
                  <Progress value={10} className="h-1.5 bg-destructive/10" />
                  <Button variant="outline" className="w-full text-[10px] h-8 font-bold uppercase">
                    Solicitar Reposição
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card className="surface border-none">
            <CardHeader>
              <CardTitle className="text-lg font-display">Inventário de Suplementos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <InventoryItem name="Creatina Monohidratada" current="150g" total="300g" percent={50} days="15 dias" />
                <InventoryItem name="Whey Protein" current="90g" total="900g" percent={10} days="3 dias" isLow />
                <InventoryItem name="Multivitamínico" current="45 cápsulas" total="60 cápsulas" percent={75} days="45 dias" />
                <InventoryItem name="Ômega 3" current="20 cápsulas" total="120 cápsulas" percent={16} days="20 dias" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SupplementItem({ name, dosage, schedule, taken }: { name: string; dosage: string; schedule: string; taken: boolean }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${taken ? 'bg-muted/30 border-transparent opacity-70' : 'bg-card border-muted/20 hover:border-primary/50'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${taken ? 'bg-success/20 text-success' : 'bg-primary/10 text-primary'}`}>
          <Pill size={20} />
        </div>
        <div>
          <div className="text-sm font-bold">{name}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock size={12} /> {schedule} — {dosage}
          </div>
        </div>
      </div>
      <Button size="sm" variant={taken ? "ghost" : "default"} className={taken ? "text-success" : ""}>
        {taken ? "Concluído" : "Registrar"}
      </Button>
    </div>
  );
}

function InventoryItem({ name, current, total, percent, days, isLow }: { name: string; current: string; total: string; percent: number; days: string; isLow?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-sm font-bold">{name}</span>
          <span className="text-[10px] text-muted-foreground ml-2">({current} de {total})</span>
        </div>
        <span className={`text-[10px] font-bold ${isLow ? 'text-destructive' : 'text-muted-foreground'}`}>{days} restantes</span>
      </div>
      <Progress value={percent} className={`h-2 ${isLow ? 'bg-destructive/10' : ''}`} />
    </div>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
      variant === 'destructive' ? 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80' : 
      'border-transparent bg-primary text-primary-foreground hover:bg-primary/80'
    } ${className}`}>
      {children}
    </span>
  );
}
