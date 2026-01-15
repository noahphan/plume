"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Send, ArrowLeft, FileText, Users, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/patterns/modal";
import { useToast } from "@/components/patterns/toast";
import { Confetti } from "@/components/features/confetti";
import { REMINDER_OPTIONS } from "@/lib/constants";

export default function ReviewSendPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const [customMessage, setCustomMessage] = useState("");
  const [reminderFrequency, setReminderFrequency] = useState("every3days");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Mock data for the review
  const mockContract = {
    title: "NDA - Acme Corporation",
    templateName: "Non-Disclosure Agreement (NDA)",
    signers: [
      { name: "John Smith", email: "john@acme.com", role: "CEO" },
      { name: "Emily Davis", email: "emily@company.com", role: "Legal" },
    ],
  };

  const handleSend = async () => {
    setIsSending(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSending(false);
    setConfirmModalOpen(false);
    setShowConfetti(true);
    
    addToast({
      type: "success",
      title: "Contract sent!",
      description: `${mockContract.signers.length} signers have been notified.`,
    });

    // Navigate after showing success
    setTimeout(() => {
      router.push(`/contracts/${id}`);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Confetti isActive={showConfetti} />
      
      <PageHeader
        title="Review & Send"
        description="Review your contract before sending for signatures"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "New Contract" },
          { label: "Review" },
        ]}
      />

      {/* Contract Summary */}
      <GlassCard padding="lg" className="mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-muted)] flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {mockContract.title}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {mockContract.templateName}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Signers */}
      <GlassCard padding="lg" className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-[var(--color-text-muted)]" />
          <h3 className="font-semibold text-[var(--color-text-primary)]">
            Signers ({mockContract.signers.length})
          </h3>
        </div>
        <div className="space-y-3">
          {mockContract.signers.map((signer, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface-glass)]"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-muted)] flex items-center justify-center">
                <span className="text-sm font-medium text-[var(--color-primary)]">
                  {signer.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-[var(--color-text-primary)]">
                  {signer.name}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {signer.email}
                </p>
              </div>
              {signer.role && (
                <span className="text-xs px-2 py-1 rounded bg-[var(--color-surface-glass)] text-[var(--color-text-muted)]">
                  {signer.role}
                </span>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Email Settings */}
      <GlassCard padding="lg" className="mb-6">
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">
          Email Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="custom-message">Custom Message (optional)</Label>
            <Textarea
              id="custom-message"
              placeholder="Add a personal message to your email..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="reminder">Reminder Frequency</Label>
            <Select
              value={reminderFrequency}
              onValueChange={setReminderFrequency}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REMINDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={() => setConfirmModalOpen(true)}>
          <Send className="w-4 h-4 mr-2" />
          Send for Signature
        </Button>
      </div>

      {/* Confirm Modal */}
      <Modal open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Send Contract</ModalTitle>
            <ModalDescription>
              You&apos;re about to send this contract to {mockContract.signers.length}{" "}
              signer{mockContract.signers.length !== 1 ? "s" : ""}. They will receive
              an email with a link to review and sign the document.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => setConfirmModalOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button onClick={handleSend} isLoading={isSending}>
              {isSending ? "Sending..." : "Confirm & Send"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
