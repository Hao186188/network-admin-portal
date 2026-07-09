// src/app/(routes)/assignments/components/CreateAssignmentModal.tsx
// Vai trò: Modal tạo bài tập - HOÀN CHỈNH

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAssignments } from "@/hooks/use-assignments";
import { supabase } from "@/lib/db/supabase-client";
import { logger } from "@/lib/logger";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, FileText, Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ============================================
// CONSTANTS
// ============================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "text/plain",
  "text/csv",
];

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".zip",
  ".rar",
  ".7z",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".txt",
  ".csv",
  ".pkt",
  ".pka",
  ".pkz", // Packet Tracer
  ".clab",
  ".yaml",
  ".yml", // Containerlab
];

// ============================================
// DATE TIME PICKER COMPONENT
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
    <div className="relative">
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
              <Button variant="ghost" size="sm" onClick={() => changeMonth(-1)}>
                <ChevronDown className="w-4 h-4 rotate-90" />
              </Button>
              <span className="font-semibold">
                {monthNames[selectedDate.getMonth()]}{" "}
                {selectedDate.getFullYear()}
              </span>
              <Button variant="ghost" size="sm" onClick={() => changeMonth(1)}>
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

function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  const startDay = firstDay.getDay();
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= lastDay.getDate(); i++)
    days.push(new Date(year, month, i));
  return days;
}

// ============================================
// FILE ATTACHMENT UPLOAD COMPONENT
// ============================================

function FileAttachmentUpload({
  files,
  onFilesChange,
  disabled,
  maxFiles = 5,
}: {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Validate file
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File "${file.name}" quá lớn (tối đa ${MAX_FILE_SIZE / 1024 / 1024}MB)`,
      };
    }

    // Check file type
    const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        valid: false,
        error: `File "${file.name}" không được hỗ trợ. Chỉ chấp nhận: ${ALLOWED_EXTENSIONS.join(", ")}`,
      };
    }

    return { valid: true };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      newFiles.forEach((file) => {
        const result = validateFile(file);
        if (result.valid) {
          validFiles.push(file);
        } else if (result.error) {
          errors.push(result.error);
        }
      });

      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err));
      }

      if (validFiles.length > 0) {
        const total = files.length + validFiles.length;
        if (total > maxFiles) {
          toast.error(`Chỉ được đính kèm tối đa ${maxFiles} file`);
          return;
        }
        onFilesChange([...files, ...validFiles]);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      newFiles.forEach((file) => {
        const result = validateFile(file);
        if (result.valid) {
          validFiles.push(file);
        } else if (result.error) {
          errors.push(result.error);
        }
      });

      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err));
      }

      if (validFiles.length > 0) {
        const total = files.length + validFiles.length;
        if (total > maxFiles) {
          toast.error(`Chỉ được đính kèm tối đa ${maxFiles} file`);
          e.target.value = "";
          return;
        }
        onFilesChange([...files, ...validFiles]);
      }
      e.target.value = "";
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

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragEnter={() => !disabled && setDragActive(true)}
        onDragLeave={() => !disabled && setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={!disabled ? handleDrop : undefined}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept={ALLOWED_EXTENSIONS.join(",")}
          disabled={disabled || files.length >= maxFiles}
        />
        <div className="text-4xl mb-2">📎</div>
        <p className="text-sm font-medium">
          Kéo thả file vào đây hoặc click để chọn
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Hỗ trợ: {ALLOWED_EXTENSIONS.join(", ")} (tối đa{" "}
          {MAX_FILE_SIZE / 1024 / 1024}MB)
        </p>
        <p className="text-xs text-muted-foreground">
          Tối đa {maxFiles} file • Đã chọn {files.length}/{maxFiles}
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
              <span className="text-2xl">📄</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => removeFile(index)}
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN MODAL COMPONENT
// ============================================

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateAssignmentModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAssignmentModalProps) {
  const { data: session } = useSession();
  const { createAssignment } = useAssignments();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("Quản trị Mạng 3");
  const [type, setType] = useState("Bài tập");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState(10);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Kiểm tra quyền
  const isTeacher =
    session?.user?.role === "TEACHER" || session?.user?.role === "ADMIN";
  const isAuthenticated = !!session?.user;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubject("Quản trị Mạng 3");
    setType("Bài tập");
    setDueDate("");
    setPoints(10);
    setAttachedFiles([]);
    setIsLoading(false);
  };

  // ✅ Upload file lên Supabase Storage
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `assignments/${session?.user?.id}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("assignments")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        logger.error("Upload error:", uploadError);
        throw new Error(`Không thể upload file: ${file.name}`);
      }

      const { data: urlData } = supabase.storage
        .from("assignments")
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Kiểm tra quyền
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tạo bài tập");
      return;
    }

    if (!isTeacher) {
      toast.error("Bạn không có quyền tạo bài tập");
      return;
    }

    // ✅ Validate form
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả");
      return;
    }
    if (!dueDate) {
      toast.error("Vui lòng chọn hạn nộp");
      return;
    }
    if (new Date(dueDate) < new Date()) {
      toast.error("Hạn nộp phải là thời gian trong tương lai");
      return;
    }
    if (points < 0 || points > 100) {
      toast.error("Điểm số phải từ 0 đến 100");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ Upload files lên Storage
      let uploadedUrls: string[] = [];
      if (attachedFiles.length > 0) {
        const uploadToast = toast.loading(
          `Đang upload ${attachedFiles.length} file...`,
        );
        uploadedUrls = await uploadFiles(attachedFiles);
        toast.dismiss(uploadToast);
      }

      // ✅ Tạo bài tập với danh sách URL
      const result = await createAssignment({
        title: title.trim(),
        description: description.trim(),
        subject,
        type,
        due_date: new Date(dueDate).toISOString(),
        points,
        attachments: uploadedUrls.length,
        attachment_urls: uploadedUrls, // Lưu danh sách URL
        created_by: session.user.id,
      });

      if (result) {
        toast.success(`✅ Đã tạo bài tập "${title}" thành công!`);
        resetForm();
        onSuccess();
        onClose();
      } else {
        toast.error("Không thể tạo bài tập, vui lòng thử lại");
      }
    } catch (error: any) {
      logger.error("Create assignment error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi tạo bài tập");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Nếu không có quyền, không render modal
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
          <Button variant="ghost" size="icon" onClick={onClose}>
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
              placeholder="Nhập tiêu đề..."
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
              placeholder="Nhập mô tả chi tiết..."
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Môn học</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
              <label className="text-sm font-medium mb-2 block">Loại</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Hạn nộp <span className="text-destructive">*</span>
              </label>
              <DateTimePicker
                value={dueDate}
                onChange={setDueDate}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Điểm số</label>
              <Input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                min={0}
                max={100}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              File đính kèm
            </label>
            <FileAttachmentUpload
              files={attachedFiles}
              onFilesChange={setAttachedFiles}
              disabled={isLoading}
              maxFiles={5}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={isLoading || !isTeacher}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {attachedFiles.length > 0 ? "Đang upload..." : "Đang tạo..."}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Tạo bài tập
                </>
              )}
            </Button>
          </div>

          {/* ✅ Hiển thị thông báo nếu không có quyền */}
          {!isTeacher && isAuthenticated && (
            <p className="text-sm text-destructive text-center">
              ⚠️ Bạn không có quyền tạo bài tập. Chỉ Giảng viên và Admin mới
              được phép.
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
