// src/components/animations/ScanLine.tsx
// SCAN LINE EFFECT

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ScanLineProps {
  className?: string;
  color?: string;
  speed?: number;
  children?: React.ReactNode;
}

export function ScanLine({
  className = "",
  color = "cyan-400",
  speed = 3,
  children,
}: ScanLineProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <motion.div
        className={cn(`absolute inset-0 pointer-events-none`)}
        animate={{
          y: ["-100%", "100%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div
          className={cn(
            `absolute inset-0 bg-gradient-to-b from-transparent via-${color}/5 to-transparent`,
          )}
          style={{ height: "50%" }}
        />
      </motion.div>
    </div>
  );
}
