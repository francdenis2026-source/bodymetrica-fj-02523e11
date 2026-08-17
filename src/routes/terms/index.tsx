import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Scale, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveHero } from "@/components/responsive-hero";

export const Route = createFileRoute("/terms/")({
  component: TermsPage,
  head: () => ({
    title: "Termos de Uso — Body Métrica FJ",
    meta: [
      { name: "description", content: "Leia as diretrizes legais e termos de aceitação para o uso da plataforma Body Métrica FJ." },
      { property: "og:title", content: "Termos de Uso — Body Métrica FJ" },
      { property: "og:description", content: "Diretrizes legais e responsabilidades de uso da nossa plataforma." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200" },
      { name: "twitter:card", content: "summary_large_image" },
    ]
  })
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden text-foreground">
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1600" 
          alt="Legal background" 
          className="w-full h-full object-cover"
        />
      </div>

      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft size={20} /></Link>
          </Button>
          <h1 className="text-lg font-bold font-display uppercase tracking-tighter italic">Termos de Uso</h1>
        </div>
      </header>

      <main className="relative z-10 pt-16 container mx-auto px-4 max-w-3xl space-y-12 py-12">
        <ResponsiveHero 
          imageUrl="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1600"
          overlayOpacity={0.8}
          height="h-[30vh] min-h-[250px]"
          className="rounded-[2rem] shadow-2xl"
        >
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6">
            <Scale className="text-primary w-12 h-12 mb-2" />
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tighter text-white uppercase italic">
              DIRETRIZES <span className="text-primary">LEGAIS</span>
            </h2>
          </div>
        </ResponsiveHero>

        <section className="surface p-8 md:p-12 space-y-8 border-white/5 bg-card/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display flex items-center gap-2 text-primary">
              <FileText className="w-5 h-5" />
              1. ACEITAÇÃO DOS TERMOS
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ao acessar e utilizar o Body Métrica FJ, você concorda em cumprir estes Termos de Uso. Esta ferramenta é destinada ao acompanhamento pessoal de saúde e performance, não substituindo orientação médica ou nutricional profissional.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5" />
              2. USO DO SERVIÇO
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O usuário é responsável por manter a confidencialidade de seu PIN e dados de acesso. O uso indevido da plataforma ou a tentativa de violar sistemas de segurança resultará na suspensão imediata da conta.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display flex items-center gap-2 text-primary">
              <Activity className="w-5 h-5" />
              3. LIMITAÇÃO DE RESPONSABILIDADE
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O Body Métrica FJ fornece cálculos baseados em fórmulas científicas padrão, mas não garante resultados específicos. A prática de exercícios físicos e dietas deve ser sempre acompanhada por profissionais qualificados.
            </p>
          </div>

          <div className="pt-8 border-t border-white/5 text-[10px] text-muted-foreground/40 text-center uppercase tracking-widest font-black">
            Última atualização: Agosto de 2026
          </div>
        </section>
      </main>
    </div>
  );
}

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
