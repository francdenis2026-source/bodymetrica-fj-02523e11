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
        <div className="text-center space-y-4 mb-8">
          <Link to="/" className="inline-flex items-center text-sm font-semibold text-white/70 hover:text-white transition-colors mb-2 backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft size={16} className="mr-2" />
            Voltar para o Início
          </Link>
          <div className="mx-auto w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-2xl border-2 border-white/20">
            B
          </div>
          <div>
            <h1 className="text-4xl font-bold font-display tracking-tight text-white uppercase drop-shadow-lg">Body Métrica FJ</h1>
            <p className="text-white/80 font-bold uppercase tracking-widest text-xs mt-1">Sua evolução levada a sério.</p>
          </div>
        </div>

        <Card className="surface border-none shadow-2xl bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold font-display text-primary uppercase flex items-center gap-2">
              <Lock size={20} />
              Entrar
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground">
              Utilize seu CPF e PIN de 6 dígitos para acessar sua conta protegida.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">CPF</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000.000.000-00" 
                          className="h-12 text-lg font-medium border-2 focus-visible:ring-primary"
                          {...field} 
                          onChange={(e) => field.onChange(formatCpf(e.target.value))}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">PIN de 6 dígitos</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="••••••" 
                          className="h-12 text-center text-2xl tracking-[0.5em] font-bold border-2 focus-visible:ring-primary"
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-12 text-base font-bold uppercase tracking-wide bg-brand-gradient hover:opacity-90 shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Validando..." : "Acessar Sistema"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 border-t pt-8 bg-muted/20">
            <div className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed font-medium">
              <ShieldCheck className="text-primary shrink-0" size={18} />
              <p>
                Protocolo de segurança ativo. Seus dados de saúde são criptografados e acessíveis apenas sob autenticação rigorosa.
              </p>
            </div>
            
            <div className="w-full space-y-3">
              <p className="text-center text-sm font-semibold text-muted-foreground">
                Novo por aqui?{" "}
                <Link to="/onboarding" className="text-primary hover:underline underline-offset-4 decoration-2">
                  Criar minha conta agora
                </Link>
              </p>
              <button className="w-full text-center text-xs font-bold uppercase tracking-wider text-primary/60 hover:text-primary transition-colors underline underline-offset-2">
                Esqueci meu PIN de acesso
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