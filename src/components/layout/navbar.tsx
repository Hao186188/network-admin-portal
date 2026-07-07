// src/components/layout/navbar.tsx
// Vai trò: Navbar - FIX DARK MODE BUTTON

"use client";

import { Notifications } from "@/components/common/notifications";
import { Search } from "@/components/common/search";
import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Bell as BellIcon,
  BookMarked,
  BookOpen,
  Calendar,
  ClipboardList,
  Code,
  Crown,
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
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
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

const adminMobileNavItems = [{ name: "Quản trị", href: "/admin", icon: Crown }];

export function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const allMobileNavItems = [
    ...mobileNavItems,
    ...(isAdmin ? adminMobileNavItems : []),
  ];

  const displayName = session?.user?.name || session?.user?.username || "User";

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await signOut({
      redirect: false,
      callbackUrl: "/login",
    });
    window.location.href = "/login";
  };

  // Kiểm tra theme hiện tại
  const isDark = resolvedTheme === "dark";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent",
      )}
    >
      <nav className="h-16 md:h-20 px-4 md:px-6 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left - Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold gradient-text">Mạng 3 Hub</span>
            <span className="text-xs text-muted-foreground block -mt-1">
              Quản trị Mạng
            </span>
          </div>
        </Link>

        {/* Center - Navigation Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {mobileNavItems.slice(0, 8).map((item) => (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ y: -2 }}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted",
                )}
              >
                {item.name}
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <Search />

          {/* Theme Toggle - FIXED */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative hover:bg-muted"
              aria-label="Toggle theme"
            >
              <Sun
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isDark ? "rotate-90 scale-0" : "rotate-0 scale-100",
                )}
              />
              <Moon
                className={cn(
                  "absolute h-5 w-5 transition-all duration-300",
                  isDark ? "rotate-0 scale-100" : "rotate-90 scale-0",
                )}
              />
            </Button>
          )}

          <Notifications />

          {/* Admin Button - Chỉ hiển thị với ADMIN */}
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 hover:bg-primary/10",
                  pathname?.startsWith("/admin") &&
                    "bg-primary/10 text-primary",
                )}
              >
                <Crown className="w-4 h-4 text-primary" />
                <span className="hidden md:inline">Quản trị</span>
              </Button>
            </Link>
          )}

          {/* Auth Section */}
          {isAuthenticated && session ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-primary/10"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium text-foreground">
                    {displayName}
                  </span>
                </Button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-background rounded-2xl shadow-2xl border border-border overflow-hidden z-50"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-border">
                          <p className="text-sm font-semibold truncate">
                            {session.user?.name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            @{session.user?.username || "username"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {session.user?.email}
                          </p>
                        </div>
                        <Link href="/profile">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 mt-1 hover:bg-primary/10"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Hồ sơ cá nhân
                          </Button>
                        </Link>
                        {isAdmin && (
                          <Link href="/admin">
                            <Button
                              variant="ghost"
                              className="w-full justify-start gap-2 hover:bg-primary/10"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <Crown className="w-4 h-4 text-primary" />
                              Quản trị hệ thống
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 mt-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-primary/10"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline">Đăng nhập</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="gap-2 hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <User className="w-4 h-4" />
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-muted"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <div className="p-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {allMobileNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
