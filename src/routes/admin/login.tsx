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
    title: "Painel Administrativo — Body Métrica FJ",
    meta: [
      { name: "robots", content: "noindex,nofollow" },
      { name: "description", content: "Acesso restrito ao painel administrativo do Body Métrica FJ." },
    ],
  }),
});

const ADMIN_FEATURES = [
  { icon: ShieldCheck, title: "Acesso seguro", description: "Autenticação e sessões protegidas" },
  { icon: Users, title: "Gestão completa", description: "Usuários, módulos e configurações" },
  { icon: Activity, title: "Monitoramento", description: "Relatórios e auditoria de atividades" },
  { icon: SlidersHorizontal, title: "Controle total", description: "Permissões e níveis de acesso" },
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
    <div className="relative min-h-screen overflow-hidden bg-[#05090f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(37,99,235,0.10),transparent_32%),linear-gradient(180deg,#05090f_0%,#08111b_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1536px] items-stretch px-0 lg:p-5 xl:p-7">
        <div className="grid min-h-screen w-full overflow-hidden border border-white/8 bg-[#070d14] shadow-[0_36px_110px_rgba(0,0,0,0.55)] lg:min-h-[calc(100vh-2.5rem)] lg:rounded-[1.75rem] lg:grid-cols-[1.04fr_0.96fr]">
          <section className="relative hidden overflow-hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=88&w=1600"
              alt="Academia moderna preparada para gestão e acompanhamento"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#04080d]/66" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05090f]/96 via-[#05090f]/64 to-[#05090f]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05090f]/94 via-transparent to-[#05090f]/34" />

            <div className="relative flex h-full min-h-[720px] flex-col p-8 xl:p-10">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-blue-400">
                  <BarChart3 size={22} />
                </span>
                <div>
                  <p className="font-display text-xl font-semibold tracking-tight">BODY MÉTRICA FJ</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-400">Gestão inteligente</p>
                </div>
              </div>

              <div className="my-auto max-w-[520px] py-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">Acesso institucional</p>
                <div className="mt-4 h-0.5 w-8 bg-blue-500" />
                <h1 className="mt-5 font-display text-[clamp(3.2rem,5.2vw,5.5rem)] font-semibold leading-[0.93] tracking-[-0.05em]">
                  Painel <span className="block text-blue-500">Administrativo</span>
                </h1>
                <p className="mt-6 max-w-md text-base leading-7 text-white/70">
                  Ambiente exclusivo para gestão e administração da plataforma Body Métrica FJ.
                </p>

                <div className="mt-8 max-w-md divide-y divide-white/10">
                  {ADMIN_FEATURES.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex items-center gap-4 py-3.5">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-400/10">
                        <Icon size={19} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white/92">{title}</p>
                        <p className="mt-0.5 text-xs text-white/50">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/48">
                <ShieldCheck size={15} className="text-blue-400" />
                Sistema protegido e monitorado
              </div>
            </div>
          </section>

          <main className="relative flex items-center justify-center bg-[#071018]/96 px-5 py-8 sm:px-8 lg:px-10 xl:px-14">
            <div className="w-full max-w-[560px]">
              <div className="mb-6 flex items-center justify-between gap-4">
                <Button asChild variant="ghost" size="sm" className="-ml-2 h-9 rounded-lg px-2 text-white/45 hover:bg-white/5 hover:text-white">
                  <Link to="/" search={{} as any}>
                    <ArrowLeft size={15} className="mr-1.5" />
                    Voltar ao site
                  </Link>
                </Button>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/38">
                  <LockKeyhole size={12} className="text-blue-400" />
                  acesso restrito
                </span>
              </div>

              <section className="rounded-[1.7rem] border border-white/10 bg-[#0a121b]/92 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] sm:p-7">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-blue-500/25 bg-blue-500/8 text-blue-400">
                  <ShieldCheck size={28} />
                </div>
                <div className="mt-5 text-center">
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Acesso do Administrador</h2>
                  <p className="mt-2 text-sm text-white/48">Informe suas credenciais para continuar</p>
                </div>

                <form onSubmit={handleLogin} className="mt-7 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="institutional-email" className="text-sm font-medium text-white/80">E-mail do administrador</Label>
                    <Input
                      id="institutional-email"
                      type="email"
                      autoComplete="username"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      disabled={isLoading}
                      className="h-14 rounded-xl border-white/10 bg-[#0d1620] px-4 text-base text-white placeholder:text-white/28 focus-visible:ring-blue-500/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institutional-password" className="text-sm font-medium text-white/80">Senha</Label>
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
                        className="h-14 rounded-xl border-white/10 bg-[#0d1620] px-4 pr-12 text-base text-white placeholder:text-white/28 focus-visible:ring-blue-500/60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/38 transition-colors hover:bg-white/5 hover:text-white"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-14 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-blue-950/30 hover:from-blue-500 hover:to-blue-400"
                  >
                    <ShieldCheck size={17} className="mr-2" />
                    {isLoading ? "Validando credenciais..." : "Entrar no sistema"}
                  </Button>
                </form>

                <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.025] p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={20} className="mt-0.5 shrink-0 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white/82">Acesso restrito a administradores autorizados.</p>
                      <p className="mt-1 text-xs leading-5 text-white/42">A entrada é validada pelas credenciais e pelas permissões administrativas registradas no sistema.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/8 pt-5 text-center">
                  <p className="inline-flex items-center gap-2 text-xs text-white/40">
                    <LockKeyhole size={14} className="text-blue-400" />
                    Conexão segura e sessão protegida
                  </p>
                  <p className="mt-1.5 text-[11px] text-white/24">Não há criação de conta nesta área administrativa.</p>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
