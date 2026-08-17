import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveHero } from "@/components/responsive-hero";

export const Route = createFileRoute("/privacy/")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pb-20 relative overflow-hidden text-foreground">
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600" 
          alt="Privacy background" 
          className="w-full h-full object-cover"
        />
      </div>

      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft size={20} /></Link>
          </Button>
          <h1 className="text-lg font-bold font-display uppercase tracking-tighter italic">Privacidade</h1>
        </div>
      </header>

      <main className="relative z-10 pt-16 container mx-auto px-4 max-w-3xl space-y-12 py-12">
        <ResponsiveHero 
          imageUrl="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1600"
          overlayOpacity={0.8}
          height="h-[30vh] min-h-[250px]"
          className="rounded-[2rem] shadow-2xl"
        >
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6">
            <Lock className="text-primary w-12 h-12 mb-2" />
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tighter text-white uppercase italic">
              DADOS <span className="text-primary">PROTEGIDOS</span>
            </h2>
          </div>
        </ResponsiveHero>

        <section className="surface p-8 md:p-12 space-y-8 border-white/5 bg-card/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display flex items-center gap-2 text-primary">
              <Eye className="w-5 h-5" />
              1. COLETA DE DADOS
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Coletamos apenas as informações necessárias para seu acompanhamento corporal: peso, medidas, idade e fotos de evolução. Estes dados são armazenados de forma segura no Lovable Cloud e nunca são compartilhados com terceiros sem sua permissão explícita.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5" />
              2. CRIPTOGRAFIA E ACESSO
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Suas fotos de evolução são privadas e protegidas por autenticação de alto nível. O sistema utiliza infraestrutura segura para garantir que apenas o proprietário da conta tenha acesso aos registros visuais de evolução.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-display flex items-center gap-2 text-primary">
              <Lock className="w-5 h-5" />
              3. SEUS DIREITOS
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Você tem o direito de exportar seus dados a qualquer momento através do dashboard administrativo ou solicitar a exclusão total da sua conta e registros de nossos servidores.
            </p>
          </div>

          <div className="pt-8 border-t border-white/5 text-[10px] text-muted-foreground/40 text-center uppercase tracking-widest font-black">
            Body Métrica FJ • Compromisso com a Segurança
          </div>
        </section>
      </main>
    </div>
  );
}
