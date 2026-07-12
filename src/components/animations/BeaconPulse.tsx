// src/components/animations/BeaconPulse.tsx
// BEACON PULSE - HIỆU ỨNG XUNG TÍN HIỆU

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BeaconPulseProps {
  className?: string;
  size?: number;
  color?: string;
  label?: string;
}

export function BeaconPulse({
  className = "",
  size = 12,
  color = "bg-green-400",
  label,
}: BeaconPulseProps) {
  return (
    <div className={cn("relative inline-flex items-center gap-2", className)}>
      <div className="relative">
        <div
          className={cn(`w-${size / 4} h-${size / 4} ${color} rounded-full`)}
        />
        <motion.div
          className={cn(`absolute inset-0 ${color} rounded-full`)}
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: [1, 2.5, 1], opacity: [1, 0, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={cn(`absolute inset-0 ${color} rounded-full`)}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: [1, 3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>
      {label && (
        <span className="text-xs font-mono text-green-400">{label}</span>
      )}
    </div>
  );
}
