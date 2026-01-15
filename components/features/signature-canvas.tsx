"use client";

import { useRef, useState, useEffect, type PointerEvent } from "react";
import { Eraser } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/patterns/tabs";

interface SignatureCanvasProps {
  onSignatureChange?: (signature: string | null, type: "draw" | "type") => void;
  className?: string;
}

export function SignatureCanvas({ onSignatureChange, className }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");
  const [activeTab, setActiveTab] = useState<"draw" | "type">("draw");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1a1a2e";
  }, []);

  const getCoordinates = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    canvas?.setPointerCapture(e.pointerId);
  };

  const draw = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = (e: PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    canvasRef.current?.releasePointerCapture(e.pointerId);
    
    if (hasDrawn) {
      const dataUrl = canvasRef.current?.toDataURL();
      onSignatureChange?.(dataUrl || null, "draw");
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSignatureChange?.(null, "draw");
  };

  const handleTypedChange = (value: string) => {
    setTypedSignature(value);
    onSignatureChange?.(value || null, "type");
  };

  return (
    <div className={cn("w-full", className)}>
      <Tabs
        defaultValue="draw"
        onValueChange={(v) => setActiveTab(v as "draw" | "type")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="draw">Draw</TabsTrigger>
          <TabsTrigger value="type">Type</TabsTrigger>
        </TabsList>

        <TabsContent value="draw">
          <div className="space-y-4">
            <div
              className={cn(
                "relative rounded-xl overflow-hidden",
                "bg-white",
                "border-2 border-dashed border-gray-300"
              )}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-40 cursor-crosshair touch-none"
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
              />
              {!hasDrawn && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-gray-400 text-sm">Draw your signature here</p>
                </div>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={clearCanvas}
              disabled={!hasDrawn}
            >
              <Eraser className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="type">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Type your name"
              value={typedSignature}
              onChange={(e) => handleTypedChange(e.target.value)}
              className="text-lg"
            />
            {/* Signature preview */}
            <div
              className={cn(
                "h-24 rounded-xl flex items-center justify-center",
                "bg-white border border-gray-200"
              )}
            >
              {typedSignature ? (
                <span
                  className="text-3xl text-gray-800"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {typedSignature}
                </span>
              ) : (
                <span className="text-gray-400 text-sm">
                  Your signature will appear here
                </span>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      {(hasDrawn || typedSignature) && (
        <div className="mt-4 p-4 rounded-xl bg-[var(--color-surface-glass)]">
          <p className="text-xs text-[var(--color-text-muted)] mb-2">
            Preview
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden">
              {activeTab === "draw" && hasDrawn && (
                <img
                  src={canvasRef.current?.toDataURL()}
                  alt="Signature preview"
                  className="max-h-full max-w-full object-contain"
                />
              )}
              {activeTab === "type" && typedSignature && (
                <span
                  className="text-2xl text-gray-800"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {typedSignature}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
