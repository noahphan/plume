"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GlassCard } from "@/components/ui/glass-card";
import { SignatureCanvas } from "@/components/features/signature-canvas";
import { useToast } from "@/components/patterns/toast";

export default function SignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const [signature, setSignature] = useState<string | null>(null);
  const [signatureType, setSignatureType] = useState<"draw" | "type">("draw");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const handleSignatureChange = (sig: string | null, type: "draw" | "type") => {
    setSignature(sig);
    setSignatureType(type);
  };

  const handleSign = async () => {
    if (!signature || !isAgreed) return;

    setIsSigning(true);

    // Simulate signing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    addToast({
      type: "success",
      title: "Document signed!",
      description: "Your signature has been applied.",
    });

    router.push(`/sign/${token}/complete`);
  };

  const canSign = signature && isAgreed;

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <GlassCard className="max-w-lg w-full p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary-muted)] flex items-center justify-center mx-auto mb-4">
            <PenTool className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            Add Your Signature
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Draw or type your signature below
          </p>
        </div>

        {/* Signature Canvas */}
        <div className="mb-6">
          <SignatureCanvas onSignatureChange={handleSignatureChange} />
        </div>

        {/* Intent Checkbox */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-surface-glass)] mb-6">
          <Checkbox
            id="sign-agree"
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
          />
          <label
            htmlFor="sign-agree"
            className="text-sm text-[var(--color-text-secondary)] cursor-pointer"
          >
            I agree that this electronic signature is the legal equivalent of my
            manual signature on this document.
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href={`/sign/${token}/review`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button
            onClick={handleSign}
            disabled={!canSign}
            isLoading={isSigning}
            size="lg"
          >
            {isSigning ? "Signing..." : "Adopt & Sign"}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
