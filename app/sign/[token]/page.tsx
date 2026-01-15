"use client";

import { use } from "react";
import Link from "next/link";
import { Shield, FileText, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSigningSession } from "@/lib/hooks/use-signing-session";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SignerLandingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { session, isLoading, error } = useSigningSession(token);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <Skeleton variant="circular" className="w-16 h-16 mx-auto mb-6" />
          <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </GlassCard>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 rounded-full bg-[var(--color-error-muted)] flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-[var(--color-error)]" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            Invalid or Expired Link
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            This signing link is no longer valid. It may have expired or already been used.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Please contact the sender for a new signing link.
          </p>
        </GlassCard>
      </div>
    );
  }

  if (session.status === "completed") {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 rounded-full bg-[var(--color-success-muted)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-[var(--color-success)]" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            Already Signed
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            You have already signed this document. A copy has been sent to your email.
          </p>
          <Button variant="secondary">
            Download Your Copy
          </Button>
        </GlassCard>
      </div>
    );
  }

  if (session.status === "expired") {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <GlassCard className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 rounded-full bg-[var(--color-warning-muted)] flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-[var(--color-warning)]" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            Link Expired
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            This signing link has expired. Please contact the sender to request a new one.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-muted)] flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-bold text-[var(--color-primary)]">
              {session.senderCompany.charAt(0)}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            {session.senderCompany}
          </p>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            You&apos;ve been invited to sign
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            {session.contractTitle}
          </p>
        </div>

        {/* Contract Info */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-glass)] mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-[var(--color-text-muted)]" />
            <span className="text-sm text-[var(--color-text-secondary)]">
              {session.documentPages} pages
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-text-muted)]">
              From: {session.senderName}
            </span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-8 justify-center">
          <Shield className="w-4 h-4" />
          <span>Secure signing session</span>
        </div>

        {/* CTA */}
        <Button asChild className="w-full" size="lg">
          <Link href={`/sign/${token}/consent`}>
            Review Document
          </Link>
        </Button>
      </GlassCard>
    </div>
  );
}
