// src/app/(routes)/documents/components/FileExplorer/NewFolderModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { FolderPlus, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../../../lib/utils";
import { NewFolderModalProps } from "./types";

export function NewFolderModal({
  isOpen,
  onClose,
  onCreate,
}: NewFolderModalProps) {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Vui lòng nhập tên thư mục");
      return;
    }

    setIsLoading(true);
    try {
      await onCreate(title);
      setTitle("");
      setError(null);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi tạo thư mục");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-cyan-400" />
            Tạo thư mục mới
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
              Tên thư mục
            </label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="Nhập tên thư mục..."
              className={cn(
                "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50",
                error && "border-red-500/50 focus:border-red-500",
              )}
              autoFocus
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
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
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" /> Tạo
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
