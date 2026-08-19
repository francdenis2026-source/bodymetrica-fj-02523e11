import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

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
        toast.error("Credenciais inválidas ou acesso indisponível.");
        return;
      }

      const { data: adminSession, error: adminError } = await supabase.rpc("admin_session");
      const sessionRow = Array.isArray(adminSession) ? adminSession[0] : adminSession;

      if (adminError || !sessionRow?.user_id) {
        await supabase.auth.signOut();
        toast.error("Esta conta não possui permissão administrativa.");
        return;
      }

      toast.success("Acesso administrativo autorizado.");
      navigate({ to: "/admin" as any, replace: true });
    } catch {
      await supabase.auth.signOut();
      toast.error("Não foi possível validar o acesso administrativo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <img
        src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=86&w=2000"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-background/82 dark:bg-background/88" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/96 to-background/72" />

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-6">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-[1.8rem] border border-border/80 bg-background/96 shadow-2xl shadow-black/15 md:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden min-h-[520px] overflow-hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=88&w=1200"
              alt="Ambiente corporativo"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/42 to-black/12" />
            <div className="relative flex h-full flex-col justify-between p-7 text-white">
              <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-xs font-medium text-white/78">
                <ShieldCheck size={15} className="text-primary" />
                Área institucional
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/58">Body Métrica FJ</p>
                <h1 className="mt-3 max-w-sm font-display text-4xl font-semibold leading-[1.04] tracking-[-0.04em]">
                  Controle administrativo com acesso restrito.
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/66">
                  Ambiente reservado para gestão, auditoria e operações sensíveis do sistema.
                </p>
              </div>
            </div>
          </section>

          <main className="flex min-h-[520px] items-center px-5 py-7 sm:px-8 md:px-9">
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-7 flex items-center justify-between gap-4">
                <Button variant="ghost" size="sm" asChild className="-ml-2 h-9 rounded-lg px-2 text-muted-foreground">
                  <Link to="/" search={{} as any}><ArrowLeft size={15} className="mr-1.5" />Voltar</Link>
                </Button>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <LockKeyhole size={13} className="text-primary" /> Sessão protegida
                </span>
              </div>

              <div>
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck size={19} /></span>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-primary">Acesso administrativo</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.035em]">Identifique-se</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Use uma conta autorizada para continuar.</p>
              </div>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">E-mail</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 rounded-xl bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 rounded-xl bg-background pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="h-11 w-full rounded-xl font-semibold" disabled={isLoading}>
                  {isLoading ? "Validando acesso..." : "Continuar"}
                  {!isLoading && <ArrowRight size={16} className="ml-2" />}
                </Button>
              </form>

              <p className="mt-5 border-t border-border/70 pt-4 text-[11px] leading-5 text-muted-foreground">
                Tentativas e operações administrativas podem ser registradas para fins de segurança e auditoria.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
