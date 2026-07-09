// src/components/ui/progress-bar-fluid.tsx
// Vai trò: Progress bar với hiệu ứng fluid

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ProgressBarFluidProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
  color?: string;
}

export function ProgressBarFluid({
  value,
  max = 100,
  className = "",
  showLabel = true,
  label,
  color = "from-cyan-500 to-blue-500",
}: ProgressBarFluidProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label || "Tiến độ"}</span>
          <span className="font-mono text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted/30">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />

        {/* Fluid fill */}
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{
            duration: 1.2,
            ease: [0.25, 1, 0.5, 1],
            type: "spring",
            stiffness: 50,
            damping: 30,
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Neon glow */}
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 blur-sm opacity-50" />
        </motion.div>
      </div>
    </div>
  );
}
