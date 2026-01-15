"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfettiProps {
  isActive?: boolean;
  duration?: number;
  particleCount?: number;
}

const COLORS = [
  "#6366f1", // Primary
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ec4899", // Pink
];

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  scale: number;
}

export function Confetti({
  isActive = false,
  duration = 3000,
  particleCount = 50,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      // Generate particles
      const newParticles: Particle[] = Array.from({ length: particleCount }).map(
        (_, i) => ({
          id: i,
          x: Math.random() * 100,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: Math.random() * 0.5,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
        })
      );

      setParticles(newParticles);
      setShouldRender(true);

      // Clean up after duration
      const timer = setTimeout(() => {
        setShouldRender(false);
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, particleCount]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[var(--z-toast)]"
      aria-hidden="true"
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              y: -20,
              x: `${particle.x}vw`,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: "100vh",
              rotate: particle.rotation + 720,
              opacity: 0,
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: particle.delay,
              ease: "linear",
            }}
            className="absolute top-0"
            style={{
              left: 0,
            }}
          >
            <div
              className={cn(
                "w-3 h-3 rounded-sm"
              )}
              style={{
                backgroundColor: particle.color,
                transform: `scale(${particle.scale})`,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Simple success checkmark animation
export function SuccessCheckmark({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "w-20 h-20 rounded-full",
        "bg-[var(--color-success)]",
        "flex items-center justify-center",
        className
      )}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="w-10 h-10 text-white"
        initial="hidden"
        animate="visible"
      >
        <motion.path
          d="M5 13l4 4L19 7"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        />
      </motion.svg>
    </motion.div>
  );
}
