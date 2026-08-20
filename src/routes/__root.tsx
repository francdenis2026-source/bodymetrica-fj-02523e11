import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Droplets,
  Dumbbell,
  LayoutDashboard,
  Loader2,
  LogOut,
  Pill,
  Settings,
  Target,
  User,
  Utensils,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AppErrorBoundary } from "@/components/ui/error-boundary";
import { AccessGate } from "@/components/access-gate";
import { cn } from "@/lib/utils";
import { clearSession, getSession, setSession, setupLogoutListener } from "@/lib/auth/auth.functions";
import { normalizeClientSession } from "@/lib/client-metrics";
import { getSyncHistory, syncOfflineActions } from "@/lib/offline-sync";
import { scheduleNotifications } from "@/lib/notifications";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { checkLicenseStatus } from "@/lib/monetization.functions";
import { reportLovableError } from "../lib/lovable-error-reporting";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-10 text-center shadow-xl">
        <p className="font-display text-7xl font-semibold text-primary">404</p>
        <h1 className="mt-4 text-xl font-semibold">Página não encontrada</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">O caminho solicitado não existe ou foi movido.</p>
        <Link to="/" className="mt-7 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground">Voltar ao início</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => reportLovableError(error, { boundary: "tanstack_root_error_component" }), [error]);
  return <div className="flex min-h-screen items-center justify-center p-4"><AppErrorBoundary error={error} reset={reset} /></div>;
}

function StatusIcon({ isOnline }: { isOnline: boolean }) {
  return isOnline ? <Wifi className="size-3 text-success" /> : <WifiOff className="size-3 text-destructive" />;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Body Métrica FJ — Composição Corporal e Saúde" },
      { name: "description", content: "Acompanhamento de composição corporal, alimentação, hidratação, suplementação e treinos." },
      { name: "theme-color", content: "#0a1317" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Outfit:wght@400;700;900&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var stored=localStorage.getItem('bodymetrica_user_theme')||localStorage.getItem('theme');var theme=(stored==='light'||stored==='dark')?stored:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(theme);root.style.colorScheme=theme;localStorage.setItem('bodymetrica_user_theme',theme);localStorage.setItem('theme',theme);}catch(e){}})();` }} />
        <HeadContent />
      </head>
      <body className="antialiased selection:bg-primary selection:text-primary-foreground" suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [needsLicense, setNeedsLicense] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced">("idle");
  const [syncHistory, setSyncHistory] = useState<{ lastSync: number | null; totalSynced: number; failures: number }>({ lastSync: null, totalSynced: 0, failures: 0 });
  const checkLicenseStatusFn = useServerFn(checkLicenseStatus);

  const isAdminRoute = location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  const publicRoutes = ["/", "/auth", "/auth/register", "/auth/recover", "/auth/verify", "/terms", "/privacy", "/about", "/tools", "/help"];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  const showSidebar = !isPublicRoute && !isAdminRoute && isLoggedIn;

  const refreshLicenseStatus = async () => {
    if (!isLoggedIn || !isOnline || isAdminRoute) return;
    try {
      const result = await checkLicenseStatusFn();
      if (result.success) setNeedsLicense(result.status !== "active");
    } catch {
      // License lookup must never invalidate an authenticated session.
    }
  };

  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error("Você está offline. Reconecte-se para sincronizar.");
      return;
    }
    setSyncStatus("syncing");
    try {
      await syncOfflineActions();
      await refreshLicenseStatus();
      const history = await getSyncHistory();
      setSyncHistory(history);
      setSyncStatus("synced");
      window.setTimeout(() => setSyncStatus("idle"), 2200);
    } catch {
      setSyncStatus("idle");
      toast.error("Não foi possível concluir a sincronização agora.");
    }
  };

  const handleLogout = async () => {
    try { await supabase.auth.signOut(); } catch {}
    clearSession();
    setIsLoggedIn(false);
    queryClient.clear();
    window.location.href = "/auth";
  };

  useEffect(() => {
    const local = normalizeClientSession(getSession());
    setIsLoggedIn(Boolean(local));
    setNeedsVerification(Boolean(local?.needsVerification));
    setNeedsLicense(Boolean(local && local.licenseStatus !== "active"));
    setAuthChecked(true);

    getSyncHistory().then(setSyncHistory).catch(() => undefined);

    const cleanupLogout = setupLogoutListener(() => {
      setIsLoggedIn(false);
      queryClient.clear();
      window.location.href = "/auth";
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        if (getSession()) clearSession();
        setIsLoggedIn(false);
        return;
      }

      if ((event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") && session?.user) {
        const previous = normalizeClientSession(getSession()) || {};
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
        const merged = normalizeClientSession({
          ...previous,
          id: session.user.id,
          email: session.user.email,
          name: profile?.name || previous.name || session.user.user_metadata?.["name"] || "Usuário",
          profile: { ...(previous.profile || {}), ...(profile || {}) },
          licenseStatus: profile?.license_status || previous.licenseStatus || "pending",
          isLicensed: profile?.license_status === "active",
        });
        setSession(merged);
        setIsLoggedIn(true);
        setNeedsVerification(!session.user.email_confirmed_at);
        setNeedsLicense(merged?.licenseStatus !== "active");
      }
    });

    const online = () => { setIsOnline(true); setSyncStatus("syncing"); syncOfflineActions().finally(() => setSyncStatus("idle")); };
    const offline = () => setIsOnline(false);
    setIsOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => scheduleNotifications()).catch(() => undefined);
    }

    return () => {
      cleanupLogout();
      subscription.unsubscribe();
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || isAdminRoute) return;
    refreshLicenseStatus();
    const interval = window.setInterval(refreshLicenseStatus, 5 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [isLoggedIn, isOnline, isAdminRoute]);

  const allowed = isAdminRoute || isPublicRoute || (isLoggedIn && !needsVerification);

  if (!authChecked && !isPublicRoute && !isAdminRoute) {
    return <QueryClientProvider client={queryClient}><div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="size-6 animate-spin text-primary" /></div></QueryClientProvider>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {!isPublicRoute && (
        <div className="fixed bottom-4 right-4 z-[70] md:bottom-6 md:right-6">
          <button type="button" onClick={handleManualSync} className="group flex items-center gap-2 rounded-full border border-border/70 bg-background/88 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground shadow-md backdrop-blur transition-opacity hover:opacity-100 md:opacity-70" title="Sincronizar agora">
            {syncStatus === "syncing" ? <Loader2 className="size-3 animate-spin text-primary" /> : <StatusIcon isOnline={isOnline} />}
            <span>{syncStatus === "syncing" ? "Sincronizando" : isOnline ? "Online" : "Offline"}</span>
            {isOnline && <Zap className="size-3 text-primary" />}
          </button>
        </div>
      )}

      <div className="app-shell flex min-h-screen w-full flex-col bg-background md:flex-row">
        {showSidebar && <AppSidebar onLogout={handleLogout} />}

        <main className={cn("flex min-w-0 flex-1 flex-col", showSidebar && "mb-20 md:mb-0")}>
          <div className="flex-1">
            <AccessGate isAllowed={allowed} needsVerification={!isAdminRoute && needsVerification} needsLicense={false}>
              <Outlet />
            </AccessGate>
          </div>
          {!isPublicRoute && <footer className="mt-auto border-t border-border/60 px-6 py-5 text-center"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/55">Body Métrica FJ · Saúde em contexto</p></footer>}
        </main>
      </div>
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}

function AppSidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <>
      <aside className="group/sidebar sticky top-0 z-40 hidden h-screen w-20 shrink-0 flex-col border-r border-border/60 bg-card/80 backdrop-blur-xl transition-[width] duration-300 hover:w-72 focus-within:w-72 md:flex">
        <div className="flex items-center gap-4 border-b border-border/60 p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">B</div>
          <div className="min-w-0 opacity-0 transition-opacity group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100"><p className="whitespace-nowrap font-display text-base font-semibold">Body Métrica FJ</p><p className="whitespace-nowrap text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Saúde em contexto</p></div>
        </div>
        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
          <SidebarLink to="/goals" icon={<Target />} label="Metas" />
          <SidebarLink to="/profile" icon={<User />} label="Perfil" />
          <SidebarLink to="/body" icon={<Zap />} label="Composição" />
          <SidebarLink to="/nutrition" icon={<Utensils />} label="Nutrição" />
          <SidebarLink to="/hydration" icon={<Droplets />} label="Hidratação" />
          <SidebarLink to="/supplements" icon={<Pill />} label="Protocolos" />
          <SidebarLink to="/training" icon={<Dumbbell />} label="Performance" />
        </nav>
        <div className="flex flex-col gap-2 border-t border-border/60 p-3">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 p-2"><span className="whitespace-nowrap text-[9px] uppercase tracking-[0.14em] text-muted-foreground opacity-0 transition-opacity group-hover/sidebar:opacity-100">Tema</span><ThemeToggle /></div>
          <SidebarLink to="/settings" icon={<Settings />} label="Ajustes" />
          <button type="button" onClick={onLogout} className="flex h-11 items-center gap-3 rounded-xl px-3 text-destructive transition-colors hover:bg-destructive/10"><LogOut className="size-5 shrink-0" /><span className="whitespace-nowrap text-xs font-semibold uppercase opacity-0 transition-opacity group-hover/sidebar:opacity-100">Sair</span></button>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border/70 bg-card/90 p-2 pb-safe backdrop-blur-xl md:hidden">
        <MobileNavLink to="/dashboard" icon={<LayoutDashboard />} label="Início" />
        <MobileNavLink to="/body" icon={<User />} label="Corpo" />
        <MobileNavLink to="/nutrition" icon={<Utensils />} label="Dieta" />
        <MobileNavLink to="/training" icon={<Dumbbell />} label="Treino" />
        <MobileNavLink to="/settings" icon={<Settings />} label="Ajustes" />
      </nav>
    </>
  );
}

function SidebarLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return <Link to={to as any} activeProps={{ className: "bg-primary text-primary-foreground" }} inactiveProps={{ className: "text-muted-foreground hover:bg-muted hover:text-foreground" }} className="flex h-11 items-center gap-3 rounded-xl px-3 transition-colors"><span className="[&>svg]:size-5 shrink-0">{icon}</span><span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.06em] opacity-0 transition-opacity group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100">{label}</span></Link>;
}

function MobileNavLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return <Link to={to as any} activeProps={{ className: "text-primary" }} inactiveProps={{ className: "text-muted-foreground" }} className="flex min-w-14 flex-col items-center gap-1 p-2"><span className="[&>svg]:size-5">{icon}</span><span className="text-[9px] font-semibold">{label}</span></Link>;
}
