// src/components/animations/NetworkPulse.tsx
// NETWORK PULSE INDICATOR

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NetworkPulseProps {
  className?: string;
  label?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
};

const ringSizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function NetworkPulse({
  className = "",
  label = "ONLINE",
  color = "cyan-400",
  size = "md",
}: NetworkPulseProps) {
  const dotSize = sizeClasses[size];
  const ringSize = ringSizes[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <div className={cn(`rounded-full bg-${color}`, dotSize)} />
        <motion.div
          className={cn(`absolute rounded-full bg-${color}/20`, ringSize)}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={cn(`absolute rounded-full bg-${color}/10`, ringSize)}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>
      {label && (
        <span className={cn(`text-xs font-mono text-${color}`)}>{label}</span>
      )}
    </div>
  );
}
