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
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
    icon: FileText,
  },
  pending: {
    label: "Pending",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    icon: Clock,
  },
  sent: {
    label: "Sent",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    icon: Clock,
  },
  viewed: {
    label: "Viewed",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    icon: Eye,
  },
  signed: {
    label: "Signed",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    icon: Check,
  },
  completed: {
    label: "Completed",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/20",
    icon: CheckCircle2,
  },
  voided: {
    label: "Voided",
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    icon: XCircle,
  },
  declined: {
    label: "Declined",
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    icon: XCircle,
  },
  expired: {
    label: "Expired",
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
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
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
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
