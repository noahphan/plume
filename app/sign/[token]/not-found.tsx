import { AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function SignerNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full text-center p-8">
        <div className="w-16 h-16 rounded-full bg-[var(--color-error-muted)] flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-[var(--color-error)]" />
        </div>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Invalid Signing Link
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          This signing link is not valid. Please contact the sender if you believe
          this is an error.
        </p>
      </GlassCard>
    </div>
  );
}
