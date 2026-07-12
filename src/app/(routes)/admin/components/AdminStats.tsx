// src/app/(routes)/admin/components/AdminStats.tsx

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Crown, Shield, User, Users } from "lucide-react";
import { AdminStats as StatsType } from "../types";
import { StatsCard } from "./StatsCard";

interface AdminStatsProps {
  stats: StatsType;
  loading?: boolean;
}

export function AdminStats({ stats, loading = false }: AdminStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      <StatsCard
        title="Tổng người dùng"
        value={stats.totalUsers}
        icon={Users}
        color="from-blue-500 to-blue-600"
        change={`+${stats.newUsers} mới`}
      />
      <StatsCard
        title="Admin"
        value={stats.totalAdmins}
        icon={Crown}
        color="from-red-500 to-red-600"
      />
      <StatsCard
        title="Giảng viên"
        value={stats.totalTeachers}
        icon={Shield}
        color="from-purple-500 to-purple-600"
      />
      <StatsCard
        title="Học sinh"
        value={stats.totalStudents}
        icon={User}
        color="from-green-500 to-green-600"
      />
    </motion.div>
  );
}
