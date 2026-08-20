import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
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
import { setSession } from "@/lib/auth/auth.functions";
import { resolveAdminRole } from "@/lib/admin-auth.functions";
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

function createIsolatedAuthClient() {
  const url = import.meta.env["VITE_SUPABASE_URL"];
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Configuração do Supabase ausente.");
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const resolveAdminRoleFn = useServerFn(resolveAdminRole);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // IMPORTANT: validate credentials with an isolated client first.
      // This prevents a temporary SIGNED_IN event from being interpreted by the
      // global customer session handler before the admin role is validated.
      const probe = createIsolatedAuthClient();
      const { data: authData, error: loginError } = await probe.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (loginError || !authData.user || !authData.session?.access_token || !authData.session.refresh_token) {
        showAdminToast("error", "Credenciais inválidas", "O e-mail ou a senha estão incorretos.");
        return;
      }

      const adminResult = await resolveAdminRoleFn({
        data: { accessToken: authData.session.access_token },
      });

      if (!adminResult.success || !adminResult.user) {
        await probe.auth.signOut();
        showAdminToast("warning", "Acesso negado", adminResult.message || "Esta conta não possui papel administrativo ativo.");
        return;
      }

      // Store the admin role before activating the shared Supabase session.
      // The global auth listener will therefore preserve admin/super_admin.
      setSession({
        id: adminResult.user.id,
        email: adminResult.user.email || normalizedEmail,
        name: adminResult.user.name || "Administrador",
        role: adminResult.user.role,
        profile: null,
        isLicensed: true,
        licenseStatus: "active",
      });

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      });

      if (sessionError) {
        localStorage.removeItem("bodymetrica_auth_session");
        showAdminToast("error", "Sessão não iniciada", "As credenciais foram validadas, mas não foi possível iniciar a sessão administrativa.");
        return;
      }

      showAdminToast("success", "Acesso autorizado", "Abrindo o painel administrativo.");
      window.location.replace("/admin");
    } catch (error) {
      console.error("Admin login failed:", error);
      showAdminToast("error", "Falha inesperada", "Não foi possível validar o acesso administrativo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page on-media relative min-h-[100dvh] overflow-hidden bg-[#0a1218] text-white">
      <img src="/bodymetrica-admin-2026.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-35 [filter:saturate(0.7)_hue-rotate(-25deg)]" />
      <div className="absolute inset-0 bg-[#0a1218]/78" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1218]/97 via-[#0d1c22]/90 to-[#0c6478]/28" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a1218] to-transparent" />

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-4 sm:px-6">
        <div className="grid w-full max-w-[980px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0c161c]/98 shadow-[0_30px_90px_rgba(0,0,0,0.5)] lg:h-[590px] lg:grid-cols-[0.92fr_1.08fr]">
          <section className="relative min-h-[260px] overflow-hidden border-b border-white/10 lg:min-h-0 lg:border-b-0 lg:border-r">
            <img src="/bodymetrica-admin-2026.jpg" alt="Ambiente tecnológico profissional para gestão do sistema" className="absolute inset-0 h-full w-full object-cover object-center [filter:saturate(0.8)_hue-rotate(-20deg)]" />
            <div className="absolute inset-0 bg-[#061014]/58" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061014]/98 via-[#061014]/66 to-[#061014]/16" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#061014]/56 via-transparent to-transparent" />

            <div className="relative flex h-full flex-col justify-between p-5 sm:p-6 lg:p-7">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl border border-primary/30 bg-[#04141a]/88 text-primary shadow-sm"><BarChart3 size={20} /></span>
                <div className="rounded-lg bg-[#04141a]/72 px-2.5 py-1.5">
                  <p className="font-display text-base font-semibold tracking-tight text-white">Body Métrica FJ</p>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.19em] text-primary">Gestão do sistema</p>
                </div>
              </div>

              <div className="max-w-md py-6 lg:py-0">
                <div className="inline-flex rounded-lg border border-primary/20 bg-[#04141a]/76 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Acesso institucional</div>
                <h1 className="mt-3 max-w-sm font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.5rem]">Administração com contexto e controle.</h1>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/72">Um ambiente reservado para gestão operacional, permissões e auditoria da plataforma.</p>

                <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  {ADMIN_FEATURES.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#04141a]/78 px-3 py-2.5 shadow-sm">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon size={15} /></span>
                      <div className="min-w-0"><p className="text-xs font-semibold text-white">{title}</p><p className="text-[10px] text-white/55">{description}</p></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#04141a]/68 px-2.5 py-1.5 text-[10px] font-medium text-white/62"><ShieldCheck size={13} className="text-success" />Ambiente monitorado e protegido</div>
            </div>
          </section>

          <main className="flex items-center justify-center bg-[#07121a]/98 px-5 py-6 sm:px-7 lg:px-9">
            <div className="w-full max-w-[410px]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 rounded-lg border border-transparent bg-transparent px-2 text-white/55 hover:border-white/10 hover:bg-white/5 hover:text-white"><Link to="/" search={{} as any}><ArrowLeft size={14} className="mr-1.5" />Voltar</Link></Button>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/60"><LockKeyhole size={11} className="text-primary" />admin</span>
              </div>

              <div className="mb-5">
                <span className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary"><ShieldCheck size={19} /></span>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Credenciais administrativas</p>
                <h2 className="mt-1.5 font-display text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[1.8rem]">Entrar no painel</h2>
                <p className="mt-1.5 text-sm leading-5 text-white/55">Somente contas administrativas previamente autorizadas.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="institutional-email" className="text-xs font-medium text-white/75">E-mail do administrador</Label>
                  <Input id="institutional-email" type="email" autoComplete="username" placeholder="administrador@dominio.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={isLoading} className="h-11 rounded-xl border-white/12 bg-white/[.04] px-3.5 text-sm text-white placeholder:text-white/30 focus-visible:border-primary/50 focus-visible:ring-primary/50" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="institutional-password" className="text-xs font-medium text-white/75">Senha</Label>
                  <div className="relative">
                    <Input id="institutional-password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Digite sua senha" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={isLoading} className="h-11 rounded-xl border-white/12 bg-white/[.04] px-3.5 pr-11 text-sm text-white placeholder:text-white/30 focus-visible:border-primary/50 focus-visible:ring-primary/50" />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/55 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="h-11 w-full"><ShieldCheck size={16} />{isLoading ? "Validando..." : "Acessar administração"}</Button>
              </form>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[.03] px-3.5 py-3">
                <div className="flex items-start gap-2.5"><LockKeyhole size={14} className="mt-0.5 shrink-0 text-primary" /><p className="text-[11px] leading-5 text-white/55">Credenciais inválidas permanecem nesta tela. O acesso só é liberado após autenticação e validação do papel administrativo.</p></div>
              </div>

              <p className="mt-4 text-center text-[9px] uppercase tracking-[0.1em] text-white/30">Acesso restrito · sessão protegida</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
