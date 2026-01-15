"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-error-muted)] flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-[var(--color-error)]" />
        </div>
        
        <h1 className="text-h2 font-semibold mb-2">Something went wrong</h1>
        
        <p className="text-[var(--color-text-secondary)] mb-8">
          An unexpected error occurred. Please try again.
        </p>
        
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
