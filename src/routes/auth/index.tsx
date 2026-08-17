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
import { login, register, setSession, requestPasswordReset, updatePassword } from "@/lib/auth/auth.functions";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { ShieldCheck, ArrowLeft, Mail, UserPlus, KeyRound, Lock } from "lucide-react";
import { ResponsiveHero } from "@/components/responsive-hero";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/")({
  component: AuthPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      registerMode: (search['registerMode'] as boolean) || false,
      reset: (search['reset'] as boolean) || false,
      name: (search['name'] as string) || "",
      birthDate: (search['birthDate'] as string) || "",
      goal: (search['goal'] as string) || "",
      weight: (search['weight'] as string) || "",
      height: (search['height'] as string) || "",
      activityLevel: (search['activityLevel'] as string) || "",
    };
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
  const [isResetting, setIsResetting] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(searchParams.reset);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false } as any,
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      email: "", 
      password: "", 
      name: searchParams.name || "" 
    },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
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

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    if (isBlocked) return;
    setIsLoading(true);
    try {
      const result = await login({ data: values });
      if (result.success) {
        setSession(result.user);
        localStorage.setItem(RATE_LIMIT_KEY, '{"count": 0, "lastAttempt": 0}');
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title="BEM-VINDO"
            message="Sessão autenticada. Acesso liberado à suíte Body Métrica FJ."
            onClose={() => toast.dismiss(t)}
          />
        ));
        
        if (!result.user.isLicensed) {
          toast.info("Acesse Ajustes para ativar sua licença e liberar o sistema.");
        }
        
        window.location.href = "/dashboard";
      } else {
        toast.custom((t) => (
          <SVGToast 
            type="error"
            title="FALHA NA AUTENTICAÇÃO"
            message={result.message}
            onClose={() => toast.dismiss(t)}
          />
        ));
        if (result.needsVerification) {
          // Store user email for resend functionality
          const { data } = await supabase.auth.getUser();
          navigate({ to: "/auth/verify" as any });
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
        toast.success(result.message || "Cadastro realizado! Verifique seu e-mail.");
        navigate({ to: "/auth/verify" as any });
      } else {
        toast.error(result.message || "Erro ao cadastrar.");
      }
    } catch (error) {
      toast.error("Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetSubmit(values: z.infer<typeof resetSchema>) {
    setIsLoading(true);
    try {
      const result = await requestPasswordReset({ data: values });
      if (result.success) {
        toast.success(result.message);
        setIsResetting(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro na recuperação. Tente novamente.");
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
    <div className="min-h-screen flex items-center justify-center relative p-0 overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1600"
          alt="Auth background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-primary/20" />
      </div>

        {/* Removed redundant hero overlay that was causing layout issues */}

      <div className="relative z-10 w-full max-w-sm px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4 mb-6">
          <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all mb-2 backdrop-blur-3xl bg-black/40 px-4 py-1.5 rounded-full border border-white/10 hover:border-primary/50">
            <ArrowLeft size={12} className="mr-2" />
            VOLTAR AO INÍCIO
          </Link>
          <div className="mx-auto w-16 h-16 bg-brand-gradient rounded-[1.25rem] flex items-center justify-center text-primary-foreground font-black text-2xl shadow-2xl border-2 border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            B
          </div>
          <div>
            <h1 className="text-4xl font-black font-display tracking-tighter text-white uppercase italic leading-none">
              BODY <span className="text-gradient-brand">MÉTTRICA</span>
            </h1>
            <p className="text-white/60 font-black uppercase tracking-[0.3em] text-[8px] mt-2">PERFORMANCE & RESULTADOS</p>
          </div>
        </div>

        <Card className="surface border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-black/60 backdrop-blur-3xl rounded-[2rem] overflow-hidden">
          <CardHeader className="space-y-1 pb-6 border-b border-white/5 pt-8">
            <CardTitle className="text-xl font-black text-white text-center uppercase tracking-[0.2em] italic">
              {isUpdatingPassword ? "NOVA SENHA" : isResetting ? "RECUPERAÇÃO" : isRegistering ? "CADASTRO" : "AUTENTICAÇÃO"}
            </CardTitle>
            <CardDescription className="font-bold text-white/40 text-center uppercase text-[8px] tracking-widest px-4">
              {isBlocked ? `ACESSO BLOQUEADO POR ${remainingSeconds}s` :
               isUpdatingPassword ? "DEFINA SUA NOVA SENHA DE ACESSO" :
               isResetting ? "SOLICITE O LINK DE REDEFINIÇÃO" : 
               isRegistering ? "CRIE SUA CONTA PROFISSIONAL" : 
               "INSIRA SEUS DADOS DE ACESSO PROTEGIDO"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {isUpdatingPassword ? (
              <Form {...newPasswordForm}>
                <form onSubmit={newPasswordForm.handleSubmit(onNewPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={newPasswordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[8px] uppercase tracking-[0.2em] text-primary ml-1">NOVA SENHA</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="••••••" 
                            className="h-12 text-base font-black bg-white/5 border-white/10 rounded-xl px-4 text-white"
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-[8px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={newPasswordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[8px] uppercase tracking-[0.2em] text-primary ml-1">CONFIRMAR SENHA</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="••••••" 
                            className="h-12 text-base font-black bg-white/5 border-white/10 rounded-xl px-4 text-white"
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-[8px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-[0.2em] bg-brand-gradient rounded-xl" disabled={isLoading}>
                    {isLoading ? "SALVANDO..." : "ATUALIZAR SENHA"}
                  </Button>
                </form>
              </Form>
            ) : isResetting ? (
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[8px] uppercase tracking-[0.2em] text-primary ml-1">E-MAIL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="seu@email.com" 
                            className="h-12 text-base font-black bg-white/5 border-white/10 rounded-xl px-4 text-white"
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-[8px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" className="flex-1 h-12 font-black uppercase text-white/40 text-[10px]" onClick={() => setIsResetting(false)}>
                      VOLTAR
                    </Button>
                    <Button type="submit" className="flex-[2] h-12 text-sm font-black uppercase tracking-[0.2em] bg-brand-gradient rounded-xl" disabled={isLoading}>
                      {isLoading ? "ENVIANDO..." : "ENVIAR LINK"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : isRegistering ? (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[8px] uppercase tracking-[0.2em] text-primary ml-1">NOME COMPLETO</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Seu Nome" 
                            className="h-12 text-base font-black bg-white/5 border-white/10 rounded-xl px-4 text-white"
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-[8px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[8px] uppercase tracking-[0.2em] text-primary ml-1">E-MAIL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="seu@email.com" 
                            className="h-12 text-base font-black bg-white/5 border-white/10 rounded-xl px-4 text-white"
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-[8px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[8px] uppercase tracking-[0.2em] text-primary ml-1">SENHA (MÍN. 6)</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••" 
                            className="h-12 text-base font-black bg-white/5 border-white/10 rounded-xl px-4 text-white"
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-[8px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-[0.2em] bg-brand-gradient hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 border-none mt-2 rounded-xl" disabled={isLoading}>
                    {isLoading ? "CADASTRANDO..." : "CRIAR CONTA"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[8px] uppercase tracking-[0.2em] text-primary ml-1">E-MAIL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="seu@email.com" 
                            className="h-12 text-base font-black bg-white/5 border-white/10 rounded-xl px-4 text-white"
                            {...field} 
                            disabled={isLoading || isBlocked}
                          />
                        </FormControl>
                        <FormMessage className="text-[8px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[8px] uppercase tracking-[0.2em] text-primary ml-1">SENHA</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••" 
                            className="h-12 text-base font-black bg-white/5 border-white/10 rounded-xl px-4 text-white"
                            {...field} 
                            disabled={isLoading || isBlocked}
                          />
                        </FormControl>
                        <FormMessage className="text-[8px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 px-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-white/20 bg-white/5"
                          />
                        </FormControl>
                        <FormLabel className="text-[8px] font-black uppercase tracking-widest text-white/40 cursor-pointer">
                          LEMBRAR DE MIM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-[0.2em] bg-brand-gradient hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 border-none mt-2 rounded-xl" disabled={isLoading || isBlocked}>
                    {isLoading ? "PROCESSANDO..." : "ACESSAR PLATAFORMA"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 border-t border-white/5 pt-6 pb-8 bg-white/[0.02]">
            {!isResetting && (
              <>
                <div className="flex items-start gap-3 text-[8px] text-white/40 leading-relaxed font-bold uppercase tracking-widest px-2">
                  <ShieldCheck className="text-primary shrink-0" size={16} />
                  <p>
                    Protocolo de segurança militar ativo. Criptografia de ponta a ponta.
                  </p>
                </div>
                
                <div className="w-full space-y-2">
                  <p className="text-center text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">
                    {isRegistering ? "JÁ POSSUI UMA CONTA?" : "NÃO POSSUI UMA CONTA?"}{" "}
                    <button 
                      onClick={() => setIsRegistering(!isRegistering)} 
                      className="text-primary hover:text-primary-foreground transition-all"
                    >
                      {isRegistering ? "ENTRAR AGORA" : "CADASTRAR AGORA"}
                    </button>
                  </p>
                  {!isRegistering && (
                    <button 
                      onClick={() => setIsResetting(true)}
                      className="w-full text-center text-[8px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all underline decoration-white/10 underline-offset-4"
                    >
                      RECUPERAR SENHA
                    </button>
                  )}
                </div>
              </>
            )}
            {isResetting && (
              <button 
                onClick={() => setIsResetting(false)}
                className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all"
              >
                VOLTAR PARA O LOGIN
              </button>
            )}
          </CardFooter>
        </Card>
        
        <div className="mt-6 text-center space-y-1">
          <p className="text-[8px] text-white/40 uppercase tracking-[0.2em] font-bold">
            dev Franc D'nis Feijó, AC
          </p>
          <p className="text-[8px] text-white/30 font-medium">
            © {new Date().getFullYear()} Body Métrica FJ. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
