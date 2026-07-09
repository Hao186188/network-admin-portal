// src/app/(dashboard)/dashboard/page.tsx
// Vai trò: Trang Dashboard - FIXED

"use client";

import {
  DashboardHero,
  DropdownMenu,
  QuickAccess,
  RecentAnnouncements,
  StatsCard,
  UpcomingTasks,
  UserActions,
} from "@/components/dashboard";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useStats } from "@/hooks/use-stats";
import { useToast } from "@/hooks/use-toast";
import { FileText, RefreshCw, UserPlus, Users, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const stats = useStats();
  const { refresh: refreshAnnouncements } = useAnnouncements(); // ✅ Đã có refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] =
    useState(false);
  const [isCreateForumPostOpen, setIsCreateForumPostOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("✅ Session loaded:", session.user.email);
    }
  }, [status, session]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Đang làm mới dữ liệu...");
    await Promise.all([
      refreshAnnouncements(),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);
    setIsRefreshing(false);
    toast.success("Đã làm mới dữ liệu thành công!");
  };

  const handleCreateSuccess = () => {
    refreshAnnouncements();
    toast.success("Đã cập nhật dữ liệu!");
  };

  const handleViewDetail = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsDetailModalOpen(true);
  };

  const statItems = [
    {
      title: "Tài liệu",
      value: stats.documents || 0,
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      change: stats.documents > 0 ? "+12%" : "0%",
      href: "/documents",
      delay: 0.1,
    },
    {
      title: "Bài giảng",
      value: stats.lectures || 0,
      icon: Video,
      color: "from-purple-500 to-purple-600",
      change: stats.lectures > 0 ? "+8%" : "0%",
      href: "/lectures",
      delay: 0.2,
    },
    {
      title: "Sinh viên",
      value: stats.students || 0,
      icon: Users,
      color: "from-green-500 to-green-600",
      change: stats.students > 0 ? "+5%" : "0%",
      href: "/students",
      delay: 0.3,
    },
    {
      title: "Giảng viên",
      value: stats.teachers || 0,
      icon: UserPlus,
      color: "from-orange-500 to-orange-600",
      change: "0%",
      href: "/teachers",
      delay: 0.4,
    },
  ];

  const handleDropdownItemClick = (index: number) => {
    setIsDropdownOpen(false);
    if (index === 0) setIsCreateAnnouncementOpen(true);
    else if (index === 1) setIsCreateForumPostOpen(true);
    else if (index === 2) setIsUploadModalOpen(true);
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
      <div className="flex-1">
        <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Chào mừng trở lại, {session?.user?.name || "Người dùng"}!
              </p>
              {session?.user?.email && (
                <p className="text-xs text-muted-foreground">
                  {session.user.email}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Làm mới
              </Button>

              <DropdownMenu
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-muted animate-pulse" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statItems.map((stat) => (
                <StatsCard key={stat.title} {...stat} />
              ))}
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentAnnouncements
              onViewDetail={handleViewDetail}
              onCreateClick={() => setIsCreateAnnouncementOpen(true)}
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
