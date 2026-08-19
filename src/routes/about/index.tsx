import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  MapPin,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about/")({
  component: AboutPage,
  head: () => ({
    title: "Sobre o Body Métrica FJ",
    meta: [
      {
        name: "description",
        content:
          "Conheça a proposta do Body Métrica FJ e como a plataforma reúne composição corporal, nutrição, hidratação e treino.",
      },
      { property: "og:title", content: "Sobre o Body Métrica FJ" },
      {
        property: "og:description",
        content:
          "Tecnologia aplicada ao acompanhamento de saúde e composição corporal.",
      },
    ],
  }),
});

const PRINCIPLES = [
  {
    icon: BarChart3,
    label: "CLAREZA",
    title: "Dados que fazem sentido",
    description: "Informação organizada para mostrar evolução sem transformar a rotina em um painel técnico.",
  },
  {
    icon: WifiOff,
    label: "CONTINUIDADE",
    title: "Feito para o uso real",
    description: "Uma experiência leve, direta e preparada para diferentes condições de acesso e conexão.",
  },
  {
    icon: ShieldCheck,
    label: "PRIVACIDADE",
    title: "Controle em primeiro lugar",
    description: "Métricas pessoais tratadas com discrição, previsibilidade e foco em segurança.",
  },
];

const authSearch = {
  registerMode: true,
  reset: false,
  name: "",
  birthDate: "",
  goal: "",
  weight: "",
  height: "",
  activityLevel: "",
};

function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="relative z-50 border-b border-border/70 bg-background/95">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-xl">
              <Link to="/" search={{} as any} aria-label="Voltar para a página inicial">
                <ArrowLeft size={18} />
              </Link>
            </Button>
            <div className="leading-tight">
              <p className="font-display text-base font-semibold tracking-tight">Body Métrica FJ</p>
              <p className="hidden text-xs text-muted-foreground sm:block">Sobre o projeto</p>
            </div>
          </div>

          <Button asChild size="sm" variant="outline" className="min-h-10 rounded-xl bg-background px-4">
            <Link to="/auth" search={authSearch}>Criar conta</Link>
          </Button>
        </div>
      </header>

      <main className="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1800"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-background/42 dark:bg-background/55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/97 via-background/82 to-background/48 dark:from-background/98 dark:via-background/88 dark:to-background/58" />

        <section className="container mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col px-4 py-7 md:px-6 md:py-9 lg:py-10">
          <div className="grid flex-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background/92 px-3.5 py-1.5 text-sm font-semibold text-foreground shadow-sm">
                <Sparkles size={15} className="text-primary" aria-hidden="true" />
                Conheça o projeto
              </div>

              <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.65rem,6vw,4.8rem)] font-semibold leading-[1.01] tracking-[-0.045em] text-balance">
                Menos ruído. <span className="text-primary">Mais clareza sobre sua evolução.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base font-medium leading-7 text-foreground/76 md:text-lg md:leading-8">
                O Body Métrica FJ reúne composição corporal, alimentação, hidratação, treino e metas em uma única experiência. A ideia é simples: transformar registros soltos em contexto útil para acompanhar o que realmente muda.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-xl px-6 font-semibold shadow-sm">
                  <Link to="/auth" search={authSearch}>
                    Começar agora
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-xl bg-background/92 px-6 font-medium shadow-sm">
                  <Link to="/tools">Ver ferramentas</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/66">
                <span className="inline-flex items-center gap-2 font-medium">
                  <MapPin size={15} className="text-primary" />
                  Feijó, Acre
                </span>
                <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
                <span>Desenvolvido por Franc D&apos;nis</span>
              </div>
            </div>

            <div className="lg:pl-2">
              <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-background/94 shadow-xl shadow-black/10">
                <div className="border-b border-border/70 px-5 py-4 md:px-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Princípios do produto</p>
                  <h2 className="mt-1 font-display text-xl font-semibold tracking-tight md:text-2xl">
                    Feito para acompanhar, não para impressionar.
                  </h2>
                </div>

                <div className="divide-y divide-border/70">
                  {PRINCIPLES.map(({ icon: Icon, label, title, description }) => (
                    <article key={title} className="grid grid-cols-[auto_1fr] gap-4 px-5 py-4 md:px-6 md:py-5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
                        <Icon size={19} strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.14em] text-primary/80">{label}</p>
                        <h3 className="mt-1 font-display text-base font-semibold tracking-tight md:text-lg">{title}</h3>
                        <p className="mt-1 text-sm leading-6 text-foreground/62">{description}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="border-t border-border/70 bg-muted/35 px-5 py-4 md:px-6">
                  <p className="text-sm leading-6 text-foreground/65">
                    Produto em evolução contínua, com foco em experiência de uso, organização de dados e decisões mais simples no cotidiano.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-8 flex flex-col gap-2 border-t border-border/60 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>Body Métrica FJ · saúde, composição corporal e rotina em uma única visão.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="transition-colors hover:text-foreground">Privacidade</Link>
              <Link to="/terms" className="transition-colors hover:text-foreground">Termos</Link>
              <Link to="/help" className="transition-colors hover:text-foreground">Ajuda</Link>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
