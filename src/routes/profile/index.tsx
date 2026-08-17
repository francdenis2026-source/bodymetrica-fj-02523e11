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
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { supabase } from "@/integrations/supabase/client";
import { getSession, updateProfile, changePassword } from "@/lib/auth/auth.functions";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
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

  useEffect(() => {
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

      // Fetch active sessions using the user_id if needed, but Supabase JS SDK 
      // doesn't have listSessions on the client side in this version.
      setSessions([]);
      
      setIsLoading(false);
    };

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

  const handleLogoutOthers = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'others' });
    if (!error) {
      toast.success("Outras sessões encerradas.");
    }
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
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">E-MAIL</Label>
                  <div className="relative">
                    <Input 
                      value={profileForm.email}
                      disabled
                      className="h-14 bg-white/5 border-white/10 rounded-2xl opacity-50 font-bold italic pr-12"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
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

          {/* Active Sessions */}
          <Card className="surface border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black uppercase italic tracking-widest">SESSÕES ATIVAS</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      DISPOSITIVOS CONECTADOS AGORA
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogoutOthers}
                  className="text-[10px] font-black text-destructive hover:bg-destructive/10 uppercase tracking-widest"
                >
                  SAIR DE OUTROS
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                        {session.user_agent?.toLowerCase().includes('mobile') ? <Smartphone size={18} /> : <Clock size={18} />}
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase italic">{session.user_agent?.split('(')[0] || "Navegador Desconhecido"}</div>
                        <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                          {new Date(session.last_sign_in_at).toLocaleDateString()} ÀS {new Date(session.last_sign_in_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    {session.id === userData?.user?.id && (
                      <span className="text-[8px] font-black bg-primary/20 text-primary px-2 py-1 rounded-full uppercase tracking-widest">ESTA SESSÃO</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
