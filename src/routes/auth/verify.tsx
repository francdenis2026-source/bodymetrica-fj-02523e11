import { createFileRoute } from "@tanstack/react-router";
import { ModuleHeader } from "@/components/module-header";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const Route = createFileRoute("/auth/verify")({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);

  const resendVerification = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast.error("E-mail não encontrado.");
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        toast.custom((t) => (
          <SVGToast 
            type="error"
            title="ERRO NO ENVIO"
            message={error.message}
            onClose={() => toast.dismiss(t)}
          />
        ));
      } else {
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title="LINK ENVIADO"
            message="Um novo link de confirmação foi enviado para o seu e-mail."
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
    } catch (error) {
      toast.error("Erro ao reenviar e-mail.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 bg-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/bodymetrica-auth-2026.jpg"
          alt="Auth background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#151329]/96 via-[#211d3d]/90 to-[#6d3d54]/62" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-brand-gradient rounded-3xl flex items-center justify-center text-primary-foreground font-black text-3xl shadow-2xl border-2 border-white/20 mb-6">
            B
          </div>
          <h1 className="text-4xl font-black font-display tracking-tighter text-white uppercase italic leading-none">
            CONFIRME SEU <span className="text-gradient-brand">E-MAIL</span>
          </h1>
        </div>

        <Card className="surface border-white/5 shadow-2xl bg-black/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden text-center">
          <CardHeader className="pt-10">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Mail size={32} />
            </div>
            <CardTitle className="text-xl font-black text-white uppercase tracking-widest italic">VERIFICAÇÃO PENDENTE</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 px-6">
              Para sua segurança, confirme sua identidade através do link enviado ao seu e-mail.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-10 space-y-6">
            <p className="text-sm text-white/60 leading-relaxed italic">
              Ainda não recebeu? Verifique sua pasta de spam ou clique no botão abaixo para reenviar.
            </p>
            
            <div className="flex flex-col gap-4">
              <Button 
                onClick={resendVerification}
                disabled={isLoading}
                className="h-14 w-full bg-brand-gradient border-none font-black uppercase tracking-widest rounded-2xl"
              >
                {isLoading ? "ENVIANDO..." : "REENVIAR E-MAIL"}
              </Button>
              
              <Button 
                variant="outline" 
                className="h-14 w-full border-white/10 bg-white/5 font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"
                onClick={() => window.location.href = "/auth"}
              >
                <ArrowLeft size={16} /> VOLTAR AO LOGIN
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
