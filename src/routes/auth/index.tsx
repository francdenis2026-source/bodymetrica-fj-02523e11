import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cpfSchema, formatCpf } from "@/lib/auth/utils";
import { login } from "@/lib/auth/auth.functions";
import { toast } from "sonner";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import { ResponsiveHero } from "@/components/responsive-hero";

export const Route = createFileRoute("/auth/")({
  component: AuthPage,
});

const authSchema = z.object({
  cpf: cpfSchema,
  pin: z.string().length(6, "O PIN deve ter exatamente 6 dígitos"),
});

type AuthFormValues = z.infer<typeof authSchema>;

function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      cpf: "",
      pin: "",
    },
  });

  async function onSubmit(values: AuthFormValues) {
    setIsLoading(true);
    try {
      const result = await login({ data: values });
      if (result.success) {
        toast.success("Bem-vindo ao Body Métrica FJ!");
        navigate({ to: "/dashboard" });
      }
    } catch (error) {
      toast.error("Erro ao entrar. Verifique seus dados.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-0 overflow-hidden bg-background">
      <ResponsiveHero 
        imageUrl="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1600"
        overlayOpacity={0.7}
        className="absolute inset-0 z-0 h-full"
      />

      <div className="relative z-10 w-full max-w-md px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-6 mb-12">
          <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-all mb-4 backdrop-blur-3xl bg-black/40 px-6 py-2 rounded-full border border-white/10 hover:border-primary/50">
            <ArrowLeft size={14} className="mr-2" />
            VOLTAR AO INÍCIO
          </Link>
          <div className="mx-auto w-24 h-24 bg-brand-gradient rounded-[2rem] flex items-center justify-center text-primary-foreground font-black text-4xl shadow-2xl border-2 border-white/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            B
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-black font-display tracking-tighter text-white uppercase italic leading-none">
              BODY <span className="text-gradient-brand">MÉTTRICA</span>
            </h1>
            <p className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] mt-4">PERFORMANCE & RESULTADOS</p>
          </div>
        </div>

        <Card className="surface border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-black/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="space-y-2 pb-10 border-b border-white/5 pt-12">
            <CardTitle className="text-3xl font-black text-white text-center uppercase tracking-[0.2em] italic">AUTENTICAÇÃO</CardTitle>
            <CardDescription className="font-bold text-white/40 text-center uppercase text-[10px] tracking-widest px-4">
              INSIRA SEUS DADOS DE ACESSO PROTEGIDO
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-primary ml-1">IDENTIFICAÇÃO (CPF)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000.000.000-00" 
                          className={cn(
                            "h-16 text-xl font-black bg-white/5 border-white/10 rounded-2xl px-6 text-white focus:ring-primary focus:border-primary transition-all placeholder:text-white/20",
                            form.formState.errors.cpf && "border-destructive ring-destructive"
                          )}
                          {...field} 
                          onChange={(e) => field.onChange(formatCpf(e.target.value))}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold uppercase tracking-widest text-destructive animate-in fade-in slide-in-from-top-1" />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-black text-[10px] uppercase tracking-[0.2em] text-primary ml-1">CÓDIGO DE ACESSO (PIN)</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="••••••" 
                          className={cn(
                            "h-16 text-center text-3xl tracking-[0.5em] font-black bg-white/5 border-white/10 rounded-2xl text-white focus:ring-primary focus:border-primary transition-all placeholder:text-white/20",
                            form.formState.errors.pin && "border-destructive ring-destructive"
                          )}
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold uppercase tracking-widest text-destructive animate-in fade-in slide-in-from-top-1" />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-16 text-base font-black uppercase tracking-[0.2em] bg-brand-gradient hover:scale-[1.02] transition-all shadow-2xl shadow-primary/30 border-none mt-4 rounded-2xl" disabled={isLoading}>
                  {isLoading ? "PROCESSANDO..." : "ACESSAR PLATAFORMA"}
                </Button>

              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-8 border-t border-white/5 pt-10 pb-12 bg-white/[0.02]">
            <div className="flex items-start gap-4 text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">
              <ShieldCheck className="text-primary shrink-0" size={20} />
              <p>
                Protocolo de segurança militar ativo. Criptografia de ponta a ponta.
              </p>
            </div>
            
            <div className="w-full space-y-4">
              <p className="text-center text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                NÃO POSSUI UMA CONTA?{" "}
                <Link to="/onboarding" className="text-primary hover:text-primary-foreground transition-all">
                  CADASTRAR AGORA
                </Link>
              </p>
              <button className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all underline decoration-white/10 underline-offset-4">
                RECUPERAR PIN DE ACESSO
              </button>
            </div>
          </CardFooter>

        </Card>
        
        <div className="mt-8 text-center space-y-1">
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
            dev Franc D'nis Feijó, AC
          </p>
          <p className="text-[10px] text-white/30 font-medium">
            © {new Date().getFullYear()} Body Métrica FJ. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}