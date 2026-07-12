// src/components/animations/DataPacketFlow.tsx
// DATA PACKET FLOW BACKGROUND ANIMATION

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DataPacketFlowProps {
  className?: string;
  count?: number;
  color?: string;
  density?: "low" | "medium" | "high";
}

const densityConfig = {
  low: 8,
  medium: 16,
  high: 24,
};

export function DataPacketFlow({
  className = "",
  count,
  color = "cyan-400",
  density = "medium",
}: DataPacketFlowProps) {
  const packetCount = count || densityConfig[density];

  const packets = Array.from({ length: packetCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 8 + 4,
    delay: Math.random() * 4,
    xOffset: Math.random() * 200 - 100,
    yOffset: Math.random() * 200 - 100,
  }));

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden",
        className,
      )}
    >
      {packets.map((p) => (
        <motion.div
          key={p.id}
          className={cn(`absolute rounded-full bg-${color}/20`)}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            x: [0, p.xOffset, 0],
            y: [0, p.yOffset, 0],
            opacity: [0, 0.6, 0],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
