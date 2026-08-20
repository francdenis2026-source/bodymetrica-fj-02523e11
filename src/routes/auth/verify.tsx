import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ArrowLeft } from "lucide-react";
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
            title="Erro no envio"
            message={error.message}
            onClose={() => toast.dismiss(t)}
          />
        ));
      } else {
        toast.custom((t) => (
          <SVGToast
            type="success"
            title="Link enviado"
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
    <div className="on-media relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background p-6">
      <div className="absolute inset-0 z-0">
        <img
          src="/bodymetrica-auth-2026.jpg"
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-25 [filter:saturate(0.85)]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1418]/96 via-[#0d1c22]/90 to-[#0c6478]/32" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground shadow-brand">
            B
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
            Confirme seu <span className="text-gradient-brand">e-mail</span>
          </h1>
        </div>

        <Card className="overflow-hidden rounded-[2rem] border-none bg-card text-center shadow-2xl">
          <CardHeader className="pt-9">
            <div className="mx-auto mb-3.5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail size={26} />
            </div>
            <CardTitle className="text-xl">Verificação pendente</CardTitle>
            <CardDescription className="px-4 text-sm leading-6">
              Para sua segurança, confirme sua identidade através do link enviado ao seu e-mail.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pb-9">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ainda não recebeu? Verifique sua pasta de spam ou clique no botão abaixo para reenviar.
            </p>

            <div className="flex flex-col gap-3">
              <Button onClick={resendVerification} disabled={isLoading} className="h-11 w-full">
                {isLoading ? "Enviando..." : "Reenviar e-mail"}
              </Button>

              <Button asChild variant="outline" className="h-11 w-full">
                <Link to="/auth" search={{} as any}><ArrowLeft size={16} /> Voltar ao login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
