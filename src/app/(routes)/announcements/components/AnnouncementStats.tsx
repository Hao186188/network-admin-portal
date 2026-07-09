// src/app/(routes)/announcements/components/AnnouncementStats.tsx
// Vai trò: Thống kê announcements

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Bell, Eye, Heart, MessageCircle } from "lucide-react";

interface AnnouncementStatsProps {
  total: number;
  views: number;
  likes: number;
  comments: number;
  loading: boolean;
}

export function AnnouncementStats({
  total,
  views,
  likes,
  comments,
  loading,
}: AnnouncementStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-8 w-12 bg-muted rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Tổng thông báo",
      value: total,
      icon: Bell,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Lượt xem",
      value: views,
      icon: Eye,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Lượt thích",
      value: likes,
      icon: Heart,
      color: "from-red-500 to-rose-500",
    },
    {
      label: "Bình luận",
      value: comments,
      icon: MessageCircle,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
        >
          <Card className="relative overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}
            />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold tabular-nums">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all duration-500" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
