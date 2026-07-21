// src/components/layout/navbar.tsx
// HOÀN CHỈNH - NÂNG CẤP VỚI ZUSTAND STORE

"use client";

import { Notifications } from "@/components/common/notifications";
import { Search } from "@/components/common/search";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/lib/db/supabase-client";
import { cn } from "@/lib/utils";
import { useRoleStore } from "@/store/useRoleStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BookMarked,
  BookOpen,
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
  Sparkles,
  User,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

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

// ✅ Desktop Navigation - TẤT CẢ USER ĐỀU THẤY BÀI GIẢNG
const desktopNavItems: NavItemType[] = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Diễn đàn", href: "/forum", icon: MessageCircle },
  { name: "Bài tập", href: "/assignments", icon: ClipboardList },
  { name: "Tài liệu", href: "/documents", icon: BookOpen },
  { name: "Bài giảng", href: "/lectures", icon: FileText },
];

// ✅ Mobile Navigation - TẤT CẢ USER ĐỀU THẤY BÀI GIẢNG
const mobileNavItems: NavItemType[] = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Thông báo", href: "/announcements", icon: Bell },
  { name: "Môn học", href: "/courses", icon: BookMarked },
  { name: "Bài tập", href: "/assignments", icon: ClipboardList },
  { name: "Tài liệu", href: "/documents", icon: BookOpen },
  { name: "Bài giảng", href: "/lectures", icon: FileText },
  { name: "Diễn đàn", href: "/forum", icon: MessageCircle },
  { name: "Dự án", href: "/projects", icon: Code },
  { name: "Giới thiệu", href: "/about", icon: Info },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
  { name: "Liên hệ", href: "/contact", icon: Mail },
];

// ✅ Admin items (chỉ hiển thị khi là Admin)
const adminMobileNavItems: NavItemType[] = [
  { name: "Quản trị", href: "/admin", icon: Crown },
];

// ✅ Role colors
const ROLE_COLORS = {
  ADMIN: "bg-red-500/20 text-red-400 border-red-500/20",
  TEACHER: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  STUDENT: "bg-green-500/20 text-green-400 border-green-500/20",
};

const ROLE_LABELS = {
  ADMIN: "👑 Admin",
  TEACHER: "👨‍🏫 Teacher",
  STUDENT: "🎓 Student",
};

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
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Zustand store - đồng bộ role toàn cục
  const { role: storeRole, setRole, setCanManage } = useRoleStore();

  // ✅ State để lưu role từ database - KHỞI TẠO VỚI SESSION ROLE
  const [userRole, setUserRole] = useState<string>(() => {
    const role = session?.user?.role?.toUpperCase() || "STUDENT";
    console.log(`🔍 [Navbar] Initial role from session: ${role}`);
    return role;
  });

  // ✅ Refs để kiểm soát
  const syncDoneRef = useRef(false);
  const syncInProgressRef = useRef(false);
  const isMountedRef = useRef(true);
  const storeSyncedRef = useRef(false);

  // ✅ Kiểm tra role
  const isAdmin = useMemo(() => userRole === "ADMIN", [userRole]);
  const isTeacher = useMemo(() => userRole === "TEACHER", [userRole]);
  const isStudent = useMemo(() => userRole === "STUDENT", [userRole]);

  const isAuthenticated = useMemo(
    () => status === "authenticated" && !!session?.user,
    [status, session],
  );

  const displayName = useMemo(
    () => session?.user?.name || session?.user?.username || "User",
    [session],
  );

  const userInitial = useMemo(
    () => displayName.charAt(0).toUpperCase(),
    [displayName],
  );

  // ✅ Build desktop nav items
  const desktopNavItemsWithBadge = useMemo(() => desktopNavItems, []);

  // ✅ Build mobile nav items
  const allMobileNavItems = useMemo(() => {
    const items = [...mobileNavItems];
    if (isAdmin) {
      items.push(...adminMobileNavItems);
    }
    return items;
  }, [isAdmin]);

  // ✅ Handle mount
  useEffect(() => {
    isMountedRef.current = true;
    setMounted(true);
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ✅ Cập nhật userRole và store khi session thay đổi - CHỈ 1 LẦN
  useEffect(() => {
    if (session?.user?.role && !storeSyncedRef.current) {
      const role = session.user.role.toUpperCase();
      console.log(`🔄 [Navbar] Session changed, role: ${role}`);

      // Cập nhật state
      if (!syncDoneRef.current) {
        setUserRole(role);
      }

      // ✅ SYNC VÀO ZUSTAND STORE
      setRole(role);
      setCanManage(role === "ADMIN" || role === "TEACHER");
      storeSyncedRef.current = true;
      console.log(`✅ [Navbar] Synced role to store: ${role}`);
    }
  }, [session?.user?.role, setRole, setCanManage]);

  // ✅ CHỈ SYNC ROLE 1 LẦN - KHÔNG RESET
  useEffect(() => {
    if (
      syncDoneRef.current ||
      syncInProgressRef.current ||
      !mounted ||
      !session?.user?.id ||
      storeSyncedRef.current
    ) {
      return;
    }

    syncInProgressRef.current = true;

    const syncRole = async () => {
      try {
        console.log("🔄 [Navbar] Syncing role with database...");

        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        const dbRoleValue = data?.role?.toUpperCase() || "STUDENT";
        const sessionRole = session.user.role?.toUpperCase() || "STUDENT";

        // ✅ LUÔN CẬP NHẬT userRole với role từ database
        if (dbRoleValue !== userRole) {
          console.log(
            `🔄 [Navbar] Updating role from ${userRole} to ${dbRoleValue}`,
          );
          setUserRole(dbRoleValue);
        }

        // ✅ Cập nhật store
        setRole(dbRoleValue);
        setCanManage(dbRoleValue === "ADMIN" || dbRoleValue === "TEACHER");
        storeSyncedRef.current = true;

        // ✅ CHỈ UPDATE SESSION NẾU KHÁC VỚI DATABASE
        if (dbRoleValue !== sessionRole) {
          console.log(
            `🔄 [Navbar] Updating session from ${sessionRole} to ${dbRoleValue}`,
          );
          await update({
            ...session,
            user: {
              ...session.user,
              role: dbRoleValue,
            },
          });
        }

        syncDoneRef.current = true;
        console.log("✅ [Navbar] Role sync completed");
      } catch (error) {
        console.error("❌ [Navbar] Error syncing role:", error);
        syncDoneRef.current = true;
        storeSyncedRef.current = true; // Mark as synced even on error to prevent retry loops
      } finally {
        syncInProgressRef.current = false;
      }
    };

    // ✅ Tăng timeout lên 2 giây để giảm số lần gọi API
    const timeoutId = setTimeout(syncRole, 2000);
    return () => clearTimeout(timeoutId);
  }, [
    mounted,
    session?.user?.id,
    userRole,
    session,
    update,
    setRole,
    setCanManage,
  ]);

  // ✅ Lắng nghe sự kiện storage - CHỈ UPDATE KHI CẦN
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nextauth.message" || e.key === "nextauth.state") {
        console.log("🔄 [Navbar] Storage changed, checking session...");
        // ✅ Debounce: Chỉ update sau 5 giây không có event nào
        setTimeout(() => {
          update();
        }, 5000);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [update]);

  // ✅ Lắng nghe sự kiện visibility change - CHỈ KHI CẦN
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("🔄 [Navbar] Tab visible, checking session...");
        // ✅ Debounce: Chỉ update sau 10 giây không có event nào
        setTimeout(() => {
          update();
        }, 10000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [update]);

  // ✅ Reset sync khi đăng nhập/đăng xuất
  useEffect(() => {
    if (status === "authenticated") {
      syncDoneRef.current = false;
      syncInProgressRef.current = false;
      storeSyncedRef.current = false;
    } else if (status === "unauthenticated") {
      // ✅ Reset tất cả refs khi đăng xuất
      syncDoneRef.current = false;
      syncInProgressRef.current = false;
      storeSyncedRef.current = false;
    }
  }, [status]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  // ✅ Get role color
  const getRoleColor = useCallback((role: string) => {
    return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || ROLE_COLORS.STUDENT;
  }, []);

  // ✅ Get role label
  const getRoleLabel = useCallback((role: string) => {
    return ROLE_LABELS[role as keyof typeof ROLE_LABELS] || ROLE_LABELS.STUDENT;
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
              <span className="text-lg font-bold gradient-text">GIÁO LÀNG</span>
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
              GIÁO LÀNG
            </span>
            <span className="text-[8px] md:text-[10px] lg:text-xs text-muted-foreground block -mt-0.5 whitespace-nowrap">
              Quản trị Mạng
            </span>
          </div>
          <span className="sm:hidden text-sm font-bold gradient-text whitespace-nowrap">
            GIÁO LÀNG
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center px-2 overflow-x-auto">
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
            className="sm:hidden hover:bg-muted touch-friendly w-8 h-8 md:w-9 md:h-9"
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

          {isAdmin && (
            <Link href="/admin" className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1 hover:bg-primary/10 touch-friendly text-xs lg:text-sm px-2 lg:px-3",
                  pathname?.startsWith("/admin") &&
                    "bg-primary/10 text-primary",
                )}
              >
                <Crown className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary" />
                <span className="hidden xl:inline">Quản trị</span>
              </Button>
            </Link>
          )}

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 hover:bg-primary/10 touch-friendly px-1.5 lg:px-3"
                onClick={toggleProfile}
                aria-label="Tài khoản"
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-[10px] md:text-xs font-bold flex-shrink-0">
                  {userInitial}
                </div>
                <span className="hidden md:inline text-xs lg:text-sm font-medium text-foreground max-w-[60px] lg:max-w-[80px] truncate">
                  {displayName}
                </span>
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background transition-colors",
                    isAdmin && "bg-red-500",
                    isTeacher && "bg-blue-500",
                    isStudent && "bg-green-500",
                  )}
                />
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
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Vai trò:
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium px-2 py-0.5 rounded-full border",
                              getRoleColor(userRole),
                            )}
                          >
                            {getRoleLabel(userRole)}
                          </span>
                        </div>
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
                          <Bell className="w-4 h-4" /> Thông báo
                        </Button>
                      </Link>

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
                  className="gap-1 hover:bg-primary/10 touch-friendly text-xs lg:text-sm px-1.5 lg:px-3"
                >
                  <LogIn className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden xs:inline text-xs lg:text-sm">
                    Đăng nhập
                  </span>
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="gap-1 hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 touch-friendly text-xs lg:text-sm px-1.5 lg:px-3"
                >
                  <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span className="hidden xs:inline text-xs lg:text-sm">
                    Đăng ký
                  </span>
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
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <Menu className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-border bg-background/98 backdrop-blur-xl"
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

              {/* Mobile Bottom Actions */}
              <div className="pt-3 mt-2 border-t border-border/50">
                {!isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login" onClick={closeAllMenus}>
                      <Button className="w-full gap-2">
                        <LogIn className="w-4 h-4" />
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link href="/register" onClick={closeAllMenus}>
                      <Button
                        variant="outline"
                        className="w-full gap-2 border-white/10"
                      >
                        <User className="w-4 h-4" />
                        Đăng ký
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
