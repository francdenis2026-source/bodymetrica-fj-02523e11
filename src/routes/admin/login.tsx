import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
  head: () => ({
    title: "Portal institucional — Body Métrica FJ",
    meta: [
      { name: "robots", content: "noindex,nofollow" },
      { name: "description", content: "Portal administrativo de acesso restrito do Body Métrica FJ." },
    ],
  }),
});

const ADMIN_CAPABILITIES = [
  { icon: UserCog, label: "Gestão", value: "Contas e perfis" },
  { icon: ShieldCheck, label: "Controle", value: "Papéis e permissões" },
  { icon: Fingerprint, label: "Auditoria", value: "Sessão validada" },
];

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (loginError) {
        toast.error("Não foi possível validar suas credenciais.");
        return;
      }

      const { data: adminSession, error: adminError } = await supabase.rpc("admin_session");
      const sessionRow = Array.isArray(adminSession) ? adminSession[0] : adminSession;

      if (adminError || !sessionRow?.user_id) {
        await supabase.auth.signOut();
        toast.error("Esta conta não possui autorização institucional.");
        return;
      }

      toast.success("Sessão administrativa autorizada.");
      navigate({ to: "/admin" as any, replace: true });
    } catch {
      await supabase.auth.signOut();
      toast.error("Não foi possível validar o acesso neste momento.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#071018] text-white">
      <img
        src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=88&w=2200"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#071018]/88" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#071018] via-[#0b1620]/96 to-[#0d1d29]/82" />

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-5 sm:px-6">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a141d]/96 shadow-[0_30px_90px_rgba(0,0,0,0.45)] lg:grid-cols-[1.06fr_0.94fr]">
          <section className="relative min-h-[320px] overflow-hidden border-b border-white/10 lg:min-h-[660px] lg:border-b-0 lg:border-r">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=90&w=1500"
              alt="Ambiente executivo contemporâneo"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061019] via-[#061019]/70 to-[#061019]/18" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#061019]/26" />

            <div className="relative flex h-full min-h-[320px] flex-col justify-between p-5 text-white sm:p-7 lg:min-h-[660px] lg:p-9">
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-xs font-semibold text-white/80">
                  <Sparkles size={14} className="text-sky-300" />
                  Portal institucional
                </div>
                <span className="hidden items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50 sm:inline-flex">
                  <ShieldCheck size={13} className="text-emerald-300" />
                  acesso restrito
                </span>
              </div>

              <div className="max-w-xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300/85">Body Métrica FJ · Administração</p>
                <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-[3.65rem]">
                  Controle do sistema em um ambiente reservado.
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-6 text-white/68 sm:text-base sm:leading-7">
                  Um ponto único para acessar operações administrativas, governança de contas e recursos institucionais do Body Métrica FJ.
                </p>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-3 lg:mt-8">
                  {ADMIN_CAPABILITIES.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-black/22 p-3.5">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-white/8 text-sky-300"><Icon size={16} /></div>
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.13em] text-white/42">{label}</p>
                      <p className="mt-1 text-xs font-medium text-white/82">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <main className="flex min-h-[520px] items-center bg-[#0b1620]/94 px-5 py-7 sm:px-8 lg:min-h-[660px] lg:px-10">
            <div className="mx-auto w-full max-w-[410px]">
              <div className="mb-8 flex items-center justify-between gap-4">
                <Button variant="ghost" size="sm" asChild className="-ml-2 h-9 rounded-lg px-2 text-white/50 hover:bg-white/5 hover:text-white">
                  <Link to="/" search={{} as any}><ArrowLeft size={15} className="mr-1.5" />Voltar ao site</Link>
                </Button>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  <LockKeyhole size={12} className="text-sky-300" /> Sessão segura
                </span>
              </div>

              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5 shadow-inner shadow-black/10 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300 ring-1 ring-sky-300/10"><KeyRound size={20} /></span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300/85">Credenciais administrativas</p>
                    <h2 className="mt-1 font-display text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">Identifique-se para continuar</h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/50">Somente contas previamente autorizadas podem abrir o painel institucional.</p>
              </div>

              <form onSubmit={handleLogin} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="institutional-email" className="text-xs font-medium text-white/72">E-mail institucional</Label>
                  <Input
                    id="institutional-email"
                    type="email"
                    autoComplete="username"
                    placeholder="conta autorizada"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 rounded-xl border-white/10 bg-black/18 text-white placeholder:text-white/25 focus-visible:ring-sky-400/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutional-password" className="text-xs font-medium text-white/72">Senha</Label>
                  <div className="relative">
                    <Input
                      id="institutional-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 rounded-xl border-white/10 bg-black/18 pr-11 text-white focus-visible:ring-sky-400/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/35 transition-colors hover:bg-white/5 hover:text-white"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="h-12 w-full rounded-xl bg-sky-400 font-semibold text-slate-950 shadow-lg shadow-sky-500/10 hover:bg-sky-300" disabled={isLoading}>
                  {isLoading ? "Validando credenciais..." : "Entrar no painel administrativo"}
                  {!isLoading && <ArrowRight size={16} className="ml-2" />}
                </Button>
              </form>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/72"><ShieldCheck size={15} className="text-emerald-300" /> Autorização por papel</div>
                  <p className="mt-1.5 text-[11px] leading-4 text-white/38">A conta precisa estar registrada como admin ou super_admin.</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/72"><Fingerprint size={15} className="text-sky-300" /> Sessão verificada</div>
                  <p className="mt-1.5 text-[11px] leading-4 text-white/38">A entrada é confirmada pelo provedor de autenticação e pelo banco.</p>
                </div>
              </div>

              <p className="mt-5 text-center text-[10px] uppercase tracking-[0.11em] text-white/24">Ambiente reservado · acesso monitorado</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
