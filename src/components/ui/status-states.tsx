import { useEffect } from "react";
import { Info, WifiOff } from "lucide-react";
import { Button } from "./button";

interface OfflineStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function OfflineState({
  title = "Sem conexão",
  description = "Algumas funcionalidades podem estar limitadas enquanto você estiver offline.",
  onRetry
}: OfflineStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center surface border-dashed animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <WifiOff className="w-8 h-8 text-muted-foreground/60" />
      </div>
      <h3 className="text-lg font-semibold font-display tracking-tight text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[280px] mb-6 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="rounded-xl px-8"
        >
          Tentar reconectar
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Info,
  title,
  description,
  action
}: {
  icon?: any,
  title: string,
  description: string,
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 md:p-16 text-center surface border-dashed animate-in fade-in zoom-in duration-500 min-h-[360px]">
      <div className="w-20 h-20 rounded-[1.75rem] bg-brand-gradient flex items-center justify-center mb-7 shadow-brand border border-white/10 group">
        <Icon className="w-10 h-10 text-primary-foreground group-hover:scale-110 transition-transform" />
      </div>
      <h3 className="text-2xl font-semibold font-display tracking-tight text-foreground mb-3 leading-none">{title}</h3>
      <p className="text-base text-muted-foreground max-w-lg mb-8 leading-relaxed font-normal">
        {description}
      </p>
      {action}
    </div>
  );
}
