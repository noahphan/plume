"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  Send,
  XCircle,
  FileText,
  MoreHorizontal,
  ExternalLink,
  Copy,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { useContract } from "@/lib/hooks/use-contracts";
import { getContractTimeline, getSigningSessionByContractId } from "@/lib/api/mock";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton, SkeletonTimeline } from "@/components/ui/skeleton";
import { Timeline } from "@/components/patterns/timeline";
import { SignerCard } from "@/components/features/signer-card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/patterns/modal";
import { useToast } from "@/components/patterns/toast";
import type { SigningSession, TimelineEvent } from "@/lib/types";

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { contract, isLoading, error } = useContract(id);
  const { addToast } = useToast();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [voidModalOpen, setVoidModalOpen] = useState(false);
  const [signingSession, setSigningSession] = useState<SigningSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [origin, setOrigin] = useState("");

  // Load timeline
  useState(() => {
    getContractTimeline(id).then((events) => {
      setTimeline(events);
      setTimelineLoading(false);
    });
  });

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!id) return;
    setSessionLoading(true);
    getSigningSessionByContractId(id).then((session) => {
      setSigningSession(session);
      setSessionLoading(false);
    });
  }, [id]);

  const handleVoid = () => {
    // Mock void action
    setVoidModalOpen(false);
    addToast({
      type: "success",
      title: "Contract voided",
      description: "The contract has been voided and signers notified.",
    });
  };

  const handleResend = (signerId: string) => {
    addToast({
      type: "success",
      title: "Reminder sent",
      description: "A reminder has been sent to the signer.",
    });
  };

  const handleCopyLink = async () => {
    if (!signingSession) return;
    const path = `/sign/${signingSession.token}`;
    const url = origin ? `${origin}${path}` : path;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      addToast({
        type: "success",
        title: "Signing link copied",
      });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Copy failed",
        description: "Unable to copy the signing link.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard>
              <SkeletonTimeline />
            </GlassCard>
          </div>
          <div>
            <GlassCard>
              <Skeleton className="h-40" />
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="max-w-5xl mx-auto">
        <GlassCard className="text-center py-12">
          <p className="text-[var(--color-error)] mb-4">Contract not found</p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title={contract.title}
        description={`Created ${formatDate(contract.createdAt)} by ${contract.createdBy.name}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: contract.title },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {contract.status === "completed" && (
              <Button asChild>
                <Link href={`/contracts/${id}/evidence`}>
                  <FileText className="w-4 h-4 mr-2" />
                  Evidence Bundle
                </Link>
              </Button>
            )}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className={cn(
                    "z-[var(--z-dropdown)] min-w-[160px] p-1.5 rounded-xl",
                    "bg-[var(--color-background-elevated)]",
                    "border border-[var(--color-border-default)]",
                    "shadow-xl"
                  )}
                  sideOffset={8}
                  align="end"
                >
                  <DropdownMenu.Item
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                      "text-[var(--color-text-secondary)] cursor-pointer outline-none",
                      "hover:bg-[var(--color-surface-glass)] hover:text-[var(--color-text-primary)]"
                    )}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </DropdownMenu.Item>
                  {contract.status !== "voided" && contract.status !== "completed" && (
                    <>
                      <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-border-subtle)]" />
                      <DropdownMenu.Item
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                          "text-[var(--color-error)] cursor-pointer outline-none",
                          "hover:bg-[var(--color-error-muted)]"
                        )}
                        onClick={() => setVoidModalOpen(true)}
                      >
                        <XCircle className="w-4 h-4" />
                        Void Contract
                      </DropdownMenu.Item>
                    </>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        }
      />

      {/* Status Banner */}
      <GlassCard padding="md" className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StatusBadge status={contract.status} size="lg" />
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {contract.status === "completed" && `Completed ${formatDate(contract.completedAt!)}`}
                {contract.status === "pending" && `Sent ${formatDate(contract.sentAt!)}`}
                {contract.status === "draft" && "Not yet sent"}
                {contract.status === "voided" && "This contract has been voided"}
              </p>
            </div>
          </div>
          {contract.status === "draft" && (
            <Button asChild>
              <Link href={`/contracts/${id}/prepare`}>
                Continue Setup
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </GlassCard>

      {!sessionLoading && signingSession ? (
        <GlassCard padding="md" className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-[var(--color-text-muted)] mb-1">Signing link</p>
              <p className="text-sm font-mono text-[var(--color-text-secondary)] break-all">
                {origin ? `${origin}/sign/${signingSession.token}` : `/sign/${signingSession.token}`}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-2">
                Recipient: {signingSession.signerName} • {signingSession.signerEmail}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Status: {signingSession.status}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/sign/${signingSession.token}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                <Copy className="w-4 h-4 mr-2" />
                {copiedLink ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </GlassCard>
      ) : null}
      {!sessionLoading && !signingSession ? (
        <GlassCard padding="md" className="mb-6">
          <p className="text-sm text-[var(--color-text-muted)]">
            No active signing link is available for this contract yet.
          </p>
        </GlassCard>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <GlassCard>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">
              Activity
            </h3>
            {timelineLoading ? (
              <SkeletonTimeline />
            ) : timeline.length > 0 ? (
              <Timeline events={timeline} />
            ) : (
              <p className="text-[var(--color-text-muted)] text-center py-8">
                No activity yet
              </p>
            )}
          </GlassCard>
        </div>

        {/* Signers */}
        <div>
          <GlassCard>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              Signers
            </h3>
            {contract.signers.length > 0 ? (
              <div className="space-y-3">
                {contract.signers.map((signer) => (
                  <SignerCard
                    key={signer.id}
                    signer={signer}
                    onResend={() => handleResend(signer.id)}
                    showActions={contract.status === "pending"}
                  />
                ))}
              </div>
            ) : (
              <p className="text-[var(--color-text-muted)] text-center py-8">
                No signers added yet
              </p>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Void Modal */}
      <Modal open={voidModalOpen} onOpenChange={setVoidModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Void Contract</ModalTitle>
            <ModalDescription>
              Are you sure you want to void this contract? This action cannot be
              undone and all signers will be notified.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setVoidModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleVoid}>
              Void Contract
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
