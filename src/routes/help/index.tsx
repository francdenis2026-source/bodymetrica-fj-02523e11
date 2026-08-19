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
      { property: "og:description", content: "Uma central de suporte clara, confortável e organizada para encontrar respostas e acessar os principais módulos." },
      { property: "og:image", content: "/bodymetrica-auth-2026.jpg" },
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
  { id: "all", label: "Todos" },
  { id: "Geral", label: "Geral" },
  { id: "Nutrição", label: "Nutrição" },
  { id: "Treino", label: "Treino" },
  { id: "Hidratação", label: "Hidratação" },
  { id: "Corpo", label: "Corpo" },
];

const QUICK_LINKS = [
  { title: "Nutrição", caption: "Refeições, metas e consumo", icon: Utensils, to: "/nutrition" as const },
  { title: "Treinos", caption: "Séries, cargas e evolução", icon: Dumbbell, to: "/training" as const },
  { title: "Corpo", caption: "Peso, medidas e tendências", icon: BarChart3, to: "/body" as const },
  { title: "Hidratação", caption: "Meta e consumo diário", icon: Droplets, to: "/hydration" as const },
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
      <header className="relative z-40 border-b border-border/70 bg-background/96">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-xl">
              <Link to="/" search={{} as any} aria-label="Voltar para a página inicial"><ArrowLeft size={18} /></Link>
            </Button>
            <div className="leading-tight">
              <p className="font-display text-base font-semibold tracking-tight">Central de ajuda</p>
              <p className="hidden text-xs text-muted-foreground sm:block">Body Métrica FJ · suporte e orientação</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="h-10 rounded-xl bg-background px-4">
            <Link to="/tools">Explorar ferramentas</Link>
          </Button>
        </div>
      </header>

      <main className="relative isolate overflow-hidden">
        <section className="relative min-h-[430px] overflow-hidden border-b border-border/60">
          <img
            src="/bodymetrica-auth-2026.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 -z-20 bg-black/45 dark:bg-black/58" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/82 via-black/58 to-black/28" />

          <div className="on-media container mx-auto grid min-h-[430px] max-w-7xl items-center gap-10 px-4 py-10 text-white md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/28 px-3.5 py-1.5 text-sm font-semibold shadow-sm">
                <Sparkles size={15} className="text-primary" />
                Ajuda clara, no momento certo
              </div>
              <h1 className="mt-5 font-display text-[clamp(3rem,6vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-balance">
                Encontre respostas <span className="text-primary">sem complicação.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/74 md:text-lg md:leading-8">
                Pesquise dúvidas, consulte orientações e acesse rapidamente os módulos do Body Métrica FJ em uma central mais confortável e organizada.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/15 bg-black/32 p-5 shadow-xl shadow-black/20 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/58">O que você quer encontrar?</p>
              <div className="relative mt-3">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={19} />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Busque por água, treino, macros, peso..."
                  aria-label="Pesquisar na central de ajuda"
                  className="h-14 rounded-xl border-white/15 bg-white/96 pl-12 pr-4 text-base text-black shadow-sm placeholder:text-black/40"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setCategory(item.id); setOpenItem(null); }}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${category === item.id ? "bg-primary text-primary-foreground" : "border border-white/14 bg-white/8 text-white/72 hover:bg-white/12 hover:text-white"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background">
          <div className="container mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
            <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
              <aside>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Acesso rápido</p>
                    <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">Vá direto ao módulo.</h2>
                  </div>
                  <span className="text-xs text-muted-foreground">4 áreas</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {QUICK_LINKS.map(({ title, caption, icon: Icon, to }) => (
                    <Link
                      key={title}
                      to={to}
                      className="group rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-[border-color,background-color,box-shadow] hover:border-primary/30 hover:bg-primary/[0.025] hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon size={18} /></span>
                        <ArrowUpRight size={15} className="text-foreground/25 transition-colors group-hover:text-primary" />
                      </div>
                      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{caption}</p>
                    </Link>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-border/80 bg-muted/30 p-4">
                  <div className="flex gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck size={17} /></span>
                    <div>
                      <p className="text-sm font-semibold">Privacidade e segurança</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">Saiba como os dados pessoais e métricas são tratados na plataforma.</p>
                      <Link to="/privacy" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">Ver política <ArrowUpRight size={13} /></Link>
                    </div>
                  </div>
                </div>
              </aside>

              <section className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-lg shadow-black/5">
                <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen size={18} /></span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Perguntas frequentes</p>
                      <h2 className="mt-0.5 text-base font-semibold">Respostas organizadas por assunto</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{results.length} {results.length === 1 ? "resultado" : "resultados"}</span>
                    {(query || category !== "all") && <Button type="button" variant="ghost" size="sm" onClick={resetFilters} className="h-8 rounded-lg px-2.5 text-xs">Limpar</Button>}
                  </div>
                </div>

                {results.length > 0 ? (
                  <div className="divide-y divide-border/65">
                    {results.map((faq, index) => {
                      const isOpen = openItem === faq.id;
                      return (
                        <article key={faq.id} className={isOpen ? "bg-muted/18" : ""}>
                          <button
                            type="button"
                            onClick={() => setOpenItem(isOpen ? null : faq.id)}
                            aria-expanded={isOpen}
                            className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-muted/25 md:px-6"
                          >
                            <span className="font-mono text-[11px] font-semibold text-foreground/28">{String(index + 1).padStart(2, "0")}</span>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-primary/80">{faq.category}</span>
                              <h3 className="mt-1 text-[15px] font-semibold leading-6 text-foreground/92 md:text-base">{faq.question}</h3>
                            </div>
                            <span className={`flex size-9 items-center justify-center rounded-xl border border-border/70 bg-background text-foreground/45 transition-transform ${isOpen ? "rotate-180 border-primary/20 text-primary" : ""}`}>
                              <ChevronDown size={17} />
                            </span>
                          </button>
                          {isOpen && (
                            <div className="grid grid-cols-[auto_1fr] gap-4 px-5 pb-5 md:px-6">
                              <span className="w-[23px]" aria-hidden="true" />
                              <p className="max-w-3xl rounded-2xl bg-muted/40 px-5 py-4 text-sm leading-7 text-foreground/68">{faq.answer}</p>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><CircleHelp size={22} /></span>
                    <h3 className="mt-4 text-base font-semibold">Não encontramos essa dúvida</h3>
                    <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">Tente uma palavra mais curta ou selecione “Todos” para ampliar os resultados.</p>
                    <Button type="button" variant="outline" size="sm" onClick={resetFilters} className="mt-4 rounded-xl">Mostrar todas</Button>
                  </div>
                )}

                <footer className="flex flex-col gap-3 border-t border-border/70 bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                  <p className="text-xs text-muted-foreground">Precisa entender melhor o produto antes de continuar?</p>
                  <div className="flex gap-2">
                    <Button asChild variant="ghost" size="sm" className="h-9 rounded-lg text-xs"><Link to="/about">Sobre o projeto</Link></Button>
                    <Button asChild variant="outline" size="sm" className="h-9 rounded-lg bg-background text-xs"><Link to="/terms">Termos de uso</Link></Button>
                  </div>
                </footer>
              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
