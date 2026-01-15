"use client";

import { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONSENT_DISCLOSURE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GlassCard } from "@/components/ui/glass-card";

export default function ConsentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
      if (isAtBottom) {
        setHasScrolledToBottom(true);
      }
    };

    element.addEventListener("scroll", handleScroll);
    // Check initial state
    handleScroll();

    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContinue = () => {
    if (isAgreed) {
      router.push(`/sign/${token}/verify`);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <GlassCard className="max-w-lg w-full p-6 md:p-8">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2 text-center">
          Electronic Signature Consent
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-6 text-center">
          Please read and accept the following disclosure
        </p>

        {/* Scrollable Consent Text */}
        <div
          ref={scrollRef}
          className={cn(
            "h-64 overflow-y-auto p-4 rounded-xl mb-6",
            "bg-[var(--color-surface-glass)]",
            "border border-[var(--color-border-subtle)]",
            "text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap"
          )}
        >
          {CONSENT_DISCLOSURE}
        </div>

        {/* Scroll Indicator */}
        {!hasScrolledToBottom && (
          <p className="text-xs text-[var(--color-text-muted)] text-center mb-4">
            ↓ Scroll to read the full disclosure
          </p>
        )}

        {/* Agreement Checkbox */}
        <div className="flex items-start gap-3 mb-6">
          <Checkbox
            id="consent-agree"
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
            disabled={!hasScrolledToBottom}
          />
          <label
            htmlFor="consent-agree"
            className={cn(
              "text-sm cursor-pointer",
              hasScrolledToBottom
                ? "text-[var(--color-text-secondary)]"
                : "text-[var(--color-text-disabled)]"
            )}
          >
            I agree to use electronic signatures to sign this document
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href={`/sign/${token}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button onClick={handleContinue} disabled={!isAgreed}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
