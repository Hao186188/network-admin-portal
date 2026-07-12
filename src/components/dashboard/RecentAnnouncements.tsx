// src/components/dashboard/RecentAnnouncements.tsx
// Recent Announcements - TỐI ƯU

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnnouncements } from "@/hooks/use-announcements";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, Bell, Pin, Plus } from "lucide-react";
import Link from "next/link";

interface RecentAnnouncementsProps {
  onViewDetail: (announcement: any) => void;
  onCreateClick: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};

export function RecentAnnouncements({
  onViewDetail,
  onCreateClick,
}: RecentAnnouncementsProps) {
  // ✅ SỬA: loading -> isLoading
  const { announcements, isLoading } = useAnnouncements();
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="h-full"
    >
      <Card className="h-full border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            Thông báo mới
            {!isLoading && recentAnnouncements.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {recentAnnouncements.length}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs md:text-sm px-2 md:px-3 hover:bg-primary/10 hover:text-primary"
              onClick={onCreateClick}
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Tạo mới</span>
            </Button>
            <Link href="/announcements">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs md:text-sm px-2 md:px-3"
              >
                <span className="hidden sm:inline">Xem tất cả</span>
                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-3 md:space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-muted/30 animate-pulse"
              >
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted mt-1.5 md:mt-2" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/4 bg-muted rounded" />
                </div>
              </div>
            ))
          ) : recentAnnouncements.length > 0 ? (
            recentAnnouncements.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group active:scale-[0.98] relative overflow-hidden border border-transparent hover:border-primary/20"
                onClick={() => onViewDetail(item)}
              >
                <div
                  className={cn(
                    "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mt-1.5 md:mt-2 flex-shrink-0",
                    item.priority === "high"
                      ? "bg-red-500"
                      : item.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-blue-500",
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    {item.pinned && (
                      <Pin className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary flex-shrink-0" />
                    )}
                    <p className="font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                    {item.content}
                  </p>
                  <div className="flex items-center gap-2 md:gap-3 mt-1">
                    <span className="text-[10px] md:text-xs text-muted-foreground">
                      {formatDate(item.created_at)}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[8px] md:text-[10px] px-1.5 py-0 md:px-2 md:py-0.5"
                    >
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 md:py-8 text-muted-foreground"
            >
              <Bell className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 opacity-50" />
              <p className="text-sm md:text-base">Chưa có thông báo mới</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs md:text-sm hover:bg-primary/10 hover:text-primary"
                onClick={onCreateClick}
              >
                <Plus className="w-3 h-3 mr-1" />
                Tạo thông báo đầu tiên
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
