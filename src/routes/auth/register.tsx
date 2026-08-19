import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Activity,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
  validateSearch: (search: Record<string, unknown>) => ({
    email: (search["email"] as string) || undefined,
    name: (search["name"] as string) || undefined,
  }),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(3, "Informe seu nome completo"),
    email: z.string().trim().email("Informe um e-mail válido"),
    password: z
      .string()
      .min(8, "Use pelo menos 8 caracteres")
      .regex(/[A-Za-z]/, "Inclua ao menos uma letra")
      .regex(/[0-9]/, "Inclua ao menos um número"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

function RegisterPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: search.name || "",
      email: search.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const passwordChecks = useMemo(
    () => [
      { label: "8+ caracteres", ok: password.length >= 8 },
      { label: "1 letra", ok: /[A-Za-z]/.test(password) },
      { label: "1 número", ok: /[0-9]/.test(password) },
    ],
    [password],
  );

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        options: {
          data: {
            name: values.name.trim(),
            full_name: values.name.trim(),
          },
        },
      });

      if (error) {
        const message = error.message.toLowerCase();
        if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
          toast.info("Este e-mail já possui uma conta. Entre com sua senha.");
          navigate({ to: "/auth" as any, search: { email: values.email } as any });
          return;
        }
        toast.error(error.message || "Não foi possível criar sua conta.");
        return;
      }

      if (!data.user) {
        toast.error("Não foi possível concluir o cadastro. Tente novamente.");
        return;
      }

      toast.success("Conta criada. Confirme seu e-mail para liberar o primeiro acesso.");
      navigate({ to: "/auth/verify" as any, search: {} as any });
    } catch {
      toast.error("Não foi possível concluir o cadastro. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setIsGoogleLoading(true);
    try {
      const redirectTo = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (error) toast.error("Não foi possível iniciar o cadastro com Google.");
    } catch {
      toast.error("O cadastro com Google não está disponível no momento.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-background text-foreground">
      <img
        src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=86&w=2200"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-background/62 dark:bg-background/72" />
      <div className="absolute inset-0 bg-gradient-to-br from-background/97 via-background/88 to-background/58 dark:from-background dark:via-background/94 dark:to-background/70" />

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-4 md:px-6 md:py-6">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border/80 bg-background/96 shadow-2xl shadow-black/15 lg:grid-cols-[0.88fr_1.12fr]">
          <section className="relative hidden min-h-[640px] overflow-hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=88&w=1400"
              alt="Pessoa em rotina de treino e bem-estar"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/42 to-black/10" />

            <div className="relative flex h-full flex-col justify-between p-7 text-white md:p-8">
              <Link to="/" className="inline-flex w-fit items-center gap-3 rounded-xl bg-black/20 px-3 py-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Activity size={18} />
                </span>
                <span>
                  <strong className="block text-sm font-semibold">Body Métrica FJ</strong>
                  <span className="text-[11px] text-white/65">Sua evolução começa aqui</span>
                </span>
              </Link>

              <div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/25 px-2.5 py-1.5 text-[11px] font-semibold text-white/85">
                  <Sparkles size={14} className="text-primary" />
                  Conta em poucos passos
                </div>
                <h1 className="mt-4 max-w-md font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em]">
                  Um acesso simples para acompanhar seu progresso com mais clareza.
                </h1>
                <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
                  Crie sua conta e concentre corpo, alimentação, hidratação e treino em uma experiência única.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {["Privado", "Organizado", "Contínuo"].map((item) => (
                    <div key={item} className="rounded-xl border border-white/12 bg-white/8 px-3 py-3">
                      <ShieldCheck size={15} className="text-primary" />
                      <p className="mt-2 text-xs font-semibold text-white/85">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <main className="flex min-h-[640px] items-center px-5 py-5 sm:px-7 sm:py-6 lg:px-9">
            <div className="mx-auto w-full max-w-xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <Link to="/" className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium text-muted-foreground hover:text-foreground lg:hidden">
                  <Activity size={15} className="text-primary" />
                  Body Métrica FJ
                </Link>
                <div className="ml-auto text-xs text-muted-foreground">
                  Já tem conta? <Link to="/auth" className="font-semibold text-primary hover:underline">Entrar</Link>
                </div>
              </div>

              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Criar conta</p>
                  <h2 className="mt-1 font-display text-[clamp(2rem,4vw,2.8rem)] font-semibold leading-tight tracking-[-0.04em]">
                    Comece com seus dados essenciais.
                  </h2>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                    Preencha os quatro campos abaixo para criar seu acesso.
                  </p>
                </div>
                <span className="hidden size-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
                  <ShieldCheck size={18} />
                </span>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Nome completo</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                              <Input autoComplete="name" placeholder="Seu nome" className="h-11 rounded-xl bg-background pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">E-mail</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                              <Input type="email" inputMode="email" autoComplete="email" placeholder="voce@email.com" className="h-11 rounded-xl bg-background pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                              <Input type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="8+ caracteres" className="h-11 rounded-xl bg-background pl-9 pr-10" {...field} />
                              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold">Confirmar senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                              <Input type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Repita a senha" className="h-11 rounded-xl bg-background pl-9 pr-10" {...field} />
                              <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted" aria-label={showConfirmPassword ? "Ocultar confirmação" : "Mostrar confirmação"}>
                                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-xl border border-border/70 bg-muted/25 p-2.5">
                    {passwordChecks.map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${item.ok ? "border-success/30 bg-success/10 text-success" : "border-border text-muted-foreground/40"}`}>
                          <Check size={11} />
                        </span>
                        <span className={item.ok ? "text-foreground/75" : undefined}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <Button type="submit" disabled={isLoading} className="h-11 w-full rounded-xl font-semibold shadow-sm">
                    {isLoading ? "Criando sua conta..." : "Criar conta"}
                    {!isLoading && <ArrowRight size={16} className="ml-2" />}
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[11px] text-muted-foreground">ou</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  <Button type="button" variant="outline" disabled={isGoogleLoading} onClick={handleGoogleSignUp} className="h-10 w-full rounded-xl bg-background font-medium">
                    <span className="mr-2 flex size-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#4285F4]">G</span>
                    {isGoogleLoading ? "Conectando..." : "Continuar com Google"}
                  </Button>

                  <p className="text-center text-[11px] leading-5 text-muted-foreground">
                    Ao criar sua conta, você concorda com os <Link to="/terms" className="font-semibold text-primary hover:underline">Termos de Uso</Link> e a <Link to="/privacy" className="font-semibold text-primary hover:underline">Política de Privacidade</Link>.
                  </p>
                </form>
              </Form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
