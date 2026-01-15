"use client";

import Link from "next/link";
import { MoreHorizontal, Clock, Users } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Contract } from "@/lib/types";

interface ContractCardProps {
  contract: Contract;
  onVoid?: (id: string) => void;
  onResend?: (id: string) => void;
}

export function ContractCard({ contract, onVoid, onResend }: ContractCardProps) {
  const signedCount = contract.signers.filter((s) => s.status === "signed").length;
  const totalSigners = contract.signers.length;

  return (
    <GlassCard variant="interactive" padding="md" className="group">
      <Link href={`/contracts/${contract.id}`} className="block">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-[var(--color-text-primary)] truncate">
              {contract.title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] truncate">
              {contract.templateName}
            </p>
          </div>
          <StatusBadge status={contract.status} size="sm" />
        </div>

        {/* Signers */}
        {totalSigners > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex -space-x-2">
              {contract.signers.slice(0, 3).map((signer) => (
                <div
                  key={signer.id}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "text-xs font-medium",
                    "border-2 border-[var(--color-background-base)]",
                    signer.status === "signed"
                      ? "bg-[var(--color-success-muted)] text-[var(--color-success)]"
                      : "bg-[var(--color-surface-glass)] text-[var(--color-text-secondary)]"
                  )}
                  title={`${signer.name} - ${signer.status}`}
                >
                  {signer.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {totalSigners > 3 && (
                <div className="w-8 h-8 rounded-full bg-[var(--color-surface-glass)] flex items-center justify-center text-xs text-[var(--color-text-muted)] border-2 border-[var(--color-background-base)]">
                  +{totalSigners - 3}
                </div>
              )}
            </div>
            {contract.status === "pending" && (
              <span className="text-xs text-[var(--color-text-muted)]">
                {signedCount}/{totalSigners} signed
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <Clock className="w-3.5 h-3.5" />
            {formatRelativeTime(contract.updatedAt)}
          </div>
        </div>
      </Link>

      {/* Actions dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            onClick={(e) => e.preventDefault()}
            className={cn(
              "absolute top-3 right-3 p-1.5 rounded-lg",
              "text-[var(--color-text-muted)]",
              "opacity-0 group-hover:opacity-100",
              "hover:bg-[var(--color-surface-glass)] hover:text-[var(--color-text-primary)]",
              "transition-all"
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
            <DropdownMenu.Item
              className={cn(
                "px-3 py-2 text-sm rounded-md cursor-pointer outline-none",
                "text-[var(--color-text-secondary)]",
                "hover:bg-[var(--color-surface-glass)] hover:text-[var(--color-text-primary)]"
              )}
              asChild
            >
              <Link href={`/contracts/${contract.id}`}>View details</Link>
            </DropdownMenu.Item>
            {contract.status === "pending" && (
              <DropdownMenu.Item
                className={cn(
                  "px-3 py-2 text-sm rounded-md cursor-pointer outline-none",
                  "text-[var(--color-text-secondary)]",
                  "hover:bg-[var(--color-surface-glass)] hover:text-[var(--color-text-primary)]"
                )}
                onClick={() => onResend?.(contract.id)}
              >
                Resend
              </DropdownMenu.Item>
            )}
            {contract.status !== "voided" && contract.status !== "completed" && (
              <>
                <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-border-subtle)]" />
                <DropdownMenu.Item
                  className={cn(
                    "px-3 py-2 text-sm rounded-md cursor-pointer outline-none",
                    "text-[var(--color-error)]",
                    "hover:bg-[var(--color-error-muted)]"
                  )}
                  onClick={() => onVoid?.(contract.id)}
                >
                  Void contract
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </GlassCard>
  );
}
