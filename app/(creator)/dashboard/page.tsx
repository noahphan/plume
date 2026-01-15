"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutGrid, 
  List, 
  Search, 
  Filter, 
  FileText,
  Check,
  Send,
  RefreshCw,
  Ban,
  Download,
  Bell,
  ChevronDown,
  X,
  Users,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContracts, useContractStats } from "@/lib/hooks/use-contracts";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Checkbox } from "@/components/ui/checkbox";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ContractCard } from "@/components/features/contract-card";
import { ANIMATIONS } from "@/lib/constants";
import type { ContractStatus, Contract } from "@/lib/types";

const STATUS_FILTERS: { value: ContractStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Draft" },
  { value: "voided", label: "Voided" },
];

const BATCH_FILTERS = [
  { value: "all", label: "All Batches" },
  { value: "batch-q1-clients", label: "Q1 2026 Client Onboarding" },
  { value: "batch-jan-hiring", label: "January 2026 Hiring" },
  { value: "batch-q1-contractors", label: "Q1 Contractor Agreements" },
  { value: "batch-q4-partners", label: "Q4 Partner NDAs" },
];

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

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
    return contracts.filter(c => c.batchId === batchFilter);
  }, [contracts, batchFilter]);

  // Batch stats
  const batchStats = useMemo(() => {
    if (batchFilter === "all") return null;
    const batchContracts = contracts.filter(c => c.batchId === batchFilter);
    const total = batchContracts.length;
    const completed = batchContracts.filter(c => c.status === "completed").length;
    const pending = batchContracts.filter(c => c.status === "pending").length;
    const signedSigners = batchContracts.flatMap(c => c.signers.filter(s => s.status === "signed")).length;
    const totalSigners = batchContracts.flatMap(c => c.signers).length;
    return { total, completed, pending, signedSigners, totalSigners };
  }, [contracts, batchFilter]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.size === filteredContracts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContracts.map(c => c.id)));
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

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on ${selectedIds.size} contracts`);
    // In real app, this would call the API
    setSelectedIds(new Set());
    setShowBulkActions(false);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="Manage your contracts and track signatures"
      />

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
                  {BATCH_FILTERS.find(b => b.value === batchFilter)?.label}
                </p>
                <p className="text-[var(--text-body-sm)] text-[var(--color-text-muted)]">
                  {batchStats.signedSigners} of {batchStats.totalSigners} signatures collected
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[2rem] font-semibold text-[var(--color-primary)]">
                {batchStats.totalSigners > 0 ? Math.round((batchStats.signedSigners / batchStats.totalSigners) * 100) : 0}%
              </p>
              <p className="text-[var(--text-caption)] text-[var(--color-text-muted)]">Complete</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-2 rounded-full bg-[var(--color-background-subtle)] overflow-hidden">
            <div 
              className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
              style={{ width: `${batchStats.totalSigners > 0 ? (batchStats.signedSigners / batchStats.totalSigners) * 100 : 0}%` }}
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
            <GlassCard padding="sm" className="!bg-[var(--color-primary-muted)] border-[var(--color-primary)]/30">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[var(--text-body-sm)] font-semibold">
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
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleBulkAction("send")}
                  >
                    <Send className="w-4 h-4" />
                    Send All
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleBulkAction("remind")}
                  >
                    <Bell className="w-4 h-4" />
                    Remind
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleBulkAction("download")}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleBulkAction("void")}
                    className="text-[var(--color-error)] hover:bg-[var(--color-error-light)]"
                  >
                    <Ban className="w-4 h-4" />
                    Void
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className={cn(
                "transition-all",
                selectedIds.has(contract.id) && "ring-2 ring-[var(--color-primary)] rounded-2xl"
              )}>
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
