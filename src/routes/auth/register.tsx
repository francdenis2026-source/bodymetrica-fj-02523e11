import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, ArrowLeft, ArrowRight, Check, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, UserRound } from "lucide-react";
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

type Step = 1 | 2;

function RegisterPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>(1);
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

  async function goNext() {
    const ok = await form.trigger(["name", "email", "cpf", "birthDate", "biologicalSex"]);
    if (ok) setStep(2);
  }

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
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-background text-foreground lg:overflow-hidden">
      <img src="https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=86&w=2200" alt="" aria-hidden className="fixed inset-0 h-full w-full object-cover" />
      <div className="fixed inset-0 bg-background/80 backdrop-blur-[2px] dark:bg-background/88" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1180px] items-center px-3 py-3 sm:px-5 lg:h-[100dvh] lg:min-h-0 lg:py-4">
        <div className="grid w-full overflow-hidden rounded-[1.75rem] border border-border/90 bg-card/96 shadow-[0_28px_90px_rgba(0,0,0,.22)] ring-1 ring-foreground/5 lg:h-[min(720px,calc(100vh-32px))] lg:grid-cols-[0.74fr_1.26fr]">
          <section className="on-media relative hidden overflow-hidden lg:block">
            <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=88&w=1400" alt="Pessoa em rotina de treino e bem-estar" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/58 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/28 via-transparent to-black/15" />
            <div className="relative flex h-full flex-col justify-between p-6 text-white xl:p-7">
              <Link to="/" className="inline-flex w-fit items-center gap-2.5 rounded-xl border border-white/15 bg-black/35 px-3 py-2 backdrop-blur-md">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Activity size={16} /></span>
                <strong className="text-sm">Body Métrica FJ</strong>
              </Link>

              <div className="max-w-sm">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/35 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md"><Sparkles size={13} /> Cadastro inteligente</div>
                <h1 className="mt-4 font-display text-[2.35rem] font-semibold leading-[1.03] tracking-[-.04em]">Seu perfil começa com os dados certos.</h1>
                <p className="mt-3 text-sm leading-6 text-white/78">Um cadastro único para personalizar metas, composição corporal, hidratação e estimativas da plataforma.</p>
                <div className="mt-5 grid gap-2">
                  {["Conta e identificação", "Dados para métricas", "Segurança e confirmação"].map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl border border-white/12 bg-black/28 px-3 py-2.5 backdrop-blur-sm">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-xs font-bold">{index + 1}</span>
                      <span className="text-xs font-medium text-white/88">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-medium text-white/65"><ShieldCheck size={13} className="text-emerald-300" /> Seus dados podem ser atualizados depois.</div>
            </div>
          </section>

          <main className="flex min-h-0 items-center justify-center bg-card px-4 py-5 sm:px-7 lg:px-8 lg:py-5 xl:px-10">
            <div className="w-full max-w-[680px]">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">Cadastro unificado</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-.035em] sm:text-[1.85rem]">{step === 1 ? "Crie sua identificação" : "Complete seu perfil"}</h2>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{step === 1 ? "Dados da conta e identificação pessoal." : "Informações para métricas e segurança do acesso."}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted/45 px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground">
                  <span className={step >= 1 ? "text-primary" : ""}>01</span><span>/</span><span className={step >= 2 ? "text-primary" : ""}>02</span>
                </div>
              </div>

              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full bg-primary transition-all duration-300 ${step === 1 ? "w-1/2" : "w-full"}`} /></div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                  {step === 1 ? (
                    <div className="rounded-2xl border border-border bg-background/55 p-3.5 sm:p-4">
                      <div className="grid gap-x-3 gap-y-3 sm:grid-cols-2">
                        <TextField form={form} name="name" label="Nome completo" placeholder="Seu nome" icon={<UserRound size={15} />} />
                        <TextField form={form} name="email" label="E-mail" placeholder="voce@email.com" type="email" icon={<Mail size={15} />} />
                        <FormField control={form.control} name="cpf" render={({ field }) => <FormItem><FormLabel className="text-xs">CPF</FormLabel><FormControl><Input className="h-10" inputMode="numeric" placeholder="000.000.000-00" value={field.value} onChange={(e) => field.onChange(formatCpf(e.target.value))} /></FormControl><FormMessage className="text-[10px]" /></FormItem>} />
                        <FormField control={form.control} name="birthDate" render={({ field }) => <FormItem><FormLabel className="text-xs">Data de nascimento</FormLabel><FormControl><Input className="h-10" type="date" {...field} /></FormControl><FormMessage className="text-[10px]" /></FormItem>} />
                        <div className="sm:col-span-2"><SelectField form={form} name="biologicalSex" label="Sexo biológico" options={[{ value: "not_informed", label: "Prefiro não informar" }, { value: "female", label: "Feminino" }, { value: "male", label: "Masculino" }]} /></div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-border bg-background/55 p-3.5 sm:p-4">
                      <div className="grid gap-x-3 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                        <SelectField form={form} name="goal" label="Objetivo principal" options={[...GOAL_OPTIONS]} />
                        <SelectField form={form} name="activityLevel" label="Nível de atividade" options={[...ACTIVITY_OPTIONS]} />
                        <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1"><NumberField form={form} name="weight" label="Peso (kg)" min={25} max={400} step="0.1" /><NumberField form={form} name="height" label="Altura (cm)" min={100} max={250} step="1" /></div>
                        <div className="sm:col-span-1 lg:col-span-3"><div className="grid gap-3 sm:grid-cols-2"><PasswordField form={form} name="password" label="Senha" visible={showPassword} toggle={() => setShowPassword((v) => !v)} /><PasswordField form={form} name="confirmPassword" label="Confirmar senha" visible={showConfirmPassword} toggle={() => setShowConfirmPassword((v) => !v)} /></div></div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl border border-border bg-muted/30 p-2">{passwordChecks.map((item) => <div key={item.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className={`flex size-4 items-center justify-center rounded-full border ${item.ok ? "border-success/35 bg-success/12 text-success" : "border-border"}`}><Check size={9} /></span><span>{item.label}</span></div>)}</div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2.5">
                    {step === 2 && <Button type="button" variant="outline" onClick={() => setStep(1)} className="h-11 rounded-xl px-4"><ArrowLeft size={15} className="mr-2" />Voltar</Button>}
                    {step === 1 ? (
                      <Button type="button" onClick={goNext} className="h-11 flex-1 rounded-xl font-semibold">Continuar<ArrowRight size={15} className="ml-2" /></Button>
                    ) : (
                      <Button type="submit" disabled={isLoading} className="h-11 flex-1 rounded-xl font-semibold">{isLoading ? "Criando sua conta..." : "Criar conta"}{!isLoading && <ArrowRight size={15} className="ml-2" />}</Button>
                    )}
                  </div>

                  <p className="mt-3 text-center text-[10px] leading-4 text-muted-foreground">Já possui conta? <Link to="/auth" className="font-semibold text-primary hover:underline">Entrar</Link>. Ao continuar, você concorda com os <Link to="/terms" className="text-primary hover:underline">Termos</Link> e a <Link to="/privacy" className="text-primary hover:underline">Política de Privacidade</Link>.</p>
                </form>
              </Form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function TextField({ form, name, label, placeholder, type = "text", icon }: any) { return <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel className="text-xs">{label}</FormLabel><FormControl><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span><Input type={type} placeholder={placeholder} className="h-10 pl-9" {...field} /></div></FormControl><FormMessage className="text-[10px]" /></FormItem>} />; }
function NumberField({ form, name, label, min, max, step }: any) { return <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel className="text-xs">{label}</FormLabel><FormControl><Input className="h-10" type="number" min={min} max={max} step={step} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} /></FormControl><FormMessage className="text-[10px]" /></FormItem>} />; }
function SelectField({ form, name, label, options }: any) { return <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel className="text-xs">{label}</FormLabel><FormControl><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={field.value} onChange={field.onChange}><option value="">Selecione...</option>{options.map((option: any) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></FormControl><FormMessage className="text-[10px]" /></FormItem>} />; }
function PasswordField({ form, name, label, visible, toggle }: any) { return <FormField control={form.control} name={name} render={({ field }) => <FormItem><FormLabel className="text-xs">{label}</FormLabel><FormControl><div className="relative"><Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input type={visible ? "text" : "password"} autoComplete="new-password" className="h-10 pl-9 pr-10" {...field} /><button type="button" onClick={toggle} className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label={visible ? "Ocultar senha" : "Mostrar senha"}>{visible ? <EyeOff size={14} /> : <Eye size={14} />}</button></div></FormControl><FormMessage className="text-[10px]" /></FormItem>} />; }
