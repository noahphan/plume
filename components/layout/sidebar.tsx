"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/templates", label: "Templates", icon: FolderOpen },
];

const FILTER_ITEMS = [
  { status: "pending", label: "Pending", icon: Clock, count: 4 },
  { status: "completed", label: "Completed", icon: CheckCircle2, count: 8 },
  { status: "draft", label: "Drafts", icon: FileText, count: 1 },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[var(--z-modal-backdrop)] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-[var(--z-modal)] lg:z-auto",
          "h-screen w-64 lg:w-56 xl:w-64",
          "flex flex-col",
          "bg-[var(--color-background-base)] lg:bg-transparent",
          "border-r border-[var(--color-border-subtle)]",
          "transform transition-transform duration-300 ease-out lg:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-lg font-semibold text-[var(--color-text-primary)]">
            Menu
          </span>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg",
              "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
              "hover:bg-[var(--color-surface-glass)]"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create button */}
        <div className="p-4 pt-4 lg:pt-6">
          <Button asChild className="w-full">
            <Link href="/templates">
              <Plus className="w-4 h-4 mr-2" />
              New Contract
            </Link>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
          <div className="py-2">
            <p className="px-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Navigation
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                    "transition-colors",
                    isActive
                      ? "bg-[var(--color-primary-muted)] text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-glass)]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="py-2">
            <p className="px-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Quick Filters
            </p>
            {FILTER_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.status}
                  href={`/dashboard?status=${item.status}`}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm",
                    "text-[var(--color-text-secondary)]",
                    "hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-glass)]",
                    "transition-colors"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-glass)] px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border-subtle)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            Plume v1.0 • Phase 1
          </p>
        </div>
      </aside>
    </>
  );
}
