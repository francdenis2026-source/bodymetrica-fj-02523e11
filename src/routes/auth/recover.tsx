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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SVGToast } from "@/components/ui/svg-toast";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { requestPasswordReset } from "@/lib/auth/auth.functions";

const resetSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export const Route = createFileRoute("/auth/recover")({
  component: RecoverPage,
});

function RecoverPage() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    setIsLoading(true);
    try {
      const result = await requestPasswordReset({ data: values });
      if (result.success) {
        toast.custom((t) => (
          <SVGToast 
            type="success"
            title="LINK ENVIADO"
            message="Verifique seu e-mail para redefinir sua senha."
            onClose={() => toast.dismiss(t)}
          />
        ));
      } else {
        toast.custom((t) => (
          <SVGToast 
            type="error"
            title="ERRO"
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
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20"
           style={{
             backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000)',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             filter: 'contrast(1.2) brightness(0.3)'
           }}
      />
      
      <Card className="w-full max-w-sm z-10 bg-black/40 backdrop-blur-2xl border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 text-center space-y-2">
          <div className="w-12 h-12 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/10">
            <KeyRound className="text-white" size={24} />
          </div>
          <CardTitle className="text-3xl font-black font-display text-white italic uppercase tracking-tighter">
            RECUPERAR ACESSO
          </CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-relaxed">
            Informe seu e-mail para receber <br /> o link de redefinição
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-black text-[8px] uppercase tracking-[0.2em] text-primary ml-1">E-MAIL</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                        <Input 
                          placeholder="seu@email.com" 
                          className="h-12 pl-12 text-base font-black bg-white/5 border-white/10 rounded-xl text-white focus:border-primary/50 transition-all"
                          {...field} 
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[8px] font-bold text-destructive uppercase tracking-widest" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-[0.2em] bg-brand-gradient hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 border-none rounded-xl" disabled={isLoading}>
                {isLoading ? "ENVIANDO..." : "ENVIAR LINK"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="p-8 pt-0 text-center">
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5" asChild>
            <Link to="/auth" search={{ registerMode: false, reset: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" } as any}>
              <ArrowLeft size={12} className="mr-2" />
              VOLTAR AO LOGIN
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
