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
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft size={16} className="mr-1" />
            Voltar
          </Link>
          <div className="mx-auto w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
            B
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Body Métrica FJ</h1>
          <p className="text-muted-foreground">Acesse sua conta para ver sua evolução</p>
        </div>

        <Card className="surface border-none shadow-2xl">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Utilize seu CPF e PIN de 6 dígitos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000.000.000-00" 
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
                      <FormLabel>PIN de 6 dígitos</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="******" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t pt-6 bg-muted/30">
            <div className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
              <ShieldCheck className="text-primary shrink-0" size={16} />
              <p>
                Seus dados de saúde são protegidos e acessíveis apenas por você.
                Nunca compartilhe seu PIN.
              </p>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <button className="text-primary font-semibold hover:underline">
                Falar com consultor
              </button>
            </p>
          </CardFooter>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground/60">
          Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  );
}