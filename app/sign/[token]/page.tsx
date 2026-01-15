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
          <p className="text-[var(--text-body)] text-[var(--color-text-secondary)] mb-6">
            This signing link is no longer valid. It may have expired or already been used.
          </p>
          <p className="text-[var(--text-body-sm)] text-[var(--color-text-muted)]">
            Please contact the sender for a new signing link.
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
          <p className="text-[var(--text-body)] text-[var(--color-text-secondary)] mb-8">
            You have already signed this document. A copy has been sent to your email.
          </p>
          <Button variant="secondary" size="lg">
            Download Your Copy
          </Button>
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
            This signing link has expired. Please contact the sender to request a new one.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <GlassCard className="max-w-md w-full p-10">
        {/* Header - Company */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-[var(--radius-xl)] bg-[var(--color-primary-muted)] flex items-center justify-center mx-auto mb-4 border border-[var(--color-primary)]/20">
            <span className="text-xl font-bold text-[var(--color-primary)]">
              {session.senderCompany.charAt(0)}
            </span>
          </div>
          <p className="text-[var(--text-body-sm)] text-[var(--color-text-muted)]">
            {session.senderCompany}
          </p>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-10">
          <h1 className="text-h1 text-[var(--color-text-primary)] mb-3">
            You&apos;ve been invited to sign
          </h1>
          <p className="text-[var(--text-body-lg)] text-[var(--color-text-secondary)]">
            {session.contractTitle}
          </p>
        </div>

        {/* Contract Info */}
        <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--color-background-subtle)] border border-[var(--color-border-subtle)] mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-[var(--color-text-muted)]" />
            <span className="text-[var(--text-body-sm)] text-[var(--color-text-secondary)]">
              {session.documentPages} pages
            </span>
          </div>
          <div className="text-[var(--text-body-sm)] text-[var(--color-text-muted)]">
            From: {session.senderName}
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-[var(--text-body-sm)] text-[var(--color-text-muted)] mb-8 justify-center">
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
