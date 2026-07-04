// src/app/(routes)/profile/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    Award,
    BookOpen,
    CheckCircle,
    Clock,
    Edit,
    FileText,
    Globe,
    LinkIcon,
    Mail,
    MapPin,
    Phone,
    Star,
    TrendingUp,
    User
} from "lucide-react";
import Link from "next/link";

// Custom social icons using generic icons
const socialIcons = {
  facebook: LinkIcon,
  github: LinkIcon,
  twitter: LinkIcon,
  youtube: LinkIcon,
  linkedin: LinkIcon,
};

const studentData = {
  name: "Võ Nhật Hào",
  studentId: "CD220001",
  email: "hao.vn@cdngk.edu.vn",
  phone: "+84 123 456 789",
  class: "Quản trị Mạng 3",
  course: "Cao đẳng Nghề",
  avatar: "VNH",
  status: "Đang học",
  progress: 75,
  grade: 8.5,
  certificates: 3,
  projects: 5,
  submissions: 12,
  courses: [
    { name: "Quản trị Mạng 3", progress: 80, grade: "8.5" },
    { name: "Bảo mật Mạng", progress: 65, grade: "7.8" },
    { name: "Cisco CCNA", progress: 90, grade: "9.0" },
  ],
  recentActivities: [
    { action: "Nộp bài Lab 3", date: "2026-06-20" },
    { action: "Xem bài giảng VLAN", date: "2026-06-19" },
    { action: "Tham gia thảo luận", date: "2026-06-18" },
  ],
  savedDocuments: [
    "Giáo trình Quản trị Mạng",
    "Hướng dẫn Cisco Packet Tracer",
    "Tài liệu ôn tập thi",
  ],
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
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
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Quản lý thông tin và tiến độ học tập
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Edit className="w-4 h-4" />
            Chỉnh sửa hồ sơ
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
                      {studentData.avatar}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-full">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mt-4">{studentData.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {studentData.class}
                </p>
                <Badge variant="success" className="mt-2">
                  {studentData.status}
                </Badge>

                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <User className="w-4 h-4 text-primary-500" />
                    <span>{studentData.studentId}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="w-4 h-4 text-primary-500" />
                    <span>{studentData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4 text-primary-500" />
                    <span>{studentData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span>{studentData.course}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex justify-around">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-500">
                        {studentData.progress}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Tiến độ
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary-500">
                        {studentData.grade}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Điểm TB
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-500">
                        {studentData.certificates}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Chứng chỉ
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2 justify-center">
                  <Link href="#" target="_blank">
                    <Button variant="outline" size="icon">
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="#" target="_blank">
                    <Button variant="outline" size="icon">
                      <Globe className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="#" target="_blank">
                    <Button variant="outline" size="icon">
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  </Link>
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
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {[
                {
                  label: "Bài đã nộp",
                  value: studentData.submissions,
                  icon: FileText,
                },
                { label: "Dự án", value: studentData.projects, icon: Award },
                {
                  label: "Điểm TB",
                  value: studentData.grade,
                  icon: TrendingUp,
                },
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
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {studentData.courses.map((course, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {course.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {course.grade}/10
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {course.progress}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
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
                  {studentData.recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-gray-700/50"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {activity.action}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  ))}
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
                  {studentData.savedDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {doc}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
