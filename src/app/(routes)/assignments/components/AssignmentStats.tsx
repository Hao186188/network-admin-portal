// src/app/(routes)/assignments/components/AssignmentStats.tsx
// Vai trò: Thống kê - DÙNG DỮ LIỆU THỰC

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CheckCircle, Clock, FileText, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface AssignmentStatsProps {
  assignments: any[];
  loading: boolean;
}

function AnimatedCounter({ value, label, icon: Icon, color }: any) {
  const [displayValue, setDisplayValue] = useState(0);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const spring = useSpring(count, { stiffness: 100, damping: 30 });

  useEffect(() => {
    spring.set(value);
    const unsubscribe = spring.onChange((latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [value, spring]);

  return (
    <Card className="relative overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`}
      />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <motion.p
              className="text-3xl font-bold tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {displayValue}
            </motion.p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all duration-500" />
      </CardContent>
    </Card>
  );
}

export function AssignmentStats({
  assignments,
  loading,
}: AssignmentStatsProps) {
  // ✅ TÍNH TOÁN DỮ LIỆU THỰC TẾ
  const total = assignments.length;
  const pending = assignments.filter((a) => a.status === "pending").length;
  const submitted = assignments.filter((a) => a.status === "submitted").length;
  const graded = assignments.filter((a) => a.status === "graded").length;
  const overdue = assignments.filter(
    (a) => new Date(a.due_date) < new Date() && a.status === "pending",
  ).length;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
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
      label: "Tổng bài tập",
      value: total,
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Chưa nộp",
      value: pending,
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
    },
    {
      label: "Đã nộp",
      value: submitted,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Đã chấm",
      value: graded,
      icon: Star,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Quá hạn",
      value: overdue,
      icon: TrendingUp,
      color: "from-red-500 to-rose-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-5 gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
        >
          <AnimatedCounter {...stat} />
        </motion.div>
      ))}
    </motion.div>
  );
}
