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
  Settings,
  Save,
  Clock
} from "lucide-react";
import { ModuleHeader } from "@/components/module-header";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession, clearSession } from "@/lib/auth/auth.functions";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { requestNotificationPermission, scheduleNotifications } from "@/lib/notifications";
import { validateLicense, generateLicenseKey, createCheckoutSession } from "@/lib/monetization.functions";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";


export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  const session = getSession();
  const user = session?.user;
  const navigate = useNavigate();
  const [licenseKey, setLicenseKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const validateLicenseFn = useServerFn(validateLicense);
  const generateLicenseFn = useServerFn(generateLicenseKey);
  const createCheckoutFn = useServerFn(createCheckoutSession);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckoutFn({ data: { userId: user.id } });
      if (result.success && result.init_point) {
        window.location.href = result.init_point;
      } else {
        toast.custom((t) => (
          <SVGToast 
            type="error"
            title="ERRO NO CHECKOUT"
            message={result.message || "Não foi possível iniciar o processamento do pagamento."}
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
    } catch (error) {
      toast.custom((t) => (
        <SVGToast 
          type="error"
          title="FALHA DE INTEGRAÇÃO"
          message="Erro na comunicação com o Mercado Pago. Tente novamente."
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateLicense = async () => {
    if (!licenseKey) {
      toast.custom((t) => (
        <SVGToast 
          type="warning"
          title="CHAVE AUSENTE"
          message="Por favor, insira o código da licença para ativação."
          onClose={() => toast.dismiss(t)}
        />
      ));
      return;
    }

    setIsLoading(true);
    try {
      const result = await validateLicenseFn({ data: { licenseKey, userId: user.id } });
      if (result.success) {
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title="LICENÇA ATIVADA"
            message={result.message}
            onClose={() => toast.dismiss(t)}
          />
        ));
        // Update local session
        const updatedUser = { ...session.user, licenseStatus: 'active', isLicensed: true };
        localStorage.setItem('bodymetrica_auth_session', JSON.stringify({ ...session, user: updatedUser }));
        window.location.reload();
      } else {
        toast.custom((t) => (
          <SVGToast 
            type="error"
            title="CHAVE INVÁLIDA"
            message={result.message}
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
    } catch (error) {
      toast.custom((t) => (
        <SVGToast 
          type="error"
          title="ERRO DE VALIDAÇÃO"
          message="Não foi possível validar a licença no servidor."
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseSim = async () => {
    setIsLoading(true);
    try {
      const result = await generateLicenseFn({ data: { userId: user.id } });
      if (result.success) {
        setLicenseKey(result.licenseKey);
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title="SIMULAÇÃO CONCLUÍDA"
            message="Compra simulada com sucesso! A chave foi preenchida automaticamente."
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
    } catch (error) {
      toast.error("Erro na simulação de compra.");
    } finally {
      setIsLoading(false);
    }
  };

  const licenseStatus = user?.licenseStatus || 'demonstrative';
  const isLicensed = licenseStatus === 'active';
  const expiresAt = user?.profile?.license_expires_at;
  const daysRemaining = expiresAt ? Math.ceil((new Date(expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const isNearExpiration = isLicensed && daysRemaining > 0 && daysRemaining <= 7;

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


      <div className="max-w-2xl space-y-6 relative z-10">
        <Card className={cn(
          "surface border-none overflow-hidden border",
          isLicensed ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"
        )}>
          <CardHeader>
            <CardTitle className="text-xl font-display uppercase italic flex items-center gap-2 text-primary">
              <Shield size={20} />
              Licença de Uso
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Status da sua assinatura Body Métrica FJ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background/50 rounded-2xl border border-white/5 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">STATUS ATUAL</p>
                <p className={cn(
                  "text-sm font-black uppercase",
                  isLicensed ? "text-success" : "text-destructive"
                )}>
                  {isLicensed ? 'Licença Ativa' : licenseStatus === 'revoked' ? 'Revogada' : licenseStatus === 'expired' ? 'Expirada' : 'Pendente'}
                </p>
              </div>
              <div className="p-4 bg-background/50 rounded-2xl border border-white/5 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">DIAS RESTANTES</p>
                <p className="text-sm font-bold uppercase">
                  {isLicensed ? `${daysRemaining} DIAS` : '0 DIAS'}
                </p>
              </div>
            </div>

            {isLicensed && (
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-white/5">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">DATA DE EXPIRAÇÃO</p>
                  <p className="text-sm font-bold uppercase">
                    {expiresAt ? format(new Date(expiresAt), "dd 'de' MMMM, yyyy", { locale: ptBR }) : 'Não disponível'}
                  </p>
                </div>
                {isNearExpiration && (
                  <Badge className="bg-warning text-warning-foreground font-black animate-pulse">RENOVE AGORA</Badge>
                )}
              </div>
            )}

            {!isLicensed && (
              <div className="p-4 bg-destructive/10 rounded-2xl border border-destructive/20 flex items-start gap-3">
                <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-destructive uppercase tracking-widest">Acesso Restrito</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    Sua licença não está ativa. Por favor, insira uma chave válida ou realize a renovação para liberar os módulos de performance.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">
                  {isLicensed ? "CHAVE ATIVA" : "ATIVAR CHAVE DE LICENÇA"}
                </Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="BODY-XXXX-XXXX-XXXX" 
                    className="h-12 bg-white/5 border-white/10 rounded-xl px-4 font-mono text-xs uppercase"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                    disabled={isLicensed || isLoading}
                  />
                  {!isLicensed && (
                    <Button 
                      onClick={handleActivateLicense}
                      disabled={isLoading}
                      className="h-12 bg-brand-gradient border-none font-black uppercase tracking-widest px-6 rounded-xl"
                    >
                      ATIVAR
                    </Button>
                  )}
                </div>
              </div>
              
              {!isLicensed && (
                <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 space-y-3">
                  <p className="text-xs font-bold text-primary flex items-center gap-2">
                    <Smartphone size={14} /> SIMULAR AQUISIÇÃO
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    Clique abaixo para simular o fluxo de pagamento e receber sua chave automaticamente via Mercado Pago.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-[10px] font-black border-primary/30 hover:bg-primary/20"
                    onClick={handlePurchase}
                    disabled={isLoading}
                  >
                    COMPRAR LICENÇA (MERCADO PAGO)
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
              <Link to="/profile" search={{} as any} className="flex w-full items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <span className="text-sm font-medium">Dados Pessoais e Segurança</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/profile" search={{} as any} className="flex w-full items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    <Smartphone size={18} />
                  </div>
                  <span className="text-sm font-medium">Dispositivos Conectados</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
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
            <CardTitle className="text-xl font-display uppercase italic flex items-center gap-2">
              <Bell size={20} className="text-primary" />
              Alertas de Performance
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Configure lembretes estratégicos para suas metas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Metas de Hidratação</Label>
                    <p className="text-xs text-muted-foreground">Lembretes e alertas de sensibilidade</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Select defaultValue="medium">
                      <SelectTrigger className="h-8 w-24 text-[10px] uppercase font-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="pl-4 space-y-4 border-l-2 border-primary/20 ml-2">
                   <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Clock size={12} /> Horários de Lembrete
                      </span>
                      <div className="flex flex-wrap gap-2">
                         <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-[9px] border-primary/30"
                            onClick={() => {
                              if ("Notification" in window) {
                                Notification.requestPermission().then(permission => {
                                  if (permission === "granted") {
                                    new Notification("Body Métrica FJ", {
                                      body: "Lembrete de hidratação configurado para as 08:00",
                                      icon: "/favicon.svg"
                                    });
                                  }
                                });
                              }
                            }}
                         >
                           08:00
                         </Button>
                         <Button variant="outline" size="sm" className="h-7 text-[9px] border-primary/30">14:00</Button>
                         <Button variant="outline" size="sm" className="h-7 text-[9px] border-primary/30">20:00</Button>
                         <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full border border-dashed border-muted-foreground/30">+</Button>
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Resumo Diário</Label>
                    <p className="text-xs text-muted-foreground">Insights e pendências do dia</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input type="time" defaultValue="21:30" className="h-8 w-24 text-[10px]" />
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Janela de Atraso (Macros)</Label>
                    <p className="text-xs text-muted-foreground">Tempo antes do alerta de atraso</p>
                  </div>
                  <Select defaultValue="15">
                    <SelectTrigger className="h-8 w-24 text-[10px] uppercase font-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 min</SelectItem>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Lembretes de Refeições</Label>
                    <p className="text-xs text-muted-foreground">Notificar nos horários estratégicos de alimentação</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="pl-4 space-y-4 border-l-2 border-primary/20 ml-2">
                   <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Clock size={12} /> Horários Customizados
                      </span>
                      <div className="flex flex-wrap gap-2">
                         <Button variant="outline" size="sm" className="h-7 text-[9px] border-primary/30">07:30</Button>
                         <Button variant="outline" size="sm" className="h-7 text-[9px] border-primary/30">12:30</Button>
                         <Button variant="outline" size="sm" className="h-7 text-[9px] border-primary/30">16:00</Button>
                         <Button variant="outline" size="sm" className="h-7 text-[9px] border-primary/30">20:00</Button>
                         <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full border border-dashed border-muted-foreground/30">+</Button>
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Macronutrientes</Label>
                    <p className="text-xs text-muted-foreground">Avisar sobre batimento de proteínas e calorias</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="pl-4 space-y-4 border-l-2 border-primary/20 ml-2">
                   <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Clock size={12} /> Horários de Lembrete
                      </span>
                      <div className="flex flex-wrap gap-2">
                         <Button variant="outline" size="sm" className="h-7 text-[9px] border-primary/30">12:00</Button>
                         <Button variant="outline" size="sm" className="h-7 text-[9px] border-primary/30">19:00</Button>
                         <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full border border-dashed border-muted-foreground/30">+</Button>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Relatórios Semanais</Label>
                  <p className="text-xs text-muted-foreground">Resumo de evolução física e performance</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Tema do Sistema</Label>
                  <p className="text-xs text-muted-foreground">Escolha entre modo claro ou escuro.</p>
                </div>
                <ThemeToggle />
              </div>
            </div>

            <Button className="w-full bg-brand-gradient border-none font-black uppercase tracking-widest h-12 gap-2 mt-4" onClick={() => {
              // Trigger permission and push settings
              requestNotificationPermission().then(() => {
                scheduleNotifications();
                toast.success("Preferências de notificação salvas e agendadas");
              });
            }}>
              <Save size={18} /> Salvar Preferências
            </Button>
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
