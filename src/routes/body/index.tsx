import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  Info
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

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight font-display">O QUE AIND AFALTA CRIAR</h2>
        <p className="text-muted-foreground text-sm whitespace-pre-line">
          Adicionar uma linha do tempo da minha evolução com marcos e comparativos (peso, medidas, hidratação e alimentação) para eu visualizar tendências por período. 

          Implementar a importação de refeições e treinos a partir de CSV para eu acelerar o preenchimento inicial e manter meus registros consistentes. 

          Adicionar lembretes de check-ins semanais e horários de hidratação com opções de notificações dentro do app e no modo PWA. 

          Implementar um simulador de proteína com prévia do cálculo usando minha fórmula atual, para eu comparar valores antes de salvar alterações. 

          Criar uma tela de perfil para eu ajustar peso, idade, altura, objetivos e preferências, e refletir esses dados automaticamente no cálculo de proteínas e metas. 

          COLOQU EO NOME DO DESEMVOLVEDOR E A CIDADE: dev Franc D'nis Feijó, AC
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="overview">Geral</TabsTrigger>
          <TabsTrigger value="measurements">Medidas</TabsTrigger>
          <TabsTrigger value="photos">Fotos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard 
              label="Peso" 
              value="82.4 kg" 
              change="-0.3 kg" 
              trend="down" 
              icon={<Scale className="h-4 w-4 text-primary" />} 
            />
            <MetricCard 
              label="Gordura" 
              value="15.2 %" 
              change="-0.8 %" 
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
          </div>

          <Card className="surface border-none p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-display">Histórico de Peso</CardTitle>
            </CardHeader>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockWeightData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.012 235 / 0.5)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="oklch(0.51 0.025 240)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="oklch(0.51 0.025 240)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'oklch(1 0 0)', 
                      borderRadius: '12px',
                      border: '1px solid oklch(0.9 0.012 235)',
                      boxShadow: '0 8px 24px oklch(0.2 0.05 235 / 0.06)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="oklch(0.45 0.09 226)" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: 'oklch(0.45 0.09 226)' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="surface border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-display">Últimos Registros</CardTitle>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus size={16} /> Registrar
              </Button>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors border-b last:border-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">13 Ago, 08:30</span>
                      <span className="text-xs text-muted-foreground">Medição matinal</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">82.4 kg</div>
                      <div className="text-[10px] text-success font-medium">-0.3 kg</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 text-center">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-2">
                  <History size={14} /> Ver histórico completo
                </Button>
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
          
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Compare sua evolução visual com segurança e privacidade.
            </p>
            <Button variant="outline" className="gap-2">
              Ver Comparativo Antes e Depois
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ label, value, change, trend, icon }: { label: string; value: string; change: string; trend: 'up' | 'down'; icon: React.ReactNode }) {
  return (
    <Card className="surface border-none overflow-hidden group">
      <CardContent className="p-5 flex flex-col gap-2 relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display">{value}</span>
          <span className={`text-[10px] font-bold ${trend === 'up' && label === 'Massa Muscular' ? 'text-success' : trend === 'down' ? 'text-success' : 'text-destructive'}`}>
            {change}
          </span>
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