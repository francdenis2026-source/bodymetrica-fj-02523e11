import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BarChart3, Code2, MapPin, ShieldCheck, WifiOff } from "lucide-react";
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
        content: "Tecnologia aplicada ao acompanhamento de saúde e composição corporal.",
      },
    ],
  }),
});

const PRINCIPLES = [
  {
    icon: BarChart3,
    title: "Clareza antes de complexidade",
    description: "Os dados existem para ajudar na decisão, não para transformar a experiência em um painel técnico difícil de ler.",
  },
  {
    icon: WifiOff,
    title: "Resiliência no uso diário",
    description: "O projeto considera cenários de conectividade limitada e prioriza continuidade de uso sempre que possível.",
  },
  {
    icon: ShieldCheck,
    title: "Privacidade por padrão",
    description: "Informações pessoais e métricas corporais merecem uma experiência discreta, previsível e segura.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
        <div className="container mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6">
          <Button variant="ghost" size="icon" asChild className="rounded-xl">
            <Link to="/" search={{} as any} aria-label="Voltar para a página inicial">
              <ArrowLeft size={18} />
            </Link>
          </Button>
          <div>
            <p className="font-display text-base font-semibold tracking-tight">Sobre o Body Métrica FJ</p>
            <p className="hidden text-xs text-muted-foreground sm:block">Propósito, princípios e desenvolvimento</p>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-border/60">
          <div className="container mx-auto grid max-w-7xl gap-12 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Uma plataforma de acompanhamento pessoal</p>
              <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl md:text-6xl">
                Tecnologia para enxergar sua evolução com mais contexto.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                O Body Métrica FJ nasceu para reunir informações que normalmente ficam espalhadas: composição corporal, alimentação, hidratação, treino e metas. A proposta é transformar registros isolados em uma leitura contínua da evolução.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-xl px-6">
                  <Link
                    to="/auth"
                    search={{ registerMode: true, reset: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" }}
                  >
                    Criar conta
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-6">
                  <Link to="/tools">Ver ferramentas</Link>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-border bg-muted shadow-xl shadow-black/10">
              <div className="relative aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=85&w=1600"
                  alt="Dados e métricas exibidos em uma tela"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <p className="max-w-md font-display text-2xl font-semibold leading-tight md:text-3xl">
                    O dado só é útil quando ajuda você a entender o que mudou e por quê.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Princípios do produto</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Menos espetáculo visual. Mais confiança no que você está vendo.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PRINCIPLES.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/25">
          <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background text-primary shadow-sm">
                <Code2 size={22} />
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight md:text-4xl">Desenvolvido em Feijó, Acre</h2>
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                Feijó, AC · Brasil
              </div>
            </div>

            <div className="max-w-2xl space-y-5 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              <p>
                O projeto é desenvolvido por Franc D'nis com foco em resolver necessidades reais de acompanhamento pessoal por meio de software acessível, responsivo e simples de usar.
              </p>
              <p>
                A evolução do Body Métrica FJ combina engenharia de software, experiência de uso e organização de dados para construir um produto útil no cotidiano — sem depender de uma estética exageradamente técnica para parecer avançado.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="rounded-[2rem] border border-border bg-card p-7 md:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Próximo passo</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Use a plataforma e acompanhe seus próprios dados.</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                Comece com seus registros atuais e construa uma visão mais consistente da sua evolução ao longo do tempo.
              </p>
            </div>
            <Button asChild size="lg" className="mt-6 h-12 rounded-xl px-6 lg:mt-0">
              <Link
                to="/auth"
                search={{ registerMode: true, reset: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" }}
              >
                Começar agora
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
