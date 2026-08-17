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
    <div className={cn("flex flex-col gap-2 relative z-10 animate-in fade-in slide-in-from-left-4 duration-500", className)}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "bg-brand-gradient p-2 rounded-xl shadow-lg border border-white/10 group",
          iconClassName
        )}>
          <Icon className="text-primary-foreground group-hover:scale-110 transition-transform" size={24} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-display text-primary uppercase">
          {title}
        </h2>
      </div>
      <p className="text-muted-foreground text-sm md:text-base max-w-2xl font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
}
