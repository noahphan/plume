"use client";

import { useUIPreferences } from "@/lib/contexts/ui-preferences-context";

export function AuroraBackground() {
  // We could use reducedMotion here to disable animation
  // but it's already handled in CSS via prefers-reduced-motion
  
  return (
    <div className="aurora-bg" aria-hidden="true">
      {/* The aurora effect is created via CSS in globals.css */}
    </div>
  );
}
