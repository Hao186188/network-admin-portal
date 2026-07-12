// src/app/(routes)/documents/components/EditDocumentModal.tsx
// FIXED: Sửa lỗi "Cannot coerce the result to a single JSON object"

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Edit2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Document } from "../types";

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onSuccess: () => void;
  onUpdate: (id: string, updates: Partial<Document>) => Promise<any>;
}

const CATEGORIES = [
  "Tài liệu",
  "Giáo trình",
  "Bài giảng",
  "Hướng dẫn",
  "Bài tập",
  "Ôn tập",
  "Đề thi",
];
const SUBJECTS = [
  "Quản trị Mạng 3",
  "Bảo mật Mạng",
  "Linux Server",
  "Mạng máy tính",
  "Python",
  "Docker",
];

export function EditDocumentModal({
  isOpen,
  onClose,
  document,
  onSuccess,
  onUpdate,
}: EditDocumentModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Populate form khi document thay đổi
  useEffect(() => {
    if (document) {
      setTitle(document.title || "");
      setDescription(document.description || "");
      setCategory(document.category || "Tài liệu");
      setSubject(document.subject || "Quản trị Mạng 3");
      setTags((document.tags || []).join(", "));
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    setIsLoading(true);
    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      // ✅ Gọi onUpdate với dữ liệu đã chuẩn bị
      await onUpdate(document.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        subject,
        tags: tagsArray,
      });

      toast.success("Đã cập nhật tài liệu");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Không thể cập nhật tài liệu");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Edit2 className="w-6 h-6 text-cyan-400" /> Chỉnh sửa tài liệu
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/40 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">
              Tiêu đề <span className="text-red-400">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chi tiết..."
              rows={4}
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">
                Danh mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
                disabled={isLoading}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">
                Môn học
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
                disabled={isLoading}
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">
              Thẻ (cách nhau bằng dấu phẩy)
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="VD: CCNA, Cisco, Mạng máy tính"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-white/10 text-white/60 hover:text-white hover:border-white/20"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" /> Cập nhật
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
