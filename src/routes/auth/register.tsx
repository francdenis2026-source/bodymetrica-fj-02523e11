import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { register } from "@/lib/auth/auth.functions";
import { toast } from "sonner";

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

const registerSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const easeOut = [0.23, 1, 0.32, 1] as const;

function RegisterPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: search.name || "",
      email: search.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      const result = await register({
        data: {
          name: values.name,
          email: values.email,
          password: values.password,
          birthDate: search.birthDate,
          goal: search.goal,
          weight: search.weight,
          height: search.height,
          activityLevel: search.activityLevel,
        },
      });

      if (!result.success) {
        toast.error(result.message || "Não foi possível criar sua conta.");
        return;
      }

      toast.success(result.message || "Cadastro realizado. Confirme seu e-mail para continuar.");
      navigate({ to: "/auth/verify" as any, search: {} as any });
    } catch {
      toast.error("Não foi possível concluir o cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <img
        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=86&w=2200"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-background/56 dark:bg-background/68" />
      <div className="absolute inset-0 bg-gradient-to-l from-background/96 via-background/84 to-background/24 dark:from-background/98 dark:via-background/90 dark:to-background/34" />

      <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-10 px-4 py-6 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-8">
        <motion.main
          initial={{ opacity: 0, scale: 0.99, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.42, ease: easeOut }}
          className="mx-auto w-full max-w-[520px] lg:order-2"
        >
          <div className="rounded-[1.75rem] border border-border/80 bg-background/95 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7 md:p-8">
            <div className="mb-7 flex items-center justify-between gap-4">
              <Link to="/auth" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <ArrowLeft size={16} />
                Já tenho conta
              </Link>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <ShieldCheck size={15} className="text-primary" />
                Cadastro seguro
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-primary">Novo cadastro</p>
              <h1 className="mt-2 font-display text-[clamp(2rem,6vw,2.75rem)] font-semibold leading-tight tracking-[-0.035em] text-balance">Crie sua conta Body Métrica FJ</h1>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Comece com os dados essenciais. Depois você poderá completar suas metas e informações corporais no painel.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-7 space-y-5">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input autoComplete="name" placeholder="Seu nome" className="h-12 rounded-xl bg-background pl-11" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
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

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" className="h-12 rounded-xl bg-background pl-11" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl><Input type="password" autoComplete="new-password" placeholder="Repita a senha" className="h-12 rounded-xl bg-background" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                    <p className="text-sm leading-5 text-muted-foreground">Ao criar a conta, você receberá um e-mail para confirmar seu acesso antes do primeiro login.</p>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="group h-12 w-full rounded-xl font-medium shadow-sm transition-[transform,box-shadow] duration-150 hover:shadow-md active:scale-[0.98] motion-reduce:transition-none">
                  {isLoading ? "Criando conta..." : "Criar minha conta"}
                  {!isLoading && <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-0.5" />}
                </Button>
              </form>
            </Form>
          </div>
        </motion.main>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.04, ease: easeOut }}
          className="hidden max-w-xl lg:block lg:order-1"
        >
          <Link to="/" className="mb-10 inline-flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm">B</span>
            <span>
              <strong className="block font-display text-lg font-semibold tracking-tight">Body Métrica FJ</strong>
              <span className="text-sm text-muted-foreground">Uma visão mais clara da sua evolução</span>
            </span>
          </Link>

          <p className="text-sm font-medium text-primary">Comece simples</p>
          <h2 className="mt-3 max-w-lg font-display text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-balance">Seu acompanhamento começa com uma conta segura e bem organizada.</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">Depois do cadastro, você pode registrar medidas, definir metas e acompanhar hábitos sem preencher tudo de uma vez.</p>

          <div className="mt-8 space-y-3">
            {["Cadastro com poucos campos", "Confirmação por e-mail", "Dados complementares depois"].map((label) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/72 px-4 py-3 text-sm font-medium shadow-sm backdrop-blur-md">
                <CheckCircle2 size={17} className="text-primary" />
                {label}
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
