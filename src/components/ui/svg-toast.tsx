import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type SVGToastType = "success" | "error" | "info" | "warning";

interface SVGToastProps {
  type: SVGToastType;
  title: string;
  message: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export const SVGToast = ({ type, title, message, action, onClose }: SVGToastProps) => {
  const config = {
    success: {
      icon: <CheckCircle2 className="w-6 h-6 text-success" />,
      gradient: "from-success/20 to-success/5",
      border: "border-success/20",
      accent: "bg-success",
      titleColor: "text-success"
    },
    error: {
      icon: <AlertCircle className="w-6 h-6 text-destructive" />,
      gradient: "from-destructive/20 to-destructive/5",
      border: "border-destructive/20",
      accent: "bg-destructive",
      titleColor: "text-destructive"
    },
    info: {
      icon: <Info className="w-6 h-6 text-info" />,
      gradient: "from-info/20 to-info/5",
      border: "border-info/20",
      accent: "bg-info",
      titleColor: "text-info"
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6 text-warning" />,
      gradient: "from-warning/20 to-warning/5",
      border: "border-warning/20",
      accent: "bg-warning",
      titleColor: "text-warning"
    }
  }[type];

  return (
    <div 
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        "relative w-full max-w-[400px] overflow-hidden rounded-[1.5rem] border backdrop-blur-2xl shadow-2xl transition-all duration-500",
        config.border,
        "bg-background/80"
      )}
    >
      {/* Background Gradient */}
      <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", config.gradient)} />
      
      {/* Side Accent Bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", config.accent)} />

      <div className="relative z-10 p-5 flex items-start gap-4">
        <div className="shrink-0 mt-0.5" aria-hidden="true">
          <div className={cn("p-2 rounded-xl bg-white/5 border border-white/5 shadow-inner")}>
            {config.icon}
          </div>
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <h4 className={cn("text-xs font-black uppercase tracking-[0.2em] italic", config.titleColor)}>
            {title}
          </h4>
          <p className="text-[13px] font-medium text-foreground/70 leading-snug">
            {message}
          </p>
          
          {action && (
            <div className="pt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary focus:outline-none",
                  "bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20"
                )}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>

        {onClose && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Fechar notificação"
            className="shrink-0 p-1 hover:bg-white/5 rounded-full text-foreground/40 hover:text-foreground transition-colors focus:ring-2 focus:ring-white/20 focus:outline-none"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
