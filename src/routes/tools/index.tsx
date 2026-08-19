import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BarChart3, Droplets, Dumbbell, LayoutDashboard, Settings, Sparkles, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tools/")({
  component: ToolsPage,
  head: () => ({
    title: "Ferramentas — Body Métrica FJ",
    meta: [
      { name: "description", content: "Explore os módulos de composição corporal, nutrição, treino, hidratação e acompanhamento do Body Métrica FJ." },
      { property: "og:title", content: "Ferramentas — Body Métrica FJ" },
      { property: "og:description", content: "Um ecossistema compacto para acompanhar sua evolução." },
      { property: "og:image", content: "/bodymetrica-hero-2026.jpg" },
    ],
  }),
});

const TOOLS = [
  { icon: LayoutDashboard, title: "Dashboard", description: "Resumo diário, metas e indicadores em uma visão central.", path: "/dashboard" },
  { icon: BarChart3, title: "Composição corporal", description: "Peso, medidas, tendências e registros de evolução.", path: "/body" },
  { icon: Utensils, title: "Nutrição", description: "Refeições, metas e organização alimentar no mesmo fluxo.", path: "/nutrition" },
  { icon: Dumbbell, title: "Treino", description: "Sessões, volume, desempenho e histórico de exercícios.", path: "/training" },
  { icon: Droplets, title: "Hidratação", description: "Metas hídricas e acompanhamento de consumo ao longo do dia.", path: "/hydration" },
  { icon: Settings, title: "Configurações", description: "Preferências, notificações e ajustes da sua experiência.", path: "/settings" },
];

const authSearch = { registerMode: true, reset: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" };

function ToolsPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="relative z-50 border-b border-border/70 bg-background/95">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-xl">
              <Link to="/" search={{} as any} aria-label="Voltar para a página inicial"><ArrowLeft size={18} /></Link>
            </Button>
            <div className="leading-tight">
              <p className="font-display text-base font-semibold tracking-tight">Ferramentas</p>
              <p className="hidden text-xs text-muted-foreground sm:block">Módulos do Body Métrica FJ</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="min-h-10 rounded-xl bg-background px-4"><Link to="/help">Ajuda</Link></Button>
        </div>
      </header>

      <main className="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden">
        <img src="/bodymetrica-hero-2026.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-20 bg-background/50 dark:bg-background/62" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/98 via-background/88 to-background/54 dark:from-background dark:via-background/94 dark:to-background/66" />

        <section className="container mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-8 px-4 py-8 md:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12 lg:py-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background/92 px-3.5 py-1.5 text-sm font-semibold shadow-sm">
              <Sparkles size={15} className="text-primary" />
              Ecossistema integrado
            </div>
            <h1 className="mt-5 font-display text-[clamp(2.55rem,5.5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-balance">
              Tudo que importa para acompanhar sua <span className="text-primary">evolução em um só lugar.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-foreground/74 md:text-lg md:leading-8">
              Seis módulos conectados para transformar registros de rotina em uma leitura simples de progresso, sem excesso de telas ou complexidade.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-xl px-6"><Link to="/auth" search={authSearch}>Começar agora<ArrowRight size={16} className="ml-2" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl bg-background/92 px-6"><Link to="/about">Conhecer o projeto</Link></Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-background/95 shadow-xl shadow-black/10">
            <div className="border-b border-border/70 px-5 py-4 md:px-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Acesso rápido</p>
              <p className="mt-1 text-sm text-foreground/62">Escolha um módulo para continuar.</p>
            </div>
            <div className="grid sm:grid-cols-2">
              {TOOLS.map(({ icon: Icon, title, description, path }, index) => (
                <Link
                  key={title}
                  to={path}
                  className={`group grid grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-4 transition-colors hover:bg-primary/[0.035] md:px-6 ${index > 1 ? "border-t border-border/70" : index === 1 ? "border-t border-border/70 sm:border-l sm:border-t-0" : ""} ${index > 1 && index % 2 === 1 ? "sm:border-l" : ""}`}
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={19} /></div>
                  <div className="min-w-0">
                    <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
                    <p className="mt-0.5 text-xs leading-5 text-foreground/58">{description}</p>
                  </div>
                  <ArrowRight size={16} className="text-foreground/35 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))}
            </div>
            <div className="border-t border-border/70 bg-muted/35 px-5 py-4 text-xs leading-5 text-foreground/58 md:px-6">
              Os módulos compartilham a mesma base de acompanhamento para reduzir retrabalho e manter a navegação consistente.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
