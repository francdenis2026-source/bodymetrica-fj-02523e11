import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, BarChart3, BookOpen, ChevronRight, Droplets, HelpCircle, LifeBuoy, Search, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/help/")({
  component: HelpCenterPage,
  head: () => ({
    title: "Central de Ajuda — Body Métrica FJ",
    meta: [
      { name: "description", content: "Encontre respostas rápidas sobre nutrição, treino, hidratação, composição corporal e uso do Body Métrica FJ." },
      { property: "og:title", content: "Central de Ajuda — Body Métrica FJ" },
      { property: "og:description", content: "Respostas objetivas para usar a plataforma com mais confiança." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=82&w=1400" },
    ],
  }),
});

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  { id: "1", category: "Nutrição", question: "Como o aplicativo calcula meus macros?", answer: "As metas são estimadas a partir dos dados do perfil, nível de atividade e objetivo informado. Use os resultados como referência de acompanhamento e ajuste com orientação profissional quando necessário." },
  { id: "2", category: "Nutrição", question: "Posso substituir alimentos sugeridos?", answer: "Sim. O módulo de Nutrição permite adaptar refeições e manter o acompanhamento de forma flexível, respeitando as metas definidas no seu perfil." },
  { id: "3", category: "Treino", question: "O que significa RPE nos registros de treino?", answer: "RPE é a escala de esforço percebido, geralmente de 1 a 10. Ela ajuda a registrar o quanto uma série ou sessão exigiu de você naquele momento." },
  { id: "4", category: "Treino", question: "Como acompanho recordes pessoais?", answer: "O histórico de treino permite comparar cargas, repetições e volume ao longo do tempo para identificar novos marcos de desempenho." },
  { id: "5", category: "Hidratação", question: "Como definir minha meta de água?", answer: "A plataforma usa uma referência inicial baseada no perfil e permite acompanhar o consumo diário. Necessidades individuais podem variar conforme clima, treino e orientação profissional." },
  { id: "6", category: "Corpo", question: "Com que frequência devo registrar meu peso?", answer: "A consistência é mais importante do que um único valor. Registre em condições semelhantes e acompanhe a tendência ao longo do tempo, evitando conclusões por oscilações isoladas." },
  { id: "7", category: "Geral", question: "O aplicativo funciona sem conexão o tempo todo?", answer: "Algumas experiências podem depender de conexão para sincronização e acesso a recursos online. Quando houver suporte local, os registros podem ser preservados até a próxima sincronização." },
];

const CATEGORIES = [
  { id: "all", label: "Todos", icon: HelpCircle },
  { id: "Nutrição", label: "Nutrição", icon: BookOpen },
  { id: "Treino", label: "Treino", icon: Zap },
  { id: "Hidratação", label: "Hidratação", icon: Droplets },
  { id: "Corpo", label: "Corpo", icon: BarChart3 },
];

function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItem, setOpenItem] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    return FAQS.filter((faq) => {
      const matchesSearch = !normalized || faq.question.toLowerCase().includes(normalized) || faq.answer.toLowerCase().includes(normalized);
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="relative z-50 border-b border-border/70 bg-background/95">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="rounded-xl">
              <Link to="/" search={{} as any} aria-label="Voltar para a página inicial"><ArrowLeft size={18} /></Link>
            </Button>
            <div className="leading-tight">
              <p className="font-display text-base font-semibold tracking-tight">Central de ajuda</p>
              <p className="hidden text-xs text-muted-foreground sm:block">Respostas rápidas e objetivas</p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="min-h-10 rounded-xl bg-background px-4"><Link to="/tools">Ferramentas</Link></Button>
        </div>
      </header>

      <main className="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=82&w=1800" alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-20 bg-background/58 dark:bg-background/70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/99 via-background/92 to-background/64 dark:from-background dark:via-background/96 dark:to-background/76" />

        <section className="container mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-8 px-4 py-8 md:px-6 lg:grid-cols-[0.84fr_1.16fr] lg:gap-12 lg:py-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background/92 px-3.5 py-1.5 text-sm font-semibold shadow-sm">
              <LifeBuoy size={15} className="text-primary" />
              Ajuda sem complicação
            </div>
            <h1 className="mt-5 font-display text-[clamp(2.55rem,5.4vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-balance">
              Encontre a resposta certa <span className="text-primary">sem sair do fluxo.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-foreground/74 md:text-lg md:leading-8">
              Busque por um termo, filtre por tema e abra apenas a pergunta que importa. A central foi reduzida ao essencial para você resolver dúvidas mais rápido.
            </p>

            <div className="relative mt-7 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar por treino, macros, água..."
                className="h-12 rounded-xl border-border/85 bg-background/95 pl-11 pr-4 text-sm shadow-sm"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  type="button"
                  variant={selectedCategory === id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(id)}
                  className="h-9 rounded-xl gap-2 bg-background/92"
                >
                  <Icon size={14} />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-background/95 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 md:px-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Perguntas frequentes</p>
                <p className="mt-1 text-sm text-foreground/62">{filteredFaqs.length} resultado{filteredFaqs.length === 1 ? "" : "s"}</p>
              </div>
              {(searchQuery || selectedCategory !== "all") && (
                <Button variant="ghost" size="sm" className="rounded-lg" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setOpenItem(null); }}>Limpar</Button>
              )}
            </div>

            <div className="max-h-[58vh] overflow-y-auto divide-y divide-border/70">
              {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => {
                const isOpen = openItem === faq.id;
                return (
                  <article key={faq.id}>
                    <button
                      type="button"
                      onClick={() => setOpenItem(isOpen ? null : faq.id)}
                      className="grid w-full grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-primary/[0.035] md:px-6"
                    >
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.14em] text-primary/80">{faq.category.toUpperCase()}</span>
                        <h2 className="mt-1 text-sm font-semibold leading-5 md:text-[15px]">{faq.question}</h2>
                      </div>
                      <div className={`flex size-8 items-center justify-center rounded-lg bg-muted text-foreground/50 transition-transform ${isOpen ? "rotate-90 text-primary" : ""}`}><ChevronRight size={17} /></div>
                    </button>
                    {isOpen && <div className="px-5 pb-4 md:px-6"><p className="rounded-xl bg-muted/45 px-4 py-3 text-sm leading-6 text-foreground/64">{faq.answer}</p></div>}
                  </article>
                );
              }) : (
                <div className="px-6 py-10 text-center">
                  <HelpCircle className="mx-auto text-primary/60" size={24} />
                  <p className="mt-3 text-sm font-medium">Nenhuma resposta encontrada.</p>
                  <p className="mt-1 text-xs text-foreground/50">Tente outro termo ou remova os filtros.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border/70 bg-muted/35 px-5 py-4 md:px-6">
              <div>
                <p className="text-sm font-semibold">Ainda precisa de contexto?</p>
                <p className="text-xs text-foreground/52">Veja a visão geral do projeto e dos módulos.</p>
              </div>
              <Button asChild size="sm" variant="outline" className="rounded-xl bg-background"><Link to="/about">Sobre</Link></Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
