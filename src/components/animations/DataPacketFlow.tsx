// src/components/animations/DataPacketFlow.tsx
// FIX HYDRATION - DÙNG useEffect ĐỂ RENDER CLIENT-SIDE

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DataPacketFlowProps {
  count?: number;
  className?: string;
}

export function DataPacketFlow({
  count = 12,
  className = "",
}: DataPacketFlowProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      size: number;
      x: number;
      y: number;
      duration: number;
      delay: number;
    }>
  >([]);

  // ✅ Chỉ tạo particles trên client để tránh hydration mismatch
  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: 2 + Math.random() * 4,
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, [count]);

  if (particles.length === 0) {
    return null; // Hoặc return skeleton
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, (Math.random() - 0.5) * 100],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
