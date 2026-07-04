// src/app/(routes)/courses/page.tsx
// Vai trò: Hiển thị danh sách các môn học và tiến độ

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Award,
    BookOpen,
    CheckCircle,
    Clock,
    Filter,
    Grid as GridIcon,
    List,
    Search,
    TrendingUp,
    Users
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const courses = [
  {
    id: 1,
    name: "Quản trị Mạng 3",
    code: "QTM301",
    instructor: "Nguyễn Ngọc Thanh",
    description:
      "Kiến thức về quản trị mạng nâng cao, bao gồm VLAN, Routing, NAT, và bảo mật mạng.",
    credits: 4,
    students: 25,
    schedule: "Thứ 2, 07:30 - 10:30",
    room: "Phòng A1.2",
    progress: 75,
    status: "active",
    rating: 4.8,
    tags: ["Mạng", "Cisco", "CCNA"],
  },
  {
    id: 2,
    name: "Bảo mật Mạng",
    code: "BMM401",
    instructor: "Nguyễn Ngọc Thanh",
    description:
      "Các kỹ thuật bảo mật mạng, firewall, IPS, và các biện pháp phòng thủ.",
    credits: 3,
    students: 22,
    schedule: "Thứ 3, 13:00 - 16:00",
    room: "Phòng B2.1",
    progress: 65,
    status: "active",
    rating: 4.6,
    tags: ["Bảo mật", "Firewall", "IPS"],
  },
  {
    id: 3,
    name: "Cisco CCNA",
    code: "CCNA201",
    instructor: "Nguyễn Ngọc Thanh",
    description:
      "Chứng chỉ CCNA với các kiến thức về routing, switching và networking.",
    credits: 4,
    students: 20,
    schedule: "Thứ 4, 07:30 - 10:30",
    room: "Phòng Lab 3",
    progress: 90,
    status: "active",
    rating: 4.9,
    tags: ["CCNA", "Cisco", "Routing"],
  },
];

export default function CoursesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleEnroll = (name: string) => {
    toast.success(`Đã đăng ký môn học: ${name}`);
  };

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
              Môn Học
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Danh sách các môn học và tiến độ
            </p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm môn học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
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

        {/* Courses Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {courses.map((course, index) => (
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
                    <Badge variant="success" className="text-xs">
                      {course.status === "active" ? "Đang học" : "Hoàn thành"}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
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
                      <span className="font-medium">{course.progress}%</span>
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

                  <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <Link href={`/courses/${course.id}`} className="flex-1">
                      <Button className="w-full gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Chi tiết
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEnroll(course.name)}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
