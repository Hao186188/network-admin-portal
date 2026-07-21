// src/app/(routes)/profile/[id]/page.tsx
// Trang xem hồ sơ người dùng khác

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/db/supabase-client";
import { cn, formatRelativeTime } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  FileText,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  School,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  image?: string;
  role: string;
  student_id?: string;
  specialties?: string[];
  created_at: string;
}

interface UserStats {
  totalPosts: number;
  totalCourses: number;
  totalAssignments: number;
}

interface ForumPost {
  id: string;
  title: string;
  category: string;
  views: number;
  likes: number;
  replies: number;
  created_at: string;
}

const ROLE_CONFIG: Record<string, { label: string; className: string }> = {
  admin:   { label: "👑 Admin",      className: "bg-red-500/10 text-red-500 border-red-500/20"     },
  teacher: { label: "👨🏫 Giảng viên", className: "bg-blue-500/10 text-blue-500 border-blue-500/20"  },
  student: { label: "🎓 Sinh viên",   className: "bg-green-500/10 text-green-500 border-green-500/20"},
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({ totalPosts: 0, totalCourses: 0, totalAssignments: 0 });
  const [recentPosts, setRecentPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAll = async () => {
      try {
        setLoading(true);

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, name, email, phone, bio, image, role, student_id, specialties, created_at")
          .eq("id", userId)
          .single();

        if (userError || !userData) {
          setError("Không tìm thấy người dùng");
          return;
        }

        setProfile(userData);

        const [postsRes, coursesRes, assignmentsRes, recentPostsRes] = await Promise.all([
          supabase.from("forum_posts").select("*", { count: "exact", head: true }).eq("author_id", userId),
          supabase.from("courses").select("*", { count: "exact", head: true }),
          supabase.from("assignments").select("*", { count: "exact", head: true }),
          supabase
            .from("forum_posts")
            .select("id, title, category, views, likes, replies, created_at")
            .eq("author_id", userId)
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        setStats({
          totalPosts: postsRes.count || 0,
          totalCourses: coursesRes.count || 0,
          totalAssignments: assignmentsRes.count || 0,
        });

        setRecentPosts(recentPostsRes.data || []);
      } catch (err) {
        setError("Có lỗi xảy ra khi tải hồ sơ");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
            <Skeleton className="h-10 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-3xl mx-auto p-4 md:p-8 text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy người dùng</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => router.back()} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const role = profile.role?.toLowerCase() || "student";
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.student;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={profile.image || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-3xl">
                  {profile.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold truncate">{profile.name || "Chưa cập nhật"}</h1>
                  <Badge className={cn("border text-xs", roleConfig.className)}>
                    {roleConfig.label}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {profile.email}
                  </span>
                  {profile.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {profile.phone}
                    </span>
                  )}
                  {profile.student_id && (
                    <span className="flex items-center gap-1">
                      <School className="w-3.5 h-3.5" />
                      {profile.student_id}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Tham gia {new Date(profile.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {profile.bio && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Specialties */}
            {profile.specialties && profile.specialties.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                  <Globe className="w-3.5 h-3.5" />
                  Chuyên môn
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
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
                <p className="text-2xl font-bold">{stats.totalAssignments}</p>
                <p className="text-xs text-muted-foreground">Bài tập</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Bài viết gần đây
              </h2>
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <Link key={post.id} href={`/forum/${post.id}`}>
                    <div className="bg-card rounded-xl border border-border/50 p-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate hover:text-primary transition-colors">
                            {post.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {post.category}
                            </Badge>
                            <span>{formatRelativeTime(post.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            {post.replies}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-3 text-center">
                <Link href={`/forum?author=${profile.id}`}>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Xem tất cả bài viết →
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
