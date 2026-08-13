import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock admin login logic
      console.log("Admin login attempt:", email);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Acesso administrativo autorizado");
      navigate({ to: "/dashboard" }); // In reality would go to /admin/hub
    } catch (error) {
      toast.error("Credenciais inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            <ShieldAlert size={20} />
          </div>
          <h1 className="text-xl font-bold font-display tracking-tight">Painel Administrativo</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            Restrito a pessoal autorizado
          </p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Login Seguro</CardTitle>
            <CardDescription>Insira suas credenciais de administrador.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@bodymetrica.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Autenticando..." : "Entrar no Sistema"}
              </Button>
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <a href="/">
                  <ArrowLeft size={14} className="mr-1" />
                  Voltar para o site
                </a>
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-[10px] text-muted-foreground/60 uppercase tracking-tighter">
          Toda atividade neste painel é auditada e registrada.
        </p>
      </div>
    </div>
  );
}