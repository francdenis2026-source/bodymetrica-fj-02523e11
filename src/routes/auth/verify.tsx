import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, ArrowLeft, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { ResponsiveHero } from "@/components/responsive-hero";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/verify")({
  component: VerifyPage,
});

function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResendLink = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast.error("Usuário não encontrado. Por favor, faça login novamente.");
        navigate({ to: "/auth", search: {} as any } as any);
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Link de verificação reenviado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao reenviar o link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-0 overflow-hidden bg-background">
      <ResponsiveHero 
        imageUrl="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1600"
        overlayOpacity={0.8}
        className="absolute inset-0 z-0 h-full"
      />

      <div className="relative z-10 w-full max-w-md px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-6 mb-12">
          <div className="mx-auto w-24 h-24 bg-brand-gradient rounded-[2rem] flex items-center justify-center text-primary-foreground font-black text-4xl shadow-2xl border-2 border-white/20">
            B
          </div>
          <div>
            <h1 className="text-4xl font-black font-display tracking-tighter text-white uppercase italic leading-none">
              VERIFICAÇÃO DE <span className="text-gradient-brand">CONTA</span>
            </h1>
            <p className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] mt-4">CONFIRME SEU ACESSO</p>
          </div>
        </div>

        <Card className="surface border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-black/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="space-y-2 pb-10 border-b border-white/5 pt-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Mail className="text-primary" size={32} />
            </div>
            <CardTitle className="text-2xl font-black text-white text-center uppercase tracking-[0.1em] italic">
              CONFIRME SEU E-MAIL
            </CardTitle>
            <CardDescription className="font-bold text-white/40 text-center uppercase text-[10px] tracking-widest px-4">
              ENVIAMOS UM LINK DE ATIVAÇÃO PARA VOCÊ.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 space-y-6">
            <p className="text-sm text-white/70 text-center leading-relaxed">
              Para garantir a segurança da plataforma e dos seus dados de saúde, precisamos que você valide seu endereço de e-mail antes de acessar as ferramentas.
            </p>

            <div className="space-y-4">
              <Button 
                onClick={handleResendLink} 
                disabled={isLoading}
                className="w-full h-16 text-base font-black uppercase tracking-[0.2em] bg-brand-gradient hover:scale-[1.02] transition-all shadow-2xl shadow-primary/30 border-none rounded-2xl"
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 animate-spin" size={20} />
                ) : (
                  <Mail className="mr-2" size={20} />
                )}
                REENVIAR LINK
              </Button>

              <Button 
                variant="ghost" 
                asChild
                className="w-full h-14 font-black uppercase tracking-widest text-white/40 hover:text-white"
              >
                <Link to="/auth">
                  <ArrowLeft className="mr-2" size={16} />
                  VOLTAR AO LOGIN
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
