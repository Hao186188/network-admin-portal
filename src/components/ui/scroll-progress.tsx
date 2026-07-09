// src/components/ui/scroll-progress.tsx
// Vai trò: Hiển thị tiến độ cuộn trang

"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll } from "framer-motion";

interface ScrollProgressProps {
  className?: string;
  variant?: "line" | "circle";
  size?: "sm" | "md" | "lg";
}

export function ScrollProgress({
  className,
  variant = "line",
  size = "md",
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();

  const sizeClasses = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2",
  };

  if (variant === "circle") {
    return (
      <motion.div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center shadow-lg",
          className,
        )}
      >
        <svg className="w-10 h-10 -rotate-90">
          <circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-muted/20"
          />
          <motion.circle
            cx="20"
            cy="20"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-primary"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>
        <span className="absolute text-[10px] font-mono text-muted-foreground">
          {Math.round(scrollYProgress.get() * 100)}%
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-secondary to-accent origin-left",
        sizeClasses[size],
        className,
      )}
      style={{ scaleX: scrollYProgress }}
    />
  );
}
