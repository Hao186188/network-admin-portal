// src/components/common/notifications.tsx
// Vai trò: Component thông báo - FIXED RE-RENDER

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClickAway } from "@/hooks/use-click-away";
import { useNotifications, type Notification } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  Bell,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  MessageCircle,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const NOTIFICATION_ICONS = {
  assignment: { icon: FileText, color: "text-blue-500 bg-blue-500/10" },
  announcement: {
    icon: MessageCircle,
    color: "text-purple-500 bg-purple-500/10",
  },
  submission: { icon: Users, color: "text-green-500 bg-green-500/10" },
  grade: { icon: Award, color: "text-yellow-500 bg-yellow-500/10" },
  course: { icon: BookOpen, color: "text-cyan-500 bg-cyan-500/10" },
  default: { icon: Bell, color: "text-gray-500 bg-gray-500/10" },
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  if (weeks < 4) return `${weeks} tuần trước`;
  if (months < 12) return `${months} tháng trước`;
  return date.toLocaleDateString("vi-VN");
};

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  } = useNotifications();

  useClickAway(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  // ✅ CHỈ REFRESH KHI MỞ DROPDOWN LẦN ĐẦU
  const [hasRefreshed, setHasRefreshed] = useState(false);

  useEffect(() => {
    if (isOpen && !hasRefreshed) {
      refresh();
      setHasRefreshed(true);
    }
    if (!isOpen) {
      setHasRefreshed(false);
    }
  }, [isOpen, refresh, hasRefreshed]);

  const getIconConfig = useCallback((type: string) => {
    return (
      NOTIFICATION_ICONS[type as keyof typeof NOTIFICATION_ICONS] ||
      NOTIFICATION_ICONS.default
    );
  }, []);

  const handleClick = useCallback((notification: Notification) => {
    setIsOpen(false);
    if (notification.link) {
      window.location.href = notification.link;
    }
  }, []);

  const handleMarkAsRead = useCallback(
    async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      await markAsRead(id);
    },
    [markAsRead],
  );

  const handleDelete = useCallback(
    async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      await deleteNotification(id);
    },
    [deleteNotification],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    setIsAnimating(true);
    await markAllAsRead();
    setTimeout(() => setIsAnimating(false), 300);
  }, [markAllAsRead]);

  const notificationCount = useMemo(
    () => notifications.length,
    [notifications],
  );

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setIsOpen(false);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-muted w-8 h-8 md:w-9 md:h-9 touch-friendly"
          aria-label="Thông báo"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-red-600 text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-background shadow-lg"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        ref={dropdownRef}
        align="end"
        className="w-[360px] max-h-[480px] p-0 overflow-hidden rounded-2xl shadow-2xl border-border/50"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-3 border-b border-border flex items-center justify-between">
          <DropdownMenuLabel className="text-sm font-semibold p-0 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span>Thông báo</span>
            {notificationCount > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {notificationCount}
              </span>
            )}
            {unreadCount > 0 && (
              <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                {unreadCount} chưa đọc
              </span>
            )}
          </DropdownMenuLabel>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2 hover:text-primary hover:bg-primary/10"
                onClick={handleMarkAllAsRead}
                disabled={isAnimating}
              >
                {isAnimating ? (
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Đọc tất cả"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-2 overflow-y-auto max-h-[360px]">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Đang tải...</p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-sm font-medium text-red-500">
                ⚠️ Lỗi tải thông báo
              </p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={refresh}
              >
                Thử lại
              </Button>
            </motion.div>
          ) : notificationCount === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm font-medium">✅ Không có thông báo</p>
              <p className="text-xs text-muted-foreground mt-1">
                Bạn chưa có thông báo nào
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-1">
                {notifications.map((notification, index) => {
                  const { icon: Icon, color } = getIconConfig(
                    notification.type,
                  );
                  const isUnread = !notification.read;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      layout
                    >
                      <DropdownMenuItem
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all",
                          "hover:bg-muted/80 focus:bg-muted/80",
                          isUnread && "bg-primary/5 hover:bg-primary/10",
                          "border border-transparent hover:border-border/50",
                        )}
                        onClick={() => handleClick(notification)}
                      >
                        {/* Icon */}
                        <div
                          className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105",
                            color,
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={cn(
                                "text-sm truncate",
                                isUnread
                                  ? "font-semibold"
                                  : "font-medium text-muted-foreground",
                              )}
                            >
                              {notification.title}
                            </p>
                            {isUnread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.created_at)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-0.5 flex-shrink-0">
                          {isUnread && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-primary/10 rounded-full"
                              onClick={(e) =>
                                handleMarkAsRead(notification.id, e)
                              }
                              title="Đánh dấu đã đọc"
                            >
                              <CheckCircle className="w-3 h-3 text-primary" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive rounded-full"
                            onClick={(e) => handleDelete(notification.id, e)}
                            title="Xóa thông báo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </DropdownMenuItem>
                      {index < notifications.length - 1 && (
                        <DropdownMenuSeparator className="my-1" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && notificationCount > 0 && (
          <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground hover:text-primary gap-2 h-8"
              onClick={() => {
                setIsOpen(false);
                window.location.href = "/announcements";
              }}
            >
              <Sparkles className="w-3 h-3" />
              Xem tất cả thông báo
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
