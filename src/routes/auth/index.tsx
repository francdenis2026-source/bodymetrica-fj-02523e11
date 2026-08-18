import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { login, register, setSession, requestPasswordReset, updatePassword, verifyRecoveryCode } from "@/lib/auth/auth.functions";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { ShieldCheck, ArrowLeft, Mail, UserPlus, KeyRound, Lock, Info, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/")({
  component: AuthPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      registerMode: (search['registerMode'] as boolean) || undefined,
      reset: (search['reset'] as boolean) || undefined,
      name: (search['name'] as string) || undefined,
      birthDate: (search['birthDate'] as string) || undefined,
      goal: (search['goal'] as string) || undefined,
      weight: (search['weight'] as string) || undefined,
      height: (search['height'] as string) || undefined,
      activityLevel: (search['activityLevel'] as string) || undefined,
    } as any;
  },
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().default(false),
});

const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(3, "Nome muito curto"),
});

const resetSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

const newPasswordSchema = z.object({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const RATE_LIMIT_KEY = 'auth_attempts';
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 60 * 1000; // 1 minute

function AuthPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const [isRegistering, setIsRegistering] = useState(searchParams.registerMode);
  
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(searchParams.reset);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [showMfaChallenge, setShowMfaChallenge] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [tempUserData, setTempUserData] = useState<any>(null);
  const [loginValues, setLoginValues] = useState<any>(null);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false } as any,
  } as any);

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      email: "", 
      password: "", 
      name: searchParams.name || "" 
    },
  });

  const newPasswordForm = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    setIsRegistering(searchParams.registerMode);
    setIsUpdatingPassword(searchParams.reset);
  }, [searchParams.registerMode, searchParams.reset]);

  useEffect(() => {
    const attemptsStr = localStorage.getItem(RATE_LIMIT_KEY);
    const attempts = attemptsStr ? JSON.parse(attemptsStr) : { count: 0, lastAttempt: 0 };
    
    if (attempts.count >= MAX_ATTEMPTS) {
      const waitTime = BLOCK_TIME - (Date.now() - attempts.lastAttempt);
      if (waitTime > 0) {
        setIsBlocked(true);
        setRemainingSeconds(Math.ceil(waitTime / 1000));
        const timer = setInterval(() => {
          setRemainingSeconds(s => {
            if (s <= 1) {
              clearInterval(timer);
              setIsBlocked(false);
              localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 0, lastAttempt: 0 }));
              return 0;
            }
            return s - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      } else {
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 0, lastAttempt: 0 }));
      }
    }
    return undefined;
  }, []);

  const trackAttempt = () => {
    const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{"count": 0, "lastAttempt": 0}');
    const newCount = attempts.count + 1;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: newCount, lastAttempt: Date.now() }));
    if (newCount >= MAX_ATTEMPTS) {
      setIsBlocked(true);
      setRemainingSeconds(BLOCK_TIME / 1000);
    }
  };

  async function onLoginSubmit(values: any) {
    if (isBlocked) return;
    setIsLoading(true);
    try {
      const result = await login({ data: values });
      if (result.success) {
        setLoginValues(values);
        setTempUserData(result.user);

        const { data: mfaData } = await supabase.auth.mfa.listFactors();
        const activeFactors = mfaData?.all?.filter(f => f.status === 'verified') || [];

        if (activeFactors.length > 0) {
          setShowMfaChallenge(true);
          setIsLoading(false);
          return;
        }

        await completeLogin(result.user, values.rememberMe);
      } else {
        toast.custom((t) => (
          <SVGToast 
            type="error"
            title="FALHA NA AUTENTICAÇÃO"
            message={result.message}
            onClose={() => toast.dismiss(t)}
          />
        ), { duration: 5000 });
        if (result.needsVerification) {
          toast.custom((t) => (
            <SVGToast 
              type="info"
              title="VERIFIQUE SEU E-MAIL"
              message="Sua conta precisa ser confirmada via e-mail antes do primeiro acesso."
              onClose={() => toast.dismiss(t)}
            />
          ), { duration: 6000 });
          navigate({ to: "/auth/verify" as any, search: {} as any });
        } else {
          trackAttempt();
        }
      }
    } catch (error) {
      toast.error("Erro ao entrar. Verifique sua conexão.");
      trackAttempt();
    } finally {
      setIsLoading(false);
    }
  }

  async function completeLogin(user: any, rememberMe: boolean) {
    await supabase.rpc('log_security_activity', {
      _user_id: user.id,
      _action: 'LOGIN_SUCCESS',
      _details: { remember: rememberMe }
    });

    setSession(user);
    localStorage.setItem(RATE_LIMIT_KEY, '{"count": 0, "lastAttempt": 0}');
    toast.custom((t) => (
      <SVGToast 
        type="success"
        title="BEM-VINDO"
        message="Sessão autenticada. Acesso liberado à suíte Body Métrica FJ."
        onClose={() => toast.dismiss(t)}
      />
    ), { duration: 4000 });
    
    if (!user.isLicensed) {
      toast.info("Acesse Ajustes para ativar sua licença e liberar o sistema.");
    }
    
    window.location.href = "/dashboard";
  }

  async function onMfaSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRecoveryMode) {
        const res = await verifyRecoveryCode({ data: { code: mfaCode } });
        if (res.success) {
          await completeLogin(tempUserData, loginValues.rememberMe);
        } else {
          toast.custom((t) => (
            <SVGToast 
              type="error"
              title="CÓDIGO INVÁLIDO"
              message={res.message || "O código de recuperação não confere."}
              onClose={() => toast.dismiss(t)}
            />
          ), { duration: 4000 });
        }
      } else {
        // Simulation for now
        if (mfaCode === "123456") {
          await completeLogin(tempUserData, loginValues.rememberMe);
        } else {
          toast.custom((t) => (
            <SVGToast 
              type="error"
              title="CÓDIGO MFA INCORRETO"
              message="O código inserido não é válido. Tente novamente."
              onClose={() => toast.dismiss(t)}
            />
          ), { duration: 4000 });
        }
      }
    } catch (error) {
      toast.error("Erro na verificação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }


  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      const result = await register({ 
        data: { 
          ...values,
          goal: searchParams.goal,
          weight: searchParams.weight,
          height: searchParams.height,
          activityLevel: searchParams.activityLevel,
        } 
      });
      if (result.success) {
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title="CADASTRO REALIZADO"
            message={result.message || "Verifique seu e-mail para confirmar a conta."}
            onClose={() => toast.dismiss(t)}
          />
        ), { duration: 6000 });
        navigate({ to: "/auth/verify" as any, search: {} as any });
      } else {
        toast.custom((t) => (
          <SVGToast 
            type="error"
            title="ERRO NO CADASTRO"
            message={result.message || "Não foi possível criar sua conta."}
            onClose={() => toast.dismiss(t)}
          />
        ), { duration: 5000 });
      }
    } catch (error) {
      toast.error("Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }


  async function onNewPasswordSubmit(values: z.infer<typeof newPasswordSchema>) {
    setIsLoading(true);
    try {
      const result = await updatePassword({ data: { password: values.password } });
      if (result.success) {
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title="SENHA ATUALIZADA"
            message="Sua nova senha foi definida com sucesso. Faça login agora."
            onClose={() => toast.dismiss(t)}
          />
        ));
        setIsUpdatingPassword(false);
        navigate({ to: "/auth" as any, search: { reset: false } as any });
      } else {
        toast.custom((t) => (
          <SVGToast 
            type="error"
            title="ERRO"
            message={result.message}
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
    } catch (error) {
      toast.error("Erro ao atualizar senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 md:p-8 bg-[#050505] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      {/* MFA Challenge Dialog */}
      <Dialog open={showMfaChallenge} onOpenChange={setShowMfaChallenge}>
        <DialogContent className="surface border-white/10 rounded-[2.5rem] max-w-sm bg-black/90 backdrop-blur-2xl shadow-2xl">
          <DialogHeader>
            <div className="w-16 h-16 rounded-3xl bg-brand-gradient flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-primary/20">
              <ShieldCheck size={32} />
            </div>
            <DialogTitle className="text-center text-2xl font-black italic uppercase tracking-tighter text-white">
              {isRecoveryMode ? "RECUPERAÇÃO" : "SEGURANÇA 2FA"}
            </DialogTitle>
            <DialogDescription className="text-center text-[10px] font-bold uppercase tracking-widest text-white/40 px-4">
              {isRecoveryMode 
                ? "INSIRA UM DOS SEUS CÓDIGOS DE RECUPERAÇÃO DE 8 DÍGITOS." 
                : "INSIRA O CÓDIGO DE 6 DÍGITOS DO SEU APLICATIVO DE AUTENTICAÇÃO."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onMfaSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-primary ml-1 tracking-widest">
                {isRecoveryMode ? "CÓDIGO DE EMERGÊNCIA" : "CÓDIGO DE ACESSO"}
              </Label>
              <Input 
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder={isRecoveryMode ? "XXXXXXXX" : "000000"}
                className={cn(
                  "h-16 bg-white/5 border-white/10 rounded-2xl text-center text-3xl font-black text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none",
                  !isRecoveryMode && "tracking-[0.4em]"
                )}
                maxLength={isRecoveryMode ? 8 : 6}
                autoFocus
                aria-label={isRecoveryMode ? "Código de recuperação" : "Código de autenticação"}
              />
            </div>
            <div className="space-y-3">
              <Button 
                type="submit"
                disabled={isLoading || (isRecoveryMode ? mfaCode.length < 8 : mfaCode.length < 6)}
                className="w-full h-14 bg-brand-gradient border-none font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isLoading ? "VERIFICANDO..." : "VALIDAR ACESSO"}
              </Button>
              <Button 
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsRecoveryMode(!isRecoveryMode);
                  setMfaCode("");
                }}
                className="w-full text-[10px] font-black uppercase text-white/30 hover:text-white transition-colors"
              >
                {isRecoveryMode ? "USAR CÓDIGO DO APP" : "PROBLEMAS COM 2FA? USAR RECUPERAÇÃO"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        {/* Navigation & Brand Header */}
        <div className="w-full flex items-center justify-between mb-8 px-4">
          <Link to="/" search={{} as any} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="hidden sm:inline">INÍCIO</span>
          </Link>
          
          <div className="flex flex-col items-end">
             <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
              BODY <span className="text-primary">MÉTTRICA</span>
            </h1>
            <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">SISTEMA INTEGRADO</p>
          </div>
        </div>

        {/* Main "Window" Container */}
        <div className="w-full max-h-[85vh] bg-[#0A0A0A]/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500">
          {/* Decorative Window Top Bar */}
          <div className="h-10 bg-white/[0.03] border-b border-white/5 flex items-center justify-between px-6">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>
            <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
              SESSION_CORE_V1.0
            </div>
            <div className="w-12 h-1 bg-white/5 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto p-8 sm:p-10 relative custom-scrollbar">
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">PROCESSANDO...</p>
                </div>
              </div>
            )}

            {/* Context Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                {isUpdatingPassword ? "RESET_PWD" : isRegistering ? "CREATE_ACC" : "USER_AUTH"}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  {isBlocked ? `ACESSO BLOQUEADO: ${remainingSeconds}S` :
                   isUpdatingPassword ? "DEFINA SUA NOVA CHAVE DE ACESSO" :
                   isRegistering ? "REGISTRO DE NOVO OPERADOR" : 
                   "LOGIN DE SEGURANÇA REQUERIDO"}
                </p>
              </div>
            </div>

            {/* Forms Area */}
              <div className={cn("space-y-6 transition-all duration-300", isLoading && "opacity-20 blur-sm pointer-events-none")}>
                {isUpdatingPassword ? (
                  <Form {...newPasswordForm}>
                    <form onSubmit={newPasswordForm.handleSubmit(onNewPasswordSubmit)} className="space-y-5">
                      <FormField
                        control={newPasswordForm.control}
                        name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">NOVA SENHA</FormLabel>
                          <FormControl>
                              <Input 
                                type="password"
                                placeholder="••••••" 
                                className="h-14 bg-white/5 border-white/10 rounded-2xl px-5 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-black outline-none"
                                {...field} 
                                disabled={isLoading}
                                aria-required="true"
                              />
                          </FormControl>
                          <FormMessage className="text-[8px] font-bold text-red-500 uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newPasswordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">CONFIRMAR</FormLabel>
                          <FormControl>
                              <Input 
                                type="password"
                                placeholder="••••••" 
                                className="h-14 bg-white/5 border-white/10 rounded-2xl px-5 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-black outline-none"
                                {...field} 
                                disabled={isLoading}
                                aria-required="true"
                              />
                          </FormControl>
                          <FormMessage className="text-[8px] font-bold text-red-500 uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-14 bg-brand-gradient font-black uppercase tracking-widest rounded-2xl mt-2 shadow-lg shadow-primary/10" disabled={isLoading}>
                      {isLoading ? "SALVANDO..." : "ATUALIZAR CREDENCIAIS"}
                    </Button>
                  </form>
                </Form>
              ) : isRegistering ? (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">NOME IDENTIFICADOR</FormLabel>
                          <FormControl>
                              <Input 
                                placeholder="SEU NOME" 
                                className="h-14 bg-white/5 border-white/10 rounded-2xl px-5 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-black outline-none"
                                {...field} 
                                disabled={isLoading}
                                aria-required="true"
                              />
                          </FormControl>
                          <FormMessage className="text-[8px] font-bold text-red-500 uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">ENDEREÇO E-MAIL</FormLabel>
                          <FormControl>
                              <Input 
                                placeholder="seu@email.com" 
                                className="h-14 bg-white/5 border-white/10 rounded-2xl px-5 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-black outline-none"
                                {...field} 
                                disabled={isLoading}
                                aria-required="true"
                                type="email"
                              />
                          </FormControl>
                          <FormMessage className="text-[8px] font-bold text-red-500 uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">SENHA MESTRA</FormLabel>
                          <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••" 
                                className="h-14 bg-white/5 border-white/10 rounded-2xl px-5 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-black outline-none"
                                {...field} 
                                disabled={isLoading}
                                aria-required="true"
                              />
                          </FormControl>
                          <FormMessage className="text-[8px] font-bold text-red-500 uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-14 bg-brand-gradient font-black uppercase tracking-widest rounded-2xl mt-2 shadow-lg shadow-primary/10" disabled={isLoading}>
                      {isLoading ? "REGISTRANDO..." : "CRIAR REGISTRO"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit as any)} className="space-y-5">
                    <FormField
                      control={loginForm.control as any}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">ID OPERADOR</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="E-MAIL" 
                                className="h-14 bg-white/5 border-white/10 rounded-2xl px-5 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-black pl-12 outline-none"
                                {...field} 
                                disabled={isLoading || isBlocked}
                                aria-required="true"
                                type="email"
                              />
                              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[8px] font-bold text-red-500 uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control as any}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <div className="flex items-center justify-between ml-1">
                            <FormLabel className="text-[9px] font-black uppercase text-white/40 tracking-widest">SENHA ACESSO</FormLabel>
                            {!isRegistering && (
                              <Link 
                                to="/auth/recover" 
                                className="text-[8px] font-black uppercase tracking-widest text-primary/50 hover:text-primary transition-colors"
                              >
                                ESQUECI A SENHA
                              </Link>
                            )}
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="password" 
                                placeholder="••••••" 
                                className="h-14 bg-white/5 border-white/10 rounded-2xl px-5 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-black pl-12 outline-none"
                                {...field} 
                                disabled={isLoading || isBlocked}
                                aria-required="true"
                              />
                              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[8px] font-bold text-red-500 uppercase tracking-widest" />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between px-1">
                      <FormField
                        control={loginForm.control as any}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="border-white/20 bg-white/10 data-[state=checked]:bg-primary rounded-md w-4 h-4 focus:ring-2 focus:ring-primary/20 outline-none"
                                aria-label="Lembrar de mim"
                              />
                            </FormControl>
                            <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 cursor-pointer select-none">
                              MANTER SESSÃO
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" className="w-full h-14 bg-brand-gradient font-black uppercase tracking-widest rounded-2xl mt-2 shadow-xl shadow-primary/10 hover:scale-[1.01] active:scale-[0.98] transition-all" disabled={isLoading || isBlocked}>
                      {isLoading ? "CARREGANDO..." : "INICIAR CONEXÃO"}
                    </Button>
                  </form>
                </Form>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  {isRegistering ? <UserPlus size={14} /> : <LogIn size={14} />}
                </div>
                <div className="flex flex-col">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                    {isRegistering ? "JÁ POSSUI ACESSO?" : "NOVO POR AQUI?"}
                  </p>
                  <button 
                    onClick={() => setIsRegistering(!isRegistering)} 
                    className="text-[10px] font-black uppercase tracking-widest text-white hover:text-primary transition-all text-left"
                  >
                    {isRegistering ? "FAZER LOGIN" : "CRIAR CONTA"}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={10} className="text-primary" />
                  SSL_ENCRYPT
                </span>
                <span className="flex items-center gap-1.5">
                  <Info size={10} className="text-blue-500" />
                  MFA_READY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 flex flex-col items-center space-y-2 opacity-30 group hover:opacity-100 transition-opacity duration-500">
          <p className="text-[8px] text-white font-black uppercase tracking-[0.4em]">
            DEV FRANC D'NIS FEIJÓ, AC
          </p>
          <div className="flex items-center gap-4 text-[7px] text-white/60 font-bold uppercase tracking-widest">
            <span>© {new Date().getFullYear()} BM_SUITE</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span>FEIJÓ_ACRE_BR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
