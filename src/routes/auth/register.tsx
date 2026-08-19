import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, ArrowRight, Check, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ACTIVITY_OPTIONS, GOAL_OPTIONS, customerMetadata, formatCpf, isValidCpf, normalizeCpf } from "@/lib/customer-registration";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
  validateSearch: (search: Record<string, unknown>) => ({
    email: (search["email"] as string) || undefined,
    name: (search["name"] as string) || undefined,
  }),
});

const registerSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo"),
  email: z.string().trim().email("Informe um e-mail válido"),
  cpf: z.string().refine(isValidCpf, "Informe um CPF válido"),
  birthDate: z.string().min(1, "Informe sua data de nascimento"),
  biologicalSex: z.enum(["female", "male", "not_informed"]),
  goal: z.string().min(1, "Selecione seu objetivo"),
  weight: z.coerce.number().min(25, "Peso inválido").max(400, "Peso inválido"),
  height: z.coerce.number().min(100, "Altura em centímetros").max(250, "Altura inválida"),
  activityLevel: z.string().min(1, "Selecione seu nível de atividade"),
  password: z.string().min(8, "Use pelo menos 8 caracteres").regex(/[A-Za-z]/, "Inclua ao menos uma letra").regex(/[0-9]/, "Inclua ao menos um número"),
  confirmPassword: z.string().min(1, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, { message: "As senhas não coincidem", path: ["confirmPassword"] });

type RegisterValues = z.infer<typeof registerSchema>;

function RegisterPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: search.name || "",
      email: search.email || "",
      cpf: "",
      birthDate: "",
      biologicalSex: "not_informed",
      goal: "",
      weight: 70,
      height: 170,
      activityLevel: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const passwordChecks = useMemo(() => [
    { label: "8+ caracteres", ok: password.length >= 8 },
    { label: "1 letra", ok: /[A-Za-z]/.test(password) },
    { label: "1 número", ok: /[0-9]/.test(password) },
  ], [password]);

  async function onSubmit(values: RegisterValues) {
    setIsLoading(true);
    try {
      const normalizedCpf = normalizeCpf(values.cpf);
      const { data: duplicate } = await (supabase as any).from("profiles").select("id").eq("cpf", normalizedCpf).maybeSingle();
      if (duplicate) {
        toast.error("Este CPF já está vinculado a uma conta.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
          data: customerMetadata({
            name: values.name,
            email: values.email,
            cpf: values.cpf,
            birthDate: values.birthDate,
            biologicalSex: values.biologicalSex,
            goal: values.goal,
            weight: Number(values.weight),
            height: Number(values.height),
            activityLevel: values.activityLevel,
          }, "self"),
        },
      });

      if (error) {
        const message = error.message.toLowerCase();
        if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
          toast.info("Este e-mail ou CPF já possui uma conta. Entre com suas credenciais.");
          navigate({ to: "/auth" as any, search: { email: values.email } as any });
          return;
        }
        toast.error(error.message || "Não foi possível criar sua conta.");
        return;
      }

      if (!data.user) {
        toast.error("Não foi possível concluir o cadastro.");
        return;
      }

      toast.success("Conta criada. Confirme seu e-mail para liberar o acesso.");
      navigate({ to: "/auth/verify" as any, search: {} as any });
    } catch (error: any) {
      toast.error(error?.message || "Não foi possível concluir o cadastro.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-background text-foreground">
      <img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=86&w=2200" alt="" aria-hidden className="fixed inset-0 h-full w-full object-cover" />
      <div className="fixed inset-0 bg-background/75 backdrop-blur-sm dark:bg-background/82" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-6xl items-center px-4 py-6 md:px-6">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-border/80 bg-background/96 shadow-2xl lg:grid-cols-[0.72fr_1.28fr]">
          <section className="relative hidden min-h-[760px] overflow-hidden lg:block">
            <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=88&w=1400" alt="Pessoa em rotina de treino e bem-estar" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/15" />
            <div className="relative flex h-full flex-col justify-between p-8 text-white">
              <Link to="/" className="inline-flex w-fit items-center gap-3 rounded-xl bg-black/25 px-3 py-2"><span className="flex size-9 items-center justify-center rounded-lg bg-primary"><Activity size={18} /></span><strong className="text-sm">Body Métrica FJ</strong></Link>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs"><Sparkles size={14} /> Cadastro inteligente</div>
                <h1 className="mt-4 font-display text-4xl font-semibold leading-tight">Uma conta. Dados suficientes para personalizar sua jornada.</h1>
                <p className="mt-4 text-sm leading-6 text-white/70">As informações iniciais alimentam metas, composição corporal, hidratação e estimativas usadas pelas ferramentas da plataforma.</p>
              </div>
            </div>
          </section>

          <main className="px-5 py-6 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">Cadastro unificado</p><h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">Crie seu perfil completo</h2><p className="mt-2 text-sm text-muted-foreground">O mesmo cadastro é usado quando a conta é criada por você ou pela administração.</p></div>
                <ShieldCheck className="mt-1 text-primary" size={22} />
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <FormSection title="Identificação" description="Dados usados para identificar e recuperar sua conta.">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField form={form} name="name" label="Nome completo" placeholder="Seu nome" icon={<UserRound size={16} />} />
                      <TextField form={form} name="email" label="E-mail" placeholder="voce@email.com" type="email" icon={<Mail size={16} />} />
                      <FormField control={form.control} name="cpf" render={({ field }) => <FormItem><FormLabel>CPF</FormLabel><FormControl><Input inputMode="numeric" placeholder="000.000.000-00" value={field.value} onChange={(e) => field.onChange(formatCpf(e.target.value))} /></FormControl><FormMessage /></FormItem>} />
                      <FormField control={form.control} name="birthDate" render={({ field }) => <FormItem><FormLabel>Data de nascimento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                  </FormSection>

                  <FormSection title="Dados para métricas" description="Usados para personalizar estimativas, metas e indicadores. Você poderá alterar depois.">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <SelectField form={form} name="biologicalSex" label="Sexo biológico" options={[{ value: "not_informed", label: "Prefiro não informar" }, { value: "female", label: "Feminino" }, { value: "male", label: "Masculino" }]} />
                      <SelectField form={form} name="goal" label="Objetivo principal" options={[...GOAL_OPTIONS]} />
                      <SelectField form={form} name="activityLevel" label="Nível de atividade" options={[...ACTIVITY_OPTIONS]} />
                      <NumberField form={form} name="weight" label="Peso atual (kg)" min={25} max={400} step="0.1" />
                      <NumberField form={form} name="height" label="Altura (cm)" min={100} max={250} step="1" />
                    </div>
                  </FormSection>

                  <FormSection title="Segurança" description="Sua senha nunca é armazenada diretamente no perfil.">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <PasswordField form={form} name="password" label="Senha" visible={showPassword} toggle={() => setShowPassword((v) => !v)} />
                      <PasswordField form={form} name="confirmPassword" label="Confirmar senha" visible={showConfirmPassword} toggle={() => setShowConfirmPassword((v) => !v)} />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-border bg-muted/30 p-2.5">{passwordChecks.map((item) => <div key={item.label} className="flex items-center gap-2 text-[11px] text-muted-foreground"><span className={`flex size-5 items-center justify-center rounded-full border ${item.ok ? "border-success/30 bg-success/10 text-success" : "border-border"}`}><Check size={11} /></span>{item.label}</div>)}</div>
                  </FormSection>

                  <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-xl font-semibold">{isLoading ? "Criando sua conta..." : "Criar conta e continuar"}{!isLoading && <ArrowRight size={16} className="ml-2" />}</Button>
                  <p className="text-center text-xs text-muted-foreground">Já possui conta? <Link to="/auth" className="font-semibold text-primary hover:underline">Entrar</Link>. Ao continuar, você concorda com os <Link to="/terms" className="text-primary hover:underline">Termos</Link> e a <Link to="/privacy" className="text-primary hover:underline">Política de Privacidade</Link>.</p>
                </form>
              </Form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, description, children }: any) { return <section className="rounded-2xl border border-border/80 bg-card/60 p-4"><h3 className="font-semibold">{title}</h3><p className="mb-4 mt-1 text-xs text-muted-foreground">{description}</p>{children}</section>; }
function TextField({ form, name, label, placeholder, type = "text", icon }: any) { return <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span><Input type={type} placeholder={placeholder} className="pl-9" {...field} /></div></FormControl><FormMessage /></FormItem>} />; }
function NumberField({ form, name, label, min, max, step }: any) { return <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><Input type="number" min={min} max={max} step={step} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} /></FormControl><FormMessage /></FormItem>} />; }
function SelectField({ form, name, label, options }: any) { return <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={field.value} onChange={field.onChange}><option value="">Selecione...</option>{options.map((option: any) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></FormControl><FormMessage /></FormItem>} />; }
function PasswordField({ form, name, label, visible, toggle }: any) { return <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel>{label}</FormLabel><FormControl><div className="relative"><Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input type={visible ? "text" : "password"} autoComplete="new-password" className="pl-9 pr-10" {...field} /><button type="button" onClick={toggle} className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">{visible ? <EyeOff size={15} /> : <Eye size={15} />}</button></div></FormControl><FormMessage /></FormItem>} />; }
