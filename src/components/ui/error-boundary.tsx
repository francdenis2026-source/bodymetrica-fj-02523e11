import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./button";

interface ErrorBoundaryProps {
  error?: Error;
  reset?: () => void;
  title?: string;
  message?: string;
}

export function AppErrorBoundary({ error, reset, title, message }: ErrorBoundaryProps) {
  console.error("ErrorBoundary caught:", error);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-background surface border-none">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-semibold font-display tracking-tight uppercase  mb-2">
        {title || "Ops! Algo deu errado"}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        {message || "Não foi possível carregar esta seção. Tente recarregar ou volte mais tarde."}
      </p>
      <div className="flex gap-4">
        {reset && (
          <Button onClick={reset} className="gap-2 font-semibold uppercase tracking-wide h-12 px-6">
            <RefreshCcw size={16} /> RECARREGAR
          </Button>
        )}
        <Button variant="outline" onClick={() => window.location.href = "/"} className="font-semibold uppercase tracking-wide h-12 px-6">
          VOLTAR AO INÍCIO
        </Button>
      </div>
    </div>
  );
}
