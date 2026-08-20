import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center bg-muted/30 rounded-[2rem] border border-dashed border-border", className)}>
      {icon && <div className="mb-4 opacity-40">{icon}</div>}
      <h3 className="text-lg font-semibold font-display tracking-tight">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-2 max-w-[240px] leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
