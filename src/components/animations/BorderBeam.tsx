// src/components/animations/BorderBeam.tsx
// BORDER BEAM - LUỒNG SÁNG CHẠY QUANH VIỀN

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BorderBeamProps {
  className?: string;
  children: React.ReactNode;
  beamColor?: string;
  duration?: number;
  onClick?: () => void;
}

export function BorderBeam({
  className = "",
  children,
  beamColor = "from-cyan-400 via-blue-500 to-purple-500",
  duration = 3,
  onClick,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "relative p-[2px] rounded-xl overflow-hidden cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <motion.div
        className={cn(`absolute inset-0 bg-gradient-to-r ${beamColor}`)}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: "300%",
          height: "300%",
          top: "-100%",
          left: "-100%",
        }}
      />
      <div className="relative rounded-xl bg-background/95 backdrop-blur-sm h-full">
        {children}
      </div>
    </div>
  );
}
