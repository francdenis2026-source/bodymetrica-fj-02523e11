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
import { SVGToast } from "@/components/ui/svg-toast";

const TOAST_DURATION = 4500;

const showAdminToast = (type: "success" | "error" | "info" | "warning", title: string, message: string) => {
  toast.custom(
    (t) => <SVGToast type={type} title={title} message={message} onClose={() => toast.dismiss(t)} />,
    { duration: TOAST_DURATION },
  );
};

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
        showAdminToast("error", "CREDENCIAIS INVÁLIDAS", "Verifique o e-mail e a senha informados.");
        return;
      }

      const { data: adminSession, error: adminError } = await (supabase.rpc as any)("admin_session");
      const sessionRow = Array.isArray(adminSession) ? adminSession[0] : adminSession;

      if (adminError || !sessionRow?.user_id) {
        await supabase.auth.signOut();
        showAdminToast("warning", "ACESSO NEGADO", "Esta conta não possui papel administrativo ativo.");
        return;
      }

      showAdminToast("success", "ACESSO AUTORIZADO", "Redirecionando para o painel administrativo.");
      navigate({ to: "/admin" as any, replace: true });
    } catch {
      await supabase.auth.signOut();
      showAdminToast("error", "FALHA INESPERADA", "Não foi possível validar o acesso. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#04070b] text-white">
      <img
        src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=82&w=2200"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
      />
      <div className="absolute inset-0 bg-[#03070c]/82" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#03070c]/96 via-[#07111c]/90 to-[#0b1a28]/76" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#03070c] to-transparent" />

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-4 sm:px-6">
        <div className="grid w-full max-w-[980px] overflow-hidden rounded-[1.65rem] border border-white/12 bg-[#08111a]/98 shadow-[0_30px_90px_rgba(0,0,0,0.56)] lg:h-[590px] lg:grid-cols-[0.92fr_1.08fr]">
          <section className="on-media relative min-h-[260px] overflow-hidden border-b border-white/10 lg:min-h-0 lg:border-b-0 lg:border-r">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=88&w=1400"
              alt="Ambiente tecnológico profissional para gestão do sistema"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#03101b]/54" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03101b]/98 via-[#03101b]/68 to-[#03101b]/18" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#03101b]/58 via-transparent to-transparent" />

            <div className="relative flex h-full flex-col justify-between p-5 sm:p-6 lg:p-7">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl border border-sky-300/28 bg-[#061522]/88 text-sky-300 shadow-sm">
                  <BarChart3 size={20} />
                </span>
                <div className="rounded-lg bg-[#03101b]/72 px-2.5 py-1.5">
                  <p className="font-display text-base font-semibold tracking-tight text-white">Body Métrica FJ</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-sky-300">Gestão do sistema</p>
                </div>
              </div>

              <div className="max-w-md py-6 lg:py-0">
                <div className="inline-flex rounded-lg border border-sky-300/15 bg-[#03101b]/76 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">
                  Acesso institucional
                </div>
                <h1 className="mt-3 max-w-sm font-display text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.65rem]">
                  Administração com contexto e controle.
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/78">
                  Um ambiente reservado para gestão operacional, permissões e auditoria da plataforma.
                </p>

                <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  {ADMIN_FEATURES.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex items-center gap-3 rounded-xl border border-white/12 bg-[#03101b]/78 px-3 py-2.5 shadow-sm">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-400/12 text-sky-300"><Icon size={15} /></span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white">{title}</p>
                        <p className="text-[10px] text-white/60">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#03101b]/68 px-2.5 py-1.5 text-[10px] font-medium text-white/66">
                <ShieldCheck size={13} className="text-emerald-300" />
                Ambiente monitorado e protegido
              </div>
            </div>
          </section>

          <main className="flex items-center justify-center bg-[#08121c]/98 px-5 py-6 sm:px-7 lg:px-9">
            <div className="w-full max-w-[410px]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 rounded-lg px-2 text-white/55 hover:bg-white/5 hover:text-white">
                  <Link to="/" search={{} as any}>
                    <ArrowLeft size={14} className="mr-1.5" />
                    Voltar
                  </Link>
                </Button>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/55">
                  <LockKeyhole size={11} className="text-sky-300" />
                  admin
                </span>
              </div>

              <div className="mb-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300 ring-1 ring-sky-300/12">
                  <ShieldCheck size={19} />
                </span>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">Credenciais administrativas</p>
                <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.035em] text-white sm:text-[1.9rem]">Entrar no painel</h2>
                <p className="mt-1.5 text-sm leading-5 text-white/58">Somente contas administrativas previamente autorizadas.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="institutional-email" className="text-xs font-medium text-white/78">E-mail do administrador</Label>
                  <Input
                    id="institutional-email"
                    type="email"
                    autoComplete="username"
                    placeholder="administrador@dominio.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 rounded-xl border-white/12 bg-[#0b1722] px-3.5 text-sm text-white placeholder:text-white/30 focus-visible:ring-sky-400/55"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="institutional-password" className="text-xs font-medium text-white/78">Senha</Label>
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
                      className="h-11 rounded-xl border-white/12 bg-[#0b1722] px-3.5 pr-11 text-sm text-white placeholder:text-white/30 focus-visible:ring-sky-400/55"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/42 transition-colors hover:bg-white/5 hover:text-white"
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

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-3">
                <div className="flex items-start gap-2.5">
                  <LockKeyhole size={14} className="mt-0.5 shrink-0 text-sky-300" />
                  <p className="text-[11px] leading-5 text-white/52">
                    Não existe criação de conta nesta área. O acesso depende de credenciais válidas e papel administrativo ativo.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-center text-[9px] uppercase tracking-[0.12em] text-white/30">Acesso restrito · sessão protegida</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
