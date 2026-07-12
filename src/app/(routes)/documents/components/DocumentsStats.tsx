// src/app/(routes)/documents/components/DocumentsStats.tsx
// STATS COUNTERS - TỐI ƯU HIỂN THỊ

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Download, Eye, FileText, HardDrive, Upload } from "lucide-react";

interface DocumentsStatsProps {
  total: number;
  downloads: number;
  views: number;
  recentUploads: number;
  totalSize: string;
  loading?: boolean;
}

export function DocumentsStats({
  total,
  downloads,
  views,
  recentUploads,
  totalSize,
  loading = false,
}: DocumentsStatsProps) {
  const stats = [
    {
      label: "Tổng tài liệu",
      value: total,
      icon: FileText,
      color: "from-cyan-500 to-blue-500",
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      label: "Lượt tải",
      value: downloads,
      icon: Download,
      color: "from-blue-500 to-purple-500",
      gradient: "from-blue-500/20 to-purple-500/20",
    },
    {
      label: "Lượt xem",
      value: views,
      icon: Eye,
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      label: "Mới thêm (7 ngày)",
      value: recentUploads,
      icon: Upload,
      color: "from-green-500 to-emerald-500",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      label: "Tổng dung lượng",
      value: totalSize,
      icon: HardDrive,
      color: "from-orange-500 to-red-500",
      gradient: "from-orange-500/20 to-red-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm animate-pulse"
          >
            <div className="h-3 w-16 bg-white/10 rounded mb-2" />
            <div className="h-6 w-12 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isString = typeof stat.value === "string";
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
            className={cn(
              "p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-primary/30 transition-all group relative overflow-hidden",
              "hover:shadow-[0_0_30px_rgba(6,182,212,0.05)]",
            )}
          >
            {/* Background gradient on hover */}
            <div
              className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                `bg-gradient-to-br ${stat.gradient}`,
              )}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">
                    {stat.label}
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-white mt-1 tabular-nums">
                    {isString
                      ? stat.value
                      : (stat.value as number).toLocaleString()}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl bg-gradient-to-r flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                    stat.color,
                  )}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent group-hover:via-cyan-500/50 transition-all duration-500" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
