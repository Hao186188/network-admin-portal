// src/app/(routes)/announcements/components/CreateAnnouncementModal.tsx
// Vai trò: Modal tạo thông báo - FIXED

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Bell, Pin, Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateAnnouncementModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAnnouncementModalProps) {
  const { toast } = useToast();
  const { createAnnouncement } = useAnnouncements();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Thông báo");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [pinned, setPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    if (!session?.user) {
      toast.error("Vui lòng đăng nhập để tạo thông báo");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ Gọi createAnnouncement và không kiểm tra result vì nó trả về void
      await createAnnouncement({
        title: title.trim(),
        content: content.trim(),
        priority,
        pinned,
        category,
      });

      // ✅ Luôn hiển thị thành công nếu không có lỗi
      toast.success("✅ Đã tạo thông báo thành công!");
      onSuccess();
      onClose();
      setTitle("");
      setContent("");
      setCategory("Thông báo");
      setPriority("medium");
      setPinned(false);
    } catch (error: any) {
      console.error("Create error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi tạo thông báo");
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
        className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 border border-slate-800 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" />
            Tạo thông báo mới
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Tiêu đề <span className="text-red-400">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề thông báo..."
              className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Nội dung <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung thông báo..."
              rows={5}
              className="w-full px-4 py-2 rounded-xl border bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Danh mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border bg-slate-800 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                disabled={isLoading}
              >
                {[
                  "Thông báo",
                  "Thi cử",
                  "Phòng máy",
                  "Bài tập",
                  "Hướng dẫn",
                  "Sự kiện",
                  "Khác",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className="w-full px-4 py-2 rounded-xl border bg-slate-800 border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                disabled={isLoading}
              >
                <option value="high">🔴 Quan trọng</option>
                <option value="medium">🟡 Bình thường</option>
                <option value="low">🔵 Thấp</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                pinned
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                  : "border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
              disabled={isLoading}
            >
              <Pin className={`w-4 h-4 ${pinned ? "fill-cyan-400" : ""}`} />
              {pinned ? "Đã ghim" : "Ghim thông báo"}
            </button>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
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
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Đăng thông báo
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
