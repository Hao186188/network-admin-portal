// src/app/(routes)/profile/page.tsx
// Vai trò: Trang hồ sơ cá nhân - FIX LỖI

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  Edit,
  FileText,
  Globe,
  LinkIcon,
  Mail,
  Phone,
  RefreshCw,
  Shield,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { profile, courses, activities, documents, stats, loading, refresh } =
    useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const getRoleBadge = (role: string) => {
    const config = {
      ADMIN: { color: "bg-red-500", icon: Crown, label: "Admin" },
      TEACHER: { color: "bg-blue-500", icon: Shield, label: "Giảng viên" },
      STUDENT: { color: "bg-green-500", icon: User, label: "Học sinh" },
    };
    const {
      color,
      icon: Icon,
      label,
    } = config[role as keyof typeof config] || config.STUDENT;
    return (
      <Badge className={`${color} text-white border-0 gap-1`}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  // Kiểm tra trạng thái đăng nhập
  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            <Skeleton className="h-12 w-48" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Skeleton className="h-96 rounded-2xl" />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Nếu chưa đăng nhập
  if (!session?.user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Card>
              <CardContent className="p-8 text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Vui lòng đăng nhập</h2>
                <p className="text-muted-foreground">
                  Đăng nhập để xem hồ sơ của bạn
                </p>
                <Link href="/login">
                  <Button className="mt-4">Đăng nhập</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Nếu đã đăng nhập nhưng chưa có profile
  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Card>
              <CardContent className="p-8 text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-2xl font-bold mb-2">
                  Không tìm thấy hồ sơ
                </h2>
                <p className="text-muted-foreground">
                  Vui lòng cập nhật thông tin hồ sơ của bạn
                </p>
                <Button className="mt-4 gap-2" onClick={refresh}>
                  <RefreshCw className="w-4 h-4" />
                  Tải lại
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                Hồ Sơ Cá Nhân
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <User className="w-4 h-4" />
                Quản lý thông tin và tiến độ học tập
              </p>
            </div>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4" />
              {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-24">
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 p-1">
                      <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-4xl font-bold text-primary-500">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-full">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mt-4">{profile.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{profile.username}
                  </p>
                  <div className="mt-2">{getRoleBadge(profile.role)}</div>

                  <div className="mt-6 space-y-3 text-left">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4 text-primary-500" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4 text-primary-500" />
                      <span>{profile.phone || "Chưa cập nhật"}</span>
                    </div>
                    {profile.student_id && (
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4 text-primary-500" />
                        <span>MSSV: {profile.student_id}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <span>Tham gia: {formatDate(profile.created_at)}</span>
                    </div>
                  </div>

                  {profile.bio && (
                    <div className="mt-4 p-3 rounded-xl bg-muted/50 text-sm text-gray-600 dark:text-gray-300">
                      {profile.bio}
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex justify-around">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500">
                          {stats.progress}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Tiến độ
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary-500">
                          {stats.averageGrade}/10
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Điểm TB
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent-500">
                          {stats.submissions}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Bài nộp
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:bg-blue-500/10"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="hover:bg-purple-500/10"
                    >
                      <Globe className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  {
                    label: "Bài đã nộp",
                    value: stats.submissions,
                    icon: FileText,
                  },
                  { label: "Dự án", value: stats.projects, icon: Award },
                  {
                    label: "Điểm TB",
                    value: stats.averageGrade + "/10",
                    icon: TrendingUp,
                  },
                  { label: "Chứng chỉ", value: stats.certificates, icon: Star },
                ].map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {stat.label}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>

              {/* Courses Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary-500" />
                      Môn học đang theo học
                      <Badge variant="secondary" className="ml-2">
                        {courses.length} môn
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courses.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Chưa đăng ký môn học nào</p>
                        <Link href="/courses">
                          <Button variant="outline" size="sm" className="mt-2">
                            Khám phá môn học
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      courses.map((course, index) => (
                        <div key={course.id}>
                          <div className="flex justify-between mb-1">
                            <div>
                              <span className="text-sm font-medium">
                                {course.name}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {course.code}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {course.grade.toFixed(1)}/10
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {course.progress}%
                              </Badge>
                              <Badge
                                variant={
                                  course.status === "active"
                                    ? "success"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {course.status === "active"
                                  ? "Đang học"
                                  : "Hoàn thành"}
                              </Badge>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{
                                duration: 1,
                                delay: 0.5 + index * 0.2,
                              }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-secondary-500" />
                      Hoạt động gần đây
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activities.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Chưa có hoạt động nào</p>
                      </div>
                    ) : (
                      activities.map((activity, index) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-gray-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                activity.type === "grade"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                              }`}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {activity.action}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {activity.description}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTime(activity.created_at)}
                          </span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Saved Documents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Tài liệu đã lưu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {documents.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Chưa có tài liệu nào được lưu</p>
                        <Link href="/documents">
                          <Button variant="outline" size="sm" className="mt-2">
                            Khám phá tài liệu
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      documents.map((doc, index) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                          onClick={() => window.open(doc.url, "_blank")}
                        >
                          <FileText className="w-4 h-4 text-primary-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                            {doc.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(doc.created_at)}
                          </span>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
