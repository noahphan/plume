import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-primary-muted)] flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8 text-[var(--color-primary)]" />
        </div>
        
        <h1 className="text-h2 font-semibold mb-2">Page not found</h1>
        
        <p className="text-[var(--color-text-secondary)] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
