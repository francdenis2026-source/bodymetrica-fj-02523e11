import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Droplets,
  Dumbbell,
  Search,
  ShieldCheck,
  Sparkles,
  Utensils,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/help/")({
  component: HelpCenterPage,
  head: () => ({
    title: "Central de Ajuda — Body Métrica FJ",
    meta: [
      { name: "description", content: "Respostas rápidas e orientações sobre os principais recursos do Body Métrica FJ." },
      { property: "og:title", content: "Central de Ajuda — Body Métrica FJ" },
      { property: "og:description", content: "Uma central de suporte compacta para encontrar respostas e acessar os principais módulos." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=82&w=1400" },
    ],
  }),
});

type Category = "Geral" | "Nutrição" | "Treino" | "Hidratação" | "Corpo";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: Category;
}

const FAQS: FAQItem[] = [
  { id: "1", category: "Nutrição", question: "Como são definidas minhas metas de macros?", answer: "As metas usam os dados do perfil, nível de atividade e objetivo informado como referência. Elas ajudam no acompanhamento, mas podem ser ajustadas conforme sua rotina e orientação profissional." },
  { id: "2", category: "Nutrição", question: "Posso adaptar refeições e alimentos?", answer: "Sim. O módulo de Nutrição foi pensado para permitir ajustes sem perder a visão das metas e do consumo registrado ao longo do dia." },
  { id: "3", category: "Treino", question: "O que significa RPE no treino?", answer: "RPE representa o esforço percebido, normalmente em uma escala de 1 a 10. É uma forma simples de registrar quão exigente foi uma série ou sessão." },
  { id: "4", category: "Treino", question: "Como acompanho minha evolução de carga?", answer: "Use o histórico de treino para comparar cargas, repetições e volume. A leitura conjunta desses registros ajuda a identificar evolução com mais contexto." },
  { id: "5", category: "Hidratação", question: "Como funciona a meta diária de água?", answer: "A plataforma apresenta uma referência inicial baseada no perfil e permite acompanhar o consumo ao longo do dia. Necessidades reais variam conforme treino, clima e características individuais." },
  { id: "6", category: "Corpo", question: "Qual a melhor forma de registrar meu peso?", answer: "Prefira condições semelhantes entre os registros e observe a tendência ao longo do tempo. Oscilações isoladas são comuns e não representam, sozinhas, mudança de composição corporal." },
  { id: "7", category: "Geral", question: "Meus dados ficam protegidos?", answer: "A experiência foi desenhada para manter informações pessoais e métricas associadas à conta. Consulte a Política de Privacidade para entender os princípios aplicados ao tratamento dos dados." },
  { id: "8", category: "Geral", question: "Alguns recursos funcionam sem internet?", answer: "A disponibilidade offline depende do recurso. Experiências que exigem sincronização ou dados online precisam de conexão; registros com suporte local podem aguardar a próxima sincronização." },
];

const CATEGORIES: Array<{ id: "all" | Category; label: string }> = [
  { id: "all", label: "Tudo" },
  { id: "Geral", label: "Geral" },
  { id: "Nutrição", label: "Nutrição" },
  { id: "Treino", label: "Treino" },
  { id: "Hidratação", label: "Hidratação" },
  { id: "Corpo", label: "Corpo" },
];

const QUICK_LINKS = [
  { title: "Nutrição", caption: "Refeições e metas", icon: Utensils, to: "/nutrition" as const },
  { title: "Treinos", caption: "Séries e evolução", icon: Dumbbell, to: "/training" as const },
  { title: "Corpo", caption: "Peso e medidas", icon: BarChart3, to: "/body" as const },
  { title: "Hidratação", caption: "Consumo diário", icon: Droplets, to: "/hydration" as const },
];

function HelpCenterPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [openItem, setOpenItem] = useState<string | null>("1");

  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return FAQS.filter((faq) => {
      const matchesCategory = category === "all" || faq.category === category;
      const haystack = `${faq.question} ${faq.answer} ${faq.category}`.toLocaleLowerCase("pt-BR");
      return matchesCategory && (!term || haystack.includes(term));
    });
  }, [query, category]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setOpenItem(null);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="relative z-40 border-b border-border/70 bg-background/95">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-xl">
              <Link to="/" search={{} as any} aria-label="Voltar para a página inicial"><ArrowLeft size={18} /></Link>
            </Button>
            <div className="leading-tight">
              <p className="font-display text-base font-semibold tracking-tight">Central de ajuda</p>
              <p className="hidden text-xs text-muted-foreground sm:block">Body Métrica FJ · suporte rápido</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="h-10 rounded-xl bg-background px-4">
            <Link to="/tools">Explorar ferramentas</Link>
          </Button>
        </div>
      </header>

      <main className="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=82&w=1800"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-20 bg-background/72 dark:bg-background/80" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background/98 via-background/91 to-background/72 dark:from-background dark:via-background/96 dark:to-background/82" />

        <section className="container mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl items-center px-4 py-6 md:px-6 md:py-8">
          <div className="grid w-full overflow-hidden rounded-[1.8rem] border border-border/80 bg-background/94 shadow-xl shadow-black/10 lg:grid-cols-[0.78fr_1.22fr]">
            <aside className="relative border-b border-border/70 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-7">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                <Sparkles size={13} />
                suporte inteligente
              </div>

              <h1 className="mt-4 max-w-md font-display text-3xl font-semibold leading-[1.04] tracking-[-0.035em] sm:text-4xl">
                O que você precisa <span className="text-primary">resolver agora?</span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-foreground/62">
                Pesquise uma dúvida ou entre direto no módulo relacionado. Tudo em uma única área, sem navegação desnecessária.
              </p>

              <div className="relative mt-5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" size={17} />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ex.: água, macros, peso..."
                  aria-label="Pesquisar na central de ajuda"
                  className="h-11 rounded-xl border-border bg-card pl-10 pr-3 text-sm shadow-none"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setCategory(item.id); setOpenItem(null); }}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${category === item.id ? "bg-primary text-primary-foreground" : "border border-border/80 bg-card text-foreground/60 hover:text-foreground"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/45">Acesso rápido</p>
                  <span className="text-[10px] text-foreground/38">4 módulos</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_LINKS.map(({ title, caption, icon: Icon, to }) => (
                    <Link
                      key={title}
                      to={to}
                      className="group rounded-xl border border-border/75 bg-card/80 p-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.035]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon size={16} /></span>
                        <ArrowUpRight size={14} className="text-foreground/25 transition-colors group-hover:text-primary" />
                      </div>
                      <p className="mt-2 text-xs font-semibold">{title}</p>
                      <p className="mt-0.5 text-[10px] leading-4 text-foreground/45">{caption}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-border/70 bg-muted/35 px-3 py-2.5">
                <ShieldCheck size={16} className="shrink-0 text-primary" />
                <p className="text-[11px] leading-4 text-foreground/55">Dúvidas sobre seus dados? <Link to="/privacy" className="font-semibold text-foreground hover:text-primary">Ver privacidade</Link></p>
              </div>
            </aside>

            <section className="flex min-h-[520px] flex-col bg-card/40 lg:min-h-[610px]">
              <div className="flex items-center justify-between gap-4 border-b border-border/70 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen size={17} /></span>
                  <div>
                    <h2 className="text-sm font-semibold">Respostas recomendadas</h2>
                    <p className="text-[11px] text-foreground/45">{results.length} {results.length === 1 ? "resposta encontrada" : "respostas encontradas"}</p>
                  </div>
                </div>
                {(query || category !== "all") && (
                  <Button type="button" variant="ghost" size="sm" onClick={resetFilters} className="h-8 rounded-lg px-2.5 text-xs">Limpar busca</Button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {results.length > 0 ? (
                  <div className="divide-y divide-border/65">
                    {results.map((faq, index) => {
                      const isOpen = openItem === faq.id;
                      return (
                        <article key={faq.id} className={isOpen ? "bg-background/65" : ""}>
                          <button
                            type="button"
                            onClick={() => setOpenItem(isOpen ? null : faq.id)}
                            aria-expanded={isOpen}
                            className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-background/55 sm:px-6"
                          >
                            <span className="font-mono text-[10px] font-semibold text-foreground/28">{String(index + 1).padStart(2, "0")}</span>
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-primary/80">{faq.category}</span>
                              <h3 className="mt-0.5 text-sm font-semibold leading-5 text-foreground/90">{faq.question}</h3>
                            </div>
                            <span className={`flex size-8 items-center justify-center rounded-lg border border-border/70 bg-card text-foreground/45 transition-transform ${isOpen ? "rotate-180 border-primary/20 text-primary" : ""}`}>
                              <ChevronDown size={16} />
                            </span>
                          </button>
                          {isOpen && (
                            <div className="grid grid-cols-[auto_1fr] gap-3 px-5 pb-4 sm:px-6">
                              <span className="w-[20px]" aria-hidden="true" />
                              <p className="max-w-2xl border-l-2 border-primary/25 pl-4 text-sm leading-6 text-foreground/62">{faq.answer}</p>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex h-full min-h-[360px] flex-col items-center justify-center px-6 text-center">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><CircleHelp size={20} /></span>
                    <h3 className="mt-3 text-sm font-semibold">Não encontramos essa dúvida</h3>
                    <p className="mt-1 max-w-xs text-xs leading-5 text-foreground/48">Tente uma palavra mais curta ou selecione “Tudo” para ampliar os resultados.</p>
                    <Button type="button" variant="outline" size="sm" onClick={resetFilters} className="mt-4 rounded-lg">Mostrar todas</Button>
                  </div>
                )}
              </div>

              <footer className="flex flex-col gap-3 border-t border-border/70 bg-background/60 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-[11px] text-foreground/45">Não encontrou o que precisava? Consulte também a visão geral do produto.</p>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm" className="h-8 rounded-lg text-xs"><Link to="/about">Sobre o projeto</Link></Button>
                  <Button asChild variant="outline" size="sm" className="h-8 rounded-lg bg-background text-xs"><Link to="/terms">Termos de uso</Link></Button>
                </div>
              </footer>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
