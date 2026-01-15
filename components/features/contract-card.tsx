"use client";

import Link from "next/link";
import { MoreHorizontal, Clock, Layers } from "lucide-react";
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
  const progressPercent = totalSigners > 0 ? (signedCount / totalSigners) * 100 : 0;

  return (
    <GlassCard variant="interactive" padding="md" className="group relative">
      <Link href={`/contracts/${contract.id}`} className="block">
        {/* Batch Tag */}
        {contract.batchName && (
          <div className="flex items-center gap-1.5 mb-3">
            <Layers className="w-3 h-3 text-[var(--color-text-muted)]" />
            <span className="text-[var(--text-caption)] text-[var(--color-text-muted)]">
              {contract.batchName}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-[var(--text-h3)] font-medium text-[var(--color-text-primary)] truncate mb-1">
              {contract.title}
            </h3>
            <p className="text-[var(--text-body-sm)] text-[var(--color-text-muted)] truncate">
              {contract.templateName}
            </p>
          </div>
          <StatusBadge status={contract.status} size="sm" />
        </div>

        {/* Signers Progress */}
        {totalSigners > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex -space-x-2">
                {contract.signers.slice(0, 4).map((signer) => (
                  <div
                    key={signer.id}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      "text-[var(--text-caption)] font-medium",
                      "border-2 border-[var(--color-background-pure)]",
                      "shadow-[var(--shadow-xs)]",
                      signer.status === "signed"
                        ? "bg-emerald-100 text-emerald-700"
                        : signer.status === "viewed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-[var(--color-background-subtle)] text-[var(--color-text-secondary)]"
                    )}
                    title={`${signer.name} - ${signer.status}`}
                  >
                    {signer.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {totalSigners > 4 && (
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "text-[var(--text-caption)] font-medium",
                    "bg-[var(--color-background-subtle)] text-[var(--color-text-muted)]",
                    "border-2 border-[var(--color-background-pure)]"
                  )}>
                    +{totalSigners - 4}
                  </div>
                )}
              </div>
              {contract.status === "pending" && (
                <span className="text-[var(--text-caption)] font-medium text-[var(--color-text-secondary)]">
                  {signedCount}/{totalSigners}
                </span>
              )}
            </div>
            {/* Mini Progress Bar */}
            {contract.status === "pending" && (
              <div className="h-1.5 rounded-full bg-[var(--color-background-subtle)] overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-1.5 text-[var(--text-caption)] text-[var(--color-text-muted)]">
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
              "absolute top-4 right-4 p-2 rounded-[var(--radius-md)]",
              "text-[var(--color-text-muted)]",
              "opacity-0 group-hover:opacity-100",
              "hover:bg-[var(--color-surface-glass-hover)] hover:text-[var(--color-text-primary)]",
              "transition-all duration-[var(--duration-fast)]"
            )}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className={cn(
              "z-[var(--z-dropdown)] min-w-[160px] p-1.5 rounded-[var(--radius-lg)]",
              "bg-[var(--color-background-pure)]",
              "border border-[var(--color-border-subtle)]",
              "shadow-[var(--shadow-xl)]"
            )}
            sideOffset={4}
            align="end"
          >
            <DropdownMenu.Item
              className={cn(
                "px-3 py-2.5 text-[var(--text-body-sm)] rounded-[var(--radius-md)] cursor-pointer outline-none",
                "text-[var(--color-text-secondary)]",
                "hover:bg-[var(--color-surface-glass-hover)] hover:text-[var(--color-text-primary)]"
              )}
              asChild
            >
              <Link href={`/contracts/${contract.id}`}>View details</Link>
            </DropdownMenu.Item>
            {contract.status === "pending" && (
              <DropdownMenu.Item
                className={cn(
                  "px-3 py-2.5 text-[var(--text-body-sm)] rounded-[var(--radius-md)] cursor-pointer outline-none",
                  "text-[var(--color-text-secondary)]",
                  "hover:bg-[var(--color-surface-glass-hover)] hover:text-[var(--color-text-primary)]"
                )}
                onClick={() => onResend?.(contract.id)}
              >
                Resend
              </DropdownMenu.Item>
            )}
            {contract.status !== "voided" && contract.status !== "completed" && (
              <>
                <DropdownMenu.Separator className="my-1.5 h-px bg-[var(--color-border-subtle)]" />
                <DropdownMenu.Item
                  className={cn(
                    "px-3 py-2.5 text-[var(--text-body-sm)] rounded-[var(--radius-md)] cursor-pointer outline-none",
                    "text-[var(--color-error)]",
                    "hover:bg-[var(--color-error-light)]"
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
