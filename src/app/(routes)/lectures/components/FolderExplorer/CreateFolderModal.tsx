// src/app/(routes)/lectures/components/FolderExplorer/CreateFolderModal.tsx
// MODAL TẠO THƯ MỤC - FIXED

"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FolderPlus, Loader2, X } from "lucide-react";
import { useState } from "react";
import { CreateFolderModalProps } from "./types";

export function CreateFolderModal({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
}: CreateFolderModalProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await onCreate(title);
    setTitle("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-cyan-400" />
            Tạo thư mục mới
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">
              Tên thư mục
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên thư mục..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              autoFocus
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              className="flex-1 border-white/10 text-white/60 hover:text-white hover:border-white/20"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button
              className="flex-1 gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              onClick={handleSubmit}
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" /> Tạo
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
