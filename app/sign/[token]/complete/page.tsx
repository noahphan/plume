"use client";

import { useState, useEffect, use } from "react";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Confetti, SuccessCheckmark } from "@/components/features/confetti";
import { useToast } from "@/components/patterns/toast";

export default function CompletePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { addToast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti on mount
    setShowConfetti(true);
  }, []);

  const handleDownload = () => {
    addToast({
      type: "info",
      title: "Downloading...",
      description: "Your signed document is being prepared.",
    });
  };

  const handleClose = () => {
    // In a real app, this might close the window or redirect
    addToast({
      type: "info",
      title: "You can close this window",
      description: "A copy of the signed document will be sent to your email.",
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Confetti isActive={showConfetti} />
      
      <GlassCard className="max-w-md w-full p-8 text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <SuccessCheckmark className="mx-auto" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
          Successfully Signed!
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-2">
          Thank you for signing the document.
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mb-8">
          A copy has been sent to your email address.
        </p>

        {/* Summary */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-glass)] mb-8 text-left">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Document</span>
              <span className="text-[var(--color-text-primary)]">NDA - Acme Corp</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Signed on</span>
              <span className="text-[var(--color-text-primary)]">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={handleDownload} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Your Copy
          </Button>
          <Button variant="ghost" onClick={handleClose} className="w-full">
            Close Window
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
