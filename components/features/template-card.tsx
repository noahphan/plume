"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";
import type { Template } from "@/lib/types";

interface TemplateCardProps {
  template: Template;
  isSelected?: boolean;
  onClick?: () => void;
}

export function TemplateCard({ template, isSelected, onClick }: TemplateCardProps) {
  return (
    <GlassCard
      variant="interactive"
      padding="md"
      className={cn(
        "cursor-pointer",
        isSelected && "ring-2 ring-[var(--color-primary)] border-[var(--color-primary)]"
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl mb-4",
          "bg-[var(--color-primary-muted)]",
          "flex items-center justify-center"
        )}
      >
        <FileText className="w-6 h-6 text-[var(--color-primary)]" />
      </div>

      {/* Content */}
      <h3 className="font-medium text-[var(--color-text-primary)] mb-1 line-clamp-1">
        {template.name}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
        {template.description}
      </p>

      {/* Variables count */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)]">
        <span className="text-xs text-[var(--color-text-muted)]">
          {template.variables.length} variable{template.variables.length !== 1 ? "s" : ""}
        </span>
      </div>
    </GlassCard>
  );
}
