"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { maskEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { OTPInput } from "@/components/patterns/otp-input";
import { useToast } from "@/components/patterns/toast";

export default function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Mock email
  const email = "john@example.com";

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOTPComplete = async (code: string) => {
    setIsVerifying(true);
    setError(false);

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock: accept any 6-digit code
    if (code.length === 6) {
      addToast({
        type: "success",
        title: "Verified",
        description: "Your identity has been verified.",
      });
      router.push(`/sign/${token}/review`);
    } else {
      setError(true);
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setResendCooldown(30);
    addToast({
      type: "success",
      title: "Code sent",
      description: "A new verification code has been sent to your email.",
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary-muted)] flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            Verify Your Email
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            We sent a 6-digit code to
          </p>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            {maskEmail(email)}
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center mb-6">
          <OTPInput
            length={6}
            onComplete={handleOTPComplete}
            error={error}
            disabled={isVerifying}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-[var(--color-error)] text-center mb-4">
            Invalid code. Please try again.
          </p>
        )}

        {/* Resend */}
        <div className="text-center mb-8">
          {resendCooldown > 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              Resend code in {resendCooldown}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Resend code
            </button>
          )}
        </div>

        {/* Back */}
        <div className="flex justify-center">
          <Button variant="ghost" asChild>
            <Link href={`/sign/${token}/consent`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
