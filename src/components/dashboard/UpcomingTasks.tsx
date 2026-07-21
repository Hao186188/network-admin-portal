// src/components/dashboard/UpcomingTasks.tsx
// Upcoming Tasks - TỐI ƯU

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime(); // thời gian còn lại (tương lai - hiện tại)

  if (diff < 0) return "Quá hạn";

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `Còn ${days} ngày`;
  if (hours > 0) return `Còn ${hours} giờ`;
  return `Còn ${minutes} phút`;
};

const STATUS_CONFIG = {
  urgent: {
    label: "Gấp",
    className: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  },
  pending: {
    label: "Chờ",
    className: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  },
  upcoming: {
    label: "Sắp tới",
    className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  },
};

export function UpcomingTasks() {
  const { upcomingTasks, loading } = useDashboard();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="h-full border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/3 via-transparent to-accent/3 pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Bài tập sắp đến hạn
            {!loading && upcomingTasks.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {upcomingTasks.length}
              </Badge>
            )}
          </CardTitle>
          <Link href="/assignments">
            <Button variant="ghost" size="sm" className="gap-1">
              Xem tất cả
              <ArrowUpRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-6 w-16 bg-muted rounded" />
              </div>
            ))
          ) : upcomingTasks.length > 0 ? (
            upcomingTasks.map((task, index) => {
              // Tính status dựa trên due_date thực tế
              const daysLeft = Math.floor(
                (new Date(task.due_date).getTime() - Date.now()) / 86400000
              );
              const status: keyof typeof STATUS_CONFIG =
                daysLeft < 0
                  ? "urgent"
                  : daysLeft <= 2
                    ? "urgent"
                    : daysLeft <= 7
                      ? "pending"
                      : "upcoming";
              const config = STATUS_CONFIG[status];

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-secondary/20 relative overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        status === "urgent"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                          : status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
                      )}
                    >
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-secondary transition-colors">
                        {task.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {task.due_date
                          ? formatDate(task.due_date)
                          : "Chưa có hạn"}
                      </p>
                    </div>
                  </div>
                  <Badge className={config.className}>{config.label}</Badge>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Không có bài tập nào sắp đến hạn</p>
              <p className="text-sm">Bạn đã hoàn thành tất cả!</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
