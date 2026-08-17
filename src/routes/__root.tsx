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

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center surface border-none p-8">
        <h1 className="text-7xl font-black font-display text-primary tracking-tighter italic">404</h1>
        <h2 className="mt-4 text-xl font-black uppercase tracking-widest text-foreground italic">PÁGINA NÃO ENCONTRADA</h2>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          O caminho que você está tentando acessar não existe ou foi movido para uma nova zona de performance.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-8 h-12 text-xs font-black uppercase tracking-widest text-primary-foreground transition-all hover:scale-105 shadow-xl shadow-primary/20"
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
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [syncHistory, setSyncHistory] = useState<{lastSync: number | null, totalSynced: number, failures: number}>({lastSync: null, totalSynced: 0, failures: 0});

  const handleManualSync = async () => {
    if (!isOnline) {
      toast.error("Não é possível sincronizar offline.");
      return;
    }
    setSyncStatus('syncing');
    await syncOfflineActions();
    const history = await getSyncHistory();
    setSyncHistory(history);
    setSyncStatus('synced');
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        const localSession = getSession();
        if (!session && localSession) {
          handleLogout();
        }
      }
    });

    // Check initial auth state
    const session = getSession();
    setIsLoggedIn(!!session);
    setNeedsVerification(session?.needsVerification || false);
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
      setSyncStatus('syncing');
      syncOfflineActions().then(() => setSyncStatus('synced'));
      setTimeout(() => setSyncStatus('idle'), 3000);
      toast.success("Conexão restabelecida. Sincronizando dados...");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Você está offline. O modo offline está ativo.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
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
      <div className="fixed top-4 right-4 z-[100] flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-white/10 shadow-lg animate-in fade-in slide-in-from-top-2 group relative">
          {syncStatus === 'syncing' ? (
            <Loader2 className="w-3 h-3 animate-spin text-primary" />
          ) : isOnline ? (
            <Wifi className="w-3 h-3 text-success" />
          ) : (
            <WifiOff className="w-3 h-3 text-destructive" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
            {syncStatus === 'syncing' ? 'Sincronizando...' : isOnline ? 'Online' : 'Offline'}
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
            <aside className="hidden md:flex w-72 flex-col border-r border-white/5 bg-card/50 backdrop-blur-2xl sticky top-0 h-screen z-40">
              <div className="p-8 border-b border-white/5">
                <h1 className="text-2xl font-black font-display text-primary leading-tight tracking-tighter uppercase italic">
                  BODY MÉTTRICA
                </h1>
              </div>
              <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                <SidebarLink to="/dashboard" icon={<LayoutDashboard size={22} />} label="DASHBOARD" />
                <SidebarLink to="/goals" icon={<Target size={22} />} label="METAS" />
                <SidebarLink to="/body" icon={<User size={22} />} label="COMPOSIÇÃO" />
                <SidebarLink to="/nutrition" icon={<Utensils size={22} />} label="NUTRIÇÃO" />
                <SidebarLink 
                  to="/hydration" 
                  icon={<Droplets size={22} />} 
                  label="HIDRATAÇÃO" 
                />
                <SidebarLink to="/supplements" icon={<Pill size={22} />} label="PROTOCOLOS" />
                <SidebarLink to="/training" icon={<Dumbbell size={22} />} label="PERFORMANCE" />
              </nav>
              <div className="p-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl">
                  <span className="text-[10px] font-black tracking-widest text-foreground/40 uppercase">TEMA</span>
                  <ThemeToggle />
                </div>
                <SidebarLink to="/settings" icon={<Settings size={22} />} label="AJUSTES" />
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-4 px-4 py-3 text-xs font-black tracking-widest text-destructive hover:bg-destructive/10 rounded-xl transition-all uppercase cursor-pointer"
                >
                  <LogOut size={22} />
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
            <AccessGate isAllowed={isPublicRoute || isLoggedIn} needsVerification={needsVerification}>
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
      className="flex items-center gap-4 px-4 py-3 text-[11px] font-black tracking-widest rounded-xl transition-all uppercase group border-2"
    >
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      {label}
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
