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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { login, register, setSession, requestPasswordReset } from "@/lib/auth/auth.functions";
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
});

const registerSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(3, "Nome muito curto"),
});

const resetSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

const RATE_LIMIT_KEY = 'auth_attempts';
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 60 * 1000; // 1 minute

function AuthPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const [isRegistering, setIsRegistering] = useState(searchParams.registerMode);
  const [isResetting, setIsResetting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
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

  useEffect(() => {
    setIsRegistering(searchParams.registerMode);
  }, [searchParams.registerMode]);

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

      <div className="relative z-10 w-full max-w-md px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-6 mb-12">
          <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all mb-4 backdrop-blur-3xl bg-black/40 px-6 py-2 rounded-full border border-white/10 hover:border-primary/50">
            <ArrowLeft size={14} className="mr-2" />
            VOLTAR AO INÍCIO
          </Link>
          <div className="mx-auto w-24 h-24 bg-brand-gradient rounded-[2rem] flex items-center justify-center text-primary-foreground font-black text-4xl shadow-2xl border-2 border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            B
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-black font-display tracking-tighter text-white uppercase italic leading-none">
              BODY <span className="text-gradient-brand">MÉTTRICA</span>
            </h1>
            <p className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] mt-4">PERFORMANCE & RESULTADOS</p>
          </div>
        </div>

        <Card className="surface border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-black/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="space-y-2 pb-10 border-b border-white/5 pt-12">
            <CardTitle className="text-3xl font-black text-white text-center uppercase tracking-[0.2em] italic">
              {isResetting ? "RECUPERAÇÃO" : isRegistering ? "CADASTRO" : "AUTENTICAÇÃO"}
            </CardTitle>
            <CardDescription className="font-bold text-white/40 text-center uppercase text-[10px] tracking-widest px-4">
              {isBlocked ? `ACESSO BLOQUEADO POR ${remainingSeconds}s` :
               isResetting ? "SOLICITE O LINK DE REDEFINIÇÃO" : 
               isRegistering ? "CRIE SUA CONTA PROFISSIONAL" : 
               "INSIRA SEUS DADOS DE ACESSO PROTEGIDO"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            {isResetting ? (
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-primary ml-1">E-MAIL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="seu@email.com" 
                            className="h-16 text-lg font-black bg-white/5 border-white/10 rounded-2xl px-6 text-white"
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <Button type="button" variant="ghost" className="flex-1 h-16 font-black uppercase text-white/40" onClick={() => setIsResetting(false)}>
                      VOLTAR
                    </Button>
                    <Button type="submit" className="flex-[2] h-16 text-base font-black uppercase tracking-[0.2em] bg-brand-gradient rounded-2xl" disabled={isLoading}>
                      {isLoading ? "ENVIANDO..." : "ENVIAR LINK"}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : isRegistering ? (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-primary ml-1">NOME COMPLETO</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Seu Nome" 
                            className="h-16 text-lg font-black bg-white/5 border-white/10 rounded-2xl px-6 text-white"
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-primary ml-1">E-MAIL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="seu@email.com" 
                            className="h-16 text-lg font-black bg-white/5 border-white/10 rounded-2xl px-6 text-white"
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-primary ml-1">SENHA (MÍN. 6)</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••" 
                            className="h-16 text-lg font-black bg-white/5 border-white/10 rounded-2xl px-6 text-white"
                            {...field} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-16 text-base font-black uppercase tracking-[0.2em] bg-brand-gradient hover:scale-[1.02] transition-all shadow-2xl shadow-primary/30 border-none mt-4 rounded-2xl" disabled={isLoading}>
                    {isLoading ? "CADASTRANDO..." : "CRIAR CONTA"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-primary ml-1">E-MAIL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="seu@email.com" 
                            className="h-16 text-lg font-black bg-white/5 border-white/10 rounded-2xl px-6 text-white"
                            {...field} 
                            disabled={isLoading || isBlocked}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-primary ml-1">SENHA</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••" 
                            className="h-16 text-lg font-black bg-white/5 border-white/10 rounded-2xl px-6 text-white"
                            {...field} 
                            disabled={isLoading || isBlocked}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold text-destructive uppercase tracking-widest" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-16 text-base font-black uppercase tracking-[0.2em] bg-brand-gradient hover:scale-[1.02] transition-all shadow-2xl shadow-primary/30 border-none mt-4 rounded-2xl" disabled={isLoading || isBlocked}>
                    {isLoading ? "PROCESSANDO..." : "ACESSAR PLATAFORMA"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-8 border-t border-white/5 pt-10 pb-12 bg-white/[0.02]">
            {!isResetting && (
              <>
                <div className="flex items-start gap-4 text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                  <ShieldCheck className="text-primary shrink-0" size={20} />
                  <p>
                    Protocolo de segurança militar ativo. Criptografia de ponta a ponta.
                  </p>
                </div>
                
                <div className="w-full space-y-4">
                  <p className="text-center text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
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
                      className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all underline decoration-white/10 underline-offset-4"
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
        
        <div className="mt-8 text-center space-y-1">
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
            dev Franc D'nis Feijó, AC
          </p>
          <p className="text-[10px] text-white/30 font-medium">
            © {new Date().getFullYear()} Body Métrica FJ. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
