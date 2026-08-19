import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "allowed" | "denied">(
    location.pathname === "/admin/login" ? "allowed" : "checking",
  );

  useEffect(() => {
    if (location.pathname === "/admin/login") {
      setStatus("allowed");
      return;
    }

    let active = true;

    const verifyAdmin = async () => {
      setStatus("checking");
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (!active) return;

      if (userError || !userData.user) {
        setStatus("denied");
        navigate({ to: "/admin/login" as any, replace: true });
        return;
      }

      const { data: adminSession, error: adminError } = await (supabase.rpc as any)("admin_session");
      if (!active) return;

      const sessionRow = Array.isArray(adminSession) ? adminSession[0] : adminSession;
      if (adminError || !sessionRow?.user_id) {
        await supabase.auth.signOut();
        if (!active) return;
        setStatus("denied");
        navigate({ to: "/admin/login" as any, replace: true });
        return;
      }

      setStatus("allowed");
    };

    verifyAdmin();
    return () => {
      active = false;
    };
  }, [location.pathname, navigate]);

  if (location.pathname === "/admin/login") return <Outlet />;

  if (status !== "allowed") {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card px-5 py-4 shadow-sm">
          {status === "checking" ? <Loader2 size={18} className="animate-spin text-primary" /> : <ShieldCheck size={18} className="text-primary" />}
          <div>
            <p className="text-sm font-semibold">Validando acesso</p>
            <p className="text-xs text-muted-foreground">Confirmando permissões administrativas.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Outlet />
    </div>
  );
}
