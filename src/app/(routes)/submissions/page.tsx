// src/app/(routes)/submissions/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Eye,
    File,
    Search,
    Upload,
    User,
    XCircle
} from "lucide-react";
import { useState } from "react";

const submissions = [
  {
    id: 1,
    title: "Lab 3 - Cấu hình VLAN",
    subject: "Quản trị Mạng 3",
    submittedDate: "2026-06-20T14:30:00",
    status: "graded",
    grade: 8.5,
    feedback: "Bài làm tốt, cần chú ý cấu hình trunk",
    file: "lab3_vlan.pkt",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Bài tập tuần 5 - DHCP",
    subject: "Quản trị Mạng 3",
    submittedDate: "2026-06-18T10:15:00",
    status: "pending",
    grade: null,
    feedback: null,
    file: "dhcp_config.docx",
    size: "1.2 MB",
  },
  {
    id: 3,
    title: "Dự án - Mạng doanh nghiệp",
    subject: "Quản trị Mạng 3",
    submittedDate: "2026-06-15T16:45:00",
    status: "rejected",
    grade: null,
    feedback: "Cần bổ sung sơ đồ mạng và cấu hình chi tiết",
    file: "project_network.pkt",
    size: "5.6 MB",
  },
];

const statusConfig = {
  graded: {
    label: "Đã chấm",
    icon: CheckCircle,
    color: "text-green-500 bg-green-500/10",
  },
  pending: {
    label: "Đang chờ",
    icon: Clock,
    color: "text-yellow-500 bg-yellow-500/10",
  },
  rejected: {
    label: "Cần sửa",
    icon: XCircle,
    color: "text-red-500 bg-red-500/10",
  },
};

export default function SubmissionsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [isDragging, setIsDragging] = useState(false);

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "Tất cả" || sub.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleUpload = () => {
    toast.success("Đang tải lên bài tập...");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    toast.success("File đã được tải lên");
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
              Nộp Bài Tập
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Quản lý bài tập đã nộp và kết quả
            </p>
          </div>
          <Button size="lg" className="gap-2" onClick={handleUpload}>
            <Upload className="w-4 h-4" />
            Nộp bài mới
          </Button>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card
            className={`border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/20"
                : "border-gray-300/50 dark:border-gray-700/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Kéo thả file vào đây
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hoặc click để chọn file (tối đa 50MB)
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Chọn file
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
            {["Tất cả", "Đã chấm", "Đang chờ", "Cần sửa"].map((status) => (
              <Badge
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Submissions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          {filteredSubmissions.map((sub, index) => {
            const StatusIcon =
              statusConfig[sub.status as keyof typeof statusConfig].icon;
            const statusInfo =
              statusConfig[sub.status as keyof typeof statusConfig];
            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg flex-shrink-0">
                            <File className="w-6 h-6 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {sub.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {sub.subject}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(sub.submittedDate).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <File className="w-3 h-3" />
                                {sub.file}
                              </span>
                              <span className="text-xs">{sub.size}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {statusInfo.label}
                          </span>
                        </div>

                        {sub.status === "graded" && (
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            <span className="font-bold">{sub.grade}</span>
                            <span className="text-sm">/10</span>
                          </div>
                        )}

                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="w-3 h-3" />
                          Xem
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="w-3 h-3" />
                          Tải
                        </Button>
                      </div>
                    </div>

                    {sub.feedback && (
                      <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Phản hồi: </span>
                          {sub.feedback}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredSubmissions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <File className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chưa có bài tập nào</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Hãy nộp bài tập đầu tiên của bạn
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
