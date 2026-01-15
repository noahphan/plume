"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  FileText,
  Send,
  X,
  Users,
  Layers,
  Upload,
  Plus,
  Sparkles,
  Copy,
  ExternalLink,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useContracts, useContractStats } from "@/lib/hooks/use-contracts";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ContractCard } from "@/components/features/contract-card";
import { DocumentPreview } from "@/components/features/document-preview";
import { useToast } from "@/components/patterns/toast";
import { ANIMATIONS } from "@/lib/constants";
import type { ContractStatus } from "@/lib/types";

const STATUS_FILTERS: { value: ContractStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Draft" },
  { value: "voided", label: "Voided" },
];

const BATCH_FILTERS = [
  { value: "all", label: "All Batches" },
  { value: "batch-q1-2026", label: "Q1 2026 Client Agreements" },
];

const DEMO_CONFIG = {
  contractId: "ctr-sow-001",
  contractTitle: "SOW - Brand Refresh & Website Redesign",
  templateId: "tpl-sow-001",
  signerToken: "sow-brandrefresh-2026",
  pages: 6,
};

type BulkBatchAction = "upload" | "create" | "send";

const BULK_ACTION_LABELS: Record<BulkBatchAction, string> = {
  upload: "Bulk upload",
  create: "Bulk create",
  send: "Bulk send",
};

const BULK_REPORTING_OPTIONS = [
  { value: "daily", label: "Daily reporting" },
  { value: "weekly", label: "Weekly reporting" },
  { value: "biweekly", label: "Bi-weekly reporting" },
  { value: "monthly", label: "Monthly reporting" },
];

const getDefaultTargetDate = () => {
  const target = new Date();
  target.setDate(target.getDate() + 14);
  return target.toISOString().split("T")[0];
};

interface BulkBatchSummary {
  id: string;
  action: BulkBatchAction;
  createdAt: string;
  total: number;
  pending: number;
  completed: number;
  dueDate?: string;
  reportingCadence: string;
}

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkTargetDate, setBulkTargetDate] = useState(getDefaultTargetDate);
  const [bulkReportingCadence, setBulkReportingCadence] = useState("weekly");
  const [bulkBatchSummary, setBulkBatchSummary] = useState<BulkBatchSummary | null>(null);
  const [origin, setOrigin] = useState("");
  const [demoLinkCopied, setDemoLinkCopied] = useState(false);
  const { addToast } = useToast();

  const filters = useMemo(
    () => ({
      status: statusFilter === "all" ? undefined : [statusFilter],
      search: searchQuery || undefined,
      batchId: batchFilter === "all" ? undefined : batchFilter,
    }),
    [statusFilter, searchQuery, batchFilter]
  );

  const { contracts, isLoading, error } = useContracts(filters);
  const { stats } = useContractStats();

  // Filter contracts by batch if needed
  const filteredContracts = useMemo(() => {
    if (batchFilter === "all") return contracts;
    return contracts.filter((c) => c.batchId === batchFilter);
  }, [contracts, batchFilter]);

  // Batch stats
  const batchStats = useMemo(() => {
    if (batchFilter === "all") return null;
    const batchContracts = contracts.filter((c) => c.batchId === batchFilter);
    const total = batchContracts.length;
    const completed = batchContracts.filter((c) => c.status === "completed").length;
    const pending = batchContracts.filter((c) => c.status === "pending").length;
    const signedSigners = batchContracts.flatMap((c) => c.signers.filter((s) => s.status === "signed")).length;
    const totalSigners = batchContracts.flatMap((c) => c.signers).length;
    return { total, completed, pending, signedSigners, totalSigners };
  }, [contracts, batchFilter]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredContracts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContracts.map((c) => c.id)));
    }
  };

  const handleSelectContract = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkAction = (action: BulkBatchAction) => {
    const selectedContracts = filteredContracts.filter((contract) => selectedIds.has(contract.id));
    const total = selectedContracts.length;
    const pending = selectedContracts.filter((contract) => contract.status === "pending").length;
    const completed = selectedContracts.filter((contract) => contract.status === "completed").length;

    console.log(`Bulk action: ${action} on ${total} contracts`);

    setBulkBatchSummary({
      id: `bulk-${action}-${Date.now()}`,
      action,
      createdAt: new Date().toISOString(),
      total,
      pending,
      completed,
      dueDate: bulkTargetDate || undefined,
      reportingCadence: bulkReportingCadence,
    });

    setSelectedIds(new Set());
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const demoSignerLink = origin
    ? `${origin}/sign/${DEMO_CONFIG.signerToken}`
    : `/sign/${DEMO_CONFIG.signerToken}`;

  const handleCopyDemoLink = async () => {
    try {
      await navigator.clipboard.writeText(demoSignerLink);
      setDemoLinkCopied(true);
      addToast({
        type: "success",
        title: "Signer link copied",
      });
      setTimeout(() => setDemoLinkCopied(false), 2000);
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Copy failed",
        description: "Unable to copy the signer link.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="Manage your contracts and track signatures"
      />

      <GlassCard padding="lg" className="mb-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[var(--text-body-sm)] text-[var(--color-text-muted)] mb-3">
              <Sparkles className="w-4 h-4" />
              Demo walkthrough
            </div>
            <h2 className="text-[var(--text-h2)] font-semibold text-[var(--color-text-primary)] mb-2">
              Live signing demo in under two minutes
            </h2>
            <p className="text-[var(--text-body)] text-[var(--color-text-secondary)] mb-4">
              Show the creator view, then open the signer link in a new tab to walk through consent,
              verification, review, and signature.
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Button asChild>
                <a href={`/contracts/${DEMO_CONFIG.contractId}`}>
                  Open contract
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a href={`/sign/${DEMO_CONFIG.signerToken}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Open signer experience
                </a>
              </Button>
              <Button variant="ghost" onClick={handleCopyDemoLink}>
                <Copy className="w-4 h-4" />
                {demoLinkCopied ? "Copied" : "Copy link"}
              </Button>
            </div>

            <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-glass)] p-3 mb-4">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                Signer link
              </p>
              <p className="text-sm font-mono text-[var(--color-text-secondary)] break-all">
                {demoSignerLink}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: "1. Creator view",
                  description: "Open the contract and show status + signer progress.",
                },
                {
                  title: "2. Signer flow",
                  description: "Consent → Verify → Review → Sign.",
                },
                {
                  title: "3. Completion",
                  description: "Show the completion screen and share link again.",
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="rounded-lg border border-[var(--color-border-subtle)] bg-white/60 p-3"
                >
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {step.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-[360px]">
            <GlassCard padding="none" className="h-[420px]">
              <DocumentPreview
                pages={DEMO_CONFIG.pages}
                templateId={DEMO_CONFIG.templateId}
                showControls={false}
              />
            </GlassCard>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          <StatCard label="Total Contracts" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} color="amber" />
          <StatCard label="Completed" value={stats.completed} color="green" />
          <StatCard label="Draft" value={stats.draft} color="slate" />
        </div>
      )}

      {/* Batch Filter Bar */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 text-[var(--text-body-sm)] text-[var(--color-text-muted)]">
          <Layers className="w-4 h-4" />
          <span>Batch:</span>
        </div>
        <div className="flex items-center gap-2">
          {BATCH_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setBatchFilter(filter.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[var(--text-caption)] font-medium whitespace-nowrap",
                "transition-all duration-[var(--duration-fast)]",
                "border",
                batchFilter === filter.value
                  ? "bg-[var(--color-primary-muted)] text-[var(--color-primary)] border-[var(--color-primary)]/30"
                  : "bg-transparent text-[var(--color-text-muted)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)] hover:text-[var(--color-text-secondary)]"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Progress Bar (when batch is selected) */}
      {batchStats && (
        <GlassCard padding="md" className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-primary-muted)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-[var(--text-h3)] font-medium text-[var(--color-text-primary)]">
                  {BATCH_FILTERS.find((b) => b.value === batchFilter)?.label}
                </p>
                <p className="text-[var(--text-body-sm)] text-[var(--color-text-muted)]">
                  {batchStats.signedSigners} of {batchStats.totalSigners} signatures collected
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[2rem] font-semibold text-[var(--color-primary)]">
                {batchStats.totalSigners > 0
                  ? Math.round((batchStats.signedSigners / batchStats.totalSigners) * 100)
                  : 0}
                %
              </p>
              <p className="text-[var(--text-caption)] text-[var(--color-text-muted)]">Complete</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-2 rounded-full bg-[var(--color-background-subtle)] overflow-hidden">
            <div
              className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
              style={{
                width: `${batchStats.totalSigners > 0 ? (batchStats.signedSigners / batchStats.totalSigners) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="flex items-center gap-6 mt-3 text-[var(--text-caption)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[var(--color-text-muted)]">{batchStats.completed} completed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[var(--color-text-muted)]">{batchStats.pending} pending</span>
            </span>
          </div>
        </GlassCard>
      )}

      {/* Selection & Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <GlassCard padding="md" className="!bg-[var(--color-primary-muted)] border-[var(--color-primary)]/30">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[var(--text-body-sm)] font-semibold">
                        {selectedIds.size}
                      </div>
                      <span className="text-[var(--text-body-sm)] font-medium text-[var(--color-text-primary)]">
                        selected
                      </span>
                    </div>
                    <button
                      onClick={clearSelection}
                      className="text-[var(--text-body-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] underline"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleBulkAction("upload")}>
                      <Upload className="w-4 h-4" />
                      Bulk Upload
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleBulkAction("create")}>
                      <Plus className="w-4 h-4" />
                      Bulk Create
                    </Button>
                    <Button size="sm" onClick={() => handleBulkAction("send")}>
                      <Send className="w-4 h-4" />
                      Bulk Send
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="bulk-target-date"
                      className="text-xs font-medium text-[var(--color-text-muted)]"
                    >
                      Target date
                    </label>
                    <Input
                      id="bulk-target-date"
                      type="date"
                      value={bulkTargetDate}
                      onChange={(event) => setBulkTargetDate(event.target.value)}
                      className="w-[160px]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--color-text-muted)]">
                      Reporting
                    </span>
                    <Select value={bulkReportingCadence} onValueChange={setBulkReportingCadence}>
                      <SelectTrigger className="w-[190px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BULK_REPORTING_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {bulkBatchSummary && (
        <GlassCard padding="lg" className="mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                  Batch ready
                </p>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {BULK_ACTION_LABELS[bulkBatchSummary.action]} batch
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Created {formatDate(bulkBatchSummary.createdAt)}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setBulkBatchSummary(null)}>
                <X className="w-4 h-4" />
                Dismiss
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-glass)] p-3">
                <p className="text-xs text-[var(--color-text-muted)]">Targets</p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {bulkBatchSummary.total} contract{bulkBatchSummary.total === 1 ? "" : "s"}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-glass)] p-3">
                <p className="text-xs text-[var(--color-text-muted)]">Reporting</p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {BULK_REPORTING_OPTIONS.find((option) => option.value === bulkBatchSummary.reportingCadence)?.label ??
                    "Reporting cadence"}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-glass)] p-3">
                <p className="text-xs text-[var(--color-text-muted)]">Target date</p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {bulkBatchSummary.dueDate ? formatDate(bulkBatchSummary.dueDate) : "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
              <span>{bulkBatchSummary.pending} pending</span>
              <span>{bulkBatchSummary.completed} completed</span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Select All (when contracts exist) */}
        {filteredContracts.length > 0 && (
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedIds.size === filteredContracts.length && filteredContracts.length > 0}
              onCheckedChange={handleSelectAll}
              aria-label="Select all contracts"
            />
            <span className="text-[var(--text-body-sm)] text-[var(--color-text-muted)]">
              Select all
            </span>
          </div>
        )}

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <Input
            type="search"
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                "px-4 py-2 rounded-[var(--radius-lg)] text-[var(--text-body-sm)] font-medium whitespace-nowrap",
                "transition-all duration-[var(--duration-fast)]",
                statusFilter === filter.value
                  ? "bg-[var(--color-primary)] text-[var(--color-text-inverted)] shadow-[var(--shadow-sm)]"
                  : "bg-[var(--color-surface-glass)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-glass-hover)]"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-[var(--color-surface-glass)] rounded-[var(--radius-lg)] p-1.5 border border-[var(--color-border-subtle)]">
          <button
            onClick={() => setViewMode("card")}
            className={cn(
              "p-2 rounded-[var(--radius-md)] transition-all duration-[var(--duration-fast)]",
              viewMode === "card"
                ? "bg-[var(--color-primary)] text-[var(--color-text-inverted)] shadow-[var(--shadow-xs)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            )}
            aria-label="Card view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-[var(--radius-md)] transition-all duration-[var(--duration-fast)]",
              viewMode === "list"
                ? "bg-[var(--color-primary)] text-[var(--color-text-inverted)] shadow-[var(--shadow-xs)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            )}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          className={cn(
            viewMode === "card"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              : "space-y-4"
          )}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <GlassCard className="text-center py-16">
          <p className="text-[var(--color-error)] mb-6">{error}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </GlassCard>
      ) : filteredContracts.length === 0 ? (
        <EmptyState
          hasFilters={!!searchQuery || statusFilter !== "all" || batchFilter !== "all"}
          onClearFilters={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setBatchFilter("all");
          }}
        />
      ) : (
        <motion.div
          className={cn(
            viewMode === "card"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              : "space-y-4"
          )}
          variants={ANIMATIONS.staggerContainer}
          initial="initial"
          animate="animate"
        >
          {filteredContracts.map((contract, index) => (
            <motion.div
              key={contract.id}
              variants={ANIMATIONS.staggerItem}
              transition={{ delay: index * 0.03 }}
              className="relative"
            >
              {/* Selection Checkbox Overlay */}
              <div className="absolute top-4 left-4 z-10">
                <Checkbox
                  checked={selectedIds.has(contract.id)}
                  onCheckedChange={() => handleSelectContract(contract.id)}
                  aria-label={`Select ${contract.title}`}
                  className={cn(
                    "transition-opacity",
                    selectedIds.size > 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                />
              </div>
              <div
                className={cn(
                  "transition-all",
                  selectedIds.has(contract.id) && "ring-2 ring-[var(--color-primary)] rounded-2xl"
                )}
              >
                <ContractCard contract={contract} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "primary",
}: {
  label: string;
  value: number;
  color?: "primary" | "amber" | "green" | "slate";
}) {
  const colorStyles = {
    primary: "text-[var(--color-primary)]",
    amber: "text-amber-600",
    green: "text-emerald-600",
    slate: "text-slate-500",
  };

  return (
    <GlassCard padding="md">
      <p className="text-[var(--text-body-sm)] text-[var(--color-text-muted)] mb-2">{label}</p>
      <p className={cn("text-[2rem] font-semibold leading-none", colorStyles[color])}>{value}</p>
    </GlassCard>
  );
}

function EmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <GlassCard className="text-center py-20">
      <div className="w-16 h-16 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center mx-auto mb-6 border border-[var(--color-border-subtle)]">
        {hasFilters ? (
          <Filter className="w-7 h-7 text-[var(--color-text-muted)]" />
        ) : (
          <FileText className="w-7 h-7 text-[var(--color-text-muted)]" />
        )}
      </div>
      <h3 className="text-[var(--text-h2)] font-medium text-[var(--color-text-primary)] mb-3">
        {hasFilters ? "No contracts found" : "No contracts yet"}
      </h3>
      <p className="text-[var(--text-body)] text-[var(--color-text-secondary)] mb-8 max-w-sm mx-auto">
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Get started by creating your first contract from a template."}
      </p>
      {hasFilters ? (
        <Button variant="secondary" onClick={onClearFilters}>
          Clear filters
        </Button>
      ) : (
        <Button asChild>
          <a href="/templates">Create Contract</a>
        </Button>
      )}
    </GlassCard>
  );
}
