import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Bell, 
  Shield, 
  LogOut, 
  Smartphone,
  Download,
  Trash2,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 pb-24">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight font-display text-primary">Configurações</h2>
        <p className="text-muted-foreground text-sm">
          Gerencie sua conta e preferências de privacidade.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="surface border-none overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6 pt-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">FJ</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-xl font-display">Visitante Demonstrativo</CardTitle>
                <CardDescription>Membro desde Agosto 2026</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="mt-2">Alterar Foto</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <SettingsLink icon={<User size={18} />} label="Dados Pessoais" />
              <SettingsLink icon={<Smartphone size={18} />} label="Dispositivos Conectados" />
              <SettingsLink icon={<Download size={18} />} label="Exportar Meus Dados (LGPD)" />
            </div>
          </CardContent>
        </Card>

        <Card className="surface border-none">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Lembretes de Água</Label>
                <p className="text-xs text-muted-foreground">Notificações periódicas para hidratação.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Horário das Refeições</Label>
                <p className="text-xs text-muted-foreground">Alertas baseados no seu planejamento nutricional.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Relatórios Semanais</Label>
                <p className="text-xs text-muted-foreground">Resumo da sua evolução toda segunda-feira.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="surface border-none">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              Privacidade e Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-between h-12 px-4 group">
              <span className="text-sm">Alterar PIN de 6 dígitos</span>
              <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="w-full justify-between h-12 px-4 group">
              <span className="text-sm">Gerenciar Consentimentos</span>
              <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3 pt-4">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 h-12 px-4 gap-3">
            <LogOut size={18} />
            Sair da Conta
          </Button>
          <Button variant="ghost" className="w-full justify-start text-destructive/60 hover:bg-destructive/5 h-12 px-4 gap-3">
            <Trash2 size={18} />
            Excluir Minha Conta Permanentemente
          </Button>
        </div>

        <div className="text-center space-y-1 py-8 opacity-40">
          <p className="text-[10px] font-bold uppercase tracking-widest">Body Métrica FJ</p>
          <p className="text-[8px]">Versão 1.0.0-demo (2026)</p>
        </div>
      </div>
    </div>
  );
}

function SettingsLink({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex w-full items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
