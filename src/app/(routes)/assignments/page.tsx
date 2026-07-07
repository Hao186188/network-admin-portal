// src/app/(routes)/assignments/page.tsx
// Vai trò: Quản lý và hiển thị danh sách bài tập - FIX LOGIC

"use client";

import { ExportButton } from "@/components/common/ExportButton";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssignments } from "@/hooks/use-assignments";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  File,
  FileText,
  Filter,
  Folder,
  Grid as GridIcon,
  List,
  Plus,
  RefreshCw,
  Search,
  Star,
  Tag,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

// Types
interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: string;
  due_date: string;
  status: "pending" | "submitted" | "graded";
  submissions: number;
  total_students: number;
  points: number;
  attachments: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  pending: {
    label: "Chưa nộp",
    icon: AlertCircle,
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  },
  submitted: {
    label: "Đã nộp",
    icon: CheckCircle,
    color: "text-green-500 bg-green-500/10 border-green-500/20",
  },
  graded: {
    label: "Đã chấm",
    icon: Star,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
};

const typeColors: Record<string, string> = {
  Lab: "from-blue-500 to-blue-600",
  "Bài tập": "from-purple-500 to-purple-600",
  "Dự án": "from-green-500 to-green-600",
  "Kiểm tra": "from-red-500 to-red-600",
  "Thực hành": "from-orange-500 to-orange-600",
};

const typeIcons: Record<string, any> = {
  Lab: FileText,
  "Bài tập": File,
  "Dự án": Folder,
  "Kiểm tra": Award,
  "Thực hành": Tag,
};

// ============================================
// COMPONENT: DATE TIME PICKER
// ============================================
function DateTimePicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? new Date(value) : new Date(),
  );
  const [selectedTime, setSelectedTime] = useState(
    value ? new Date(value).toTimeString().slice(0, 5) : "23:59",
  );
  const pickerRef = useRef<HTMLDivElement>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(selectedDate);
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const newDate = new Date(date);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    newDate.setHours(hours, minutes);
    onChange(newDate.toISOString());
    setIsOpen(false);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    const newDate = new Date(selectedDate);
    const [hours, minutes] = time.split(":").map(Number);
    newDate.setHours(hours, minutes);
    onChange(newDate.toISOString());
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setSelectedDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    const selected = new Date(selectedDate);
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div
        className={`w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground cursor-pointer flex items-center justify-between ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-primary transition-colors"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          {value ? new Date(value).toLocaleString("vi-VN") : "Chọn thời gian"}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background rounded-2xl shadow-2xl border border-border p-4 z-50 min-w-[320px]"
          >
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeMonth(-1)}
                className="hover:bg-muted rounded-full"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </Button>
              <span className="font-semibold">
                {monthNames[selectedDate.getMonth()]}{" "}
                {selectedDate.getFullYear()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeMonth(1)}
                className="hover:bg-muted rounded-full"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-muted-foreground py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => day && handleDateSelect(day)}
                  disabled={!day}
                  className={`
                    text-center py-2 rounded-lg transition-all text-sm
                    ${!day ? "opacity-0" : ""}
                    ${day && isToday(day) ? "border border-primary" : ""}
                    ${day && isSelected(day) ? "bg-primary text-white hover:bg-primary/90" : "hover:bg-muted"}
                  `}
                >
                  {day?.getDate()}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Giờ:</span>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="px-3 py-1 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-xs"
                  onClick={() => {
                    const now = new Date();
                    const time = now.toTimeString().slice(0, 5);
                    setSelectedTime(time);
                    handleTimeChange(time);
                  }}
                >
                  Bây giờ
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// COMPONENT: FILE ATTACHMENT UPLOAD
// ============================================
function FileAttachmentUpload({
  files,
  onFilesChange,
  disabled,
}: {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (["pdf"].includes(ext || "")) return "📄";
    if (["doc", "docx"].includes(ext || "")) return "📝";
    if (["zip", "rar", "7z"].includes(ext || "")) return "📦";
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(ext || "")) return "🖼️";
    return "📎";
  };

  const acceptedTypes = [
    ".pdf",
    ".doc",
    ".docx",
    ".zip",
    ".rar",
    ".7z",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    ".txt",
    ".csv",
    ".xls",
    ".xlsx",
  ];

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragEnter={!disabled ? handleDrag : undefined}
        onDragLeave={!disabled ? handleDrag : undefined}
        onDragOver={!disabled ? handleDrag : undefined}
        onDrop={!disabled ? handleDrop : undefined}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept={acceptedTypes.join(",")}
          disabled={disabled}
        />
        <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground">
          Kéo thả file vào đây hoặc click để chọn
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Hỗ trợ: PDF, DOC, DOCX, ZIP, RAR, 7Z, JPG, PNG, và nhiều định dạng
          khác
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
            >
              <span className="text-2xl">{getFileIcon(file)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENT: SKELETON
// ============================================
const AssignmentSkeleton = () => (
  <Card className="h-full">
    <CardContent className="p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-24 mt-1" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="flex gap-2 mt-auto pt-4 border-t">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

// ============================================
// MODAL: CREATE ASSIGNMENT - FIX LOGIC
// ============================================
function CreateAssignmentModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const { createAssignment } = useAssignments();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("Quản trị Mạng 3");
  const [type, setType] = useState("Bài tập");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form khi modal đóng
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubject("Quản trị Mạng 3");
    setType("Bài tập");
    setDueDate("");
    setPoints(10);
    setTotalStudents(0);
    setAttachedFiles([]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài tập");
      return;
    }
    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả bài tập");
      return;
    }
    if (!dueDate) {
      toast.error("Vui lòng chọn hạn nộp");
      return;
    }
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để tạo bài tập");
      return;
    }

    // Kiểm tra hạn nộp phải trong tương lai
    const dueDateObj = new Date(dueDate);
    if (dueDateObj < new Date()) {
      toast.error("Hạn nộp phải là thời gian trong tương lai");
      return;
    }

    // Kiểm tra điểm số hợp lệ
    if (points < 0 || points > 100) {
      toast.error("Điểm số phải từ 0 đến 100");
      return;
    }

    setIsLoading(true);
    try {
      // Lấy số lượng sinh viên thực tế từ database
      const { data: students, error: countError } = await supabase
        .from("users")
        .select("id")
        .eq("role", "STUDENT");

      if (countError) {
        console.error("Error fetching student count:", countError);
      }

      const actualTotalStudents = students?.length || totalStudents || 0;

      const assignmentData = {
        title: title.trim(),
        description: description.trim(),
        subject,
        type,
        due_date: new Date(dueDate).toISOString(),
        points,
        total_students: actualTotalStudents,
        user_id: session.user.id,
        attachments: attachedFiles,
        status: "pending",
        submissions: 0,
      };

      const result = await createAssignment(assignmentData);

      if (result) {
        toast.success("✅ Đã tạo bài tập thành công!");
        resetForm();
        onSuccess();
        onClose();
      } else {
        toast.error("Không thể tạo bài tập, vui lòng thử lại");
      }
    } catch (error: any) {
      console.error("Create error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi tạo bài tập");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 border border-border max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Tạo bài tập mới
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Tiêu đề <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài tập..."
              className="w-full"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Mô tả <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chi tiết bài tập..."
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Môn học
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              >
                {[
                  "Quản trị Mạng 3",
                  "Bảo mật Mạng",
                  "Linux Server",
                  "Mạng máy tính",
                  "Python",
                  "Docker",
                  "Network Automation",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Loại bài tập
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              >
                {["Bài tập", "Lab", "Dự án", "Kiểm tra", "Thực hành"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Hạn nộp <span className="text-destructive">*</span>
              </label>
              <DateTimePicker
                value={dueDate}
                onChange={setDueDate}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Điểm số
              </label>
              <Input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full"
                min={0}
                max={100}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Số sinh viên
              </label>
              <Input
                type="number"
                value={totalStudents}
                onChange={(e) => setTotalStudents(Number(e.target.value))}
                className="w-full"
                min={0}
                disabled={isLoading}
                placeholder="Tự động tính"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Để trống để tự động lấy số sinh viên
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              File đính kèm
            </label>
            <FileAttachmentUpload
              files={attachedFiles}
              onFilesChange={setAttachedFiles}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tải lên tài liệu, đề bài hoặc file hướng dẫn
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Tạo bài tập
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ============================================
// MODAL: SUBMIT ASSIGNMENT
// ============================================
function SubmitAssignmentModal({
  isOpen,
  onClose,
  assignment,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const { submitAssignment } = useAssignments();
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Vui lòng chọn file để nộp");
      return;
    }
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để nộp bài");
      return;
    }
    if (!assignment) {
      toast.error("Không tìm thấy bài tập");
      return;
    }

    // Kiểm tra file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File quá lớn, vui lòng chọn file nhỏ hơn 50MB");
      return;
    }

    setIsUploading(true);
    try {
      await submitAssignment({
        assignment_id: assignment.id,
        file: file,
        user_id: session.user.id,
      });
      toast.success("🎉 Nộp bài thành công!");
      onSuccess();
      onClose();
      setFile(null);
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi nộp bài");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary" /> Nộp bài tập
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="font-medium">{assignment.title}</p>
            <p className="text-sm text-muted-foreground">
              {assignment.subject}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Hạn nộp: {new Date(assignment.due_date).toLocaleString("vi-VN")}
            </p>
            <p className="text-xs text-muted-foreground">
              Điểm tối đa: {assignment.points || 10} điểm
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Chọn file bài làm <span className="text-destructive">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <File className="w-8 h-8 text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click để chọn file hoặc kéo thả vào đây
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hỗ trợ: PDF, DOC, DOCX, ZIP, RAR (tối đa 50MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isUploading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={isUploading || !file}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Nộp bài
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function AssignmentsPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { assignments, loading, error, refresh } = useAssignments();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedStatus, setSelectedStatus] = useState<string>("Tất cả");
  const [selectedType, setSelectedType] = useState<string>("Tất cả");
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  // Kiểm tra quyền - chỉ TEACHER và ADMIN mới tạo được bài tập
  const isTeacher =
    session?.user?.role === "TEACHER" || session?.user?.role === "ADMIN";

  const uniqueTypes = ["Tất cả", ...new Set(assignments.map((a) => a.type))];
  const statuses = ["Tất cả", "pending", "submitted", "graded"];

  const filteredAssignments = assignments.filter((item: Assignment) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "Tất cả" || item.status === selectedStatus;
    const matchesType = selectedType === "Tất cả" || item.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

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

  const handleUpload = (assignment: Assignment) => {
    if (assignment.status === "submitted" || assignment.status === "graded") {
      toast.info("Bạn đã nộp bài tập này rồi");
      return;
    }
    // Kiểm tra hạn nộp
    if (new Date(assignment.due_date) < new Date()) {
      toast.error("Bài tập đã quá hạn nộp");
      return;
    }
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  const handleViewDetail = (assignment: Assignment) => {
    router.push(`/assignments/${assignment.id}`);
  };

  const handleCreateSuccess = () => {
    refresh();
    toast.success("Đã cập nhật danh sách bài tập");
  };

  const handleSubmitSuccess = () => {
    refresh();
    toast.success("Đã cập nhật danh sách bài tập");
  };

  const statusLabels: Record<string, string> = {
    pending: "Chưa nộp",
    submitted: "Đã nộp",
    graded: "Đã chấm",
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
                <FileText className="w-8 h-8 text-primary" /> Bài Tập
              </h1>
              <div className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Danh sách bài tập và dự án</span>
                {!loading && (
                  <Badge variant="secondary" className="ml-2">
                    {filteredAssignments.length} bài tập
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {isTeacher && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" /> Tạo bài tập
                </Button>
              )}
              <ExportButton type="assignments" />
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={refresh}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />{" "}
                Làm mới
              </Button>
              {isTeacher && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => router.push("/submissions")}
                >
                  <Users className="w-4 h-4" />
                  Xem bài nộp
                </Button>
              )}
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm bài tập theo tên, mô tả hoặc môn học..."
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" /> Lọc
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
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
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Trạng thái
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => (
                          <Badge
                            key={status}
                            variant={
                              selectedStatus === status ? "default" : "outline"
                            }
                            className="cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setSelectedStatus(status)}
                          >
                            {status === "Tất cả"
                              ? status
                              : statusLabels[status] || status}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">
                        Loại
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueTypes.map((type) => (
                          <Badge
                            key={type}
                            variant={
                              selectedType === type ? "default" : "outline"
                            }
                            className="cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setSelectedType(type)}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Assignments Grid/List */}
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
                <AssignmentSkeleton key={i} />
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
            ) : filteredAssignments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Không có bài tập</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ||
                  selectedStatus !== "Tất cả" ||
                  selectedType !== "Tất cả"
                    ? "Không tìm thấy bài tập nào phù hợp"
                    : "Chưa có bài tập nào. Hãy tạo bài tập mới!"}
                </p>
                {!searchQuery &&
                  selectedStatus === "Tất cả" &&
                  selectedType === "Tất cả" &&
                  isTeacher && (
                    <Button
                      className="mt-4 gap-2"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      <Plus className="w-4 h-4" /> Tạo bài tập đầu tiên
                    </Button>
                  )}
              </motion.div>
            ) : (
              filteredAssignments.map(
                (assignment: Assignment, index: number) => {
                  const statusInfo =
                    statusConfig[
                      assignment.status as keyof typeof statusConfig
                    ];
                  const StatusIcon = statusInfo.icon;
                  const isOverdue =
                    new Date(assignment.due_date) < new Date() &&
                    assignment.status === "pending";
                  const TypeIcon = typeIcons[assignment.type] || FileText;

                  return viewMode === "grid" ? (
                    <motion.div
                      key={assignment.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer"
                        onClick={() => handleViewDetail(assignment)}
                      >
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${typeColors[assignment.type] || "from-gray-500 to-gray-600"} flex items-center justify-center shadow-lg`}
                              >
                                <TypeIcon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <Badge variant="outline" className="text-xs">
                                  {assignment.type}
                                </Badge>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                  {assignment.subject}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`flex items-center gap-1 px-3 py-1 rounded-full border ${statusInfo.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              <span className="text-xs font-medium">
                                {statusInfo.label}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                            {assignment.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                            {assignment.description}
                          </p>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Clock className="w-4 h-4 text-primary-500" />
                              <span>
                                Hạn nộp: {formatDate(assignment.due_date)}
                              </span>
                              {isOverdue && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Quá hạn
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Users className="w-4 h-4 text-primary-500" />
                              <span>
                                {assignment.submissions || 0}/
                                {assignment.total_students || 0} đã nộp
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <Star className="w-4 h-4 text-primary-500" />
                              <span>{assignment.points || 0} điểm</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <File className="w-4 h-4 text-primary-500" />
                              <span>
                                {assignment.attachments || 0} file đính kèm
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                            <Button
                              className="flex-1 gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpload(assignment);
                              }}
                              disabled={
                                assignment.status === "submitted" ||
                                assignment.status === "graded" ||
                                isOverdue
                              }
                            >
                              <Upload className="w-4 h-4" />
                              {assignment.status === "submitted" ||
                              assignment.status === "graded"
                                ? "Đã nộp"
                                : isOverdue
                                  ? "Quá hạn"
                                  : "Nộp bài"}
                            </Button>
                            <Button variant="outline" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={assignment.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card
                        className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onClick={() => handleViewDetail(assignment)}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {assignment.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {assignment.subject}
                                </Badge>
                                <div
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${statusInfo.color}`}
                                >
                                  <StatusIcon className="w-3 h-3" />
                                  <span className="text-xs font-medium">
                                    {statusInfo.label}
                                  </span>
                                </div>
                                {isOverdue && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Quá hạn
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {assignment.title}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {assignment.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-primary-500" />{" "}
                                  {formatDate(assignment.due_date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-primary-500" />{" "}
                                  {assignment.submissions || 0}/
                                  {assignment.total_students || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-primary-500" />{" "}
                                  {assignment.points || 0} điểm
                                </span>
                                <span className="flex items-center gap-1">
                                  <File className="w-4 h-4 text-primary-500" />{" "}
                                  {assignment.attachments || 0} file
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                className="gap-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpload(assignment);
                                }}
                                disabled={
                                  assignment.status === "submitted" ||
                                  assignment.status === "graded" ||
                                  isOverdue
                                }
                              >
                                <Upload className="w-4 h-4" />
                                {assignment.status === "submitted" ||
                                assignment.status === "graded"
                                  ? "Đã nộp"
                                  : isOverdue
                                    ? "Quá hạn"
                                    : "Nộp bài"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                              >
                                <Download className="w-4 h-4" /> Tải
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                },
              )
            )}
          </motion.div>
        </div>
      </div>
      <Footer />

      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        onSuccess={handleCreateSuccess}
      />
      <SubmitAssignmentModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
        onSuccess={handleSubmitSuccess}
      />
    </>
  );
}
