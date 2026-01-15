"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { DocumentPreview } from "@/components/features/document-preview";

export default function ReviewDocumentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-background-base)]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-[var(--color-text-primary)]">
              Review Document
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Please review the document before signing
            </p>
          </div>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 bg-[var(--color-background-elevated)]">
        <DocumentPreview pages={4} showControls={true} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-background-base)]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-muted)] hidden sm:block">
            By continuing, you confirm you have reviewed the document.
          </p>
          <Button asChild size="lg">
            <Link href={`/sign/${token}/sign`}>
              Continue to Sign
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
