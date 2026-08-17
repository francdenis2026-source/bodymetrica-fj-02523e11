import { useEffect } from "react";
import { Info, WifiOff } from "lucide-react";
import { Button } from "./ui/button";

interface OfflineStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function OfflineState({ 
  title = "SEM CONEXÃO", 
  description = "Algumas funcionalidades podem estar limitadas enquanto você estiver offline.", 
  onRetry 
}: OfflineStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center surface border-dashed border-white/10 animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <WifiOff className="w-8 h-8 text-muted-foreground/40" />
      </div>
      <h3 className="text-xl font-black font-display tracking-tight text-foreground uppercase italic mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[280px] mb-6 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="rounded-xl px-8 h-12 text-xs font-black uppercase tracking-widest border-white/10 hover:bg-white/5"
        >
          TENTAR RECONECTAR
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
    <div className="flex flex-col items-center justify-center p-12 text-center surface border-dashed border-white/5">
      <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary/40" />
      </div>
      <h3 className="text-2xl font-black font-display tracking-tight text-foreground uppercase italic mb-3">{title}</h3>
      <p className="text-base text-muted-foreground max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      {action}
    </div>
  );
}
