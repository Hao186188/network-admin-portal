// src/app/(routes)/assignments/components/EditAssignmentModal.tsx
// MODAL CHỈNH SỬA BÀI TẬP

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAssignments } from "@/hooks/use-assignments";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronDown, FileText, Save, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ============================================
// CONSTANTS
// ============================================

const TYPE_OPTIONS = [
  { value: "homework", label: "Bài tập" },
  { value: "project", label: "Dự án" },
  { value: "quiz", label: "Kiểm tra" },
  { value: "exam", label: "Thi" },
] as const;

type AssignmentType = "homework" | "project" | "quiz" | "exam";

// ============================================
// CUSTOM SELECT
// ============================================

function CustomSelect({
  value,
  onChange,
  options,
  label,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="text-sm font-medium text-foreground mb-2 block">
        {label}
      </label>
      <div
        className={cn(
          "w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground cursor-pointer flex items-center justify-between transition-all",
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary",
          isOpen && "border-primary ring-2 ring-primary/20",
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-300 flex-shrink-0",
            isOpen && "rotate-180",
          )}
        />
      </div>
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-2xl border border-border z-50 max-h-48 overflow-y-auto"
          >
            {options.map((option) => (
              <button
                key={option}
                className={cn(
                  "w-full px-4 py-2.5 text-left hover:bg-muted transition-colors text-sm",
                  value === option && "bg-primary/10 text-primary font-medium",
                )}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// DATE PICKER
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
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? new Date(value) : new Date(),
  );
  const [selectedTime, setSelectedTime] = useState(
    value ? new Date(value).toTimeString().slice(0, 5) : "23:59",
  );

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++)
      days.push(new Date(year, month, i));
    return days;
  };

  const days = getDaysInMonth(selectedDate);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    const s = new Date(selectedDate);
    return (
      date.getDate() === s.getDate() &&
      date.getMonth() === s.getMonth() &&
      date.getFullYear() === s.getFullYear()
    );
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const newDate = new Date(date);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    newDate.setHours(hours, minutes);
    // ✅ KHÔNG tự động close - chỉ cập nhật date
    onChange(newDate.toISOString());
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

  return (
    <div className="relative">
      <div
        className={cn(
          "w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground cursor-pointer flex items-center justify-between",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-primary transition-colors",
        )}
      >
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          {value ? new Date(value).toLocaleString("vi-VN") : "Chọn thời gian"}
        </span>
      </div>

      {/* Date selection - always visible when editing */}
      <div className="mt-2 bg-background rounded-2xl shadow-2xl border border-border p-4 min-w-[320px]">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeMonth(-1)}
            className="hover:bg-muted"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
          </Button>
          <span className="font-semibold">
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changeMonth(1)}
            className="hover:bg-muted"
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
              className={cn(
                "text-center py-2 rounded-lg transition-all text-sm",
                !day && "opacity-0 pointer-events-none",
                day && isToday(day) && "border border-primary",
                day &&
                  isSelected(day) &&
                  "bg-primary text-white hover:bg-primary/90",
                day && !isSelected(day) && "hover:bg-muted",
              )}
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
              className="px-3 py-1.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-xs hover:bg-muted"
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
      </div>
    </div>
  );
}

// ============================================
// MAIN MODAL
// ============================================

interface EditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: any;
  onSuccess: () => void;
}

export function EditAssignmentModal({
  isOpen,
  onClose,
  assignment,
  onSuccess,
}: EditAssignmentModalProps) {
  const { data: session } = useSession();
  const { updateAssignment } = useAssignments();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<AssignmentType>("homework");
  const [dueDate, setDueDate] = useState("");
  const [points, setPoints] = useState(10);
  const [maxSubmissions, setMaxSubmissions] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(false);

  const isTeacher =
    session?.user?.role === "TEACHER" || session?.user?.role === "ADMIN";

  const subjectOptions = [
    "Quản trị Mạng 3",
    "Bảo mật Mạng",
    "Linux Server",
    "Mạng máy tính",
    "Python",
    "Docker",
    "Network Automation",
  ];

  const typeLabels = TYPE_OPTIONS.map((t) => t.label);

  // ✅ Load dữ liệu từ assignment
  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title || "");
      setDescription(assignment.description || "");
      setSubject(assignment.subject || "Quản trị Mạng 3");
      setType(assignment.type || "homework");
      setDueDate(assignment.due_date || "");
      setPoints(assignment.points || 10);
      setMaxSubmissions(assignment.max_submissions || 0);
      setTotalStudents(assignment.total_students || 7);
    }
  }, [assignment]);

  const getTypeValueFromLabel = (label: string): AssignmentType => {
    const found = TYPE_OPTIONS.find((t) => t.label === label);
    return found?.value || "homework";
  };

  const getTypeLabelFromValue = (value: AssignmentType): string => {
    const found = TYPE_OPTIONS.find((t) => t.value === value);
    return found?.label || "Bài tập";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isTeacher) {
      toast.error("Bạn không có quyền chỉnh sửa bài tập");
      return;
    }

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
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
      const result = await updateAssignment(assignment.id, {
        title: title.trim(),
        description: description.trim(),
        subject,
        type,
        due_date: new Date(dueDate).toISOString(),
        points,
        max_submissions: maxSubmissions || 0,
        total_students: totalStudents || 7,
      });

      if (result) {
        toast.success(`✅ Đã cập nhật bài tập "${title}" thành công!`);
        onSuccess();
        onClose();
      } else {
        toast.error("Không thể cập nhật bài tập, vui lòng thử lại");
      }
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi cập nhật bài tập");
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Chỉnh sửa bài tập
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
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
              className="focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
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

          {/* Subject & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelect
              value={subject}
              onChange={setSubject}
              options={subjectOptions}
              label="Môn học"
              disabled={isLoading}
            />
            <CustomSelect
              value={getTypeLabelFromValue(type)}
              onChange={(label) => setType(getTypeValueFromLabel(label))}
              options={typeLabels}
              label="Loại"
              disabled={isLoading}
            />
          </div>

          {/* Due Date & Points & Max Submissions & Total Students */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                min={0}
                max={100}
                disabled={isLoading}
                className="focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Giới hạn sinh viên
              </label>
              <Input
                type="number"
                value={maxSubmissions}
                onChange={(e) => setMaxSubmissions(Number(e.target.value))}
                min={0}
                placeholder="0 = không giới hạn"
                disabled={isLoading}
                className="focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                0 = không giới hạn
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Tổng số sinh viên
              </label>
              <Input
                type="number"
                value={totalStudents}
                onChange={(e) => setTotalStudents(Number(e.target.value))}
                min={1}
                disabled={isLoading}
                className="focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Actions */}
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
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              disabled={isLoading || !isTeacher}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
