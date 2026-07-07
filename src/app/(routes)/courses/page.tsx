// src/app/(routes)/courses/page.tsx
// Vai trò: Hiển thị danh sách các môn học và tiến độ - DÙNG DỮ LIỆU THẬT

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourses } from "@/hooks/use-courses";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Filter,
  Grid as GridIcon,
  List,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  instructor: string;
  instructor_id: string;
  credits: number;
  students: number;
  schedule: string;
  room: string;
  progress: number;
  status: "active" | "completed" | "pending";
  rating: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
}

const CourseSkeleton = () => (
  <Card className="h-full">
    <CardContent className="p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-16 mt-1" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex flex-wrap gap-2 mb-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="flex gap-2 mt-auto pt-4 border-t">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

export default function CoursesPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { courses, loading, error, refresh, enrollCourse } = useCourses();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tất cả");
  const [showFilters, setShowFilters] = useState(false);

  const isTeacher =
    session?.user?.role === "TEACHER" || session?.user?.role === "ADMIN";

  const filteredCourses = courses.filter((item: Course) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "Tất cả" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEnroll = async (courseId: string, courseName: string) => {
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để đăng ký môn học");
      return;
    }

    try {
      await enrollCourse(courseId, session.user.id);
      toast.success(`Đã đăng ký môn học: ${courseName}`);
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi đăng ký");
    }
  };

  const statusLabels: Record<string, string> = {
    active: "Đang học",
    completed: "Hoàn thành",
    pending: "Chưa bắt đầu",
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-500",
    completed: "bg-blue-500",
    pending: "bg-yellow-500",
  };

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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                Môn Học
              </h1>
              <div className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Danh sách các môn học và tiến độ</span>
                {!loading && (
                  <Badge variant="secondary" className="ml-2">
                    {filteredCourses.length} môn học
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {isTeacher && (
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tạo môn học
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={refresh}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Làm mới
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Lọc
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <GridIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm môn học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-2 pt-2">
                {["Tất cả", "active", "completed", "pending"].map((status) => (
                  <Badge
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status === "Tất cả"
                      ? "Tất cả"
                      : statusLabels[status] || status}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>

          {/* Courses Grid/List */}
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <CourseSkeleton key={i} />
              ))
            ) : error ? (
              <Card className="border-destructive col-span-full">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-destructive opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    Lỗi tải dữ liệu
                  </h3>
                  <p className="text-muted-foreground">{error}</p>
                  <Button className="mt-4" onClick={refresh}>
                    Thử lại
                  </Button>
                </CardContent>
              </Card>
            ) : filteredCourses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Không có môn học</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || selectedStatus !== "Tất cả"
                    ? "Không tìm thấy môn học nào phù hợp"
                    : "Chưa có môn học nào trong hệ thống"}
                </p>
              </motion.div>
            ) : (
              filteredCourses.map((course: Course, index: number) => {
                const statusColor =
                  statusColors[course.status] || "bg-gray-500";
                const statusLabel =
                  statusLabels[course.status] || course.status;

                return viewMode === "grid" ? (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {course.name}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {course.code}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`${statusColor} text-white border-0`}
                          >
                            {statusLabel}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                          {course.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.tags?.map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Users className="w-4 h-4 text-primary-500" />
                            <span>{course.students} sinh viên</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Clock className="w-4 h-4 text-primary-500" />
                            <span>{course.schedule}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Award className="w-4 h-4 text-primary-500" />
                            <span>{course.credits} tín chỉ</span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-300">
                              Tiến độ
                            </span>
                            <span className="font-medium">
                              {course.progress}%
                            </span>
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

                        <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                          <Link
                            href={`/courses/${course.id}`}
                            className="flex-1"
                          >
                            <Button className="w-full gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Chi tiết
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEnroll(course.id, course.name)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {course.name}
                                  </h3>
                                  <Badge
                                    className={`${statusColor} text-white border-0 text-xs`}
                                  >
                                    {statusLabel}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {course.code}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-1">
                              {course.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-primary-500" />
                                {course.students}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-primary-500" />
                                {course.schedule}
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="w-4 h-4 text-primary-500" />
                                {course.credits} tín chỉ
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4 text-primary-500" />
                                {course.progress}%
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Link href={`/courses/${course.id}`}>
                              <Button size="sm" className="gap-1">
                                <TrendingUp className="w-4 h-4" />
                                Chi tiết
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleEnroll(course.id, course.name)
                              }
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
