// src/components/dashboard/DashboardHero.tsx
// Vai trò: Hero section của Dashboard - TỐI ƯU MOBILE

"use client";

import { Badge } from "@/components/ui/badge";
import { useStats } from "@/hooks/use-stats";
import { motion } from "framer-motion";
import {
    BookOpen,
    CheckCircle,
    Sparkles,
    TrendingUp,
    Users,
    Video,
} from "lucide-react";
import { useSession } from "next-auth/react";

export function DashboardHero() {
  const { data: session } = useSession();
  const stats = useStats();

  const currentHour = new Date().getHours();
  let greeting = "Chào buổi sáng ☀️";
  if (currentHour >= 12 && currentHour < 18) greeting = "Chào buổi chiều 🌤️";
  else if (currentHour >= 18) greeting = "Chào buổi tối 🌙";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl p-4 md:p-8 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute -top-20 -right-20 w-48 md:w-64 h-48 md:h-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-48 md:w-64 h-48 md:h-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white animate-pulse" />
            <span className="text-white/80 text-xs md:text-sm font-medium">
              {greeting}
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-bold text-white leading-tight">
            Chào mừng trở lại,{" "}
            <span className="underline decoration-white/30">
              {session?.user?.name?.split(" ")[0] || "Người dùng"}
            </span>
          </h2>
          <p className="text-white/80 mt-1 text-xs md:text-base">
            Hôm nay là một ngày tuyệt vời để học tập!
          </p>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-3 text-white/70 text-xs md:text-sm">
            <span className="flex items-center gap-1 bg-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded-full">
              <Users className="w-3 h-3 md:w-4 md:h-4" />
              {stats.students || 0} sinh viên
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded-full">
              <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
              {stats.documents || 0} tài liệu
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2 py-1 md:px-3 md:py-1.5 rounded-full">
              <Video className="w-3 h-3 md:w-4 md:h-4" />
              {stats.lectures || 0} bài giảng
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-[10px] md:text-xs px-2 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã kết nối
          </Badge>
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-[10px] md:text-xs px-2 py-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            Học tập tích cực
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
