// src/components/animations/MagneticButton.tsx
// HOÀN CHỈNH - KHÔNG LỖI NESTED BUTTON

"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  magneticStrength?: number;
  onClick?: () => void;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className = "",
  magneticStrength = 20,
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const maxDistance = Math.max(rect.width, rect.height) / 2;
    const strength = magneticStrength / 10;

    x.set((distanceX / maxDistance) * strength);
    y.set((distanceY / maxDistance) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={cn(
        "relative inline-flex items-center justify-center cursor-pointer",
        className,
      )}
      style={{
        x: springX,
        y: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}
