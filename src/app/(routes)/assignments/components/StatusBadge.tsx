// src/app/(routes)/assignments/components/StatusBadge.tsx
// Vai trò: Badge trạng thái với hiệu ứng pulse

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Star } from "lucide-react";

interface StatusBadgeProps {
  status: "pending" | "submitted" | "graded";
  isOverdue?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  pending: {
    label: "Chưa nộp",
    icon: Clock,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  submitted: {
    label: "Đã nộp",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  graded: {
    label: "Đã chấm",
    icon: Star,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
};

const sizeConfig = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
  lg: "text-base px-4 py-1.5 gap-2",
};

export function StatusBadge({
  status,
  isOverdue = false,
  className = "",
  size = "md",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "flex items-center rounded-full border font-medium",
        config.bg,
        config.border,
        config.color,
        sizeConfig[size],
        isOverdue && "animate-pulse border-red-500 bg-red-500/10 text-red-500",
        className,
      )}
    >
      <Icon className={cn("w-3 h-3", size === "lg" ? "w-4 h-4" : "w-3 h-3")} />
      <span>{isOverdue ? "Quá hạn" : config.label}</span>
    </motion.div>
  );
}
