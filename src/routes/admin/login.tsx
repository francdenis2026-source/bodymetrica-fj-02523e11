import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Users,
  Activity,
  SlidersHorizontal,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
  head: () => ({
    title: "Acesso Administrativo — Body Métrica FJ",
    meta: [
      { name: "robots", content: "noindex,nofollow" },
      { name: "description", content: "Acesso restrito ao painel administrativo do Body Métrica FJ." },
    ],
  }),
});

const ADMIN_FEATURES = [
  { icon: Users, title: "Gestão", description: "Contas e módulos" },
  { icon: Activity, title: "Auditoria", description: "Atividade do sistema" },
  { icon: SlidersHorizontal, title: "Permissões", description: "Papéis e acessos" },
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
        toast.error("Esta conta não possui autorização administrativa.");
        return;
      }

      toast.success("Acesso administrativo autorizado.");
      navigate({ to: "/admin" as any, replace: true });
    } catch {
      await supabase.auth.signOut();
      toast.error("Não foi possível validar o acesso neste momento.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#05080d] text-white">
      <img
        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=82&w=2200"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#04080d]/88" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#04080d]/98 via-[#06101a]/94 to-[#0b1723]/82" />

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-4 sm:px-6">
        <div className="grid w-full max-w-[980px] overflow-hidden rounded-[1.65rem] border border-white/10 bg-[#08111a]/96 shadow-[0_28px_80px_rgba(0,0,0,0.5)] lg:h-[590px] lg:grid-cols-[0.92fr_1.08fr]">
          <section className="relative min-h-[260px] overflow-hidden border-b border-white/10 lg:min-h-0 lg:border-b-0 lg:border-r">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=86&w=1400"
              alt="Ambiente profissional de gestão e tecnologia"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#04101a]/62" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04101a]/96 via-[#04101a]/62 to-[#04101a]/15" />

            <div className="relative flex h-full flex-col justify-between p-5 sm:p-6 lg:p-7">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl border border-sky-400/25 bg-sky-400/10 text-sky-300">
                  <BarChart3 size={20} />
                </span>
                <div>
                  <p className="font-display text-base font-semibold tracking-tight">Body Métrica FJ</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-sky-300/85">Gestão do sistema</p>
                </div>
              </div>

              <div className="max-w-md py-6 lg:py-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">Acesso institucional</p>
                <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-4xl lg:text-[2.75rem]">
                  Administração clara, segura e centralizada.
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/62">
                  Ambiente reservado para gestão operacional, permissões e auditoria da plataforma.
                </p>

                <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  {ADMIN_FEATURES.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300"><Icon size={15} /></span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white/88">{title}</p>
                        <p className="text-[10px] text-white/42">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 text-[10px] font-medium text-white/38">
                <ShieldCheck size={13} className="text-emerald-300" />
                Ambiente monitorado e protegido
              </div>
            </div>
          </section>

          <main className="flex items-center justify-center bg-[#08121c]/94 px-5 py-6 sm:px-7 lg:px-9">
            <div className="w-full max-w-[410px]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 rounded-lg px-2 text-white/45 hover:bg-white/5 hover:text-white">
                  <Link to="/" search={{} as any}>
                    <ArrowLeft size={14} className="mr-1.5" />
                    Voltar
                  </Link>
                </Button>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.025] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/38">
                  <LockKeyhole size={11} className="text-sky-300" />
                  admin
                </span>
              </div>

              <div className="mb-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300 ring-1 ring-sky-300/10">
                  <ShieldCheck size={19} />
                </span>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">Credenciais administrativas</p>
                <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.035em] sm:text-[1.9rem]">Entrar no painel</h2>
                <p className="mt-1.5 text-sm leading-5 text-white/45">Somente contas administrativas previamente autorizadas.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="institutional-email" className="text-xs font-medium text-white/72">E-mail do administrador</Label>
                  <Input
                    id="institutional-email"
                    type="email"
                    autoComplete="username"
                    placeholder="administrador@dominio.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 rounded-xl border-white/10 bg-[#0b1722] px-3.5 text-sm text-white placeholder:text-white/25 focus-visible:ring-sky-400/55"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="institutional-password" className="text-xs font-medium text-white/72">Senha</Label>
                  <div className="relative">
                    <Input
                      id="institutional-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 rounded-xl border-white/10 bg-[#0b1722] px-3.5 pr-11 text-sm text-white placeholder:text-white/25 focus-visible:ring-sky-400/55"
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-full rounded-xl bg-sky-400 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-950/25 hover:bg-sky-300"
                >
                  <ShieldCheck size={16} className="mr-2" />
                  {isLoading ? "Validando..." : "Acessar administração"}
                </Button>
              </form>

              <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.025] px-3.5 py-3">
                <div className="flex items-start gap-2.5">
                  <LockKeyhole size={14} className="mt-0.5 shrink-0 text-sky-300" />
                  <p className="text-[11px] leading-5 text-white/42">
                    Não existe criação de conta nesta área. O acesso depende de credenciais válidas e papel administrativo ativo.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-center text-[9px] uppercase tracking-[0.12em] text-white/22">Acesso restrito · sessão protegida</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
