// src/components/layout/sidebar.tsx
// Vai trò: Sidebar - CÓ FALLBACK KHI CHƯA MOUNTED

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    Award,
    Bell,
    BookMarked,
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Code,
    FileCode,
    FileText,
    Home,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageCircle,
    Package,
    Sparkles,
    Users,
    X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigationItems = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Thông báo", href: "/announcements", icon: Bell },
  { name: "Môn học", href: "/courses", icon: BookMarked },
  { name: "Bài tập", href: "/assignments", icon: ClipboardList },
  { name: "Lịch thi", href: "/exams", icon: Award },
  { name: "Giới thiệu", href: "/about", icon: Users },
  { name: "Tài liệu", href: "/documents", icon: BookOpen },
  { name: "Bài giảng", href: "/lectures", icon: FileText },
  { name: "Lịch học", href: "/schedule", icon: Calendar },
  { name: "Diễn đàn", href: "/forum", icon: MessageCircle },
  { name: "Kho phần mềm", href: "/software", icon: Package },
  { name: "Dự án", href: "/projects", icon: Code },
  { name: "Source Code", href: "/source-code", icon: FileCode },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
        setIsMobileOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Ẩn sidebar trên auth pages
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password")
  ) {
    return null;
  }

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("sidebar-toggle", {
            detail: { isCollapsed: newState },
          }),
        );
      }
    }
  };

  const sidebarWidth = isCollapsed ? 80 : 280;
  const isVisible = !isMobile || isMobileOpen;

  // Không render khi chưa mounted để tránh lỗi hydration
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-50 lg:hidden"
          aria-label="Toggle sidebar"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isVisible ? sidebarWidth : 0,
          x: isMobile ? (isMobileOpen ? 0 : -sidebarWidth) : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 h-screen bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50 z-50 overflow-hidden",
          "shadow-xl dark:shadow-2xl",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/25 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-sm font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent truncate">
                Mạng 3 Hub
              </span>
            )}
          </Link>
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => isMobile && setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-primary-500",
                  )}
                />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
                {isCollapsed && (
                  <span className="absolute left-14 hidden group-hover:inline-block bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          {status === "authenticated" && session ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {session.user?.name?.charAt(0) || "U"}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.user?.role || "STUDENT"}
                  </p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                onClick={() => signOut()}
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login">
                <Button variant="default" className="w-full text-sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="w-full text-sm">
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
