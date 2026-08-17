import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { 
  LayoutDashboard, 
  Droplets, 
  Utensils, 
  Pill, 
  Dumbbell, 
  User,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
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
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();

  const isPublicRoute = ["/", "/auth", "/admin/login"].includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen w-full flex-col md:flex-row bg-background">
        {!isPublicRoute && (
          <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r bg-card sticky top-0 h-screen">
              <div className="p-6 border-b">
                <h1 className="text-xl font-bold font-display text-primary leading-tight">
                  Body Métrica FJ
                </h1>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Início" />
                <SidebarLink to="/body" icon={<User size={20} />} label="Corpo" />
                <SidebarLink to="/nutrition" icon={<Utensils size={20} />} label="Alimentação" />
                <SidebarLink to="/hydration" icon={<Droplets size={20} />} label="Hidratação" />
                <SidebarLink to="/supplements" icon={<Pill size={20} />} label="Suplementos" />
                <SidebarLink to="/training" icon={<Dumbbell size={20} />} label="Treino" />
              </nav>
              <div className="p-4 border-t space-y-1">
                <SidebarLink to="/settings" icon={<Settings size={20} />} label="Configurações" />
                <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                  <LogOut size={20} />
                  Sair
                </button>
              </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t flex items-center justify-around p-2 pb-safe">
              <MobileNavLink to="/dashboard" icon={<LayoutDashboard size={22} />} label="Início" />
              <MobileNavLink to="/body" icon={<User size={22} />} label="Corpo" />
              <MobileNavLink to="/nutrition" icon={<Utensils size={22} />} label="Dieta" />
              <MobileNavLink to="/training" icon={<Dumbbell size={22} />} label="Treino" />
            </nav>
          </>
        )}

        <main className={cn(
          "flex-1 flex flex-col min-w-0",
          !isPublicRoute && "mb-16 md:mb-0"
        )}>
          <Outlet />
          <footer className="py-4 px-6 text-center text-[10px] text-muted-foreground/50 border-t mt-auto">
            dev <span className="font-semibold text-primary/60">Franc D'nis</span> Feijó, AC
          </footer>
        </main>
      </div>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

function SidebarLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      activeProps={{ className: "bg-primary/10 text-primary" }}
      inactiveProps={{ className: "text-muted-foreground hover:bg-accent hover:text-foreground" }}
      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      activeProps={{ className: "text-primary" }}
      inactiveProps={{ className: "text-muted-foreground" }}
      className="flex flex-col items-center gap-1 p-2 min-w-[64px]"
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
