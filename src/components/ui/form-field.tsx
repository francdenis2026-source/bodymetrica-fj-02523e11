import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";

interface FormFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string;
  description?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, description, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const descriptionId = `${inputId}-description`;

    return (
      <div className="space-y-2 w-full">
        <Label 
          htmlFor={inputId} 
          className="text-[10px] font-black uppercase tracking-widest text-foreground/60 px-1"
        >
          {label}
        </Label>
        <Input
          id={inputId}
          ref={ref}
          className={cn(
            "h-12 bg-white/5 border-white/10 focus:border-primary/50 transition-all rounded-xl px-4",
            error && "border-destructive focus:border-destructive",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={cn(
            error ? errorId : null,
            description ? descriptionId : null
          )}
          {...props}
        />
        {description && !error && (
          <p id={descriptionId} className="text-[10px] text-muted-foreground px-1">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-[10px] font-bold text-destructive px-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
