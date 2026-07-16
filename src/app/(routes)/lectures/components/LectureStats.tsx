// src/app/(routes)/lectures/components/LectureStats.tsx
// LECTURE STATS - HOÀN CHỈNH

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LectureStats as StatsType } from "@/types";
import { motion } from "framer-motion";
import { BookOpen, Eye, FileText, Heart, Monitor, Video } from "lucide-react";

interface LectureStatsProps {
  stats: StatsType;
  loading: boolean;
}

const statItems = [
  {
    key: "total",
    label: "Tổng bài giảng",
    icon: BookOpen,
    color: "from-primary to-secondary",
    gradient: "from-primary/20 to-secondary/20",
  },
  {
    key: "totalViews",
    label: "Lượt xem",
    icon: Eye,
    color: "from-blue-500 to-cyan-500",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    key: "totalLikes",
    label: "Lượt thích",
    icon: Heart,
    color: "from-red-500 to-rose-500",
    gradient: "from-red-500/20 to-rose-500/20",
  },
  {
    key: "totalVideos",
    label: "Video",
    icon: Video,
    color: "from-orange-500 to-red-500",
    gradient: "from-orange-500/20 to-red-500/20",
  },
  {
    key: "totalSlides",
    label: "Slide",
    icon: FileText,
    color: "from-purple-500 to-indigo-500",
    gradient: "from-purple-500/20 to-indigo-500/20",
  },
  {
    key: "totalLabs",
    label: "Lab",
    icon: Monitor,
    color: "from-green-500 to-emerald-500",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
];

export function LectureStats({ stats, loading }: LectureStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse border-border/50">
            <CardContent className="p-4">
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="h-8 w-12 bg-muted rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Chỉ hiển thị các stat có giá trị > 0
  const visibleStats = statItems.filter((item) => {
    const value = stats[item.key as keyof StatsType];
    return value !== undefined && value > 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {visibleStats.map((item, index) => {
        const value = stats[item.key as keyof StatsType];
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 + index * 0.05 }}
          >
            <Card className="relative overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group">
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-300",
                  item.gradient,
                  "opacity-50 group-hover:opacity-100",
                )}
              />
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold tabular-nums mt-0.5">
                      {value?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
                      item.color,
                    )}
                  >
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                {/* Progress bar animation */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all duration-500" />
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
