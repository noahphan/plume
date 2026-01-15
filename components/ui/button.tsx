"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const baseStyles = cn(
      "inline-flex items-center justify-center gap-2 font-medium transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-base)]",
      "disabled:pointer-events-none disabled:opacity-50",
      "active:scale-[0.98]"
    );

    const variantStyles = {
      primary: cn(
        "bg-[var(--color-primary)] text-white",
        "hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-glow-primary)]"
      ),
      secondary: cn(
        "bg-[var(--color-surface-glass)] text-[var(--color-text-primary)]",
        "border border-[var(--color-border-default)]",
        "hover:bg-[var(--color-surface-glass-hover)] hover:border-[var(--color-border-strong)]",
        "backdrop-blur-xl"
      ),
      ghost: cn(
        "text-[var(--color-text-secondary)]",
        "hover:bg-[var(--color-surface-glass)] hover:text-[var(--color-text-primary)]"
      ),
      destructive: cn(
        "bg-[var(--color-error)] text-white",
        "hover:bg-[var(--color-error)]/90"
      ),
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-sm rounded-lg",
      md: "h-10 px-4 text-sm rounded-xl",
      lg: "h-12 px-6 text-base rounded-xl",
    };

    // When asChild is true, we can't add extra children (like the loader)
    // because Slot expects exactly one child
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(
            baseStyles,
            variantStyles[variant],
            sizeStyles[size],
            className
          )}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
