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
import { Button } from "@/components/ui/button";
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
        "h-16 px-4 md:px-6",
        "flex items-center justify-between gap-4",
        "bg-[var(--color-background-base)]/80 backdrop-blur-xl",
        "border-b border-[var(--color-border-subtle)]"
      )}
    >
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className={cn(
              "lg:hidden p-2 rounded-lg",
              "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
              "hover:bg-[var(--color-surface-glass)]",
              "transition-colors"
            )}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-lg font-semibold text-[var(--color-text-primary)] hidden sm:block">
            Plume
          </span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <Input
            type="search"
            placeholder="Search contracts..."
            className="pl-10 w-full"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-glass)] rounded border border-[var(--color-border-subtle)]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile search */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className={cn(
            "md:hidden p-2 rounded-lg",
            "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
            "hover:bg-[var(--color-surface-glass)]",
            "transition-colors"
          )}
          aria-label="Search"
        >
          {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button
          className={cn(
            "relative p-2 rounded-lg",
            "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
            "hover:bg-[var(--color-surface-glass)]",
            "transition-colors"
          )}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)]" />
        </button>

        {/* User Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                "flex items-center gap-2 p-1.5 rounded-lg",
                "hover:bg-[var(--color-surface-glass)]",
                "transition-colors"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-surface-glass)] flex items-center justify-center">
                <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] hidden sm:block" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className={cn(
                "z-[var(--z-dropdown)] min-w-[200px] p-1.5 rounded-xl",
                "bg-[var(--color-background-elevated)]",
                "border border-[var(--color-border-default)]",
                "shadow-xl",
                "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
              )}
              sideOffset={8}
              align="end"
            >
              <div className="px-3 py-2 border-b border-[var(--color-border-subtle)] mb-1">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  Sarah Chen
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  sarah@company.com
                </p>
              </div>

              <DropdownMenu.Item
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                  "text-[var(--color-text-secondary)]",
                  "cursor-pointer outline-none",
                  "hover:bg-[var(--color-surface-glass)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <Settings className="w-4 h-4" />
                Settings
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-border-subtle)]" />

              <DropdownMenu.Item
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                  "text-[var(--color-error)]",
                  "cursor-pointer outline-none",
                  "hover:bg-[var(--color-error-muted)]"
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
        <div className="absolute left-0 right-0 top-16 p-4 bg-[var(--color-background-base)] border-b border-[var(--color-border-subtle)] md:hidden">
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
