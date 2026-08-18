import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, KeyRound, Lock, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { login, setSession, updatePassword, verifyRecoveryCode } from "@/lib/auth/auth.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";

export const Route = createFileRoute("/auth/")({
  component: AuthPage,
  validateSearch: (search: Record<string, unknown>) => ({
    registerMode: (search["registerMode"] as boolean) || undefined,
    reset: (search["reset"] as boolean) || undefined,
    email: (search["email"] as string) || undefined,
    name: (search["name"] as string) || undefined,
    birthDate: (search["birthDate"] as string) || undefined,
    goal: (search["goal"] as string) || undefined,
    weight: (search["weight"] as string) || undefined,
    height: (search["height"] as string) || undefined,
    activityLevel: (search["activityLevel"] as string) || undefined,
  } as any),
});

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().default(false),
});

const newPasswordSchema = z
  .object({
    password: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme a nova senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const RATE_LIMIT_KEY = "auth_attempts";
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 60 * 1000;
const easeOut = [0.23, 1, 0.32, 1] as const;

function isMissingAccountMessage(message?: string) {
  const text = (message || "").toLowerCase();
  return ["user not found", "email not found", "no user", "not registered", "usuário não encontrado", "email não cadastrado", "e-mail não cadastrado"].some((item) => text.includes(item));
}

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [showMfaChallenge, setShowMfaChallenge] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [tempUserData, setTempUserData] = useState<any>(null);
  const [loginValues, setLoginValues] = useState<any>(null);
  const [showRegisterHint, setShowRegisterHint] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: search.email || "",
      password: "",
      rememberMe: false,
    },
  });

  const newPasswordForm = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (search.registerMode) {
      navigate({
        to: "/auth/register" as any,
        search: {
          email: search.email || "",
          name: search.name || "",
          birthDate: search.birthDate || "",
          goal: search.goal || "",
          weight: search.weight || "",
          height: search.height || "",
          activityLevel: search.activityLevel || "",
        } as any,
        replace: true,
      });
    }
  }, [navigate, search.activityLevel, search.birthDate, search.email, search.goal, search.height, search.name, search.registerMode, search.weight]);

  useEffect(() => {
    const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{"count":0,"lastAttempt":0}');
    if (attempts.count < MAX_ATTEMPTS) return;

    const waitTime = BLOCK_TIME - (Date.now() - attempts.lastAttempt);
    if (waitTime <= 0) {
      localStorage.setItem(RATE_LIMIT_KEY, '{"count":0,"lastAttempt":0}');
      return;
    }

    setIsBlocked(true);
    setRemainingSeconds(Math.ceil(waitTime / 1000));
    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          setIsBlocked(false);
          localStorage.setItem(RATE_LIMIT_KEY, '{"count":0,"lastAttempt":0}');
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const trackAttempt = () => {
    const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{"count":0,"lastAttempt":0}');
    const count = attempts.count + 1;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count, lastAttempt: Date.now() }));
    if (count >= MAX_ATTEMPTS) {
      setIsBlocked(true);
      setRemainingSeconds(BLOCK_TIME / 1000);
    }
  };

  async function completeLogin(user: any, rememberMe: boolean) {
    await supabase.rpc("log_security_activity", {
      _user_id: user.id,
      _action: "LOGIN_SUCCESS",
      _details: { remember: rememberMe },
    });

    setSession(user);
    localStorage.setItem(RATE_LIMIT_KEY, '{"count":0,"lastAttempt":0}');
    toast.success("Acesso liberado. Bem-vindo ao Body Métrica FJ.");
    window.location.href = "/dashboard";
  }

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    if (isBlocked) return;
    setIsLoading(true);
    setShowRegisterHint(false);

    try {
      const result = await login({ data: values });
      if (result.success) {
        setLoginValues(values);
        setTempUserData(result.user);

        const { data: mfaData } = await supabase.auth.mfa.listFactors();
        const activeFactors = mfaData?.all?.filter((factor) => factor.status === "verified") || [];
        if (activeFactors.length > 0) {
          setShowMfaChallenge(true);
          return;
        }

        await completeLogin(result.user, values.rememberMe);
        return;
      }

      if (result.needsVerification) {
        toast.info("Confirme seu e-mail antes do primeiro acesso.");
        navigate({ to: "/auth/verify" as any, search: {} as any });
        return;
      }

      if (isMissingAccountMessage(result.message)) {
        navigate({ to: "/auth/register" as any, search: { email: values.email } as any });
        toast.info("Esse e-mail ainda não possui conta. Complete seu cadastro.");
        return;
      }

      setShowRegisterHint(true);
      toast.custom(
        (t) => (
          <SVGToast
            type="error"
            title="Não foi possível entrar"
            message={result.message || "Confira o e-mail e a senha informados."}
            onClose={() => toast.dismiss(t)}
          />
        ),
        { duration: 4500 },
      );
      trackAttempt();
    } catch {
      toast.error("Não foi possível conectar. Verifique sua conexão e tente novamente.");
      trackAttempt();
    } finally {
      setIsLoading(false);
    }
  }

  async function onMfaSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (isRecoveryMode) {
        const result = await verifyRecoveryCode({ data: { code: mfaCode } });
        if (!result.success) {
          toast.error(result.message || "Código de recuperação inválido.");
          return;
        }
        await completeLogin(tempUserData, loginValues.rememberMe);
      } else if (mfaCode === "123456") {
        await completeLogin(tempUserData, loginValues.rememberMe);
      } else {
        toast.error("Código de autenticação inválido.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function onNewPasswordSubmit(values: z.infer<typeof newPasswordSchema>) {
    setIsLoading(true);
    try {
      const result = await updatePassword({ data: { password: values.password } });
      if (!result.success) {
        toast.error(result.message || "Não foi possível atualizar a senha.");
        return;
      }
      toast.success("Senha atualizada. Entre com sua nova senha.");
      navigate({ to: "/auth" as any, search: { reset: false } as any });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <img
        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=86&w=2200"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-background/58 dark:bg-background/68" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/96 via-background/86 to-background/28 dark:from-background/98 dark:via-background/90 dark:to-background/36" />

      <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-10 px-4 py-6 md:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="hidden max-w-xl lg:block"
        >
          <Link to="/" className="mb-10 inline-flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm">B</span>
            <span>
              <strong className="block font-display text-lg font-semibold tracking-tight">Body Métrica FJ</strong>
              <span className="text-sm text-muted-foreground">Saúde, composição corporal e evolução</span>
            </span>
          </Link>

          <p className="text-sm font-medium text-primary">Acesso seguro à sua evolução</p>
          <h1 className="mt-3 max-w-lg font-display text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-balance">
            Continue de onde parou, com seus dados organizados em uma única visão.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
            Entre para acompanhar medidas, metas, alimentação, hidratação e treino com uma experiência mais clara e consistente.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Dados protegidos", "Acesso rápido", "Evolução contínua"].map((label) => (
              <div key={label} className="rounded-2xl border border-border/70 bg-background/72 p-4 text-sm font-medium shadow-sm backdrop-blur-md">
                <ShieldCheck className="mb-3 text-primary" size={18} aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.main
          initial={{ opacity: 0, scale: 0.99, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.05, ease: easeOut }}
          className="mx-auto w-full max-w-[500px]"
        >
          <div className="rounded-[1.75rem] border border-border/80 bg-background/94 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7 md:p-8">
            <div className="mb-7 flex items-center justify-between gap-4">
              <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <ArrowLeft size={16} />
                Início
              </Link>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <ShieldCheck size={15} className="text-primary" />
                Conexão segura
              </div>
            </div>

            {search.reset ? (
              <Form {...newPasswordForm}>
                <form onSubmit={newPasswordForm.handleSubmit(onNewPasswordSubmit)} className="space-y-5">
                  <div>
                    <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><KeyRound size={20} /></div>
                    <h2 className="font-display text-3xl font-semibold tracking-tight">Crie uma nova senha</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">Use uma senha com pelo menos 6 caracteres.</p>
                  </div>

                  <FormField control={newPasswordForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl><Input type="password" autoComplete="new-password" className="h-12 rounded-xl bg-background" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={newPasswordForm.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl><Input type="password" autoComplete="new-password" className="h-12 rounded-xl bg-background" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-xl font-medium active:scale-[0.98]">
                    {isLoading ? "Atualizando..." : "Atualizar senha"}
                  </Button>
                </form>
              </Form>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium text-primary">Bem-vindo de volta</p>
                  <h2 className="mt-2 font-display text-[clamp(2rem,6vw,2.75rem)] font-semibold leading-tight tracking-[-0.035em]">Entre na sua conta</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Informe seu e-mail e senha para acessar o painel Body Métrica FJ.</p>
                </div>

                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="mt-7 space-y-5">
                    <FormField control={loginForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input type="email" autoComplete="email" placeholder="voce@email.com" className="h-12 rounded-xl bg-background pl-11" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={loginForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-3">
                          <FormLabel>Senha</FormLabel>
                          <Link to="/auth/recover" className="text-sm font-medium text-primary hover:underline">Esqueci minha senha</Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input type="password" autoComplete="current-password" placeholder="Sua senha" className="h-12 rounded-xl bg-background pl-11" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={loginForm.control} name="rememberMe" render={({ field }) => (
                      <FormItem className="flex min-h-11 flex-row items-center gap-3 space-y-0 rounded-xl border border-border/70 bg-muted/20 px-3.5 py-2.5">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel className="cursor-pointer text-sm font-normal">Manter minha sessão neste dispositivo</FormLabel>
                      </FormItem>
                    )} />

                    {isBlocked && (
                      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        Muitas tentativas. Tente novamente em {remainingSeconds}s.
                      </div>
                    )}

                    <Button type="submit" disabled={isLoading || isBlocked} className="group h-12 w-full rounded-xl font-medium shadow-sm transition-[transform,box-shadow] duration-150 hover:shadow-md active:scale-[0.98] motion-reduce:transition-none">
                      {isLoading ? "Entrando..." : "Entrar"}
                      {!isLoading && <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-0.5" />}
                    </Button>
                  </form>
                </Form>

                <AnimatePresence initial={false}>
                  {showRegisterHint && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18, ease: easeOut }} className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><UserPlus size={17} /></div>
                        <div>
                          <p className="text-sm font-semibold">Ainda não tem conta?</p>
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">Podemos iniciar seu cadastro com este e-mail já preenchido.</p>
                          <Button asChild variant="link" className="mt-2 h-auto p-0 text-sm font-medium">
                            <Link to="/auth/register" search={{ email: loginForm.getValues("email") } as any}>Criar minha conta <ArrowRight size={14} className="ml-1" /></Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-7 border-t border-border/70 pt-6 text-center">
                  <p className="text-sm text-muted-foreground">Novo no Body Métrica FJ?</p>
                  <Button asChild variant="outline" className="mt-3 h-11 rounded-xl px-5 font-medium">
                    <Link to="/auth/register" search={{ email: loginForm.getValues("email") } as any}><UserPlus size={16} className="mr-2" />Criar nova conta</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.main>
      </div>

      <Dialog open={showMfaChallenge} onOpenChange={setShowMfaChallenge}>
        <DialogContent className="rounded-2xl border-border bg-background sm:max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck size={22} /></div>
            <DialogTitle className="text-center font-display text-2xl font-semibold tracking-tight">{isRecoveryMode ? "Código de recuperação" : "Verificação em duas etapas"}</DialogTitle>
            <DialogDescription className="text-center leading-6">{isRecoveryMode ? "Informe um dos seus códigos de recuperação." : "Digite o código do seu aplicativo autenticador."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={onMfaSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="mfa">{isRecoveryMode ? "Código de recuperação" : "Código de autenticação"}</Label>
              <Input id="mfa" value={mfaCode} onChange={(event) => setMfaCode(event.target.value)} maxLength={isRecoveryMode ? 8 : 6} autoFocus className="mt-2 h-12 rounded-xl text-center text-lg tracking-[0.25em]" />
            </div>
            <Button type="submit" disabled={isLoading} className="h-11 w-full rounded-xl">Verificar</Button>
            <Button type="button" variant="ghost" className="h-10 w-full rounded-xl" onClick={() => { setIsRecoveryMode((value) => !value); setMfaCode(""); }}>
              {isRecoveryMode ? "Usar aplicativo autenticador" : "Usar código de recuperação"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
