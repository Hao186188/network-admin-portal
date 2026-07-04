// src/app/(routes)/assignments/page.tsx
// Vai trò: Quản lý và hiển thị danh sách bài tập

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Download,
    FileText,
    Filter,
    Grid as GridIcon,
    List,
    Search,
    Star,
    Upload,
    Users
} from "lucide-react";
import { useState } from "react";

const assignments = [
  {
    id: 1,
    title: "Lab 3 - Cấu hình VLAN",
    description:
      "Thực hành cấu hình VLAN trên Switch Cisco và kiểm tra kết nối",
    subject: "Quản trị Mạng 3",
    dueDate: "2026-06-27T23:59:00",
    type: "Lab",
    status: "pending",
    submissions: 15,
    totalStudents: 25,
    points: 10,
    attachments: 2,
  },
  {
    id: 2,
    title: "Bài tập tuần 5 - DHCP",
    description:
      "Cấu hình DHCP Server trên Windows Server và kiểm tra cấp phát IP",
    subject: "Quản trị Mạng 3",
    dueDate: "2026-06-24T23:59:00",
    type: "Bài tập",
    status: "submitted",
    submissions: 20,
    totalStudents: 25,
    points: 8,
    attachments: 1,
  },
  {
    id: 3,
    title: "Dự án - Mạng doanh nghiệp",
    description:
      "Thiết kế và cấu hình mạng doanh nghiệp với VLAN, Routing và NAT",
    subject: "Quản trị Mạng 3",
    dueDate: "2026-07-10T23:59:00",
    type: "Dự án",
    status: "pending",
    submissions: 5,
    totalStudents: 25,
    points: 20,
    attachments: 3,
  },
];

const statusConfig = {
  pending: {
    label: "Chưa nộp",
    icon: AlertCircle,
    color: "text-yellow-500 bg-yellow-500/10",
  },
  submitted: {
    label: "Đã nộp",
    icon: CheckCircle,
    color: "text-green-500 bg-green-500/10",
  },
  graded: {
    label: "Đã chấm",
    icon: Star,
    color: "text-blue-500 bg-blue-500/10",
  },
};

export default function AssignmentsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleUpload = (title: string) => {
    toast.success(`Đang mở form nộp bài: ${title}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
              Bài Tập
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Danh sách bài tập và dự án
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
              placeholder="Tìm kiếm bài tập..."
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

        {/* Assignments Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {assignments.map((assignment, index) => {
            const statusInfo =
              statusConfig[assignment.status as keyof typeof statusConfig];
            const StatusIcon = statusInfo.icon;
            const isOverdue =
              new Date(assignment.dueDate) < new Date() &&
              assignment.status === "pending";

            return (
              <motion.div
                key={assignment.id}
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
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {assignment.type}
                          </Badge>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {assignment.subject}
                          </p>
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

                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                      {assignment.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span>Hạn nộp: {formatDate(assignment.dueDate)}</span>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            Quá hạn
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4 text-primary-500" />
                        <span>
                          {assignment.submissions}/{assignment.totalStudents} đã
                          nộp
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Star className="w-4 h-4 text-primary-500" />
                        <span>{assignment.points} điểm</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <Button
                        className="flex-1 gap-2"
                        onClick={() => handleUpload(assignment.title)}
                      >
                        <Upload className="w-4 h-4" />
                        Nộp bài
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="w-4 h-4" />
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
