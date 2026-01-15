"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, ArrowLeft, GripVertical, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContract } from "@/lib/hooks/use-contracts";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { Checkbox } from "@/components/ui/checkbox";
import { SignerCard } from "@/components/features/signer-card";
import { DocumentPreview } from "@/components/features/document-preview";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "@/components/patterns/modal";
import type { Signer } from "@/lib/types";

export default function PrepareSignaturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { contract } = useContract(id);
  const [signers, setSigners] = useState<Signer[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sequentialSigning, setSequentialSigning] = useState(false);
  const [newSigner, setNewSigner] = useState({ name: "", email: "", role: "" });

  const handleAddSigner = () => {
    if (!newSigner.name || !newSigner.email) return;

    const signer: Signer = {
      id: `signer-${Date.now()}`,
      name: newSigner.name,
      email: newSigner.email,
      role: newSigner.role,
      order: signers.length + 1,
      status: "pending",
    };

    setSigners([...signers, signer]);
    setNewSigner({ name: "", email: "", role: "" });
    setAddModalOpen(false);
  };

  const handleRemoveSigner = (id: string) => {
    setSigners(signers.filter((s) => s.id !== id));
  };

  const handleContinue = () => {
    router.push(`/contracts/${id}/review`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Prepare for Signature"
        description="Add signers and configure signing options"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "New Contract", href: `/contracts/new` },
          { label: "Prepare" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Signers Panel */}
        <div className="flex-1 lg:max-w-md">
          <GlassCard padding="lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Signers
              </h3>
              <Button size="sm" onClick={() => setAddModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Sequential Signing Toggle */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-surface-glass)] mb-6">
              <Checkbox
                id="sequential"
                checked={sequentialSigning}
                onCheckedChange={(checked) =>
                  setSequentialSigning(checked as boolean)
                }
              />
              <label
                htmlFor="sequential"
                className="text-sm text-[var(--color-text-secondary)] cursor-pointer"
              >
                Require signatures in order
              </label>
            </div>

            {/* Signers List */}
            {signers.length > 0 ? (
              <div className="space-y-3">
                {signers.map((signer, index) => (
                  <div key={signer.id} className="flex items-center gap-2">
                    {sequentialSigning && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-surface-glass)] text-xs font-medium text-[var(--color-text-muted)]">
                        {index + 1}
                      </div>
                    )}
                    <div className="flex-1">
                      <SignerCard
                        signer={signer}
                        onRemove={() => handleRemoveSigner(signer.id)}
                        showActions={true}
                        draggable={sequentialSigning}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface-glass)] flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[var(--color-text-muted)]" />
                </div>
                <p className="text-[var(--color-text-secondary)] mb-2">
                  No signers added yet
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Add at least one signer to continue
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--color-border-subtle)]">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleContinue} disabled={signers.length === 0}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Document Preview */}
        <div className="flex-1">
          <GlassCard padding="none" className="h-[600px] lg:sticky lg:top-24">
            <DocumentPreview pages={4} templateId={contract?.templateId} />
          </GlassCard>
        </div>
      </div>

      {/* Add Signer Modal */}
      <Modal open={addModalOpen} onOpenChange={setAddModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add Signer</ModalTitle>
          </ModalHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="signer-name" required>
                Name
              </Label>
              <Input
                id="signer-name"
                placeholder="John Smith"
                value={newSigner.name}
                onChange={(e) =>
                  setNewSigner({ ...newSigner, name: e.target.value })
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="signer-email" required>
                Email
              </Label>
              <Input
                id="signer-email"
                type="email"
                placeholder="john@example.com"
                value={newSigner.email}
                onChange={(e) =>
                  setNewSigner({ ...newSigner, email: e.target.value })
                }
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="signer-role">Role (optional)</Label>
              <Input
                id="signer-role"
                placeholder="CEO, Legal Counsel, etc."
                value={newSigner.role}
                onChange={(e) =>
                  setNewSigner({ ...newSigner, role: e.target.value })
                }
                className="mt-1.5"
              />
            </div>
          </div>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSigner}
              disabled={!newSigner.name || !newSigner.email}
            >
              Add Signer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
