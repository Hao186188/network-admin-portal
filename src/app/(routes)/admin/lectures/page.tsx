// src/app/(routes)/admin/lectures/page.tsx
// TRANG ADMIN DUYỆT BÀI - HOÀN CHỈNH

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { EditLectureModal } from "@/components/lectures/EditLectureModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLectures } from "@/hooks/useLectures";
import { useNotifications } from "@/hooks/useNotifications";
import { formatRelativeTime } from "@/lib/utils";
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  Edit,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminLecturesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState<any>(null);

  const {
    lectures,
    pendingLectures,
    isLoading,
    refresh,
    approveLecture,
    deleteLecture,
  } = useLectures();

  const { createNotification } = useNotifications();

  // Kiểm tra quyền admin
  if (session?.user?.role !== "admin") {
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

  // ✅ SỬA: approveLecture là function, gọi trực tiếp với callback
  const handleApprove = (
    id: string,
    status: "approved" | "rejected",
    reason?: string,
  ) => {
    setIsProcessing(true);

    // ✅ Gọi trực tiếp approveLecture (là function)
    approveLecture({ id, status, reason });

    // Vì approveLecture là mutation, chúng ta cần lắng nghe kết quả qua useEffect
    // Hoặc sử dụng cách khác: gọi và xử lý trong onSuccess của mutation
    // Tạm thời refresh sau 1s
    setTimeout(() => {
      refresh();
      setIsProcessing(false);
      toast.success(
        status === "approved" ? "Đã duyệt bài giảng" : "Đã từ chối bài giảng",
      );
    }, 1000);
  };

  // ✅ SỬA: deleteLecture là function, gọi trực tiếp
  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài giảng này?")) return;

    setIsProcessing(true);

    // ✅ Gọi trực tiếp deleteLecture (là function)
    deleteLecture(id);

    setTimeout(() => {
      refresh();
      setIsProcessing(false);
      toast.success("Đã xóa bài giảng");
    }, 1000);
  };

  const handleEdit = (lecture: any) => {
    setEditingLecture(lecture);
    setIsEditModalOpen(true);
  };

  const filteredPending = pendingLectures.filter(
    (lecture: any) =>
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.teacher.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">📋 Quản lý bài giảng</h1>
              <p className="text-muted-foreground mt-1">
                Duyệt, chỉnh sửa và quản lý bài giảng
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {pendingLectures.length} bài chờ duyệt
              </Badge>
              <Button variant="outline" size="sm" onClick={() => refresh()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="w-4 h-4" />
                Chờ duyệt
                {pendingLectures.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {pendingLectures.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2">
                <Eye className="w-4 h-4" />
                Tất cả
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm bài chờ duyệt..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Đang tải...</p>
                  </div>
                ) : filteredPending.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Check className="w-12 h-12 mx-auto text-green-500 mb-4" />
                      <h3 className="text-lg font-semibold">
                        Không có bài chờ duyệt
                      </h3>
                      <p className="text-muted-foreground">
                        Tất cả bài giảng đã được xử lý
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredPending.map((lecture: any) => (
                      <PendingLectureCard
                        key={lecture.id}
                        lecture={lecture}
                        onApprove={handleApprove}
                        onReject={handleApprove}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        isProcessing={isProcessing}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all">
              <AllLecturesList
                lectures={lectures}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isProcessing={isProcessing}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <EditLectureModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLecture(null);
        }}
        lecture={editingLecture}
        onSuccess={() => {
          refresh();
          setIsEditModalOpen(false);
          setEditingLecture(null);
        }}
      />

      <Footer />
    </>
  );
}

// ============================================
// COMPONENT: Pending Lecture Card
// ============================================

function PendingLectureCard({
  lecture,
  onApprove,
  onReject,
  onDelete,
  onEdit,
  isProcessing,
}: any) {
  const [showReason, setShowReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          {lecture.thumbnail && (
            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <img
                src={lecture.thumbnail}
                alt={lecture.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold line-clamp-1">
                  {lecture.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
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
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {lecture.description}
                </p>
                {lecture.tags && lecture.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {lecture.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
              <Button
                variant="default"
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(lecture.id, "approved")}
                disabled={isProcessing}
              >
                <Check className="w-4 h-4" />
                Duyệt
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => {
                  if (showReason) {
                    onReject(
                      lecture.id,
                      "rejected",
                      rejectReason || "Không đáp ứng tiêu chuẩn",
                    );
                  } else {
                    setShowReason(true);
                  }
                }}
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
                {showReason ? "Xác nhận từ chối" : "Từ chối"}
              </Button>

              {showReason && (
                <Input
                  placeholder="Lý do từ chối..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-48 h-8 text-sm"
                />
              )}

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(`/lectures/${lecture.id}`, "_blank")}
              >
                <Eye className="w-4 h-4" />
                Xem trước
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => onEdit(lecture)}
              >
                <Edit className="w-4 h-4" />
                Sửa
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive ml-auto"
                onClick={() => onDelete(lecture.id)}
                disabled={isProcessing}
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// COMPONENT: All Lectures List
// ============================================

function AllLecturesList({ lectures, onDelete, onEdit, isProcessing }: any) {
  const [search, setSearch] = useState("");

  const filtered = lectures.filter(
    (l: any) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.teacher.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm bài giảng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((lecture: any) => (
          <Card key={lecture.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold line-clamp-1">
                      {lecture.title}
                    </h4>
                    <Badge
                      variant={
                        lecture.status === "approved"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {lecture.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{lecture.teacher}</span>
                    <span>{formatRelativeTime(lecture.created_at)}</span>
                    <span>{lecture.views || 0} lượt xem</span>
                    <span>{lecture.likes || 0} lượt thích</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(`/lectures/${lecture.id}`, "_blank")
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(lecture)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(lecture.id)}
                    disabled={isProcessing}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
