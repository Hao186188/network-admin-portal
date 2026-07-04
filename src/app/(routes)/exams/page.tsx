// src/app/(routes)/exams/page.tsx
// Vai trò: Hiển thị lịch thi và kết quả thi

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    AlertCircle,
    Award,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    Filter,
    Grid as GridIcon,
    List,
    MapPin,
    Search,
    Users
} from "lucide-react";
import { useState } from "react";

const exams = [
  {
    id: 1,
    subject: "Quản trị Mạng 3",
    type: "Giữa kỳ",
    date: "2026-06-30",
    time: "08:00 - 10:00",
    room: "Phòng A1.2",
    status: "upcoming",
    duration: 120,
    maxScore: 10,
    registered: 25,
  },
  {
    id: 2,
    subject: "Bảo mật Mạng",
    type: "Giữa kỳ",
    date: "2026-07-05",
    time: "08:00 - 10:00",
    room: "Phòng B2.1",
    status: "upcoming",
    duration: 120,
    maxScore: 10,
    registered: 22,
  },
  {
    id: 3,
    subject: "Quản trị Mạng 3",
    type: "Cuối kỳ",
    date: "2026-08-15",
    time: "08:00 - 11:00",
    room: "Phòng A1.2",
    status: "upcoming",
    duration: 180,
    maxScore: 10,
    registered: 25,
  },
  {
    id: 4,
    subject: "Cisco CCNA",
    type: "Thực hành",
    date: "2026-07-20",
    time: "13:00 - 16:00",
    room: "Phòng Lab 3",
    status: "upcoming",
    duration: 180,
    maxScore: 10,
    registered: 20,
  },
];

const statusConfig = {
  upcoming: {
    label: "Sắp tới",
    icon: Clock,
    color: "text-blue-500 bg-blue-500/10",
  },
  completed: {
    label: "Đã hoàn thành",
    icon: CheckCircle,
    color: "text-green-500 bg-green-500/10",
  },
  cancelled: {
    label: "Đã hủy",
    icon: AlertCircle,
    color: "text-red-500 bg-red-500/10",
  },
};

export default function ExamsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleRegister = (subject: string) => {
    toast.success(`Đã đăng ký thi môn: ${subject}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
              Lịch Thi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Lịch thi và thông tin kỳ thi
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
              placeholder="Tìm kiếm kỳ thi..."
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

        {/* Exams Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {exams.map((exam, index) => {
            const statusInfo =
              statusConfig[exam.status as keyof typeof statusConfig];
            const StatusIcon = statusInfo.icon;
            return (
              <motion.div
                key={exam.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {exam.subject}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {exam.type}
                          </Badge>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        <span>{formatDate(exam.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span>{exam.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span>{exam.room}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4 text-primary-500" />
                        <span>{exam.registered} sinh viên đăng ký</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <BookOpen className="w-4 h-4 text-primary-500" />
                        <span>
                          {exam.duration} phút - {exam.maxScore} điểm
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => handleRegister(exam.subject)}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Đăng ký
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
