import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowLeft, FileText, Scale, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms/")({
  component: TermsPage,
  head: () => ({
    title: "Termos de Uso — Body Métrica FJ",
    meta: [
      { name: "description", content: "Diretrizes de uso, responsabilidades e limites da plataforma Body Métrica FJ." },
      { property: "og:title", content: "Termos de Uso — Body Métrica FJ" },
      { property: "og:description", content: "Um resumo claro das regras e responsabilidades de uso da plataforma." },
      { property: "og:image", content: "/bodymetrica-admin-2026.jpg" },
    ],
  }),
});

const TERMS = [
  {
    icon: FileText,
    index: "01",
    title: "Aceitação e finalidade",
    text: "Ao utilizar o Body Métrica FJ, você concorda com estes termos. A plataforma é voltada ao acompanhamento pessoal de métricas, hábitos e evolução e não substitui diagnóstico, prescrição ou acompanhamento médico, nutricional ou profissional especializado.",
  },
  {
    icon: ShieldCheck,
    index: "02",
    title: "Conta e uso responsável",
    text: "Você é responsável por manter seus dados de acesso protegidos e por utilizar a plataforma de forma legítima. Tentativas de acesso indevido, fraude, abuso ou violação de segurança podem resultar em restrição ou suspensão de acesso.",
  },
  {
    icon: Activity,
    index: "03",
    title: "Resultados e limitações",
    text: "Estimativas, cálculos e indicadores exibidos pela plataforma servem como apoio ao acompanhamento. Resultados individuais variam e decisões de saúde, dieta ou exercício devem considerar orientação de profissionais qualificados quando necessário.",
  },
];

function TermsPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="relative z-50 border-b border-border/70 bg-background/95">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-xl">
              <Link to="/" search={{} as any} aria-label="Voltar para a página inicial"><ArrowLeft size={18} /></Link>
            </Button>
            <div className="leading-tight">
              <p className="font-display text-base font-semibold tracking-tight">Termos de uso</p>
              <p className="hidden text-xs text-muted-foreground sm:block">Regras, limites e responsabilidades</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="min-h-10 rounded-xl bg-background px-4"><Link to="/privacy">Privacidade</Link></Button>
        </div>
      </header>

      <main className="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden">
        <img src="/bodymetrica-admin-2026.jpg" alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-20 bg-background/62 dark:bg-background/72" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/99 via-background/92 to-background/66 dark:from-background dark:via-background/96 dark:to-background/76" />

        <section className="container mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-8 px-4 py-8 md:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 lg:py-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background/92 px-3.5 py-1.5 text-sm font-semibold shadow-sm">
              <Scale size={15} className="text-primary" />
              Diretrizes de uso
            </div>
            <h1 className="mt-5 font-display text-[clamp(2.55rem,5.5vw,4.45rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-balance">
              Regras simples para uma experiência <span className="text-primary">segura e responsável.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-foreground/74 md:text-lg md:leading-8">
              Os termos foram organizados para deixar claro o que a plataforma oferece, o que depende do usuário e quais são os limites do serviço.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-xl px-6"><Link to="/help">Tirar dúvidas</Link></Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl bg-background/92 px-6"><Link to="/about">Sobre o projeto</Link></Button>
            </div>
            <p className="mt-5 text-xs font-medium text-foreground/50">Última atualização: agosto de 2026.</p>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-background/95 shadow-xl shadow-black/10">
            <div className="border-b border-border/70 px-5 py-4 md:px-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Resumo essencial</p>
              <p className="mt-1 text-sm text-foreground/62">Leitura rápida dos pontos principais dos termos.</p>
            </div>
            <div className="divide-y divide-border/70">
              {TERMS.map(({ icon: Icon, index, title, text }) => (
                <article key={title} className="grid grid-cols-[auto_1fr] gap-4 px-5 py-4 md:px-6 md:py-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={19} /></div>
                  <div>
                    <div className="flex items-center gap-2"><span className="text-[10px] font-bold tracking-[0.14em] text-primary/80">{index}</span><span className="h-px w-6 bg-primary/25" /></div>
                    <h2 className="mt-1 font-display text-base font-semibold tracking-tight md:text-lg">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-foreground/62">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
