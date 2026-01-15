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
            "flex h-11 w-full rounded-[var(--radius-lg)] px-4 py-2.5",
            "text-[var(--text-body)] font-normal",
            "bg-[var(--color-background-pure)]",
            "border border-[var(--color-border-default)]",
            "shadow-[var(--shadow-xs)]",
            "text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-muted)]",
            "transition-all duration-[var(--duration-fast)]",
            "focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-muted)] focus:shadow-[var(--shadow-sm)]",
            "hover:border-[var(--color-border-strong)]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-background-subtle)]",
            error && "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error-muted)]",
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
