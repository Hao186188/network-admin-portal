// src/components/common/notifications.tsx
// Vai trò: Component thông báo - KHÔNG TỰ ĐỘNG ĐÁNH DẤU ĐÃ ĐỌC

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
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  Clock,
  FileText,
  MessageCircle,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return FileText;
      case "announcement":
        return MessageCircle;
      case "submission":
        return Users;
      case "grade":
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "assignment":
        return "text-blue-500 bg-blue-500/10";
      case "announcement":
        return "text-purple-500 bg-purple-500/10";
      case "submission":
        return "text-green-500 bg-green-500/10";
      case "grade":
        return "text-yellow-500 bg-yellow-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const formatTime = (dateString: string) => {
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

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(id);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  const handleClick = (notification: any) => {
    // KHÔNG đánh dấu đã đọc khi click vào thông báo
    // Chỉ đóng dropdown và chuyển trang
    setIsOpen(false);
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          refresh();
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-muted w-8 h-8 md:w-9 md:h-9"
          aria-label="Thông báo"
        >
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-background"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[400px] overflow-y-auto p-0"
      >
        <div className="sticky top-0 bg-background z-10 p-3 border-b border-border flex items-center justify-between">
          <DropdownMenuLabel className="text-sm font-semibold p-0 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Thông báo
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">
                ({unreadCount} chưa đọc)
              </span>
            )}
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs hover:text-primary"
              onClick={markAllAsRead}
            >
              Đánh dấu đã đọc tất cả
            </Button>
          )}
        </div>

        <div className="p-2">
          {loading && notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Đang tải...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm font-medium">✅ Đã xem hết thông báo</p>
              <p className="text-xs text-muted-foreground mt-1">
                Bạn đã đọc tất cả thông báo
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => {
                const Icon = getIcon(notification.type);
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <DropdownMenuItem
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                        "bg-primary/5 hover:bg-primary/10",
                      )}
                      onClick={() => handleClick(notification)}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          getIconColor(notification.type),
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {notification.title}
                          </p>
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 animate-pulse" />
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-primary/10"
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          title="Đánh dấu đã đọc"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
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
          )}
        </div>

        {/* Footer */}
        {!loading && notifications.length > 0 && (
          <div className="sticky bottom-0 bg-background p-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground hover:text-primary"
              onClick={() => {
                setIsOpen(false);
                window.location.href = "/announcements";
              }}
            >
              📢 Xem tất cả thông báo
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
