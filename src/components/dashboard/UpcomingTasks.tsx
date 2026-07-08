// src/components/dashboard/UpcomingTasks.tsx
// Vai trò: Hiển thị bài tập sắp đến hạn

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/use-dashboard";
import { motion } from "framer-motion";
import { AlertCircle, ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};

export function UpcomingTasks() {
  const { upcomingTasks, loading } = useDashboard();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Bài tập sắp đến hạn
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
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 animate-pulse"
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
            upcomingTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      task.status === "urgent"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                        : task.status === "pending"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                    }`}
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
                <Badge
                  variant={
                    task.status === "urgent"
                      ? "destructive"
                      : task.status === "pending"
                        ? "warning"
                        : "secondary"
                  }
                >
                  {task.status === "urgent"
                    ? "Gấp"
                    : task.status === "pending"
                      ? "Chờ"
                      : "Sắp tới"}
                </Badge>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Không có bài tập nào sắp đến hạn</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
