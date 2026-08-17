import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
  className?: string;
}

export function ModuleHeader({
  title,
  description,
  icon: Icon,
  iconClassName,
  className,
}: ModuleHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 relative z-10 animate-in fade-in slide-in-from-left-4 duration-500", className)}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "bg-brand-gradient p-3 rounded-2xl shadow-2xl border border-white/20 group",
          iconClassName
        )}>
          <Icon className="text-primary-foreground group-hover:scale-110 transition-transform" size={28} />
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter font-display text-foreground uppercase italic leading-none">
          {title}
        </h2>
      </div>
      <p className="text-foreground/60 text-sm md:text-lg max-w-2xl font-semibold tracking-tight leading-snug">
        {description}
      </p>
    </div>

  );
}
