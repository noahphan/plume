"use client";

import { MoreHorizontal, Send, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Signer } from "@/lib/types";

interface SignerCardProps {
  signer: Signer;
  onResend?: () => void;
  onRemove?: () => void;
  showActions?: boolean;
  draggable?: boolean;
}

export function SignerCard({
  signer,
  onResend,
  onRemove,
  showActions = true,
  draggable = false,
}: SignerCardProps) {
  return (
    <GlassCard
      padding="sm"
      className={cn(
        "flex items-center gap-3",
        draggable && "cursor-grab active:cursor-grabbing"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-10 h-10 rounded-full flex-shrink-0",
          "flex items-center justify-center",
          "text-sm font-medium",
          signer.status === "signed"
            ? "bg-[var(--color-success-muted)] text-[var(--color-success)]"
            : "bg-[var(--color-surface-glass)] text-[var(--color-text-secondary)]"
        )}
      >
        {signer.name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-[var(--color-text-primary)] truncate">
            {signer.name}
          </span>
          {signer.role && (
            <span className="text-xs text-[var(--color-text-muted)] px-1.5 py-0.5 rounded bg-[var(--color-surface-glass)]">
              {signer.role}
            </span>
          )}
        </div>
        <p className="text-sm text-[var(--color-text-muted)] truncate">
          {signer.email}
        </p>
        {signer.signedAt && (
          <p className="text-xs text-[var(--color-text-muted)]">
            Signed {formatRelativeTime(signer.signedAt)}
          </p>
        )}
        {signer.viewedAt && !signer.signedAt && (
          <p className="text-xs text-[var(--color-text-muted)]">
            Viewed {formatRelativeTime(signer.viewedAt)}
          </p>
        )}
      </div>

      {/* Status */}
      <StatusBadge status={signer.status} size="sm" />

      {/* Actions */}
      {showActions && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                "p-1.5 rounded-lg",
                "text-[var(--color-text-muted)]",
                "hover:bg-[var(--color-surface-glass)] hover:text-[var(--color-text-primary)]",
                "transition-colors"
              )}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                "z-[var(--z-dropdown)] min-w-[140px] p-1 rounded-lg",
                "bg-[var(--color-background-elevated)]",
                "border border-[var(--color-border-default)]",
                "shadow-lg"
              )}
              sideOffset={4}
              align="end"
            >
              {onResend && signer.status !== "signed" && (
                <DropdownMenu.Item
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none",
                    "text-[var(--color-text-secondary)]",
                    "hover:bg-[var(--color-surface-glass)] hover:text-[var(--color-text-primary)]"
                  )}
                  onClick={onResend}
                >
                  <Send className="w-4 h-4" />
                  Resend
                </DropdownMenu.Item>
              )}
              {onRemove && (
                <>
                  <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-border-subtle)]" />
                  <DropdownMenu.Item
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none",
                      "text-[var(--color-error)]",
                      "hover:bg-[var(--color-error-muted)]"
                    )}
                    onClick={onRemove}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}
    </GlassCard>
  );
}
