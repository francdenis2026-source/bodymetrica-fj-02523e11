import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, type ReactNode, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { 
  LayoutDashboard, 
  Droplets, 
  Utensils, 
  Pill, 
  Dumbbell, 
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Target,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { syncOfflineActions, getSyncHistory } from "@/lib/offline-sync";
import { scheduleNotifications } from "@/lib/notifications";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AppErrorBoundary } from "@/components/ui/error-boundary";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { isAuthenticated, clearSession, getSession, setupLogoutListener } from "@/lib/auth/auth.functions";
import { AccessGate } from "@/components/access-gate";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { validateLicense, checkLicenseStatus } from "@/lib/monetization.functions";


import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center surface border-none p-12 md:p-16 rounded-[2.5rem] animate-in fade-in zoom-in duration-700">
        <h1 className="text-7xl md:text-8xl font-semibold font-display text-primary tracking-tight leading-none">404</h1>
        <h2 className="mt-5 text-xl font-semibold text-foreground leading-none">Página não encontrada</h2>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          O caminho que você está tentando acessar não existe ou foi movido.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            search={{} as any}
            className="inline-flex items-center justify-center rounded-2xl bg-brand-gradient px-10 h-12 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 shadow-brand"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AppErrorBoundary 
        error={error} 
        reset={() => {
          router.invalidate();
          reset();
        }} 
      />
    </div>
  );
}

function StatusIcon({ isOnline }: { isOnline: boolean }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) return <div className="w-3 h-3 rounded-full bg-muted animate-pulse" />;
  
  return isOnline ? (
    <Wifi className="w-3 h-3 text-success" />
  ) : (
    <WifiOff className="w-3 h-3 text-destructive" />
  );
}


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Body Métrica FJ — Composição Corporal e Saúde" },
      { name: "description", content: "Suíte completa para acompanhamento de composição corporal, alimentação, hidratação, suplementação e treinos." },
      { name: "author", content: "Body Métrica FJ" },
      { property: "og:title", content: "Body Métrica FJ — Composição Corporal e Saúde" },
      { property: "og:description", content: "Suíte completa para acompanhamento de composição corporal, alimentação, hidratação, suplementação e treinos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0a1317" },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Outfit:wght@400;700;900&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('bodymetrica_user_theme') || localStorage.getItem('theme');
                  var theme = (stored === 'light' || stored === 'dark')
                    ? stored
                    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  root.classList.add(theme);
                  root.style.colorScheme = theme;
                  localStorage.setItem('bodymetrica_user_theme', theme);
                  localStorage.setItem('theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
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
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [needsLicense, setNeedsLicense] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Default to true to match server for hydration
  const [actualIsOnline, setActualIsOnline] = useState(true);

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [syncHistory, setSyncHistory] = useState<{lastSync: number | null, totalSynced: number, failures: number}>({lastSync: null, totalSynced: 0, failures: 0});
  const checkLicenseStatusFn = useServerFn(checkLicenseStatus);
  const isAdminRoute = location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  const handleManualSync = async () => {
    if (!isOnline) {
      toast.custom((t) => (
        <SVGToast 
          type="error"
          title="ERRO DE CONEXÃO"
          message="Não é possível sincronizar offline. Verifique sua rede."
          onClose={() => toast.dismiss(t)}
        />
      ));
      return;
    }
    setSyncStatus('syncing');
    
    // Polling license status during sync as well
    const statusRes = await checkLicenseStatusFn();
    if (statusRes.success && statusRes.changed) {
      handleLogout();
      return;
    }

    await syncOfflineActions();
    const history = await getSyncHistory();
    setSyncHistory(history);
    setSyncStatus('synced');
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  useEffect(() => {
    // Consumer license checks never apply to the administrative area.
    const pollLicense = async () => {
      if (isLoggedIn && isOnline && !isAdminRoute) {
        const res = await checkLicenseStatusFn();
        if (res.success && (res.status === 'revoked' || res.status === 'expired')) {
          handleLogout();
          toast.custom((t) => (
            <SVGToast 
              type="error"
              title="LICENÇA EXPIRADA"
              message="Sua licença foi revogada ou expirou. Acesso encerrado."
              onClose={() => toast.dismiss(t)}
            />
          ));
        }

        // Automatic e-mail check for near expiration could be handled here via a dedicated server function
        // but it's better handled by a background CRON job in a real production environment.
      }
    };

    const interval = setInterval(pollLicense, 1000 * 60 * 5); // 5 minutes
    
    // Check when tab gains focus
    const handleFocus = () => pollLicense();
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleFocus);
      }
    };
  }, [isLoggedIn, isOnline, isAdminRoute]);


  useEffect(() => {
    getSyncHistory().then(setSyncHistory);
  }, [syncStatus]);

  useEffect(() => {
    // Setup cross-tab logout listener
    const cleanupLogoutListener = setupLogoutListener(() => {
      setIsLoggedIn(false);
      queryClient.clear();
      toast.info("Sessão encerrada em outra aba.");
      window.location.href = "/auth";
    });

    // Supabase Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED' || event === 'SIGNED_IN') {
        const localSession = getSession();
        
        if (event === 'SIGNED_OUT') {
          if (localSession) {
             handleLogout();
          } else if (location.pathname !== '/auth') {
             // Handle actual session expiry (when Supabase signs out due to token expiry)
             toast.custom((t) => (
               <SVGToast 
                 type="warning"
                 title="SESSÃO EXPIRADA"
                 message="Sua sessão expirou por segurança. Por favor, autentique-se novamente."
                 onClose={() => toast.dismiss(t)}
               />
             ), { duration: 6000 });
             navigate({ to: '/auth' as any, search: {} as any });
          }
        } else if (session) {
           // Refresh local license status from DB if possible
           const { data: profile } = await supabase.from('profiles').select('license_status').eq('id', session.user.id).single();
           if (profile) {
             const updatedSession = { 
               ...localSession, 
               user: { 
                 ...localSession?.user, 
                 ...session.user, 
                 licenseStatus: profile.license_status,
                 isLicensed: profile.license_status === 'active'
               } 
             };
             localStorage.setItem('bodymetrica_auth_session', JSON.stringify(updatedSession));
             setIsLoggedIn(true);
             setNeedsLicense(profile.license_status !== 'active');
           }
        }
      }
    });

    // Check initial auth state
    const session = getSession();
    setIsLoggedIn(!!session);
    setNeedsVerification(session?.needsVerification || false);
    setNeedsLicense(!!session && session.licenseStatus !== 'active');
    setAuthChecked(true);

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered:", registration);
            
            // Check for updates periodically
            registration.update();

            // Reschedule notifications on reload
            scheduleNotifications();

            // Listen for update prompt
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    toast.custom((t) => (
                      <SVGToast 
                        type="info"
                        title="ATUALIZAÇÃO DISPONÍVEL"
                        message="Uma nova versão da suíte de performance está disponível."
                        action={{
                          label: "ATUALIZAR",
                          onClick: () => window.location.reload()
                        }}
                        onClose={() => toast.dismiss(t)}
                      />
                    ), { duration: 10000 });
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error("SW registration failed:", error);
          });
      });
    }

    const handleOnline = () => {
      setIsOnline(true);
      setActualIsOnline(true);
      setSyncStatus('syncing');
      syncOfflineActions().then(() => setSyncStatus('synced'));
      setTimeout(() => setSyncStatus('idle'), 3000);
      toast.custom((t) => (
        <SVGToast 
          type="success"
          title="SINCRO ESTRUTURAL"
          message="Conexão restabelecida. Sincronizando dados de performance..."
          onClose={() => toast.dismiss(t)}
        />
      ));
    };

    const handleOffline = () => {
      setIsOnline(false);
      setActualIsOnline(false);
    };

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      setActualIsOnline(navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }


    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }

      cleanupLogoutListener();
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    queryClient.clear();
    toast.custom((t) => (
      <SVGToast 
        type="success"
        title="SESSÃO ENCERRADA"
        message="Logout realizado com sucesso. Até a próxima evolução."
        onClose={() => toast.dismiss(t)}
      />
    ));
    window.location.href = "/auth";
  };
  
  const publicRoutes = ["/", "/auth", "/auth/verify", "/terms", "/privacy", "/about", "/tools", "/help", "/goals"];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  const showSidebar = !isPublicRoute && !isAdminRoute && isLoggedIn;

  return (
    <QueryClientProvider client={queryClient}>
      {/* Sync Status Indicator */}
      <div className="fixed bottom-24 right-4 z-[100] flex flex-col items-end gap-2 md:bottom-8 lg:right-8 transition-all duration-300">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-white/10 shadow-lg animate-in fade-in slide-in-from-top-2 group relative">
          {syncStatus === 'syncing' ? (
            <Loader2 className="w-3 h-3 animate-spin text-primary" />
          ) : (
            <StatusIcon isOnline={actualIsOnline} />
          )}
          <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground/60">
            {syncStatus === 'syncing' ? 'Sincronizando...' : actualIsOnline ? 'Online' : 'Offline'}
          </span>


          
          {isOnline && (
            <button 
              onClick={handleManualSync}
              className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
              title="Sincronizar agora"
            >
              <Zap size={10} className="text-primary" />
            </button>
          )}

          {/* Sync History Tooltip-like details */}
          <div className="absolute top-full right-0 mt-2 w-48 surface p-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-[110] text-[9px] uppercase font-semibold tracking-tighter space-y-2">
             <div className="flex justify-between">
                <span className="text-muted-foreground">Última Sinc:</span>
                <span>{syncHistory.lastSync ? new Date(syncHistory.lastSync).toLocaleTimeString() : 'Nunca'}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Total Enviado:</span>
                <span className="text-success">{syncHistory.totalSynced}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-muted-foreground">Falhas:</span>
                <span className="text-destructive">{syncHistory.failures}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="app-shell flex min-h-screen w-full flex-col md:flex-row bg-background transition-colors duration-300">
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <aside className={cn(
              "hidden md:flex flex-col border-r border-white/5 bg-card/30 backdrop-blur-3xl sticky top-0 h-screen z-40 transition-all duration-300",
              "w-20 hover:w-80 focus-within:w-80 group/sidebar" // Expands on hover OR focus
            )}>
              <div className="p-6 border-b border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="flex items-center gap-4">
                  <div className="min-w-[40px] h-10 bg-brand-gradient rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-xl border border-white/10 shrink-0">
                    B
                  </div>
                  <div className="overflow-hidden transition-all duration-300 group-hover/sidebar:opacity-100 opacity-0 group-hover/sidebar:translate-x-0 -translate-x-4">
                    <h1 className="text-lg font-semibold font-display text-foreground leading-none tracking-tight whitespace-nowrap">
                      Body Métrica <span className="text-primary">FJ</span>
                    </h1>
                    <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-foreground/35 mt-1.5">Saúde em contexto</p>
                  </div>
                </div>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-none">
                <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="DASHBOARD" />
                <SidebarLink to="/goals" icon={<Target size={20} />} label="METAS" />
                <SidebarLink to="/profile" icon={<User size={20} />} label="PERFIL" />
                <SidebarLink to="/body" icon={<Zap size={20} />} label="COMPOSIÇÃO" />
                <SidebarLink to="/nutrition" icon={<Utensils size={20} />} label="NUTRIÇÃO" />
                <SidebarLink to="/hydration" icon={<Droplets size={20} />} label="HIDRATAÇÃO" />
                <SidebarLink to="/supplements" icon={<Pill size={20} />} label="PROTOCOLOS" />
                <SidebarLink to="/training" icon={<Dumbbell size={20} />} label="PERFORMANCE" />
              </nav>
              <div className="p-4 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden transition-all duration-300 group-hover/sidebar:opacity-100">
                  <span className="text-[8px] font-semibold tracking-[0.2em] text-foreground/40 uppercase whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity">TEMA</span>
                  <ThemeToggle />
                </div>
                <SidebarLink to="/settings" icon={<Settings size={20} />} label="AJUSTES" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 text-[11px] font-semibold tracking-wide text-destructive hover:bg-destructive/10 rounded-xl transition-all uppercase border-2 border-transparent group overflow-hidden"
                >
                  <LogOut size={20} className="group-hover:scale-110 transition-transform shrink-0" />
                  <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity whitespace-nowrap">SAIR</span>
                </button>
              </div>
            </aside>


            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around p-2 pb-safe shadow-2xl">
              <MobileNavLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Início" />
              <MobileNavLink to="/body" icon={<User size={20} />} label="Corpo" />
              <MobileNavLink to="/nutrition" icon={<Utensils size={20} />} label="Dieta" />
              <MobileNavLink to="/training" icon={<Dumbbell size={20} />} label="Treino" />
              <div className="flex flex-col items-center justify-center min-w-[56px]">
                <ThemeToggle />
              </div>
            </nav>
          </>
        )}

        <main className={cn(
          "flex-1 flex flex-col min-w-0",
          showSidebar && "mb-20 md:mb-0"
        )}>
          <div className="flex-1">
            <AccessGate 
              isAllowed={isAdminRoute || isPublicRoute || (isLoggedIn && !needsVerification && !needsLicense)} 
              needsVerification={!isAdminRoute && needsVerification}
              needsLicense={!isAdminRoute && needsLicense && !isPublicRoute}
            >
              <Outlet />
            </AccessGate>
          </div>
          <footer className="py-8 px-6 text-center border-t border-border/60 mt-auto">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-muted-foreground/50 uppercase">Body Métrica FJ · Suíte de Performance</p>
          </footer>
        </main>
      </div>
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}

function SidebarLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      activeProps={{ className: "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02] border-primary" }}
      inactiveProps={{ className: "text-foreground/60 hover:bg-white/5 hover:text-foreground border-transparent" }}
      className="flex items-center gap-4 px-4 py-3 text-[11px] font-semibold tracking-wide rounded-xl transition-all uppercase group border-2 overflow-hidden whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none"
    >
      <span className="group-hover:scale-110 transition-transform shrink-0">{icon}</span>
      <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 pointer-events-none group-focus-within/sidebar:opacity-100">{label}</span>
    </Link>
  );
}


function MobileNavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      activeProps={{ className: "text-primary scale-110" }}
      inactiveProps={{ className: "text-muted-foreground opacity-60" }}
      className="flex flex-col items-center gap-1 p-2 min-w-[56px] transition-all duration-300"
    >
      {icon}
      <span className="text-[9px] font-semibold uppercase tracking-tighter">{label}</span>
    </Link>
  );
}
