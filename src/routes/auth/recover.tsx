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
import { Mail, ArrowLeft, KeyRound, ShieldAlert } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center relative p-4 md:p-8 bg-background overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        {/* Navigation & Brand Header */}
        <div className="w-full flex items-center justify-between mb-8 px-4">
          <Link 
            to="/auth" 
            search={{ registerMode: false, reset: false, name: "", birthDate: "", goal: "", weight: "", height: "", activityLevel: "" } as any}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white focus:text-white outline-none transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="hidden sm:inline">VOLTAR</span>
          </Link>
          
          <div className="flex flex-col items-end">
             <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
              BODY <span className="text-primary">MÉTTRICA</span>
            </h1>
            <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em] mt-1">RECUPERAÇÃO DE CONTA</p>
          </div>
        </div>

        {/* Main "Window" Container */}
        <div className="w-full max-h-[85vh] bg-card/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-500">
          {/* Decorative Window Top Bar */}
          <div className="h-10 bg-white/[0.03] border-b border-white/5 flex items-center justify-between px-6">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>
            <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
              RECOVERY_CORE_V1.0
            </div>
            <div className="w-12 h-1 bg-white/5 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto p-8 sm:p-10 relative custom-scrollbar">
            {/* Loading Skeleton Simulation during processing */}
            {isLoading && (
              <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white animate-pulse">PROCESSANDO...</p>
                </div>
              </div>
            )}

            <div className={cn("space-y-8 transition-all duration-500", isLoading && "opacity-20 blur-sm pointer-events-none")}>
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-brand-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20 border border-white/10">
                  <KeyRound size={32} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
                  RECUPERAR <span className="text-primary">ACESSO</span>
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 leading-relaxed max-w-[280px]">
                  INFORME O E-MAIL VINCULADO À SUA CONTA PARA RECEBER O LINK DE REDEFINIÇÃO DE SENHA.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[10px] font-black uppercase text-primary ml-1 tracking-widest">E-MAIL CADASTRADO</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                            <Input 
                              placeholder="seu@email.com" 
                              className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-white font-black focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                              {...field} 
                              disabled={isLoading}
                              aria-required="true"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[8px] font-black uppercase text-destructive tracking-widest ml-1" />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-14 text-xs font-black uppercase tracking-[0.2em] bg-brand-gradient border-none rounded-2xl shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all focus:ring-2 focus:ring-primary focus:outline-none" 
                    disabled={isLoading}
                  >
                    {isLoading ? "SOLICITANDO..." : "ENVIAR LINK DE ACESSO"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          
          {/* Footer Credits */}
          <div className="px-10 py-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em]">DESENVOLVEDOR</span>
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">FRANC D'NIS FEIJÓ, AC</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
              <ShieldAlert size={12} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
