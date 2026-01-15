"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Download,
  FileText,
  Shield,
  Clock,
  Users,
  Hash,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatHash } from "@/lib/utils";
import { getEvidenceBundle } from "@/lib/api/mock";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/patterns/accordion";
import { useToast } from "@/components/patterns/toast";
import type { EvidenceBundle } from "@/lib/types";

export default function EvidenceBundlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToast } = useToast();
  const [bundle, setBundle] = useState<EvidenceBundle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    getEvidenceBundle(id).then((data) => {
      setBundle(data);
      setIsLoading(false);
    });
  }, [id]);

  const handleCopyHash = (hash: string, label: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(label);
    addToast({
      type: "success",
      title: "Copied to clipboard",
    });
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleDownload = () => {
    addToast({
      type: "info",
      title: "Downloading...",
      description: "Your evidence bundle is being prepared.",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <GlassCard>
          <Skeleton className="h-40" />
        </GlassCard>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="max-w-3xl mx-auto">
        <GlassCard className="text-center py-12">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Evidence bundle not available for this contract.
          </p>
          <Button asChild variant="secondary">
            <Link href={`/contracts/${id}`}>Back to Contract</Link>
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Evidence Bundle"
        description="Complete record of the signing process"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Contract", href: `/contracts/${id}` },
          { label: "Evidence" },
        ]}
        actions={
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download Bundle
          </Button>
        }
      />

      {/* Summary Card */}
      <GlassCard padding="lg" className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-success-muted)] flex items-center justify-center">
            <Shield className="w-6 h-6 text-[var(--color-success)]" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-text-primary)]">
              Verified Evidence Bundle
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Generated {formatDate(bundle.createdAt)}
            </p>
          </div>
        </div>

        {/* Hash Display */}
        <div className="space-y-3">
          <HashDisplay
            label="Document Hash"
            hash={bundle.documentHash}
            isCopied={copiedHash === "document"}
            onCopy={() => handleCopyHash(bundle.documentHash, "document")}
          />
          <HashDisplay
            label="Bundle Hash"
            hash={bundle.bundleHash}
            isCopied={copiedHash === "bundle"}
            onCopy={() => handleCopyHash(bundle.bundleHash, "bundle")}
          />
        </div>
      </GlassCard>

      {/* Bundle Contents */}
      <GlassCard padding="none">
        <div className="p-6 border-b border-[var(--color-border-subtle)]">
          <h3 className="font-semibold text-[var(--color-text-primary)]">
            Bundle Contents
          </h3>
        </div>

        <Accordion type="multiple" className="px-6">
          {/* Signed Document */}
          <AccordionItem value="document">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                <span>Signed Document</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 rounded-lg bg-[var(--color-surface-glass)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {bundle.contents.signedPdf.name}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {bundle.contents.signedPdf.size}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Audit Trail */}
          <AccordionItem value="audit">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                <span>Audit Trail</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 rounded-lg bg-[var(--color-surface-glass)]">
                <p className="text-[var(--color-text-secondary)]">
                  Complete timeline of {bundle.contents.auditTrail.events} events
                  documenting every action taken during the signing process.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-[var(--color-text-muted)]">
                  <li>• Contract creation timestamp</li>
                  <li>• Email delivery confirmations</li>
                  <li>• Document view events</li>
                  <li>• Signature timestamps with IP addresses</li>
                  <li>• Authentication verification records</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Consent Records */}
          <AccordionItem value="consent">
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[var(--color-primary)]" />
                <span>Consent Records</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 rounded-lg bg-[var(--color-surface-glass)]">
                <p className="text-[var(--color-text-secondary)]">
                  Electronic signature consent records for{" "}
                  {bundle.contents.consentRecords.signers} signer
                  {bundle.contents.consentRecords.signers !== 1 ? "s" : ""}.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-[var(--color-text-muted)]">
                  <li>• Consent disclosure version</li>
                  <li>• Acceptance timestamp per signer</li>
                  <li>• Authentication method used</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </GlassCard>
    </div>
  );
}

function HashDisplay({
  label,
  hash,
  isCopied,
  onCopy,
}: {
  label: string;
  hash: string;
  isCopied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-glass)]">
      <div className="flex items-center gap-3 min-w-0">
        <Hash className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
          <p className="text-sm font-mono text-[var(--color-text-secondary)] truncate">
            {formatHash(hash)}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCopy}
        className="flex-shrink-0"
      >
        {isCopied ? (
          <Check className="w-4 h-4 text-[var(--color-success)]" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
