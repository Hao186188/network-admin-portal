// src/components/layout/navbar.tsx
// HOÀN CHỈNH - DÙNG POLLING THAY VÌ REALTIME

"use client";

import { Notifications } from "@/components/common/notifications";
import { Search } from "@/components/common/search";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLectures } from "@/hooks/useLectures";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell as BellIcon,
  BookOpen,
  ClipboardList,
  Code,
  Crown,
  FileText,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

// ============================================
// TYPES
// ============================================

interface NavItemType {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

// ============================================
// CONSTANTS
// ============================================

const desktopNavItems: NavItemType[] = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Diễn đàn", href: "/forum", icon: MessageCircle },
  // { name: "Bài tập", href: "/assignments", icon: ClipboardList },
  { name: "Tài liệu", href: "/documents", icon: BookOpen },
  { name: "Hồ sơ", href: "/lectures", icon: FileText },
];

const mobileNavItems: NavItemType[] = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Thông báo", href: "/announcements", icon: BellIcon },
  // { name: "Môn học", href: "/courses", icon: BookMarked },
  { name: "Bài tập", href: "/assignments", icon: ClipboardList },
  { name: "Tài liệu", href: "/documents", icon: BookOpen },
  { name: "Hồ sơ", href: "/lectures", icon: FileText },
  { name: "Diễn đàn", href: "/forum", icon: MessageCircle },
  { name: "Dự án", href: "/projects", icon: Code },
  { name: "Giới thiệu", href: "/about", icon: Info },
  // { name: "FAQ", href: "/faq", icon: HelpCircle },
  // { name: "Liên hệ", href: "/contact", icon: Mail },
];

const adminMobileNavItems: NavItemType[] = [
  { name: "Quản trị", href: "/admin", icon: Crown },
  { name: "Kiểm duyệt", href: "/lectures/moderate", icon: ShieldCheck },
];

// ============================================
// COMPONENTS
// ============================================

const NavItem = memo(
  ({ item, isActive }: { item: NavItemType; isActive: boolean }) => (
    <Link href={item.href}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1.5",
          isActive
            ? "text-primary bg-primary/10 shadow-sm"
            : "text-foreground/70 hover:text-foreground hover:bg-muted",
        )}
      >
        {item.name}
        {item.badge && item.badge > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
            {item.badge}
          </span>
        )}
      </motion.div>
    </Link>
  ),
);

NavItem.displayName = "NavItem";

const MobileNavItem = memo(({ item, isActive, onClick }: any) => (
  <Link
    href={item.href}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.98]",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-foreground/70 hover:text-foreground hover:bg-muted",
    )}
    onClick={onClick}
  >
    <item.icon className="w-5 h-5" />
    <span className="text-sm font-medium">{item.name}</span>
    {item.badge && item.badge > 0 && (
      <span className="ml-auto px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
        {item.badge}
      </span>
    )}
  </Link>
));

MobileNavItem.displayName = "MobileNavItem";

// ============================================
// MAIN NAVBAR
// ============================================

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // ✅ Sử dụng useLectures để lấy pending count
  const { pendingLectures, isPendingLoading } = useLectures();

  const isAuthenticated = useMemo(
    () => status === "authenticated" && !!session?.user,
    [status, session],
  );
  const isAdmin = useMemo(() => session?.user?.role === "ADMIN", [session]);
  const isTeacher = useMemo(() => session?.user?.role === "TEACHER", [session]);
  const canModerate = useMemo(() => isAdmin || isTeacher, [isAdmin, isTeacher]);

  const isDark = useMemo(() => resolvedTheme === "dark", [resolvedTheme]);

  const displayName = useMemo(
    () => session?.user?.name || session?.user?.username || "User",
    [session],
  );
  const userInitial = useMemo(
    () => displayName.charAt(0).toUpperCase(),
    [displayName],
  );

  // ✅ Cập nhật pending count từ pendingLectures
  useEffect(() => {
    if (canModerate && pendingLectures) {
      setPendingCount(pendingLectures.length);
    }
  }, [canModerate, pendingLectures]);

  // ✅ Build desktop nav items với badge
  const desktopNavItemsWithBadge = useMemo(() => {
    return desktopNavItems.map((item) => {
      if (item.href === "/lectures" && canModerate && pendingCount > 0) {
        return { ...item, badge: pendingCount };
      }
      return item;
    });
  }, [canModerate, pendingCount]);

  // ✅ Build mobile nav items với badge
  const allMobileNavItems = useMemo(() => {
    const items = [...mobileNavItems];

    if (isAdmin) {
      items.push(...adminMobileNavItems);
    } else if (canModerate) {
      items.push({
        name: "Kiểm duyệt",
        href: "/lectures/moderate",
        icon: ShieldCheck,
        badge: pendingCount > 0 ? pendingCount : undefined,
      });
    }

    return items.map((item) => {
      if (item.href === "/lectures" && canModerate && pendingCount > 0) {
        return { ...item, badge: pendingCount };
      }
      return item;
    });
  }, [isAdmin, canModerate, pendingCount]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    setIsProfileOpen(false);
    try {
      sessionStorage.setItem("isLoggingOut", "true");
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isProfileOpen) setIsProfileOpen(false);
  }, [isProfileOpen]);

  const toggleProfile = useCallback(() => {
    setIsProfileOpen((prev) => !prev);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  }, [isMobileMenuOpen]);

  const closeAllMenus = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
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

  // Loading skeleton
  if (!mounted || status === "loading") {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border shadow-lg">
        <nav className="h-16 md:h-20 px-4 md:px-6 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold gradient-text">
                Thanh Giáo Là
              </span>
              <span className="text-xs text-muted-foreground block -mt-1">
                Quản trị Mạng
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            <div className="w-20 h-9 rounded-lg bg-muted animate-pulse hidden sm:block" />
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 navbar-transition",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent",
      )}
    >
      <nav className="h-14 md:h-16 lg:h-20 px-2 sm:px-4 lg:px-6 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 md:gap-2 group touch-friendly flex-shrink-0"
          aria-label="Trang chủ"
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </motion.div>
          <div className="hidden sm:block">
            <span className="text-sm md:text-base lg:text-lg font-bold gradient-text whitespace-nowrap">
              Mạng 3 Hub
            </span>
            <span className="text-[8px] md:text-[10px] lg:text-xs text-muted-foreground block -mt-0.5 whitespace-nowrap">
              Quản trị Mạng
            </span>
          </div>
          <span className="sm:hidden text-sm font-bold gradient-text whitespace-nowrap">
            Mạng 3
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center gap-0.5 flex-1 justify-center px-2 overflow-x-auto">
          {desktopNavItemsWithBadge.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isActive={
                pathname === item.href || pathname?.startsWith(item.href + "/")
              }
            />
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2 flex-shrink-0">
          <div className="hidden sm:block">
            <Search />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden hover:bg-muted touch-friendly w-8 h-8 md:w-9 md:h-9 relative"
            aria-label="Tìm kiếm"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Button>

          <ThemeToggle />
          <Notifications />

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 hover:bg-primary/10 touch-friendly px-2 lg:px-3"
                onClick={toggleProfile}
                aria-label="Tài khoản"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-[10px] md:text-xs font-bold flex-shrink-0">
                  {userInitial}
                </div>
                <span className="hidden md:inline text-xs lg:text-sm font-medium text-foreground max-w-[60px] lg:max-w-[80px] truncate">
                  {displayName}
                </span>
              </Button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 md:w-64 bg-background rounded-2xl shadow-2xl border border-border overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-semibold truncate">
                          {session?.user?.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{session?.user?.username || "username"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session?.user?.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Vai trò: {session?.user?.role}
                        </p>
                      </div>
                      <Link href="/profile">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 mt-1 hover:bg-primary/10 touch-friendly"
                          onClick={closeAllMenus}
                        >
                          <User className="w-4 h-4" /> Hồ sơ cá nhân
                        </Button>
                      </Link>
                      <Link href="/dashboard">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 hover:bg-primary/10 touch-friendly"
                          onClick={closeAllMenus}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Button>
                      </Link>
                      <Link href="/announcements">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 hover:bg-primary/10 touch-friendly"
                          onClick={closeAllMenus}
                        >
                          <BellIcon className="w-4 h-4" /> Thông báo
                        </Button>
                      </Link>

                      {canModerate && (
                        <Link href="/lectures/moderate">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 hover:bg-primary/10 touch-friendly relative"
                            onClick={closeAllMenus}
                          >
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            Kiểm duyệt bài giảng
                            {pendingCount > 0 && (
                              <span className="ml-auto px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                                {pendingCount}
                              </span>
                            )}
                          </Button>
                        </Link>
                      )}

                      {isAdmin && (
                        <Link href="/admin">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 hover:bg-primary/10 touch-friendly"
                            onClick={closeAllMenus}
                          >
                            <Crown className="w-4 h-4 text-primary" /> Quản trị
                            hệ thống
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 mt-1 text-destructive hover:bg-destructive/10 hover:text-destructive touch-friendly"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 hover:bg-primary/10 touch-friendly text-xs lg:text-sm px-2 lg:px-3"
                >
                  <LogIn className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden xs:inline">Đăng nhập</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="gap-1 hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 touch-friendly text-xs lg:text-sm px-2 lg:px-3"
                >
                  <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden xs:inline">Đăng ký</span>
                </Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-muted touch-friendly w-8 h-8 md:w-9 md:h-9"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            <Menu className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <div className="p-3 md:p-4 space-y-0.5 max-h-[75vh] overflow-y-auto hide-scrollbar">
              {allMobileNavItems.map((item) => (
                <MobileNavItem
                  key={item.name}
                  item={item}
                  isActive={
                    pathname === item.href ||
                    pathname?.startsWith(item.href + "/")
                  }
                  onClick={closeAllMenus}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
