"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Navbar({ onMenuClick, showMenuButton = true }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-sticky)]",
        "h-16 px-5 md:px-6",
        "flex items-center justify-between gap-4",
        "bg-[var(--color-surface-glass)]",
        "backdrop-blur-xl",
        "border-b border-[var(--color-border-subtle)]"
      )}
    >
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className={cn(
              "lg:hidden p-2.5 rounded-[var(--radius-md)]",
              "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
              "hover:bg-[var(--color-surface-glass-hover)]",
              "transition-colors"
            )}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary)] flex items-center justify-center shadow-[var(--shadow-sm)]">
            <span className="text-[var(--color-text-inverted)] font-bold text-sm">P</span>
          </div>
          <span className="text-[var(--text-h3)] font-semibold text-[var(--color-text-primary)] hidden sm:block">
            Plume
          </span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-lg hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <Input
            type="search"
            placeholder="Search contracts..."
            className="pl-10 w-full"
          />
          <kbd className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "px-2 py-1 text-[var(--text-micro)]",
            "text-[var(--color-text-muted)]",
            "bg-[var(--color-background-subtle)]",
            "rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)]"
          )}>
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Mobile search */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className={cn(
            "md:hidden p-2.5 rounded-[var(--radius-md)]",
            "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
            "hover:bg-[var(--color-surface-glass-hover)]",
            "transition-colors"
          )}
          aria-label="Search"
        >
          {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button
          className={cn(
            "relative p-2.5 rounded-[var(--radius-md)]",
            "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
            "hover:bg-[var(--color-surface-glass-hover)]",
            "transition-colors"
          )}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--color-primary)]" />
        </button>

        {/* User Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                "flex items-center gap-2 p-2 rounded-[var(--radius-md)]",
                "hover:bg-[var(--color-surface-glass-hover)]",
                "transition-colors"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center border border-[var(--color-border-subtle)]">
                <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] hidden sm:block" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                "z-[var(--z-dropdown)] min-w-[220px] p-2 rounded-[var(--radius-xl)]",
                "bg-[var(--color-background-pure)]",
                "border border-[var(--color-border-subtle)]",
                "shadow-[var(--shadow-xl)]",
                "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
              )}
              sideOffset={8}
              align="end"
            >
              <div className="px-3 py-2.5 border-b border-[var(--color-border-subtle)] mb-1.5">
                <p className="text-[var(--text-body-sm)] font-medium text-[var(--color-text-primary)]">
                  Sarah Chen
                </p>
                <p className="text-[var(--text-caption)] text-[var(--color-text-muted)]">
                  sarah@company.com
                </p>
              </div>

              <DropdownMenu.Item
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]",
                  "text-[var(--text-body-sm)] text-[var(--color-text-secondary)]",
                  "cursor-pointer outline-none",
                  "hover:bg-[var(--color-surface-glass-hover)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="my-1.5 h-px bg-[var(--color-border-subtle)]" />

              <DropdownMenu.Item
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)]",
                  "text-[var(--text-body-sm)] text-[var(--color-error)]",
                  "cursor-pointer outline-none",
                  "hover:bg-[var(--color-error-light)]"
                )}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className={cn(
          "absolute left-0 right-0 top-16 p-4",
          "bg-[var(--color-surface-glass)] backdrop-blur-xl",
          "border-b border-[var(--color-border-subtle)]",
          "md:hidden"
        )}>
          <Input
            type="search"
            placeholder="Search contracts..."
            autoFocus
          />
        </div>
      )}
    </header>
  );
}
