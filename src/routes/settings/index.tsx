import { createFileRoute, Link } from "@tanstack/react-router";
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
  ChevronRight,
  LifeBuoy,
  Settings
} from "lucide-react";
import { ModuleHeader } from "@/components/module-header";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession, clearSession } from "@/lib/auth/auth.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  const session = getSession();
  const user = session?.user;

  return (
    <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 relative overflow-hidden bg-background">
      {/* Decorative Module Hero Image */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.08] pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4">
        <Settings size={384} className="text-primary" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10 animate-in fade-in slide-in-from-left-4 duration-700">
        <ModuleHeader 
          title="Ajustes"
          description="Personalize sua experiência na plataforma e gerencie suas preferências de performance."
          icon={Settings}
        />
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2 h-14 px-8 font-black uppercase tracking-widest border-2 bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 transition-all" asChild>
            <Link to="/help">CENTRAL DE AJUDA</Link>
          </Button>
        </div>
      </div>


      <div className="max-w-2xl space-y-6">
        <Card className="surface border-none overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6 pt-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg transition-transform hover:scale-105">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {user?.name?.substring(0, 2).toUpperCase() || "FJ"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-xl font-display">{user?.name || "Visitante"}</CardTitle>
                <CardDescription>
                  {user?.email || "Demonstrativo"}
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="mt-2 min-h-[36px] min-w-[120px]">Alterar Foto</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <SettingsLink icon={<User size={18} />} label="Dados Pessoais" />
              <SettingsLink icon={<Smartphone size={18} />} label="Dispositivos Conectados" />
              <SettingsLink icon={<Download size={18} />} label="Exportar Meus Dados (LGPD)" />
              <Link to="/help" className="flex w-full items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <LifeBuoy size={18} />
                  </div>
                  <span className="text-sm font-medium">Central de Ajuda (FAQ)</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
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
                <Label className="text-sm font-medium">Suplementos</Label>
                <p className="text-xs text-muted-foreground">Lembretes por horário conforme protocolo.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Peso e Medidas</Label>
                <p className="text-xs text-muted-foreground">Lembretes para atualização de biometria.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Treinos</Label>
                <p className="text-xs text-muted-foreground">Notificações sobre horários de treinamento.</p>
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
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:bg-destructive/10 h-12 px-4 gap-3"
            onClick={() => {
              clearSession();
              toast.success("Sessão encerrada com sucesso");
              window.location.href = '/auth';
            }}
          >
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
