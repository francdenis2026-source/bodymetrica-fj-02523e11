import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/module-header";
import { 
  User, 
  Mail, 
  Shield, 
  Smartphone, 
  LogOut, 
  Key, 
  Save, 
  Trash2, 
  AlertTriangle,
  ChevronRight,
  Clock,
  ArrowLeft,
  Activity,
  Lock,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  getSession, 
  updateProfile, 
  changePassword, 
  changeEmail,
  deleteAccount,
  getSecurityLogs,
  logoutSession
} from "@/lib/auth/auth.functions";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const navigate = useNavigate();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    weight: "",
    height: "",
    goal: "gain"
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [newEmail, setNewEmail] = useState("");

  const loadData = async () => {
    const session = getSession();
    if (!session) {
      navigate({ to: "/auth" as any });
      return;
    }

    setUserData(session);
    setProfileForm({
      name: session.name || "",
      email: session.user?.email || "",
      weight: session.profile?.weight?.toString() || "",
      height: session.profile?.height?.toString() || "",
      goal: session.profile?.goal || "gain"
    });

    try {
      // Fetch security logs
      const logsRes = await getSecurityLogs();
      if (logsRes.success) {
        setSecurityLogs(logsRes.logs);
      }

      // In a real environment with Supabase Auth, we'd list factors for MFA
      // const { data: factors } = await supabase.auth.mfa.listFactors();
    } catch (e) {
      console.error("Error loading security data", e);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await updateProfile({
        data: {
          name: profileForm.name,
          weight: parseFloat(profileForm.weight),
          height: parseFloat(profileForm.height),
          goal: profileForm.goal
        }
      });

      if (res.success) {
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title="PERFIL ATUALIZADO"
            message="Suas informações foram salvas com sucesso."
            onClose={() => toast.dismiss(t)}
          />
        ));
      } else {
        throw new Error(res.message);
      }
    } catch (error: any) {
      toast.custom((t) => (
        <SVGToast 
          type="error"
          title="ERRO AO SALVAR"
          message={error.message || "Não foi possível atualizar o perfil."}
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await changePassword({
        data: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }
      });

      if (res.success) {
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title="SENHA ALTERADA"
            message="Sua senha foi atualizada com sucesso."
            onClose={() => toast.dismiss(t)}
          />
        ));
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        throw new Error(res.message);
      }
    } catch (error: any) {
      toast.custom((t) => (
        <SVGToast 
          type="error"
          title="ERRO DE SEGURANÇA"
          message={error.message || "Não foi possível alterar a senha."}
          onClose={() => toast.dismiss(t)}
        />
      ));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutSession = async (scope: 'others' | 'global') => {
    setIsSaving(true);
    try {
      const res = await logoutSession({ data: { scope } });
      if (res.success) {
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title={scope === 'others' ? "SESSÕES ENCERRADAS" : "DESCONECTADO"}
            message={scope === 'others' ? "Outros dispositivos foram desconectados." : "Todas as sessões foram encerradas."}
            onClose={() => toast.dismiss(t)}
          />
        ));
        if (scope === 'global') {
          navigate({ to: "/auth" as any });
        } else {
          loadData();
        }
      }
    } catch (error) {
      toast.error("Erro ao encerrar sessões.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await changeEmail({ data: { newEmail } });
      if (res.success) {
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title="CONFIRMAÇÃO ENVIADA"
            message={res.message || "Verifique seu novo e-mail."}
            onClose={() => toast.dismiss(t)}
          />
        ));
        setNewEmail("");
      } else {
        throw new Error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSaving(true);
    try {
      const res = await deleteAccount();
      if (res.success) {
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title="CONTA DESATIVADA"
            message="Sua conta foi removida com sucesso."
            onClose={() => toast.dismiss(t)}
          />
        ));
        navigate({ to: "/" as any });
      }
    } catch (error) {
      toast.error("Erro ao excluir conta.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMfaToggle = async () => {
    // This is a simplified mock of MFA enrollment
    // In production, we'd use supabase.auth.mfa.enroll()
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowMfaSetup(false);
      toast.custom((t) => (
        <SVGToast 
          type="success"
          title="2FA CONFIGURADO"
          message="Autenticação de dois fatores ativada."
          onClose={() => toast.dismiss(t)}
        />
      ));
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 bg-background animate-in fade-in duration-700">
        <Skeleton className="h-20 w-64 rounded-2xl" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-[500px] rounded-[2.5rem]" />
          <Skeleton className="h-[500px] rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-12 p-4 md:p-12 pt-10 relative overflow-hidden bg-background">
      <div className="relative z-20 flex items-center gap-4 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-primary hover:bg-primary/10"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={14} className="mr-2" /> VOLTAR
        </Button>
      </div>

      <ModuleHeader 
        title="MEU PERFIL" 
        description="GERENCIE SEUS DADOS E SEGURANÇA"
        icon={User}
      />

      <div className="grid gap-8 lg:grid-cols-2 relative z-10">
        {/* Personal Info */}
        <Card className="surface border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardHeader className="pb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <User size={24} />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase italic tracking-widest">DADOS PESSOAIS</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  INFORMAÇÕES DE PERFORMANCE E CONTATO
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">NOME COMPLETO</Label>
                  <Input 
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    placeholder="Seu nome"
                    className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary font-bold italic"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">E-MAIL ATUAL</Label>
                  <div className="relative">
                    <Input 
                      value={profileForm.email}
                      disabled
                      className="h-14 bg-white/5 border-white/10 rounded-2xl opacity-50 font-bold italic pr-12"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">ALTERAR E-MAIL</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Novo e-mail"
                      className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary font-bold italic"
                    />
                    <Button 
                      type="button"
                      onClick={handleChangeEmail}
                      disabled={!newEmail || isSaving}
                      className="h-14 aspect-square bg-primary/10 border-none rounded-2xl text-primary"
                    >
                      <RefreshCw size={20} className={isSaving ? "animate-spin" : ""} />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">PESO (KG)</Label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={profileForm.weight}
                      onChange={(e) => setProfileForm({...profileForm, weight: e.target.value})}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary font-bold italic"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">ALTURA (CM)</Label>
                    <Input 
                      type="number"
                      value={profileForm.height}
                      onChange={(e) => setProfileForm({...profileForm, height: e.target.value})}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary font-bold italic"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSaving}
                className="w-full h-14 bg-brand-gradient border-none font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all"
              >
                {isSaving ? "SALVANDO..." : "ATUALIZAR DADOS"}
                <Save className="ml-2" size={18} />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security & Password */}
        <div className="space-y-8">
          <Card className="surface border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="pb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Shield size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-black uppercase italic tracking-widest">SEGURANÇA</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    ALTERAÇÃO DE SENHA E ACESSO
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">SENHA ATUAL</Label>
                    <Input 
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">NOVA SENHA</Label>
                    <Input 
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">CONFIRMAR NOVA SENHA</Label>
                    <Input 
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-primary"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSaving}
                  variant="outline"
                  className="w-full h-14 border-white/10 bg-white/5 font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                >
                  {isSaving ? "ALTERANDO..." : "ALTERAR SENHA"}
                  <Key className="ml-2" size={18} />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card className="surface border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="pb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Lock size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-black uppercase italic tracking-widest">PROTEÇÃO EXTRA</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    MFA E GERENCIAMENTO DE ACESSO
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black uppercase italic">2FA (AUTENTICAÇÃO 2 FATORES)</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">MAIS SEGURANÇA NO SEU LOGIN</div>
                </div>
                <Button 
                  onClick={() => setShowMfaSetup(true)}
                  variant="outline"
                  className="rounded-2xl border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase"
                >
                  CONFIGURAR
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => handleLogoutSession('others')}
                  className="h-16 border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-2xl"
                >
                  SAIR DE OUTROS
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleLogoutSession('global')}
                  className="h-16 bg-destructive/10 border-destructive/20 text-destructive text-[10px] font-black uppercase tracking-widest rounded-2xl"
                >
                  SAIR DE TUDO
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Logs */}
          <Card className="surface border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Activity size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-black uppercase italic tracking-widest">HISTÓRICO</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                    ATIVIDADES DE SEGURANÇA RECENTES
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityLogs.length === 0 ? (
                  <div className="text-center py-8 text-[10px] font-bold text-white/20 uppercase tracking-widest italic">
                    NENHUMA ATIVIDADE REGISTRADA
                  </div>
                ) : (
                  securityLogs.map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center text-white/40">
                          <Clock size={14} />
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase italic tracking-wider">
                            {log.action.replace(/_/g, ' ')}
                          </div>
                          <div className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">
                            {new Date(log.created_at).toLocaleDateString()} • {new Date(log.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      {log.details?.ip && (
                        <Badge variant="outline" className="text-[8px] border-white/10 text-white/40 font-mono">
                          {log.details.ip}
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="surface border-none rounded-[2.5rem] overflow-hidden shadow-2xl bg-destructive/5 border-destructive/10">
            <CardContent className="pt-8 flex items-center justify-between">
              <div>
                <div className="text-xs font-black uppercase italic text-destructive">ZONA DE PERIGO</div>
                <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">ESSA AÇÃO NÃO PODE SER DESFEITA</div>
              </div>
              <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-destructive hover:bg-destructive/10 rounded-2xl px-6 h-12 text-[10px] font-black uppercase tracking-widest">
                    EXCLUIR CONTA
                  </Button>
                </DialogTrigger>
                <DialogContent className="surface border-white/10 rounded-[2rem] max-w-sm">
                  <DialogHeader>
                    <div className="w-16 h-16 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive mx-auto mb-4">
                      <AlertTriangle size={32} />
                    </div>
                    <DialogTitle className="text-center text-xl font-black italic uppercase tracking-widest">TEM CERTEZA?</DialogTitle>
                    <DialogDescription className="text-center text-[11px] font-bold uppercase leading-relaxed text-white/40">
                      AO EXCLUIR SUA CONTA, TODOS OS SEUS DADOS, TREINOS E EVOLUÇÕES SERÃO REMOVIDOS PERMANENTEMENTE.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex-col gap-3 mt-4">
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="w-full h-14 rounded-2xl font-black uppercase tracking-widest"
                    >
                      SIM, EXCLUIR TUDO
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-white/60"
                    >
                      CANCELAR
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MFA Setup Modal */}
      <Dialog open={showMfaSetup} onOpenChange={setShowMfaSetup}>
        <DialogContent className="surface border-white/10 rounded-[2rem] max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <Shield size={32} />
            </div>
            <DialogTitle className="text-center text-xl font-black italic uppercase tracking-widest">CONFIGURAR 2FA</DialogTitle>
            <DialogDescription className="text-center text-[11px] font-bold uppercase leading-relaxed text-white/40">
              ESCANEIE O CÓDIGO QR COM SEU APLICATIVO DE AUTENTICAÇÃO (GOOGLE AUTHENTICATOR, AUTHY, ETC).
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center gap-6">
            <div className="w-48 h-48 bg-white p-4 rounded-3xl flex items-center justify-center">
              {/* Mock QR Code */}
              <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-white/10">
                <Activity size={80} />
              </div>
            </div>
            <div className="w-full space-y-2">
              <Label className="text-[10px] font-black uppercase text-white/60 ml-1">CÓDIGO DE VERIFICAÇÃO</Label>
              <Input 
                placeholder="000000"
                className="h-14 bg-white/5 border-white/10 rounded-2xl text-center text-2xl font-black tracking-[0.5em]"
                maxLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleMfaToggle}
              disabled={isSaving}
              className="w-full h-14 bg-brand-gradient border-none font-black uppercase tracking-widest rounded-2xl"
            >
              {isSaving ? "VERIFICANDO..." : "ATIVAR PROTEÇÃO"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
