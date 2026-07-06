// src/components/common/notifications.tsx
// Vai trò: Hiển thị thông báo

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    AlertCircle,
    AlertTriangle,
    Bell,
    CheckCircle,
    Info,
    X,
} from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  read: boolean;
  time: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Đăng nhập thành công",
    message: "Bạn đã đăng nhập vào hệ thống",
    type: "success",
    read: false,
    time: "2 phút trước",
  },
  {
    id: "2",
    title: "Bài tập mới",
    message: "Bài tập tuần 5 đã được đăng tải",
    type: "info",
    read: false,
    time: "15 phút trước",
  },
  {
    id: "3",
    title: "Hạn nộp bài",
    message: "Lab 3 sắp đến hạn nộp",
    type: "warning",
    read: false,
    time: "1 giờ trước",
  },
];

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return CheckCircle;
    case "error":
      return AlertCircle;
    case "warning":
      return AlertTriangle;
    default:
      return Info;
  }
};

const getColor = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return "text-green-500 bg-green-500/10";
    case "error":
      return "text-red-500 bg-red-500/10";
    case "warning":
      return "text-yellow-500 bg-yellow-500/10";
    default:
      return "text-blue-500 bg-blue-500/10";
  }
};

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                const color = getColor(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group",
                      !notification.read && "bg-primary/5",
                    )}
                  >
                    <div
                      className={cn("p-2 rounded-full flex-shrink-0", color)}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="p-1 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Không có thông báo</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
