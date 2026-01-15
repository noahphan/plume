"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Send,
  Mail,
  Eye,
  PenTool,
  CheckCircle2,
  XCircle,
  Bell,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import type { TimelineEvent, TimelineEventType } from "@/lib/types";

const EVENT_CONFIG: Record<
  TimelineEventType,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }
> = {
  created: { icon: Plus, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  sent: { icon: Send, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  delivered: { icon: Mail, color: "text-gray-400", bgColor: "bg-gray-500/20" },
  viewed: { icon: Eye, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  signed: { icon: PenTool, color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  completed: { icon: CheckCircle2, color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  voided: { icon: XCircle, color: "text-red-400", bgColor: "bg-red-500/20" },
  reminder: { icon: Bell, color: "text-amber-400", bgColor: "bg-amber-500/20" },
  bundle_generated: { icon: Package, color: "text-purple-400", bgColor: "bg-purple-500/20" },
};

const EVENT_LABELS: Record<TimelineEventType, string> = {
  created: "Contract created",
  sent: "Contract sent",
  delivered: "Email delivered",
  viewed: "Document viewed",
  signed: "Signature completed",
  completed: "Contract completed",
  voided: "Contract voided",
  reminder: "Reminder sent",
  bundle_generated: "Evidence bundle generated",
};

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {events.map((event, index) => (
        <TimelineItem
          key={event.id}
          event={event}
          isLast={index === events.length - 1}
          index={index}
        />
      ))}
    </div>
  );
}

interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
  index: number;
}

function TimelineItem({ event, isLast, index }: TimelineItemProps) {
  const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.created;
  const Icon = config.icon;
  const label = EVENT_LABELS[event.type] || event.type;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative flex gap-4 pb-6 last:pb-0"
    >
      {/* Line */}
      {!isLast && (
        <div
          className={cn(
            "absolute left-4 top-8 w-0.5 h-full -translate-x-1/2",
            "bg-[var(--color-border-subtle)]"
          )}
        />
      )}

      {/* Icon */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
          config.bgColor
        )}
      >
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
        </p>
        {event.actor && event.actor.type !== "system" && (
          <p className="text-sm text-[var(--color-text-secondary)]">
            {event.actor.name || event.actor.email}
          </p>
        )}
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          {formatRelativeTime(event.timestamp)}
        </p>
      </div>
    </motion.div>
  );
}
