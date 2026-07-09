// src/app/(routes)/profile/page.tsx
// Vai trò: Trang hồ sơ cá nhân - FIXED

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Calendar,
  Camera,
  Edit,
  FileText,
  Globe,
  Mail,
  Phone,
  Save,
  School,
  Users,
  X
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// ✅ Định nghĩa type cho stats
interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalCourses: number;
  totalAssignments: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { profile, loading, updateProfile, refresh } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    student_id: "",
    specialties: [] as string[],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalPosts: 0,
    totalCourses: 0,
    totalAssignments: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // ✅ Fetch stats - CHỈ CHẠY 1 LẦN
  useEffect(() => {
    const fetchStats = async () => {
      if (!profile?.id) return;

      setStatsLoading(true);
      try {
        const [postsCount, coursesCount, assignmentsCount, usersCount] =
          await Promise.all([
            supabase
              .from("forum_posts")
              .select("*", { count: "exact", head: true })
              .eq("author_id", profile.id),
            supabase
              .from("courses")
              .select("*", { count: "exact", head: true }),
            supabase
              .from("assignments")
              .select("*", { count: "exact", head: true }),
            supabase.from("users").select("*", { count: "exact", head: true }),
          ]);

        setStats({
          totalUsers: usersCount.count || 0,
          totalPosts: postsCount.count || 0,
          totalCourses: coursesCount.count || 0,
          totalAssignments: assignmentsCount.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [profile?.id]); // ✅ CHỈ CHẠY KHI PROFILE ID THAY ĐỔI

  // ✅ Sync form data với profile
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        student_id: profile.student_id || "",
        specialties: profile.specialties || [],
      });
    }
  }, [profile]);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleEdit = useCallback(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        student_id: profile.student_id || "",
        specialties: profile.specialties || [],
      });
    }
    setIsEditing(true);
  }, [profile]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        student_id: profile.student_id || "",
        specialties: profile.specialties || [],
      });
    }
  }, [profile]);

  const handleSave = useCallback(async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên");
      return;
    }

    const result = await updateProfile({
      name: formData.name.trim(),
      bio: formData.bio.trim(),
      phone: formData.phone.trim(),
      student_id: formData.student_id.trim(),
      specialties: formData.specialties,
    });

    if (result) {
      setIsEditing(false);
      refresh(); // ✅ Refresh profile sau khi update
    }
  }, [formData, updateProfile, toast, refresh]);

  const handleUploadAvatar = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !session?.user?.id) return;

      setIsUploading(true);
      try {
        const filePath = `avatars/${session.user.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        await updateProfile({ image: urlData.publicUrl });
        toast.success("Cập nhật ảnh đại diện thành công");
        refresh();
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast.error("Không thể tải ảnh lên");
      } finally {
        setIsUploading(false);
      }
    },
    [session?.user?.id, updateProfile, toast, refresh],
  );

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-40 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8 text-center py-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy hồ sơ</h2>
            <p className="text-muted-foreground">Vui lòng thử lại sau</p>
            <Button className="mt-4" onClick={refresh}>
              Thử lại
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={profile.image || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-3xl">
                    {profile.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  className={cn(
                    "absolute inset-0 rounded-full cursor-pointer",
                    "flex items-center justify-center",
                    "bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity",
                  )}
                >
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadAvatar}
                    disabled={isUploading}
                  />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold">
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="text-2xl font-bold h-auto py-1 px-2"
                        placeholder="Tên của bạn"
                      />
                    ) : (
                      profile.name || "Chưa cập nhật"
                    )}
                  </h1>
                  <Badge className="bg-primary/10 text-primary border-0">
                    {profile.role || "STUDENT"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </span>
                  {profile.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {profile.phone}
                    </span>
                  )}
                  {profile.student_id && (
                    <span className="flex items-center gap-1">
                      <School className="w-4 h-4" />
                      {profile.student_id}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Tham gia:{" "}
                    {new Date(profile.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-1" />
                      Hủy
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-1" />
                      Lưu
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={handleEdit}>
                    <Edit className="w-4 h-4 mr-1" />
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4 pt-4 border-t border-border">
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Giới thiệu về bản thân..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              ) : (
                <p className="text-muted-foreground">
                  {profile.bio || "Chưa có giới thiệu"}
                </p>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {statsLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 text-center">
                      <Skeleton className="w-8 h-8 mx-auto mb-2 rounded-full" />
                      <Skeleton className="h-8 w-12 mx-auto" />
                      <Skeleton className="h-3 w-16 mx-auto mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 mx-auto text-primary mb-2" />
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground">Thành viên</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                    <p className="text-2xl font-bold">{stats.totalPosts}</p>
                    <p className="text-xs text-muted-foreground">Bài viết</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-6 h-6 mx-auto text-green-500 mb-2" />
                    <p className="text-2xl font-bold">{stats.totalCourses}</p>
                    <p className="text-xs text-muted-foreground">Khóa học</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Award className="w-6 h-6 mx-auto text-yellow-500 mb-2" />
                    <p className="text-2xl font-bold">
                      {stats.totalAssignments}
                    </p>
                    <p className="text-xs text-muted-foreground">Bài tập</p>
                  </CardContent>
                </Card>
              </>
            )}
          </motion.div>

          {/* Specialties */}
          {profile.specialties && profile.specialties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    Chuyên môn
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
