// src/components/ui/progress-bar-fluid.tsx
// PROGRESS BAR VỚI HIỆU ỨNG SÓNG

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ProgressBarFluidProps {
  value: number;
  label?: string;
  color?: string;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBarFluid({
  value,
  label,
  color = "from-cyan-500 to-blue-500",
  showLabel = true,
  className = "",
}: ProgressBarFluidProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(Math.min(value, 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const clampedValue = Math.min(Math.max(displayValue, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && label && (
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{label}</span>
          <span className="font-mono">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        {/* Wave Effect Container */}
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-out relative overflow-hidden",
            "bg-gradient-to-r",
            color,
          )}
          style={{ width: `${clampedValue}%` }}
        >
          {/* Wave Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0">
              <svg
                className="absolute -bottom-1 w-full h-6 opacity-30"
                viewBox="0 0 1200 20"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="waveGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "white", stopOpacity: 0.3 }}
                    />
                    <stop
                      offset="50%"
                      style={{ stopColor: "white", stopOpacity: 0.1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "white", stopOpacity: 0.3 }}
                    />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0,10 C300,0 600,20 900,10 C1050,5 1150,15 1200,10 L1200,20 L0,20 Z"
                  fill="url(#waveGrad)"
                  animate={{
                    d: [
                      "M0,10 C300,0 600,20 900,10 C1050,5 1150,15 1200,10 L1200,20 L0,20 Z",
                      "M0,10 C300,20 600,0 900,10 C1050,15 1150,5 1200,10 L1200,20 L0,20 Z",
                      "M0,10 C300,0 600,20 900,10 C1050,5 1150,15 1200,10 L1200,20 L0,20 Z",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.5,
            }}
          />

          {/* Glow Pulse */}
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Scan Line Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}
