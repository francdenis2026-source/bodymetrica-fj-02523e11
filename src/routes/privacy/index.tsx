import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Database, Eye, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy/")({
  component: PrivacyPage,
  head: () => ({
    title: "Política de Privacidade — Body Métrica FJ",
    meta: [
      { name: "description", content: "Entenda como o Body Métrica FJ trata seus dados pessoais e métricas de evolução." },
      { property: "og:title", content: "Política de Privacidade — Body Métrica FJ" },
      { property: "og:description", content: "Privacidade, controle e transparência sobre seus dados." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=82&w=1400" },
    ],
  }),
});

const ITEMS = [
  {
    icon: Database,
    label: "COLETA",
    title: "Somente o necessário",
    text: "O Body Métrica FJ utiliza informações necessárias para o acompanhamento, como medidas, peso, registros de evolução e dados do perfil. O objetivo é oferecer contexto ao usuário, sem coleta excessiva.",
  },
  {
    icon: LockKeyhole,
    label: "PROTEÇÃO",
    title: "Acesso controlado",
    text: "Registros pessoais e imagens de evolução ficam associados à conta autenticada. O acesso deve permanecer restrito ao titular e aos fluxos autorizados da plataforma.",
  },
  {
    icon: Eye,
    label: "CONTROLE",
    title: "Seus dados, suas decisões",
    text: "Você pode revisar suas informações e solicitar correção ou exclusão dos dados vinculados à sua conta, observadas as necessidades técnicas e legais aplicáveis.",
  },
];

function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="relative z-50 border-b border-border/70 bg-background/95">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-xl">
              <Link to="/" search={{} as any} aria-label="Voltar para a página inicial"><ArrowLeft size={18} /></Link>
            </Button>
            <div className="leading-tight">
              <p className="font-display text-base font-semibold tracking-tight">Privacidade</p>
              <p className="hidden text-xs text-muted-foreground sm:block">Dados, segurança e controle</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="min-h-10 rounded-xl bg-background px-4">
            <Link to="/terms">Ver termos</Link>
          </Button>
        </div>
      </header>

      <main className="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=82&w=1800" alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-20 bg-background/58 dark:bg-background/68" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/98 via-background/91 to-background/62 dark:from-background dark:via-background/94 dark:to-background/72" />

        <section className="container mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-8 px-4 py-8 md:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background/92 px-3.5 py-1.5 text-sm font-semibold shadow-sm">
              <ShieldCheck size={15} className="text-primary" />
              Privacidade por padrão
            </div>
            <h1 className="mt-5 font-display text-[clamp(2.55rem,5.5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-balance">
              Seus dados devem ser <span className="text-primary">claros para você e discretos para o sistema.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-foreground/74 md:text-lg md:leading-8">
              A política do Body Métrica FJ parte de três princípios simples: coletar menos, proteger melhor e manter o usuário no controle.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-xl px-6"><Link to="/help">Central de ajuda</Link></Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl bg-background/92 px-6"><Link to="/about">Sobre o projeto</Link></Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-background/95 shadow-xl shadow-black/10">
            <div className="border-b border-border/70 px-5 py-4 md:px-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Como tratamos seus dados</p>
              <p className="mt-1 text-sm text-foreground/62">Resumo direto dos compromissos centrais da plataforma.</p>
            </div>
            <div className="divide-y divide-border/70">
              {ITEMS.map(({ icon: Icon, label, title, text }) => (
                <article key={title} className="grid grid-cols-[auto_1fr] gap-4 px-5 py-4 md:px-6 md:py-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={19} /></div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] text-primary/80">{label}</p>
                    <h2 className="mt-1 font-display text-base font-semibold tracking-tight md:text-lg">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-foreground/62">{text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="border-t border-border/70 bg-muted/35 px-5 py-4 text-xs leading-5 text-foreground/58 md:px-6">
              Esta página resume os princípios de privacidade do produto e pode ser atualizada conforme a plataforma evolui.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
