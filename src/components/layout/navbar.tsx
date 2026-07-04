// src/components/layout/navbar.tsx
// Vai trò: Navbar trên cùng với auto margin theo sidebar

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Bell,
  Bell as BellIcon,
  BookMarked,
  BookOpen,
  Calendar,
  ClipboardList,
  Code,
  FileText,
  HelpCircle,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Package,
  Search,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const mobileNavItems = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Thông báo", href: "/announcements", icon: BellIcon },
  { name: "Môn học", href: "/courses", icon: BookMarked },
  { name: "Bài tập", href: "/assignments", icon: ClipboardList },
  { name: "Lịch thi", href: "/exams", icon: Award },
  { name: "Tài liệu", href: "/documents", icon: BookOpen },
  { name: "Bài giảng", href: "/lectures", icon: FileText },
  { name: "Lịch học", href: "/schedule", icon: Calendar },
  { name: "Diễn đàn", href: "/forum", icon: MessageCircle },
  { name: "Kho phần mềm", href: "/software", icon: Package },
  { name: "Dự án", href: "/projects", icon: Code },
  { name: "Giới thiệu", href: "/about", icon: Info },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
  { name: "Liên hệ", href: "/contact", icon: Mail },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lắng nghe sự thay đổi của sidebar
  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarWidth(e.detail.isCollapsed ? 80 : 280);
    };
    window.addEventListener(
      "sidebar-toggle",
      handleSidebarToggle as EventListener,
    );
    return () =>
      window.removeEventListener(
        "sidebar-toggle",
        handleSidebarToggle as EventListener,
      );
  }, []);

  // Ẩn navbar trên auth pages
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password")
  ) {
    return null;
  }

  const isAuthenticated = status === "authenticated";

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          : "bg-transparent",
        "left-0",
      )}
      style={{ left: `${sidebarWidth}px` }}
    >
      <nav className="h-16 md:h-20 px-4 md:px-6 flex items-center justify-between">
        {/* Left - Page Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {pathname?.split("/")[1]?.toUpperCase() || "TRANG CHỦ"}
          </h1>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
            <kbd className="hidden md:block absolute -top-1 -right-1 text-[10px] bg-gray-200 dark:bg-gray-700 px-1 rounded text-gray-500 dark:text-gray-400">
              ⌘K
            </kbd>
          </Button>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          )}

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </Button>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:inline">
                  {session.user?.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Đăng xuất</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline">Đăng nhập</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  variant="gradient"
                  className="gap-2 hidden sm:flex"
                >
                  <User className="w-4 h-4" />
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm">Mạng 3 Hub</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
                {mobileNavItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className="w-5 h-5 text-gray-500" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
