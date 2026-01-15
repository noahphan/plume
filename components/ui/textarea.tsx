"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorMessage?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, errorMessage, id, ...props }, ref) => {
    const errorId = errorMessage ? `${id}-error` : undefined;

    return (
      <div className="w-full">
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "flex min-h-[100px] w-full rounded-lg px-4 py-3 text-sm",
            "bg-[var(--color-surface-glass)] backdrop-blur-xl",
            "border border-[var(--color-border-subtle)]",
            "text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-muted)]",
            "transition-all duration-150",
            "focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none",
            error && "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]",
            className
          )}
          aria-invalid={error}
          aria-describedby={errorId}
          {...props}
        />
        {errorMessage && (
          <p
            id={errorId}
            className="mt-1.5 text-xs text-[var(--color-error)]"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
