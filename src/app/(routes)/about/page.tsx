// src/app/(routes)/about/page.tsx
"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClassInfo } from "@/hooks/use-class-info";
import { useStats } from "@/hooks/use-stats";
import { useTeachers } from "@/hooks/use-teachers";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  Code,
  Download,
  GraduationCap,
  Heart,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  MoreVertical,
  Phone,
  Share2,
  Sparkles,
  Target,
  Users,
  Video,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

// Types
interface Feature {
  icon: any;
  title: string;
  description: string;
  color: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
  specialties: string[];
  bio: string;
  created_at: string;
  updated_at: string;
}

// Components
const StatCardSkeleton = () => (
  <Card className="text-center">
    <CardContent className="p-6">
      <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-3" />
      <Skeleton className="h-8 w-16 mx-auto mb-2" />
      <Skeleton className="h-4 w-20 mx-auto" />
    </CardContent>
  </Card>
);

const FeatureCardSkeleton = () => (
  <Card className="h-full">
    <CardContent className="p-6">
      <Skeleton className="w-14 h-14 rounded-xl mb-4" />
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4 mt-2" />
    </CardContent>
  </Card>
);

const SkeletonWrapper = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block">{children}</span>
);

export default function AboutPage() {
  const { data: session, status } = useSession();
  const statsData = useStats();
  const { classInfo, loading: classLoading } = useClassInfo();
  const { teachers, loading: teachersLoading } = useTeachers();
  const [activeTab, setActiveTab] = useState<
    "overview" | "teachers" | "achievements"
  >("overview");
  const [showAllTeachers, setShowAllTeachers] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Format stats for display
  const displayStats = [
    { value: statsData.documents + "+", label: "Tài liệu", icon: BookOpen },
    { value: statsData.lectures + "+", label: "Bài giảng", icon: Video },
    { value: statsData.students + "+", label: "Sinh viên", icon: Users },
    { value: statsData.projects + "+", label: "Dự án", icon: Target },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mạng 3 Hub - Lớp Quản trị Mạng 3",
          text: "Khám phá nền tảng học tập của lớp Quản trị Mạng 3!",
          url: window.location.href,
        });
        toast.success("Đã chia sẻ thành công!");
      } catch {
        toast.error("Không thể chia sẻ");
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép link vào clipboard!");
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Đã bỏ thích" : "Đã thích trang này!");
  };

  const handleDownloadInfo = () => {
    const info = {
      className: classInfo?.name || "Quản trị Mạng 3",
      teacher: teachers?.[0]?.name || "Nguyễn Ngọc Thanh",
      students: statsData.students,
      documents: statsData.documents,
      lectures: statsData.lectures,
      projects: statsData.projects,
    };
    const blob = new Blob([JSON.stringify(info, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "class-info.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã tải thông tin lớp!");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        {/* Hero Section */}
        <div className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Badge className="mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0 px-4 py-2 text-sm">
                <Sparkles className="w-3 h-3 mr-2" />
                Lớp học kết nối tri thức
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent mb-6">
                {classLoading ? (
                  <SkeletonWrapper>
                    <Skeleton className="h-16 w-96 mx-auto" />
                  </SkeletonWrapper>
                ) : (
                  classInfo?.name || "Quản trị Mạng 3"
                )}
              </h1>
              <div className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {classLoading ? (
                  <SkeletonWrapper>
                    <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
                  </SkeletonWrapper>
                ) : (
                  <p>
                    {classInfo?.description ||
                      "Nơi đào tạo những chuyên gia mạng tương lai với công nghệ hiện đại"}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  Chia sẻ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur"
                  onClick={handleLike}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  {isLiked ? "Đã thích" : "Thích"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur"
                  onClick={handleDownloadInfo}
                >
                  <Download className="w-4 h-4" />
                  Tải thông tin
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-20 space-y-12">
          {/* Quick Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {[
              { id: "overview" as const, label: "Tổng quan", icon: Home },
              {
                id: "teachers" as const,
                label: "Giảng viên",
                icon: GraduationCap,
              },
              { id: "achievements" as const, label: "Thành tích", icon: Award },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className="gap-2"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {statsData.loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                  ))
                : displayStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                        <CardContent className="p-6">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <stat.icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                            {stat.value}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {stat.label}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
            </div>
          </motion.div>

          {/* Main Content based on Active Tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Features Grid */}
                  <div>
                    <h2 className="text-3xl font-bold text-center mb-8">
                      Tại sao chọn{" "}
                      <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                        {classInfo?.name || "Mạng 3 Hub"}
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {classLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <FeatureCardSkeleton key={i} />
                          ))
                        : classInfo?.features?.map(
                            (feature: Feature, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.5,
                                  delay: index * 0.1,
                                }}
                              >
                                <Card className="h-full group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                  <CardContent className="p-6">
                                    <div
                                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                                    >
                                      <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">
                                      {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {feature.description}
                                    </p>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ),
                          )}
                    </div>
                  </div>

                  {/* Location & Contact Info */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-primary-500" />
                            Địa điểm
                          </h3>
                          <div className="space-y-2 text-gray-600 dark:text-gray-300">
                            <p>🏫 Trường Cao đẳng Nghề Kiên Giang</p>
                            <p>📍 Số 123, Đường Nguyễn Trung Trực, Rạch Giá</p>
                            <p>📞 Hotline: (0297) 3xxx xxx</p>
                            <p>✉️ Email: info@cdngk.edu.vn</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-primary-500" />
                            Thời gian học tập
                          </h3>
                          <div className="space-y-2 text-gray-600 dark:text-gray-300">
                            <p>📅 Học kỳ: Tháng 9 - Tháng 1</p>
                            <p>🕐 Lịch học: Thứ 2 - Thứ 6</p>
                            <p>⏰ Giờ học: 7:00 - 17:00</p>
                            <p>🏠 Phòng học: P.301 - Tòa nhà A</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Teachers Tab */}
              {activeTab === "teachers" && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-center mb-8">
                    Đội ngũ{" "}
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                      giảng viên
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teachersLoading
                      ? Array.from({ length: 2 }).map((_, i) => (
                          <Card key={i}>
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <Skeleton className="w-20 h-20 rounded-full" />
                                <div className="flex-1">
                                  <Skeleton className="h-6 w-32 mb-2" />
                                  <Skeleton className="h-4 w-24 mb-3" />
                                  <Skeleton className="h-4 w-full" />
                                  <Skeleton className="h-4 w-3/4" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      : teachers
                          ?.slice(0, showAllTeachers ? undefined : 2)
                          .map((teacher: Teacher, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Card className="hover:shadow-2xl transition-all duration-300">
                                <CardContent className="p-6">
                                  <div className="flex items-start gap-4">
                                    <div className="relative">
                                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 p-1">
                                        <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                          {teacher.image ? (
                                            <img
                                              src={teacher.image}
                                              alt={teacher.name}
                                              className="w-full h-full rounded-full object-cover"
                                            />
                                          ) : (
                                            <span className="text-2xl font-bold text-primary-500">
                                              {teacher.name
                                                .split(" ")
                                                .map((n: string) => n[0])
                                                .join("")}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="absolute -bottom-1 -right-1 bg-green-500 p-1 rounded-full">
                                        <CheckCircle className="w-3 h-3 text-white" />
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h4 className="text-lg font-bold">
                                            {teacher.name}
                                          </h4>
                                          <p className="text-sm text-primary-500 font-medium">
                                            {teacher.role || "Giảng viên"}
                                          </p>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0"
                                        >
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {teacher.specialties?.map(
                                          (spec: string, i: number) => (
                                            <Badge
                                              key={i}
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {spec}
                                            </Badge>
                                          ),
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        {teacher.bio ||
                                          "Giảng viên giàu kinh nghiệm trong lĩnh vực mạng"}
                                      </p>
                                      <div className="flex gap-2 mt-3">
                                        {teacher.email && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 gap-1 text-xs"
                                            onClick={() =>
                                              (window.location.href = `mailto:${teacher.email}`)
                                            }
                                          >
                                            <Mail className="h-3 w-3" />
                                            Email
                                          </Button>
                                        )}
                                        {teacher.phone && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 gap-1 text-xs"
                                            onClick={() =>
                                              (window.location.href = `tel:${teacher.phone}`)
                                            }
                                          >
                                            <Phone className="h-3 w-3" />
                                            Call
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                  </div>
                  {teachers && teachers.length > 2 && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowAllTeachers(!showAllTeachers)}
                        className="gap-2"
                      >
                        {showAllTeachers ? "Thu gọn" : "Xem tất cả giảng viên"}
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            showAllTeachers ? "rotate-90" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Achievements Tab */}
              {activeTab === "achievements" && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-center mb-8">
                    Thành tích{" "}
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                      nổi bật
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-4">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                          Giải thưởng Cisco
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Đạt giải Nhất cuộc thi Cisco Networking Academy 2024
                        </p>
                        <Badge
                          variant="default"
                          className="mt-3 bg-green-500 hover:bg-green-600"
                        >
                          2024
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                          Tỷ lệ tốt nghiệp
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          95% sinh viên tốt nghiệp có việc làm đúng ngành
                        </p>
                        <Badge
                          variant="default"
                          className="mt-3 bg-green-500 hover:bg-green-600"
                        >
                          Cao nhất trường
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-4">
                          <Code className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                          Dự án nổi bật
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          5 dự án mạng được triển khai thực tế tại doanh nghiệp
                        </p>
                        <Badge
                          variant="default"
                          className="mt-3 bg-purple-500 hover:bg-purple-600"
                        >
                          Đang triển khai
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 border-primary-200/30">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
                      <Sparkles className="w-6 h-6 text-primary-500" />
                      Sẵn sàng tham gia?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Cùng xây dựng một cộng đồng học tập mạnh mẽ và đầy tri
                      thức
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/documents">
                      <Button size="lg" className="gap-2 w-full sm:w-auto">
                        <BookOpen className="w-4 h-4" />
                        Khám phá tài liệu
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button
                        size="lg"
                        variant="outline"
                        className="gap-2 w-full sm:w-auto"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Liên hệ ngay
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
