"use client";

import { useState, useRef } from "react";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DocumentPreviewProps {
  pages?: number;
  className?: string;
  showControls?: boolean;
  onFullscreen?: () => void;
}

export function DocumentPreview({
  pages = 4,
  className,
  showControls = true,
  onFullscreen,
}: DocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));
  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, pages));

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      {showControls && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border-subtle)]">
          {/* Page navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-[var(--color-text-secondary)] min-w-[80px] text-center">
              Page {currentPage} of {pages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === pages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-[var(--color-text-secondary)] min-w-[50px] text-center">
              {zoom}%
            </span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            {onFullscreen && (
              <Button variant="ghost" size="sm" onClick={onFullscreen}>
                <Maximize2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Document viewer */}
      <div
        ref={containerRef}
        className={cn(
          "flex-1 overflow-auto bg-[var(--color-background-elevated)]",
          "flex items-start justify-center p-4"
        )}
      >
        <div
          className="transition-transform duration-200"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
        >
          {/* Mock document page */}
          <div
            className={cn(
              "w-[612px] bg-white rounded-lg shadow-lg",
              "aspect-[8.5/11]" // US Letter ratio
            )}
          >
            {/* Mock document content */}
            <div className="p-12 h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="w-24 h-8 bg-gray-200 rounded" />
                <div className="text-right">
                  <div className="w-32 h-4 bg-gray-100 rounded mb-2 ml-auto" />
                  <div className="w-24 h-3 bg-gray-100 rounded ml-auto" />
                </div>
              </div>

              {/* Title */}
              <div className="w-3/4 h-6 bg-gray-300 rounded mb-8 mx-auto" />

              {/* Content lines */}
              <div className="space-y-3 mb-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 bg-gray-100 rounded"
                    style={{ width: `${Math.random() * 30 + 70}%` }}
                  />
                ))}
              </div>

              {/* Section */}
              <div className="w-1/2 h-4 bg-gray-200 rounded mb-4" />
              <div className="space-y-3 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 bg-gray-100 rounded"
                    style={{ width: `${Math.random() * 30 + 70}%` }}
                  />
                ))}
              </div>

              {/* Signature area (if last page) */}
              {currentPage === pages && (
                <div className="mt-auto pt-8 border-t border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <div className="w-40 h-12 border-b-2 border-gray-300 mb-2" />
                      <div className="w-24 h-3 bg-gray-100 rounded" />
                    </div>
                    <div>
                      <div className="w-40 h-12 border-b-2 border-gray-300 mb-2" />
                      <div className="w-24 h-3 bg-gray-100 rounded" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
