// src/app/(routes)/admin/lectures/page.tsx
// HOÀN CHỈNH - QUẢN LÝ BÀI GIẢNG

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLectures } from "@/hooks/useLectures";
import { formatRelativeTime } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  User
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// ============================================
// MAIN COMPONENT
// ============================================

export default function AdminLecturesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { lectures, isLoading, refresh, deleteLecture } = useLectures();

  // Kiểm tra quyền admin
  if (session?.user?.role !== "ADMIN") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20">
          <div className="max-w-4xl mx-auto p-4 text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-bold">Không có quyền truy cập</h1>
            <p className="text-muted-foreground mt-2">
              Trang này chỉ dành cho quản trị viên.
            </p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Về trang chủ
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Xóa bài giảng
  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài giảng này?")) return;

    setIsProcessing(true);
    deleteLecture(id);

    setTimeout(() => {
      refresh();
      setIsProcessing(false);
      toast.success("Đã xóa bài giảng");
    }, 1000);
  };

  // Lọc danh sách
  const filteredLectures = lectures.filter(
    (lecture: any) =>
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.teacher.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Thống kê
  const totalLectures = lectures.length;
  const totalApproved = lectures.filter(
    (l: any) => l.status === "approved",
  ).length;
  const totalPending = lectures.filter(
    (l: any) => l.status === "pending",
  ).length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">📋 Quản lý bài giảng</h1>
              <p className="text-muted-foreground mt-1">
                Quản lý toàn bộ bài giảng trong hệ thống
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {totalLectures} bài giảng
              </Badge>
              {totalPending > 0 && (
                <Badge
                  variant="outline"
                  className="text-sm bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                >
                  {totalPending} bài chờ duyệt
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={() => refresh()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <Eye className="w-4 h-4" />
                Tất cả
                <Badge variant="secondary" className="ml-1">
                  {totalLectures}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                <Check className="w-4 h-4" />
                Đã duyệt
                <Badge variant="secondary" className="ml-1">
                  {totalApproved}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="w-4 h-4" />
                Chờ duyệt
                <Badge variant="secondary" className="ml-1">
                  {totalPending}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài giảng theo tên, giảng viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Content */}
            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Đang tải...</p>
                </div>
              ) : (
                <LectureList
                  lectures={filteredLectures}
                  onDelete={handleDelete}
                  isProcessing={isProcessing}
                  emptyMessage="Chưa có bài giảng nào"
                />
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Đang tải...</p>
                </div>
              ) : (
                <LectureList
                  lectures={filteredLectures.filter(
                    (l: any) => l.status === "approved",
                  )}
                  onDelete={handleDelete}
                  isProcessing={isProcessing}
                  emptyMessage="Chưa có bài giảng nào được duyệt"
                />
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Đang tải...</p>
                </div>
              ) : (
                <LectureList
                  lectures={filteredLectures.filter(
                    (l: any) => l.status === "pending",
                  )}
                  onDelete={handleDelete}
                  isProcessing={isProcessing}
                  emptyMessage="Không có bài giảng nào chờ duyệt"
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </>
  );
}

// ============================================
// COMPONENT: Lecture List
// ============================================

function LectureList({ lectures, onDelete, isProcessing, emptyMessage }: any) {
  if (lectures.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold">{emptyMessage}</h3>
          <p className="text-muted-foreground mt-1">Hãy kiểm tra lại sau</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {lectures.map((lecture: any) => (
        <LectureCard
          key={lecture.id}
          lecture={lecture}
          onDelete={onDelete}
          isProcessing={isProcessing}
        />
      ))}
    </div>
  );
}

// ============================================
// COMPONENT: Lecture Card
// ============================================

function LectureCard({ lecture, onDelete, isProcessing }: any) {
  const getStatusBadge = () => {
    if (lecture.status === "approved") {
      return (
        <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
          Đã duyệt
        </Badge>
      );
    }
    if (lecture.status === "pending") {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
          Chờ duyệt
        </Badge>
      );
    }
    if (lecture.status === "rejected") {
      return (
        <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
          Từ chối
        </Badge>
      );
    }
    return <Badge variant="outline">Không xác định</Badge>;
  };

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Thumbnail */}
          {lecture.thumbnail && (
            <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <img
                src={lecture.thumbnail}
                alt={lecture.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold line-clamp-1">
                {lecture.title}
              </h3>
              {getStatusBadge()}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {lecture.teacher}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatRelativeTime(lecture.created_at)}
              </span>
              <Badge variant="outline" className="text-xs">
                {lecture.type}
              </Badge>
              <span className="text-xs text-muted-foreground">
                👁️ {lecture.views || 0}
              </span>
              <span className="text-xs text-muted-foreground">
                ❤️ {lecture.likes || 0}
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {lecture.description}
            </p>

            {lecture.tags && lecture.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {lecture.tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
                {lecture.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{lecture.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => window.open(`/lectures/${lecture.id}`, "_blank")}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(lecture.id)}
              disabled={isProcessing}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
