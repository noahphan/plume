"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, id, ...props }, ref) => {
    const errorId = errorMessage ? `${id}-error` : undefined;

    return (
      <div className="w-full">
        <input
          type={type}
          id={id}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg px-4 py-2 text-sm",
            "bg-[var(--color-surface-glass)] backdrop-blur-xl",
            "border border-[var(--color-border-subtle)]",
            "text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-muted)]",
            "transition-all duration-150",
            "focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
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

Input.displayName = "Input";

export { Input };
