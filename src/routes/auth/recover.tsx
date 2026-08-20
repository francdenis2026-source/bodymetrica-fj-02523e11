import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { Mail, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { requestPasswordReset } from "@/lib/auth/auth.functions";

const resetSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export const Route = createFileRoute("/auth/recover")({
  component: RecoverPage,
});

function RecoverPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    setIsLoading(true);
    try {
      const result = await requestPasswordReset({ data: values });
      if (result.success) {
        setSent(true);
        toast.custom((t) => (
          <SVGToast
            type="success"
            title="Link enviado"
            message="Verifique seu e-mail para redefinir sua senha."
            onClose={() => toast.dismiss(t)}
          />
        ));
      } else {
        toast.custom((t) => (
          <SVGToast
            type="error"
            title="Não foi possível enviar"
            message={result.message}
            onClose={() => toast.dismiss(t)}
          />
        ));
      }
    } catch (error) {
      toast.error("Erro ao processar solicitação.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="on-media relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background p-4 md:p-8">
      <div className="absolute inset-0 z-0">
        <img src="/bodymetrica-auth-2026.jpg" alt="" aria-hidden className="h-full w-full object-cover object-center [filter:saturate(0.85)]" />
        <div className="absolute inset-0 bg-[#0a1418]/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1418]/96 via-[#0d1c22]/86 to-[#0c6478]/30" />
      </div>

      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center">
        <div className="mb-6 flex w-full items-center justify-between">
          <Link
            to="/auth"
            search={{ registerMode: false, reset: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" } as any}
            className="group flex items-center gap-2 text-xs font-medium text-white/55 outline-none transition-all hover:text-white focus:text-white"
          >
            <div className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 group-hover:border-primary/40 group-hover:bg-primary/10">
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            </div>
            Voltar
          </Link>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/45"><ShieldCheck size={13} className="text-primary" />Ambiente protegido</span>
        </div>

        <div className="flex w-full max-h-[85vh] flex-col overflow-hidden rounded-[2rem] border border-white/12 bg-card/95 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
          <div className="flex-1 overflow-y-auto p-8 sm:p-10 custom-scrollbar relative">
            {isLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm transition-all duration-300">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                  <p className="text-xs font-medium text-foreground/70">Processando...</p>
                </div>
              </div>
            )}

            <div className={cn("space-y-6 transition-all duration-500", isLoading && "pointer-events-none opacity-30 blur-sm")}>
              <div className="space-y-3.5">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <KeyRound size={26} />
                </div>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">Recuperar acesso</h1>
                <p className="max-w-[300px] text-sm leading-6 text-muted-foreground">
                  Informe o e-mail vinculado à sua conta para receber o link de redefinição de senha.
                </p>
              </div>

              {sent ? (
                <div className="rounded-2xl border border-success/20 bg-success/5 p-5">
                  <p className="text-sm font-medium text-foreground">Link enviado com sucesso.</p>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">Verifique sua caixa de entrada (e a pasta de spam) para continuar a redefinição.</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail cadastrado</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
                              <Input
                                placeholder="seu@email.com"
                                className="h-11 pl-10"
                                {...field}
                                disabled={isLoading}
                                aria-required="true"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="h-11 w-full" disabled={isLoading}>
                      {isLoading ? "Enviando..." : "Enviar link de acesso"}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-8 py-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">Desenvolvedor</span>
              <span className="text-[11px] font-medium text-muted-foreground">Franc D'nis Feijó, AC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
