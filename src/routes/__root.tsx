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
      <div className="max-w-md w-full text-center surface border-none p-12 md:p-16 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-700">
        <h1 className="text-8xl md:text-9xl font-black font-display text-primary tracking-tighter italic leading-none">404</h1>
        <h2 className="mt-6 text-2xl font-black uppercase tracking-[0.2em] text-foreground italic leading-none">PÁGINA NÃO ENCONTRADA</h2>
        <p className="mt-6 text-base text-muted-foreground leading-tight font-medium">
          O caminho que você está tentando acessar não existe ou foi movido para uma nova zona de performance.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-[1.5rem] bg-brand-gradient px-12 h-16 text-xs font-black uppercase tracking-[0.2em] text-primary-foreground transition-all hover:scale-105 shadow-[0_20px_40px_rgba(oklch(0.65_0.22_260),0.4)]"
          >
            VOLTAR AO INÍCIO
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
      { rel: "theme-color", content: "#0a0a0a" },
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
        <HeadContent />
      </head>
      <body className="antialiased selection:bg-primary selection:text-primary-foreground" suppressHydrationWarning>
        {children}
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.add(theme);
                  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
                  if (metaThemeColor) {
                    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
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

  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error("Não é possível sincronizar offline.");
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
    // Polling license status periodically
    const pollLicense = async () => {
      if (isLoggedIn && isOnline) {
        const res = await checkLicenseStatusFn();
        if (res.success && (res.status === 'revoked' || res.status === 'expired')) {
          handleLogout();
          toast.error("Sua licença foi revogada ou expirou. Acesso encerrado.");
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
  }, [isLoggedIn, isOnline]);


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
        if (event === 'SIGNED_OUT' && localSession) {
          handleLogout();
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
                    toast.info("Nova versão disponível!", {
                      action: {
                        label: "Atualizar",
                        onClick: () => window.location.reload()
                      },
                      duration: 10000
                    });
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
      toast.success("Conexão restabelecida. Sincronizando dados...");
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
    toast.success("Sessão encerrada com sucesso");
    window.location.href = "/auth";
  };
  
  const publicRoutes = ["/", "/auth", "/auth/verify", "/terms", "/privacy", "/about", "/tools", "/help", "/goals"];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  const showSidebar = !isPublicRoute && isLoggedIn;

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
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
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
          <div className="absolute top-full right-0 mt-2 w-48 surface p-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-[110] text-[9px] uppercase font-black tracking-tighter space-y-2">
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

      <div className="flex min-h-screen w-full flex-col md:flex-row bg-background transition-colors duration-300">
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <aside className={cn(
              "hidden md:flex flex-col border-r border-white/5 bg-card/30 backdrop-blur-3xl sticky top-0 h-screen z-40 transition-all duration-300",
              "w-80 group/sidebar hover:w-80",
              "w-20 hover:w-80" // Starts collapsed, expands on hover
            )}>
              <div className="p-6 border-b border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="flex items-center gap-4">
                  <div className="min-w-[40px] h-10 bg-brand-gradient rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-xl border border-white/10 shrink-0">
                    B
                  </div>
                  <div className="overflow-hidden transition-all duration-300 group-hover/sidebar:opacity-100 opacity-0 group-hover/sidebar:translate-x-0 -translate-x-4">
                    <h1 className="text-xl font-black font-display text-primary leading-none tracking-tighter uppercase italic whitespace-nowrap">
                      BODY MÉTTRICA <span className="text-foreground">FJ</span>
                    </h1>
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-foreground/20 mt-1">Performance Suite</p>
                  </div>
                </div>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-none">
                <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="DASHBOARD" />
                <SidebarLink to="/goals" icon={<Target size={20} />} label="METAS" />
                <SidebarLink to="/body" icon={<User size={20} />} label="COMPOSIÇÃO" />
                <SidebarLink to="/nutrition" icon={<Utensils size={20} />} label="NUTRIÇÃO" />
                <SidebarLink to="/hydration" icon={<Droplets size={20} />} label="HIDRATAÇÃO" />
                <SidebarLink to="/supplements" icon={<Pill size={20} />} label="PROTOCOLOS" />
                <SidebarLink to="/training" icon={<Dumbbell size={20} />} label="PERFORMANCE" />
              </nav>
              <div className="p-4 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden transition-all duration-300 group-hover/sidebar:opacity-100">
                  <span className="text-[8px] font-black tracking-[0.2em] text-foreground/40 uppercase whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity">TEMA</span>
                  <ThemeToggle />
                </div>
                <SidebarLink to="/settings" icon={<Settings size={20} />} label="AJUSTES" />
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-5 px-5 py-4 text-[11px] font-black tracking-[0.2em] text-destructive hover:bg-destructive/10 rounded-2xl transition-all uppercase cursor-pointer group"
                >
                  <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                  SAIR
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
              isAllowed={isPublicRoute || (isLoggedIn && !needsVerification && !needsLicense)} 
              needsVerification={needsVerification}
              needsLicense={needsLicense && !isPublicRoute}
            >
              <Outlet />
            </AccessGate>
          </div>
          <footer className="relative py-20 px-6 text-center border-t border-white/5 mt-auto overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10 grayscale pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800" 
                alt="Footer background" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 space-y-4">
              <h4 className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">BODY MÉTTRICA FJ • PERFORMANCE SUITE</h4>
              <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.3em] font-black italic">
                dev Franc D'nis Feijó, AC
              </p>
            </div>
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
      className="flex items-center gap-4 px-4 py-3 text-[11px] font-black tracking-widest rounded-xl transition-all uppercase group border-2 overflow-hidden whitespace-nowrap"
    >
      <span className="group-hover:scale-110 transition-transform shrink-0">{icon}</span>
      <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">{label}</span>
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
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </Link>
  );
}
