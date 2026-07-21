// src/app/(dashboard)/dashboard/page.tsx
// FIXED: Sử dụng MagneticButton đúng cách

"use client";

import { MagneticButton } from "@/components/animations/MagneticButton";
import { NetworkTicker } from "@/components/animations/NetworkTicker";
import {
  DashboardHero,
  QuickAccess,
  RecentAnnouncements,
  StatsCard,
  UpcomingTasks,
  UserActions
} from "@/components/dashboard";
import { DropdownMenuImproved } from "@/components/dashboard/DropdownMenuImproved";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useDashboard } from "@/hooks/use-dashboard";
import { useStats } from "@/hooks/use-stats";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FileText, RefreshCw, UserPlus, Users, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const STAT_ITEMS = [
  {
    key: "documents",
    title: "Tài liệu",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    href: "/documents",
  },
  {
    key: "lectures",
    title: "Bài giảng",
    icon: Video,
    color: "from-purple-500 to-purple-600",
    href: "/lectures",
  },
  {
    key: "students",
    title: "Sinh viên",
    icon: Users,
    color: "from-green-500 to-green-600",
    href: "/students",
  },
  {
    key: "teachers",
    title: "Giảng viên",
    icon: UserPlus,
    color: "from-orange-500 to-orange-600",
    href: "/teachers",
  },
];

// Thông báo mặc định khi chưa load xong
const FALLBACK_TICKER = ["🚀 [SYSTEM]: Hệ thống đang hoạt động ổn định - Uptime: 99.9%"];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const stats = useStats();
  const { recentAnnouncements, refresh: refreshDashboard } = useDashboard();
  const { refresh: refreshAnnouncements } = useAnnouncements();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Tạo ticker messages từ announcements thật
  const tickerMessages = recentAnnouncements.length > 0
    ? recentAnnouncements.map(
        (a: any) => `📢 [${a.category?.toUpperCase() || "THÔNG BÁO"}]: ${a.title}`
      )
    : FALLBACK_TICKER;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Đang làm mới dữ liệu...");
    await Promise.all([
      refreshAnnouncements(),
      refreshDashboard(),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);
    setIsRefreshing(false);
    toast.success("Đã làm mới dữ liệu thành công!");
  };

  const handleDropdownItemClick = (index: number) => {
    setIsDropdownOpen(false);
    console.log("Dropdown item clicked:", index);
  };

  const getStatValue = (key: string): number => {
    const value = stats[key as keyof typeof stats];
    return typeof value === "number" ? value : 0;
  };

  // Không dùng Math.random() trong render → hydration mismatch
  // Hiển thị "+" đơn giản thay vì random
  const getChange = (key: string): string => {
    const value = getStatValue(key);
    return value > 0 ? "+" : "0%";
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Network Ticker - Hiển thị bên dưới Navbar */}
      <div className="sticky top-16 z-40">
        <NetworkTicker
          messages={tickerMessages}
          className="mx-2 md:mx-8 mt-2"
          speed={35}
        />
      </div>

      <div className="flex-1">
        <div className="space-y-6 md:space-y-8 p-3 md:p-8 max-w-7xl mx-auto">
          {/* Header với Magnetic Button - KHÔNG NESTED BUTTON */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold gradient-text">
                Dashboard
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-0.5">
                Chào mừng trở lại, {session?.user?.name || "Người dùng"}!
              </p>
              {session?.user?.email && (
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {session.user.email}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <MagneticButton
                className="inline-flex"
                magneticStrength={15}
                onClick={handleRefresh}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 md:gap-2 text-xs md:text-sm cursor-pointer"
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={cn(
                      "w-3 h-3 md:w-4 md:h-4",
                      isRefreshing && "animate-spin",
                    )}
                  />
                  <span className="hidden xs:inline">Làm mới</span>
                </Button>
              </MagneticButton>
              <DropdownMenuImproved
                isOpen={isDropdownOpen}
                onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                onItemClick={handleDropdownItemClick}
              />
            </div>
          </div>

          {/* Hero Section */}
          <DashboardHero />

          {/* Stats Grid */}
          {stats.loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="relative overflow-hidden">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 md:space-y-2">
                        <div className="h-3 w-16 md:h-4 md:w-20 bg-muted animate-pulse rounded" />
                        <div className="h-6 w-12 md:h-8 md:w-16 bg-muted animate-pulse rounded" />
                      </div>
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-muted animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stats.error ? (
            <Card className="border-destructive">
              <CardContent className="p-6 text-center text-destructive">
                <p>{stats.error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleRefresh}
                >
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {STAT_ITEMS.map((stat, index) => {
                const value = getStatValue(stat.key);
                return (
                  <StatsCard
                    key={stat.title}
                    title={stat.title}
                    value={value}
                    icon={stat.icon}
                    color={stat.color}
                    change={getChange(stat.key)}
                    href={stat.href}
                    delay={index * 0.1 + 0.1}
                  />
                );
              })}
            </div>
          )}

          {/* Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <RecentAnnouncements
              onViewDetail={(item) => console.log("View detail:", item)}
              onCreateClick={() => console.log("Create announcement")}
            />
            <UpcomingTasks />
          </div>

          {/* Quick Access */}
          <QuickAccess />

          {/* User Actions */}
          <UserActions />
        </div>
      </div>
      <Footer />
    </div>
  );
}
