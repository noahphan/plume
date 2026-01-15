"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, List, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContracts, useContractStats } from "@/lib/hooks/use-contracts";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ContractCard } from "@/components/features/contract-card";
import { ANIMATIONS } from "@/lib/constants";
import type { ContractStatus } from "@/lib/types";

const STATUS_FILTERS: { value: ContractStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Draft" },
  { value: "voided", label: "Voided" },
];

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all");

  const filters = useMemo(
    () => ({
      status: statusFilter === "all" ? undefined : [statusFilter],
      search: searchQuery || undefined,
    }),
    [statusFilter, searchQuery]
  );

  const { contracts, isLoading, error } = useContracts(filters);
  const { stats } = useContractStats();

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="Manage your contracts and track signatures"
      />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Contracts" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} color="amber" />
          <StatCard label="Completed" value={stats.completed} color="green" />
          <StatCard label="Draft" value={stats.draft} color="gray" />
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
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
                "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap",
                "transition-colors",
                statusFilter === filter.value
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-surface-glass)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-[var(--color-surface-glass)] rounded-lg p-1">
          <button
            onClick={() => setViewMode("card")}
            className={cn(
              "p-2 rounded-md transition-colors",
              viewMode === "card"
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            )}
            aria-label="Card view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-md transition-colors",
              viewMode === "list"
                ? "bg-[var(--color-primary)] text-white"
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
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          )}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <GlassCard className="text-center py-12">
          <p className="text-[var(--color-error)] mb-4">{error}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </GlassCard>
      ) : contracts.length === 0 ? (
        <EmptyState
          hasFilters={!!searchQuery || statusFilter !== "all"}
          onClearFilters={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}
        />
      ) : (
        <motion.div
          className={cn(
            viewMode === "card"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          )}
          variants={ANIMATIONS.staggerContainer}
          initial="initial"
          animate="animate"
        >
          {contracts.map((contract, index) => (
            <motion.div
              key={contract.id}
              variants={ANIMATIONS.staggerItem}
              transition={{ delay: index * 0.05 }}
            >
              <ContractCard contract={contract} />
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
  color?: "primary" | "amber" | "green" | "gray";
}) {
  const colorStyles = {
    primary: "text-[var(--color-primary)]",
    amber: "text-amber-400",
    green: "text-emerald-400",
    gray: "text-gray-400",
  };

  return (
    <GlassCard padding="md">
      <p className="text-sm text-[var(--color-text-muted)] mb-1">{label}</p>
      <p className={cn("text-2xl font-semibold", colorStyles[color])}>{value}</p>
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
    <GlassCard className="text-center py-16">
      <div className="w-16 h-16 rounded-full bg-[var(--color-surface-glass)] flex items-center justify-center mx-auto mb-6">
        <Filter className="w-8 h-8 text-[var(--color-text-muted)]" />
      </div>
      <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
        {hasFilters ? "No contracts found" : "No contracts yet"}
      </h3>
      <p className="text-[var(--color-text-secondary)] mb-6 max-w-sm mx-auto">
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
