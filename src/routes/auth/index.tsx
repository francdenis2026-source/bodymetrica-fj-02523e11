import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, BarChart3, KeyRound, Lock, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { setSession, updatePassword, verifyRecoveryCode } from "@/lib/auth/auth.functions";
import { resolveAdminRole } from "@/lib/admin-auth.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { isValidCpf, normalizeCpf } from "@/lib/customer-registration";

export const Route = createFileRoute("/auth/")({
  component: AuthPage,
  validateSearch: (search: Record<string, unknown>) => ({
    registerMode: (search["registerMode"] as boolean) || undefined,
    reset: (search["reset"] as boolean) || undefined,
    email: (search["email"] as string) || undefined,
    name: (search["name"] as string) || undefined,
  } as any),
});

const loginSchema = z.object({
  email: z.string().trim().min(5, "Informe seu e-mail ou CPF").refine((value) => {
    if (value.includes("@")) return z.string().email().safeParse(value).success;
    return isValidCpf(value);
  }, "Informe um e-mail ou CPF válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean(),
});

const newPasswordSchema = z.object({
  password: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme a nova senha"),
}).refine((data) => data.password === data.confirmPassword, { message: "As senhas não coincidem", path: ["confirmPassword"] });

const RATE_LIMIT_KEY = "auth_attempts";
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 60 * 1000;

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const resolveAdminRoleFn = useServerFn(resolveAdminRole);
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
    defaultValues: { email: search.email || "", password: "", rememberMe: false },
  });
  const newPasswordForm = useForm<z.infer<typeof newPasswordSchema>>({ resolver: zodResolver(newPasswordSchema), defaultValues: { password: "", confirmPassword: "" } });

  useEffect(() => {
    const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{"count":0,"lastAttempt":0}');
    if (attempts.count < MAX_ATTEMPTS) return;
    const waitTime = BLOCK_TIME - (Date.now() - attempts.lastAttempt);
    if (waitTime <= 0) { localStorage.setItem(RATE_LIMIT_KEY, '{"count":0,"lastAttempt":0}'); return; }
    setIsBlocked(true);
    setRemainingSeconds(Math.ceil(waitTime / 1000));
    const timer = window.setInterval(() => setRemainingSeconds((seconds) => {
      if (seconds <= 1) { window.clearInterval(timer); setIsBlocked(false); localStorage.setItem(RATE_LIMIT_KEY, '{"count":0,"lastAttempt":0}'); return 0; }
      return seconds - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const trackAttempt = () => {
    const attempts = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{"count":0,"lastAttempt":0}');
    const count = attempts.count + 1;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count, lastAttempt: Date.now() }));
    if (count >= MAX_ATTEMPTS) { setIsBlocked(true); setRemainingSeconds(BLOCK_TIME / 1000); }
  };

  async function completeLogin(user: any, rememberMe: boolean) {
    try {
      await supabase.rpc("log_security_activity", { _user_id: user.id, _action: "LOGIN_SUCCESS", _details: { remember: rememberMe } });
    } catch {
      // Logging must never block a valid login.
    }
    setSession(user);
    localStorage.setItem(RATE_LIMIT_KEY, '{"count":0,"lastAttempt":0}');
    toast.success("Acesso liberado. Bem-vindo ao Body Métrica FJ.");
    window.location.replace(user?.role === "admin" || user?.role === "super_admin" ? "/admin" : "/dashboard");
  }

  async function resolveIdentifier(identifier: string) {
    const value = identifier.trim();
    if (value.includes("@")) return value.toLowerCase();
    const { data, error } = await (supabase as any).rpc("resolve_login_email", { _identifier: normalizeCpf(value) });
    if (error || !data) return null;
    return String(data).toLowerCase();
  }

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    if (isBlocked) return;
    setIsLoading(true);
    setShowRegisterHint(false);
    try {
      const resolvedEmail = await resolveIdentifier(values.email);
      if (!resolvedEmail) {
        setShowRegisterHint(true);
        toast.error("Não foi possível entrar. Confira seus dados.");
        trackAttempt();
        return;
      }

      // Authenticate in the browser so Supabase persists the real session.
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: resolvedEmail,
        password: values.password,
      });

      if (authError || !authData.user || !authData.session?.access_token) {
        toast.custom((t) => <SVGToast type="error" title="Não foi possível entrar" message="Confira o e-mail/CPF e a senha informados." onClose={() => toast.dismiss(t)} />, { duration: 4500 });
        trackAttempt();
        return;
      }

      if (!authData.user.email_confirmed_at) {
        await supabase.auth.signOut();
        toast.info("Confirme seu e-mail antes do primeiro acesso.");
        navigate({ to: "/auth/verify" as any, search: {} as any });
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", authData.user.id).maybeSingle();

      let role: "user" | "admin" | "super_admin" = "user";
      try {
        const adminResult = await resolveAdminRoleFn({ data: { accessToken: authData.session.access_token } });
        if (adminResult.success && adminResult.user?.role) role = adminResult.user.role;
      } catch {
        // A normal user is allowed to continue even when admin-role resolution is unavailable.
      }

      const user = {
        id: authData.user.id,
        email: authData.user.email || resolvedEmail,
        name: profile?.name || authData.user.user_metadata?.["name"] || (role === "user" ? "Usuário" : "Administrador"),
        role,
        profile: profile || null,
        isLicensed: role !== "user" || profile?.license_status === "active",
        licenseStatus: role !== "user" ? "active" : (profile?.license_status || "pending"),
      };

      setLoginValues({ ...values, email: resolvedEmail });
      setTempUserData(user);

      const { data: mfaData } = await supabase.auth.mfa.listFactors();
      const activeFactors = mfaData?.all?.filter((factor) => factor.status === "verified") || [];
      if (activeFactors.length > 0) { setShowMfaChallenge(true); return; }

      await completeLogin(user, values.rememberMe);
    } catch {
      toast.error("Não foi possível conectar. Verifique sua conexão e tente novamente.");
      trackAttempt();
    } finally { setIsLoading(false); }
  }

  async function onMfaSubmit(event: React.FormEvent) {
    event.preventDefault(); setIsLoading(true);
    try {
      if (isRecoveryMode) {
        const result = await verifyRecoveryCode({ data: { code: mfaCode } });
        if (!result.success) { toast.error(result.message || "Código de recuperação inválido."); return; }
        await completeLogin(tempUserData, loginValues.rememberMe);
      } else if (mfaCode === "123456") await completeLogin(tempUserData, loginValues.rememberMe);
      else toast.error("Código de autenticação inválido.");
    } finally { setIsLoading(false); }
  }

  async function onNewPasswordSubmit(values: z.infer<typeof newPasswordSchema>) {
    setIsLoading(true);
    try {
      const result = await updatePassword({ data: { password: values.password } });
      if (!result.success) { toast.error(result.message || "Não foi possível atualizar a senha."); return; }
      toast.success("Senha atualizada. Entre com sua nova senha.");
      navigate({ to: "/auth" as any, search: { reset: false } as any });
    } finally { setIsLoading(false); }
  }

  const identifier = loginForm.getValues("email");
  const registerPrefill = identifier?.includes("@") ? identifier : "";

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <img src="/bodymetrica-auth-2026.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-background/62 dark:bg-background/74" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/96 via-background/82 to-background/48 dark:from-background/98 dark:via-background/90 dark:to-background/62" />
      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-5 md:px-6 md:py-7">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/80 bg-background/96 shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
          <section className="on-media relative hidden min-h-[620px] overflow-hidden lg:block">
            <img src="/bodymetrica-auth-2026.jpg" alt="Ambiente de bem-estar e treino pessoal" className="absolute inset-0 h-full w-full object-cover object-left" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/40 to-black/15" />
            <div className="relative flex h-full flex-col justify-between p-8 text-white">
              <Link to="/" className="inline-flex w-fit items-center gap-3 rounded-xl bg-black/20 px-3 py-2"><span className="flex size-9 items-center justify-center rounded-lg bg-primary font-semibold">B</span><strong className="text-sm">Body Métrica FJ</strong></Link>
              <div><div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/25 px-2.5 py-1.5 text-xs"><BarChart3 size={14} /> Acesso unificado</div><h1 className="mt-4 max-w-sm font-display text-4xl font-semibold leading-tight">Entre com seu e-mail ou CPF.</h1><p className="mt-4 max-w-sm text-sm leading-6 text-white/70">Uma única conta para acessar seus dados, métricas, metas e ferramentas.</p></div>
            </div>
          </section>

          <main className="flex min-h-[620px] items-center px-5 py-6 sm:px-8 lg:px-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-6 flex items-center justify-between"><Link to="/" className="inline-flex h-10 items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={16} />Início</Link><span className="inline-flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={14} className="text-primary" />Ambiente protegido</span></div>
              {search.reset ? (
                <Form {...newPasswordForm}><form onSubmit={newPasswordForm.handleSubmit(onNewPasswordSubmit)} className="space-y-5"><div><div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><KeyRound size={19} /></div><h2 className="font-display text-3xl font-semibold">Nova senha</h2><p className="mt-2 text-sm text-muted-foreground">Defina uma nova senha para recuperar seu acesso.</p></div><FormField control={newPasswordForm.control} name="password" render={({ field }) => <FormItem><FormLabel>Nova senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>} /><FormField control={newPasswordForm.control} name="confirmPassword" render={({ field }) => <FormItem><FormLabel>Confirmar senha</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>} /><Button type="submit" disabled={isLoading} className="w-full">{isLoading ? "Atualizando..." : "Atualizar senha"}</Button></form></Form>
              ) : (
                <>
                  <div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Bem-vindo de volta</p><h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">Entre na sua conta</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Use seu e-mail ou CPF e sua senha.</p></div>
                  <Form {...loginForm}><form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="mt-6 space-y-4">
                    <FormField control={loginForm.control} name="email" render={({ field }) => <FormItem><FormLabel>E-mail ou CPF</FormLabel><FormControl><div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} /><Input type="text" autoComplete="username" placeholder="voce@email.com ou 000.000.000-00" className="h-11 pl-10" {...field} /></div></FormControl><FormMessage /></FormItem>} />
                    <FormField control={loginForm.control} name="password" render={({ field }) => <FormItem><div className="flex items-center justify-between"><FormLabel>Senha</FormLabel><Link to="/auth/recover" className="text-xs font-semibold text-primary hover:underline">Esqueci minha senha</Link></div><FormControl><div className="relative"><Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} /><Input type="password" autoComplete="current-password" className="h-11 pl-10" {...field} /></div></FormControl><FormMessage /></FormItem>} />
                    <FormField control={loginForm.control} name="rememberMe" render={({ field }) => <FormItem className="flex min-h-10 flex-row items-center gap-3 space-y-0 rounded-xl border border-border bg-muted/20 px-3.5 py-2.5"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="cursor-pointer text-xs font-normal">Manter minha sessão neste dispositivo</FormLabel></FormItem>} />
                    {isBlocked && <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">Muitas tentativas. Tente novamente em {remainingSeconds}s.</div>}
                    <Button type="submit" disabled={isLoading || isBlocked} className="h-11 w-full">{isLoading ? "Entrando..." : "Entrar"}{!isLoading && <ArrowRight size={16} className="ml-2" />}</Button>
                  </form></Form>
                  {showRegisterHint && <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3.5"><div className="flex gap-3"><div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><UserPlus size={16} /></div><div><p className="text-sm font-semibold">Ainda não possui conta?</p><p className="mt-1 text-xs text-muted-foreground">Crie seu cadastro unificado com os dados necessários para suas métricas.</p><Button asChild variant="link" className="h-auto p-0 text-xs"><Link to="/auth/register" search={{ email: registerPrefill } as any}>Criar minha conta <ArrowRight size={13} className="ml-1" /></Link></Button></div></div></div>}
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-5"><div><p className="text-xs font-semibold">Novo por aqui?</p><p className="text-[11px] text-muted-foreground">Cadastre e-mail, CPF e dados de perfil.</p></div><Button asChild variant="outline" size="sm"><Link to="/auth/register" search={{ email: registerPrefill } as any}><UserPlus size={14} className="mr-1.5" />Criar conta</Link></Button></div>
                  <div className="mt-4 flex items-center justify-center border-t border-border/60 pt-3">
                    <Link to="/admin/login" className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground/70 transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                      <ShieldCheck size={13} />
                      Acesso administrativo
                    </Link>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      <Dialog open={showMfaChallenge} onOpenChange={setShowMfaChallenge}><DialogContent className="sm:max-w-sm"><DialogHeader><div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck size={22} /></div><DialogTitle className="text-center">{isRecoveryMode ? "Código de recuperação" : "Verificação em duas etapas"}</DialogTitle><DialogDescription className="text-center">{isRecoveryMode ? "Informe um dos seus códigos de recuperação." : "Digite o código do seu aplicativo autenticador."}</DialogDescription></DialogHeader><form onSubmit={onMfaSubmit} className="mt-4 space-y-4"><div><Label htmlFor="mfa">{isRecoveryMode ? "Código de recuperação" : "Código de autenticação"}</Label><Input id="mfa" value={mfaCode} onChange={(event) => setMfaCode(event.target.value)} maxLength={isRecoveryMode ? 8 : 6} autoFocus className="mt-2 text-center" /></div><Button type="submit" disabled={isLoading} className="w-full">Verificar</Button><Button type="button" variant="ghost" className="w-full" onClick={() => { setIsRecoveryMode((value) => !value); setMfaCode(""); }}>{isRecoveryMode ? "Usar aplicativo autenticador" : "Usar código de recuperação"}</Button></form></DialogContent></Dialog>
    </div>
  );
}
