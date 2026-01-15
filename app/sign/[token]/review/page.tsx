"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSigningSession } from "@/lib/hooks/use-signing-session";
import { useContract } from "@/lib/hooks/use-contracts";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ContractDocument } from "@/components/features/contract-document";

export default function ReviewDocumentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const { session, isLoading, error } = useSigningSession(token);
  const { contract, isLoading: contractLoading } = useContract(session?.contractId ?? "");
  const totalPages = session?.documentPages ?? 4;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full text-center p-10">
          <Skeleton variant="circular" className="w-16 h-16 mx-auto mb-8" />
          <Skeleton className="h-6 w-3/4 mx-auto mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </GlassCard>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full text-center p-10">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-h2 text-[var(--color-text-primary)] mb-3">
            Invalid or Expired Link
          </h1>
          <p className="text-[var(--text-body)] text-[var(--color-text-secondary)]">
            This signing link is no longer valid. Please contact the sender.
          </p>
        </GlassCard>
      </div>
    );
  }

  if (session.status === "completed") {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full text-center p-10">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-h2 text-[var(--color-text-primary)] mb-3">
            Already Signed
          </h1>
          <p className="text-[var(--text-body)] text-[var(--color-text-secondary)]">
            You have already signed this document. A copy has been sent to your email.
          </p>
        </GlassCard>
      </div>
    );
  }

  if (session.status === "expired") {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full text-center p-10">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-8">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-h2 text-[var(--color-text-primary)] mb-3">
            Link Expired
          </h1>
          <p className="text-[var(--text-body)] text-[var(--color-text-secondary)]">
            This signing link has expired. Please contact the sender for a new one.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Header */}
      <div
        className={cn(
          "sticky top-0 z-10 p-4 border-b border-[var(--color-border-subtle)]",
          "bg-[var(--color-surface-glass)] backdrop-blur-xl"
        )}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-h3 text-[var(--color-text-primary)]">
              Review Document
            </h1>
            <p className="text-[var(--text-body-sm)] text-[var(--color-text-muted)]">
              Please review the document before signing
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Page Navigation */}
            <div className="hidden sm:flex items-center gap-2 bg-[var(--color-background-subtle)] rounded-[var(--radius-lg)] px-3 py-1.5 border border-[var(--color-border-subtle)]">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md disabled:opacity-30 hover:bg-[var(--color-surface-glass-hover)] transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className="text-[var(--text-body-sm)] font-medium text-[var(--color-text-secondary)] min-w-[80px] text-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md disabled:opacity-30 hover:bg-[var(--color-surface-glass-hover)] transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 overflow-y-auto bg-[var(--color-background-subtle)] py-8">
        {contractLoading ? (
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-[640px] rounded-[var(--radius-xl)]" />
          </div>
        ) : (
          <ContractDocument
            templateId={contract?.templateId}
            className="rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)]"
          />
        )}
      </div>

      {/* Footer */}
      <div
        className={cn(
          "sticky bottom-0 p-4 border-t border-[var(--color-border-subtle)]",
          "bg-[var(--color-surface-glass)] backdrop-blur-xl"
        )}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <p className="text-[var(--text-body-sm)] text-[var(--color-text-muted)] hidden sm:block">
            By continuing, you confirm you have reviewed the full document.
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <Button variant="ghost" asChild>
              <Link href={`/sign/${token}/consent`}>Back</Link>
            </Button>
            <Button asChild size="lg">
              <Link href={`/sign/${token}/sign`}>
                Continue to Sign
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
