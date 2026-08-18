import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
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
    birthDate: (search["birthDate"] as string) || undefined,
    goal: (search["goal"] as string) || undefined,
    weight: (search["weight"] as string) || undefined,
    height: (search["height"] as string) || undefined,
    activityLevel: (search["activityLevel"] as string) || undefined,
  } as any),
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

const easeOut = [0.23, 1, 0.32, 1] as const;

function RegisterPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      { label: "8 ou mais caracteres", ok: password.length >= 8 },
      { label: "Pelo menos uma letra", ok: /[A-Za-z]/.test(password) },
      { label: "Pelo menos um número", ok: /[0-9]/.test(password) },
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

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <img
        src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=90&w=2400"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
      />
      <div className="absolute inset-0 bg-background/18 dark:bg-background/24" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/78 via-background/32 to-transparent dark:from-background/84 dark:via-background/40 dark:to-background/8" />
      <div className="absolute inset-y-0 right-0 w-[58%] bg-gradient-to-l from-background/34 via-background/10 to-transparent dark:from-background/42 dark:via-background/14" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/38 via-background/12 to-transparent dark:from-background/46" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl items-center px-4 py-6 md:px-6 lg:py-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] xl:gap-16">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: easeOut }}
            className="hidden max-w-xl lg:block"
          >
            <Link
              to="/"
              className="mb-12 inline-flex min-h-11 items-center gap-3 rounded-xl bg-background/66 px-3 py-2 shadow-sm backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm">
                B
              </span>
              <span>
                <strong className="block font-display text-lg font-semibold tracking-tight">Body Métrica FJ</strong>
                <span className="text-sm text-muted-foreground">Saúde e composição corporal</span>
              </span>
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/64 px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur-md">
              <Sparkles size={15} className="text-primary" aria-hidden="true" />
              Seu acompanhamento começa aqui
            </div>

            <div className="mt-5 max-w-xl rounded-[1.75rem] border border-border/55 bg-background/54 p-5 shadow-lg shadow-black/5 backdrop-blur-[10px] md:p-6">
              <h1 className="font-display text-[clamp(3rem,5vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance">
                Crie sua conta sem complicação.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-foreground/78 md:text-lg">
                Comece apenas com os dados essenciais. Depois do primeiro acesso, você completa metas, medidas e hábitos no seu próprio ritmo.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                ["01", "Conta segura", "Confirmação por e-mail"],
                ["02", "Início rápido", "Poucos campos agora"],
                ["03", "Evolução contínua", "Complete depois no painel"],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-border/60 bg-background/58 p-4 shadow-sm backdrop-blur-md transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-background/70 motion-reduce:transition-none"
                >
                  <span className="text-xs font-semibold text-primary">{number}</span>
                  <p className="mt-2 font-display text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-foreground/68">{description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.main
            initial={{ opacity: 0, scale: 0.99, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.44, delay: 0.04, ease: easeOut }}
            className="mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end"
          >
            <div className="rounded-[2rem] border border-white/30 bg-background/88 p-5 shadow-2xl shadow-black/12 backdrop-blur-xl sm:p-7 md:p-8 dark:border-white/12 dark:bg-background/86">
              <div className="flex items-center justify-between gap-4">
                <Link
                  to="/auth"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <ArrowLeft size={16} />
                  Entrar
                </Link>

                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                  <ShieldCheck size={14} aria-hidden="true" />
                  Cadastro protegido
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-primary">Nova conta</p>
                <h2 className="mt-2 font-display text-[clamp(2.1rem,6vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance">
                  Vamos preparar seu acesso.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  Leva menos de um minuto. Use um e-mail que você consiga confirmar agora.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5" noValidate>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Nome completo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
                            <Input autoComplete="name" placeholder="Como você quer ser chamado" className="h-12 rounded-xl border-border/85 bg-background/90 pl-11 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-primary" {...field} />
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
                        <FormLabel className="text-sm font-medium">E-mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
                            <Input type="email" inputMode="email" autoComplete="email" placeholder="voce@email.com" className="h-12 rounded-xl border-border/85 bg-background/90 pl-11 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-primary" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden="true" />
                              <Input type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Crie uma senha" className="h-12 rounded-xl border-border/85 bg-background/90 pl-11 pr-11 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-primary" {...field} />
                              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
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
                          <FormLabel className="text-sm font-medium">Confirmar senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Repita a senha" className="h-12 rounded-xl border-border/85 bg-background/90 pr-11 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-primary" {...field} />
                              <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={showConfirmPassword ? "Ocultar confirmação da senha" : "Mostrar confirmação da senha"}>
                                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-2 rounded-2xl border border-border/75 bg-background/54 p-4 backdrop-blur-sm sm:grid-cols-3">
                    {passwordChecks.map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-xs">
                        <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${item.ok ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                          <Check size={12} aria-hidden="true" />
                        </span>
                        <span className={item.ok ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <Button type="submit" disabled={isLoading} className="group h-12 w-full rounded-xl text-base font-medium shadow-md transition-[transform,box-shadow] duration-150 hover:shadow-lg active:scale-[0.98] motion-reduce:transition-none">
                    {isLoading ? "Criando sua conta..." : "Criar conta e continuar"}
                    {!isLoading && <ArrowRight size={17} className="ml-2 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />}
                  </Button>

                  <p className="text-center text-xs leading-5 text-muted-foreground">
                    Ao continuar, você cria seu acesso ao Body Métrica FJ e receberá uma confirmação por e-mail.
                  </p>
                </form>
              </Form>
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  );
}
