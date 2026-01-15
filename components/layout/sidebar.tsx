"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[var(--z-modal-backdrop)] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-[var(--z-modal)] lg:z-auto",
          "h-screen w-72 lg:w-60 xl:w-72",
          "flex flex-col",
          "nav-sidebar",
          "transform transition-transform duration-300 ease-out lg:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-5 py-4 lg:hidden border-b border-[var(--color-border-subtle)]">
          <span className="text-[var(--text-h3)] font-semibold text-[var(--color-text-primary)]">
            Menu
          </span>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-[var(--radius-md)]",
              "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
              "hover:bg-[var(--color-surface-glass-hover)]",
              "transition-colors"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create button */}
        <div className="p-5 pt-6 lg:pt-8">
          <Button asChild className="w-full">
            <Link href="/templates">
              <Plus className="w-4 h-4" />
              New Contract
            </Link>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4 overflow-y-auto">
          {/* Main Nav */}
          <div className="py-3">
            <p className="text-overline px-3 mb-3">
              Navigation
            </p>
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "nav-item",
                      isActive && "nav-item-active"
                    )}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="py-3 mt-2">
            <p className="text-overline px-3 mb-3">
              Quick Filters
            </p>
            <div className="space-y-1">
              {FILTER_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.status}
                    href={`/dashboard?status=${item.status}`}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between",
                      "px-4 py-3 rounded-[var(--radius-lg)]",
                      "text-[var(--text-body-sm)] font-medium",
                      "text-[var(--color-text-secondary)]",
                      "hover:text-[var(--color-text-primary)]",
                      "hover:bg-[var(--color-surface-glass-hover)]",
                      "transition-colors"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-[18px] h-[18px]" />
                      {item.label}
                    </span>
                    <span className={cn(
                      "text-[var(--text-caption)] font-medium",
                      "text-[var(--color-text-muted)]",
                      "bg-[var(--color-background-subtle)]",
                      "px-2.5 py-1 rounded-full",
                      "min-w-[28px] text-center"
                    )}>
                      {item.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[var(--color-border-subtle)]">
          <p className="text-caption">
            Plume v1.0 • Phase 1
          </p>
        </div>
      </aside>
    </>
  );
}
