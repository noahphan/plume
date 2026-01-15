"use client";

import { type HTMLAttributes } from "react";
import {
  FileText,
  Clock,
  Eye,
  Check,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContractStatus, SignerStatus } from "@/lib/types";

type StatusType = ContractStatus | SignerStatus | "expired";

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  draft: {
    label: "Draft",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    icon: FileText,
  },
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    icon: Clock,
  },
  sent: {
    label: "Sent",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    icon: Clock,
  },
  viewed: {
    label: "Viewed",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    icon: Eye,
  },
  signed: {
    label: "Signed",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    icon: Check,
  },
  completed: {
    label: "Completed",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    icon: CheckCircle2,
  },
  voided: {
    label: "Voided",
    color: "text-red-700",
    bgColor: "bg-red-50",
    icon: XCircle,
  },
  declined: {
    label: "Declined",
    color: "text-red-700",
    bgColor: "bg-red-50",
    icon: XCircle,
  },
  expired: {
    label: "Expired",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    icon: AlertCircle,
  },
};

export interface StatusBadgeProps extends HTMLAttributes<HTMLDivElement> {
  status: StatusType;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  size = "md",
  showIcon = true,
  className,
  ...props
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-[13px] gap-1.5",
    lg: "px-3.5 py-2 text-sm gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <div
      role="status"
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        config.color,
        config.bgColor,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </div>
  );
}
