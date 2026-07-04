// src/app/(dashboard)/dashboard/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  UserPlus,
  Users,
  Video
} from "lucide-react";

const stats = [
  {
    title: "Tài liệu",
    value: "156",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    change: "+12%",
  },
  {
    title: "Bài giảng",
    value: "48",
    icon: Video,
    color: "from-purple-500 to-purple-600",
    change: "+8%",
  },
  {
    title: "Sinh viên",
    value: "25",
    icon: Users,
    color: "from-green-500 to-green-600",
    change: "+5%",
  },
  {
    title: "Giảng viên",
    value: "3",
    icon: UserPlus,
    color: "from-orange-500 to-orange-600",
    change: "0%",
  },
];

const announcements = [
  {
    title: "Thông báo lịch thi giữa kỳ",
    time: "2 giờ trước",
    priority: "high",
  },
  {
    title: "Bài tập tuần 5 đã được đăng tải",
    time: "5 giờ trước",
    priority: "medium",
  },
  {
    title: "Cập nhật lịch trực phòng máy",
    time: "1 ngày trước",
    priority: "low",
  },
];

const upcomingTasks = [
  {
    title: "Nộp bài tập Lab 3",
    date: "Hôm nay, 23:59",
    status: "urgent",
  },
  {
    title: "Ôn tập kiểm tra giữa kỳ",
    date: "Ngày mai, 14:00",
    status: "pending",
  },
  {
    title: "Hoàn thành dự án nhóm",
    date: "20/07/2026",
    status: "upcoming",
  },
];

export default function DashboardPage() {
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
              Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Chào mừng đến với Mạng 3 Hub
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Đã kết nối
            </Badge>
            <Badge variant="purple" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Học tập tích cực
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold mt-2 bg-gradient-to-r dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        {stat.change} so với tháng trước
                      </p>
                    </div>
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary-500" />
                  Thông báo mới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors cursor-pointer group"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${item.priority === "high" ? "bg-red-500" : item.priority === "medium" ? "bg-yellow-500" : "bg-blue-500"}`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        item.priority === "high"
                          ? "destructive"
                          : item.priority === "medium"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {item.priority === "high"
                        ? "Quan trọng"
                        : item.priority === "medium"
                          ? "Bình thường"
                          : "Thấp"}
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary-500" />
                  Bài tập sắp đến hạn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          task.status === "urgent"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-600"
                            : task.status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                        }`}
                      >
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors">
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {task.date}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        task.status === "urgent"
                          ? "destructive"
                          : task.status === "pending"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {task.status === "urgent"
                        ? "Gấp"
                        : task.status === "pending"
                          ? "Chờ"
                          : "Sắp tới"}
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent-500" />
                Truy cập nhanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  {
                    icon: FileText,
                    label: "Tài liệu",
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    icon: Video,
                    label: "Bài giảng",
                    color: "from-purple-500 to-purple-600",
                  },
                  {
                    icon: Calendar,
                    label: "Lịch học",
                    color: "from-green-500 to-green-600",
                  },
                  {
                    icon: Bell,
                    label: "Thông báo",
                    color: "from-orange-500 to-orange-600",
                  },
                  {
                    icon: Users,
                    label: "Lớp học",
                    color: "from-pink-500 to-pink-600",
                  },
                  {
                    icon: BookOpen,
                    label: "Môn học",
                    color: "from-cyan-500 to-cyan-600",
                  },
                ].map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-lg transition-all group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
