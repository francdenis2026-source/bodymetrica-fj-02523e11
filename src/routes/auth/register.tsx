import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Check,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Target,
  TrendingUp,
  UserRound,
  Waves,
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

const easeOut = [0.23, 1, 0.32, 1] as const;

const highlights = [
  {
    icon: TrendingUp,
    title: "Acompanhamento inteligente",
    description: "Métricas organizadas para mostrar sua evolução com clareza.",
  },
  {
    icon: Target,
    title: "Metas personalizadas",
    description: "Objetivos conectados à sua rotina e ao seu progresso.",
  },
  {
    icon: Waves,
    title: "Nutrição e hidratação",
    description: "Hábitos essenciais reunidos em uma única visão.",
  },
  {
    icon: Dumbbell,
    title: "Treinos eficientes",
    description: "Consistência e desempenho acompanhados no mesmo fluxo.",
  },
];

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
      { label: "Mínimo de 8 caracteres", ok: password.length >= 8 },
      { label: "Pelo menos 1 letra", ok: /[A-Za-z]/.test(password) },
      { label: "Pelo menos 1 número", ok: /[0-9]/.test(password) },
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
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#050b13] text-white">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=90&w=2400"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-[44%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,15,0.96)_0%,rgba(3,10,18,0.84)_32%,rgba(4,12,22,0.50)_55%,rgba(3,10,18,0.78)_72%,rgba(2,7,13,0.95)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_44%,rgba(18,118,255,0.12),transparent_35%)]" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#050b13] via-[#050b13]/60 to-transparent" />
      </div>

      <div className="relative mx-auto grid min-h-[100dvh] max-w-[1500px] items-center gap-10 px-5 py-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-10 xl:gap-16 xl:px-14">
        <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: easeOut }}
          className="hidden min-w-0 lg:block"
        >
          <Link
            to="/"
            className="mb-12 inline-flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
              <Activity size={22} strokeWidth={2.2} />
            </span>
            <span>
              <strong className="block text-lg font-semibold tracking-tight">BODY MÉTRICA FJ</strong>
              <span className="text-[11px] font-medium tracking-[0.22em] text-white/55">PERFORMANCE SUITE</span>
            </span>
          </Link>

          <div className="max-w-[610px]">
            <div className="inline-flex items-center rounded-full border border-sky-400/35 bg-sky-400/8 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-sky-300 backdrop-blur-md">
              SUA JORNADA, EM EQUILÍBRIO
            </div>

            <h1 className="mt-6 text-[clamp(3.15rem,5.4vw,5.3rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-balance">
              Mais do que dados.
              <span className="block bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                É o seu progresso.
              </span>
            </h1>

            <p className="mt-6 max-w-[560px] text-base leading-7 text-white/72 md:text-lg md:leading-8">
              O Body Métrica reúne corpo, nutrição, hidratação e treino em uma experiência única. Você acompanha sua evolução com mais foco, controle e consistência.
            </p>

            <div className="mt-8 grid max-w-[620px] gap-3 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 + index * 0.04, ease: easeOut }}
                  className="group rounded-2xl border border-white/12 bg-[#08111d]/72 p-4 backdrop-blur-md transition-[transform,border-color,background-color] duration-150 hover:-translate-y-0.5 hover:border-sky-400/30 hover:bg-[#0a1524]/82 motion-reduce:transition-none"
                >
                  <div className="flex gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300 ring-1 ring-inset ring-sky-400/15">
                      <Icon size={19} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">{title}</h2>
                      <p className="mt-1 text-xs leading-5 text-white/58">{description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/18 px-4 py-3 text-sm text-white/65 backdrop-blur-md">
              <ShieldCheck size={19} className="shrink-0 text-sky-300" />
              Seus dados são protegidos com práticas modernas de segurança.
            </div>
          </div>
        </motion.section>

        <motion.main
          initial={{ opacity: 0, scale: 0.99, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.04, ease: easeOut }}
          className="mx-auto w-full max-w-[650px]"
        >
          <div className="mb-4 flex items-center justify-between gap-3 lg:justify-end">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white lg:hidden">
              <Activity size={18} className="text-sky-300" />
              Body Métrica FJ
            </Link>
            <div className="text-sm text-white/65">
              Já tem uma conta?{" "}
              <Link to="/auth" className="font-medium text-sky-300 transition-colors hover:text-sky-200">
                Entrar
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-[#0a1320]/88 p-5 shadow-[0_32px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-7 md:p-8 lg:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-sky-300">
                  <UserRound size={16} />
                  CRIAR CONTA
                </div>
                <h2 className="mt-4 text-[clamp(2.25rem,5vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-balance">
                  Comece sua jornada
                  <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    agora mesmo
                  </span>
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/62 md:text-base">
                  Preencha os dados abaixo para criar seu acesso ao Body Métrica FJ.
                </p>
              </div>
              <div className="hidden size-12 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/8 text-sky-300 sm:flex">
                <ShieldCheck size={22} />
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5" noValidate>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-white/86">Nome completo</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/38" size={18} />
                          <Input
                            autoComplete="name"
                            placeholder="Digite seu nome completo"
                            className="h-13 rounded-xl border-white/12 bg-white/[0.045] pl-11 text-base text-white shadow-none placeholder:text-white/28 focus-visible:border-sky-400/55 focus-visible:ring-2 focus-visible:ring-sky-400/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-white/86">E-mail</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/38" size={18} />
                          <Input
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="seu@email.com"
                            className="h-13 rounded-xl border-white/12 bg-white/[0.045] pl-11 text-base text-white shadow-none placeholder:text-white/28 focus-visible:border-sky-400/55 focus-visible:ring-2 focus-visible:ring-sky-400/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-white/86">Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/38" size={18} />
                            <Input
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="Mínimo 8 caracteres"
                              className="h-13 rounded-xl border-white/12 bg-white/[0.045] pl-11 pr-11 text-base text-white shadow-none placeholder:text-white/28 focus-visible:border-sky-400/55 focus-visible:ring-2 focus-visible:ring-sky-400/20"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((value) => !value)}
                              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
                              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-white/86">Confirmar senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/38" size={18} />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="Repita sua senha"
                              className="h-13 rounded-xl border-white/12 bg-white/[0.045] pl-11 pr-11 text-base text-white shadow-none placeholder:text-white/28 focus-visible:border-sky-400/55 focus-visible:ring-2 focus-visible:ring-sky-400/20"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((value) => !value)}
                              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
                              aria-label={showConfirmPassword ? "Ocultar confirmação da senha" : "Mostrar confirmação da senha"}
                            >
                              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-3">
                  {passwordChecks.map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs text-white/55">
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          item.ok
                            ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                            : "border-white/16 text-white/28"
                        }`}
                      >
                        <Check size={12} />
                      </span>
                      <span className={item.ok ? "text-white/80" : undefined}>{item.label}</span>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group h-13 w-full rounded-xl bg-gradient-to-r from-blue-500 via-blue-500 to-sky-400 text-base font-semibold text-white shadow-[0_14px_40px_rgba(37,99,235,0.24)] transition-[transform,box-shadow,filter] duration-150 hover:brightness-105 hover:shadow-[0_18px_48px_rgba(37,99,235,0.32)] active:scale-[0.985] motion-reduce:transition-none"
                >
                  {isLoading ? "Criando sua conta..." : "Criar conta"}
                  {!isLoading && <ArrowRight size={18} className="ml-2 transition-transform duration-150 group-hover:translate-x-0.5" />}
                </Button>

                <div className="flex items-center gap-4 py-1">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs text-white/38">ou continue com</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isGoogleLoading}
                  onClick={handleGoogleSignUp}
                  className="h-12 w-full rounded-xl border-white/14 bg-white/[0.025] text-white hover:bg-white/[0.06] hover:text-white"
                >
                  <span className="mr-3 flex size-6 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#4285F4]">G</span>
                  {isGoogleLoading ? "Conectando..." : "Continuar com Google"}
                </Button>

                <p className="text-center text-xs leading-5 text-white/40">
                  Ao criar sua conta, você concorda com nossos{" "}
                  <Link to="/terms" className="text-sky-300 hover:text-sky-200">Termos de Uso</Link>
                  {" "}e{" "}
                  <Link to="/privacy" className="text-sky-300 hover:text-sky-200">Política de Privacidade</Link>.
                </p>
              </form>
            </Form>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
