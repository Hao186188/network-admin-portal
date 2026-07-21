// src/app/(routes)/profile/page.tsx
// Vai trò: Trang hồ sơ cá nhân - FIX SESSION UPDATE

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
  ClipboardList,
  Edit,
  FileText,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Save,
  School,
  Settings,
  ThumbsUp,
  Users,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// ✅ Định nghĩa type cho stats
interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalCourses: number;
  totalAssignments: number;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
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
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [userActivity, setUserActivity] = useState({
    posts: 0,
    comments: 0,
    likes: 0,
    assignments: 0,
  });
  const [activityLoading, setActivityLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsData, setSettingsData] = useState({
    phone: "",
    student_id: "",
    bio: "",
    specialties: [] as string[],
    social_links: {
      facebook: "",
      github: "",
      linkedin: "",
      twitter: "",
    },
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  // ✅ Refs để kiểm soát
  const sessionUpdatedRef = useRef(false);
  const updateCalledRef = useRef(false);

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
  }, [profile?.id]);

  // ✅ Fetch user activity - CHỈ CHẠY 1 LẦN
  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!profile?.id) return;

      setActivityLoading(true);
      try {
        const [userPosts, userComments, userLikes, userAssignments] =
          await Promise.all([
            supabase
              .from("forum_posts")
              .select("*", { count: "exact", head: true })
              .eq("author_id", profile.id),
            supabase
              .from("forum_replies")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id),
            supabase
              .from("forum_likes")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id),
            supabase
              .from("submissions")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id),
          ]);

        setUserActivity({
          posts: userPosts.count || 0,
          comments: userComments.count || 0,
          likes: userLikes.count || 0,
          assignments: userAssignments.count || 0,
        });
      } catch (error) {
        console.error("Error fetching user activity:", error);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchUserActivity();
  }, [profile?.id]);

  // ✅ Load settings data
  useEffect(() => {
    if (profile) {
      setSettingsData({
        phone: profile.phone || "",
        student_id: profile.student_id || "",
        bio: profile.bio || "",
        specialties: profile.specialties || [],
        social_links: (profile as any).social_links || {
          facebook: "",
          github: "",
          linkedin: "",
          twitter: "",
        },
      });
    }
  }, [profile]);

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

  // ✅ CHỈ UPDATE SESSION 1 LẦN KHI COMPONENT MOUNT
  useEffect(() => {
    if (
      session?.user &&
      !sessionUpdatedRef.current &&
      !updateCalledRef.current
    ) {
      updateCalledRef.current = true;

      // Lấy role từ database để so sánh
      const fetchUserRole = async () => {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (error) throw error;

          const dbRole = data?.role?.toUpperCase() || "STUDENT";
          const sessionRole = session.user.role?.toUpperCase() || "STUDENT";

          console.log("🔍 [Profile] DB Role:", dbRole);
          console.log("🔍 [Profile] Session Role:", sessionRole);

          // Nếu role trong database khác với session, update session
          if (dbRole !== sessionRole) {
            console.log(
              `🔄 [Profile] Updating session from ${sessionRole} to ${dbRole}`,
            );

            // ✅ Gọi update với tham số để cập nhật role
            await update({
              ...session,
              user: {
                ...session.user,
                role: dbRole,
              },
            });

            console.log(`✅ [Profile] Session updated to: ${dbRole}`);
            sessionUpdatedRef.current = true;

            // Refresh profile để hiển thị role mới
            refresh();
          } else {
            console.log("✅ [Profile] Session role matches database");
            sessionUpdatedRef.current = true;
          }
        } catch (error) {
          console.error("❌ [Profile] Error fetching user role:", error);
        } finally {
          // Reset sau 10 giây
          setTimeout(() => {
            updateCalledRef.current = false;
          }, 10000);
        }
      };

      fetchUserRole();
    }
  }, [session, update, refresh]);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ✅ Hàm đổi role - phần quan trọng
  const handleChangeRole = useCallback(
    async (newRole: string) => {
      if (!session?.user?.id) {
        toast.error("Vui lòng đăng nhập");
        return;
      }

      // Kiểm tra quyền: chỉ Admin mới được đổi role
      const currentRole = session.user.role?.toUpperCase() || "STUDENT";
      if (currentRole !== "ADMIN") {
        toast.error("❌ Bạn không có quyền đổi vai trò");
        return;
      }

      setIsChangingRole(true);
      try {
        // ✅ 1. Update role trong database
        const { error } = await supabase
          .from("users")
          .update({ role: newRole })
          .eq("id", session.user.id);

        if (error) throw error;

        // ✅ 2. Update session với role mới
        const updatedSession = await update({
          ...session,
          user: {
            ...session.user,
            role: newRole,
          },
        });

        console.log(
          "✅ [Profile] Session updated:",
          updatedSession?.user?.role || newRole,
        );

        toast.success(`✅ Đã đổi vai trò thành ${newRole}`);

        // ✅ 3. Refresh profile data
        await refresh();

        // ✅ 4. Reset flag để cho phép update lại
        sessionUpdatedRef.current = false;
        updateCalledRef.current = false;

        // ✅ 5. Force reload page để cập nhật navbar
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error: any) {
        console.error("Error changing role:", error);
        toast.error(error.message || "Không thể đổi vai trò");
      } finally {
        setIsChangingRole(false);
      }
    },
    [session, update, refresh, toast],
  );

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
      refresh();
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

  // ✅ Save settings
  const handleSaveSettings = useCallback(async () => {
    if (!session?.user?.id) return;

    setSettingsLoading(true);
    try {
      await updateProfile({
        phone: settingsData.phone,
        student_id: settingsData.student_id,
        bio: settingsData.bio,
        specialties: settingsData.specialties,
        social_links: settingsData.social_links,
      });
      toast.success("Đã lưu cài đặt thành công");
      setShowSettings(false);
      refresh();
    } catch (error: any) {
      toast.error(error.message || "Không thể lưu cài đặt");
    } finally {
      setSettingsLoading(false);
    }
  }, [session?.user?.id, settingsData, updateProfile, toast, refresh]);

  // ✅ Kiểm tra role - ưu tiên từ profile (database) hơn session
  const isAdmin =
    profile?.role?.toUpperCase() === "ADMIN" ||
    session?.user?.role?.toUpperCase() === "ADMIN";
  const currentRole =
    profile?.role?.toLowerCase() ||
    session?.user?.role?.toLowerCase() ||
    "student";

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
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
            className="bg-card rounded-2xl border border-border/50 p-4 sm:p-6 shadow-sm"
          >
            <div className="flex flex-col items-center md:items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative group mx-auto md:mx-0">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary/20">
                  <AvatarImage src={profile.image || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-2xl sm:text-3xl">
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
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
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
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left w-full">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="text-xl sm:text-2xl font-bold h-auto py-1 px-2 text-center sm:text-left"
                        placeholder="Tên của bạn"
                      />
                    ) : (
                      profile.name || "Chưa cập nhật"
                    )}
                  </h1>
                  <Badge
                    className={cn(
                      "border-0 text-xs",
                      currentRole === "admin" && "bg-red-500/10 text-red-500",
                      currentRole === "teacher" &&
                        "bg-blue-500/10 text-blue-500",
                      currentRole === "student" &&
                        "bg-green-500/10 text-green-500",
                    )}
                  >
                    {currentRole === "admin" && "👑 Admin"}
                    {currentRole === "teacher" && "👨‍🏫 Teacher"}
                    {currentRole === "student" && "🎓 Student"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                    {profile.email}
                  </span>
                  {profile.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                      {profile.phone}
                    </span>
                  )}
                  {profile.student_id && (
                    <span className="flex items-center gap-1">
                      <School className="w-3 h-3 sm:w-4 sm:h-4" />
                      {profile.student_id}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-1 text-xs sm:text-sm text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  Tham gia:{" "}
                  {new Date(profile.created_at).toLocaleDateString("vi-VN")}
                </div>
              </div>

              {/* Actions */}
              <div className="w-full md:w-auto flex justify-center">
                {isEditing ? (
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="flex-1 md:flex-none"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Hủy
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="flex-1 md:flex-none"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Lưu
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    className="w-full md:w-auto"
                  >
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
                  className="w-full px-3 sm:px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm sm:text-base"
                />
              ) : (
                <p className="text-muted-foreground text-sm sm:text-base">
                  {profile.bio || "Chưa có giới thiệu"}
                </p>
              )}
            </div>
          </motion.div>

          {/* Global Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          >
            {statsLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-3 sm:p-4 text-center">
                      <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 rounded-full" />
                      <Skeleton className="h-6 sm:h-8 w-10 sm:w-12 mx-auto" />
                      <Skeleton className="h-2 sm:h-3 w-10 sm:w-16 mx-auto mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-primary mb-1 sm:mb-2" />
                    <p className="text-xl sm:text-2xl font-bold">
                      {stats.totalUsers}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Thành viên
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-blue-500 mb-1 sm:mb-2" />
                    <p className="text-xl sm:text-2xl font-bold">
                      {stats.totalPosts}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Bài viết
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-green-500 mb-1 sm:mb-2" />
                    <p className="text-xl sm:text-2xl font-bold">
                      {stats.totalCourses}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Khóa học
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-yellow-500 mb-1 sm:mb-2" />
                    <p className="text-xl sm:text-2xl font-bold">
                      {stats.totalAssignments}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Bài tập
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </motion.div>

          {/* User Activity Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-3 sm:mt-4"
          >
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Hoạt động của bạn
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              {activityLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-3 sm:p-4 text-center">
                        <Skeleton className="w-5 h-5 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 rounded-full" />
                        <Skeleton className="h-5 sm:h-8 w-8 sm:w-12 mx-auto" />
                        <Skeleton className="h-2 sm:h-3 w-10 sm:w-16 mx-auto mt-1" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  <Card className="border-primary/20">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <FileText className="w-4 h-4 sm:w-6 sm:h-6 mx-auto text-primary mb-1 sm:mb-2" />
                      <p className="text-lg sm:text-2xl font-bold">
                        {userActivity.posts}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Bài viết
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-500/20">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 mx-auto text-blue-500 mb-1 sm:mb-2" />
                      <p className="text-lg sm:text-2xl font-bold">
                        {userActivity.comments}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Bình luận
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-green-500/20">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <ThumbsUp className="w-4 h-4 sm:w-6 sm:h-6 mx-auto text-green-500 mb-1 sm:mb-2" />
                      <p className="text-lg sm:text-2xl font-bold">
                        {userActivity.likes}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Lượt thích
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-purple-500/20">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <ClipboardList className="w-4 h-4 sm:w-6 sm:h-6 mx-auto text-purple-500 mb-1 sm:mb-2" />
                      <p className="text-lg sm:text-2xl font-bold">
                        {userActivity.assignments}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Bài nộp
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
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

          {/* ✅ Role Management - Chỉ Admin mới thấy */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Quản lý vai trò
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={
                        currentRole === "student" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleChangeRole("student")}
                      disabled={isChangingRole}
                      className={cn(
                        currentRole === "student" &&
                          "bg-green-500 hover:bg-green-600",
                      )}
                    >
                      🎓 Học sinh
                    </Button>
                    <Button
                      variant={
                        currentRole === "teacher" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleChangeRole("teacher")}
                      disabled={isChangingRole}
                      className={cn(
                        currentRole === "teacher" &&
                          "bg-blue-500 hover:bg-blue-600",
                      )}
                    >
                      👨‍🏫 Giáo viên
                    </Button>
                    <Button
                      variant={currentRole === "admin" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChangeRole("admin")}
                      disabled={isChangingRole}
                      className={cn(
                        currentRole === "admin" &&
                          "bg-red-500 hover:bg-red-600",
                      )}
                    >
                      👑 Admin
                    </Button>
                  </div>
                  {isChangingRole && (
                    <p className="text-sm text-muted-foreground mt-2 animate-pulse">
                      Đang cập nhật...
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    💡 Vai trò hiện tại:{" "}
                    <strong>{currentRole.toUpperCase()}</strong>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ✅ Settings Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  Cài đặt hồ sơ
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showSettings ? (
                  <Button
                    onClick={() => setShowSettings(true)}
                    className="w-full gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Chỉnh sửa thông tin cá nhân
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {/* Phone & Student ID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          value={settingsData.phone}
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="+84 xxx xxx xxx"
                          className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Mã số sinh viên
                        </label>
                        <input
                          type="text"
                          value={settingsData.student_id}
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              student_id: e.target.value,
                            }))
                          }
                          placeholder="SV001"
                          className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Giới thiệu
                      </label>
                      <textarea
                        value={settingsData.bio}
                        onChange={(e) =>
                          setSettingsData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Giới thiệu về bản thân..."
                        rows={3}
                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>

                    {/* Social Links */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Mạng xã hội
                      </label>
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={settingsData.social_links.facebook}
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              social_links: {
                                ...prev.social_links,
                                facebook: e.target.value,
                              },
                            }))
                          }
                          placeholder="Facebook URL"
                          className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="url"
                          value={settingsData.social_links.github}
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              social_links: {
                                ...prev.social_links,
                                github: e.target.value,
                              },
                            }))
                          }
                          placeholder="GitHub URL"
                          className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="url"
                          value={settingsData.social_links.linkedin}
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              social_links: {
                                ...prev.social_links,
                                linkedin: e.target.value,
                              },
                            }))
                          }
                          placeholder="LinkedIn URL"
                          className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="url"
                          value={settingsData.social_links.twitter}
                          onChange={(e) =>
                            setSettingsData((prev) => ({
                              ...prev,
                              social_links: {
                                ...prev.social_links,
                                twitter: e.target.value,
                              },
                            }))
                          }
                          placeholder="Twitter URL"
                          className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowSettings(false)}
                        className="flex-1"
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleSaveSettings}
                        disabled={settingsLoading}
                        className="flex-1"
                      >
                        {settingsLoading ? "Đang lưu..." : "Lưu thay đổi"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
