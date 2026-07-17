// src/app/(routes)/admin/components/EditUserModal.tsx
// HOÀN CHỈNH - FIX TYPE ERROR

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { CheckCircle, UserCog, X } from "lucide-react";
import { useState } from "react";
import { AdminUser } from "../types";

interface EditUserModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<AdminUser>) => Promise<boolean>;
}

export function EditUserModal({
  user,
  isOpen,
  onClose,
  onSave,
}: EditUserModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const bio = formData.get("bio") as string;
    const role = formData.get("role") as string;

    if (!name.trim()) return;

    setLoading(true);
    try {
      // ✅ Chỉ gửi các field có giá trị
      const updateData: Partial<AdminUser> = {
        name: name.trim(),
        role: role as any,
      };

      if (phone?.trim()) {
        updateData.phone = phone.trim();
      }

      if (bio?.trim()) {
        updateData.bio = bio.trim();
      }

      const success = await onSave(user.id, updateData);
      if (success) onClose();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <UserCog className="w-6 h-6 text-primary" />
            Chỉnh sửa tài khoản
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-4 p-4 rounded-xl bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Đang chỉnh sửa:{" "}
            <span className="font-medium text-foreground">{user.email}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tên đăng nhập: @{user.username}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Họ và tên <span className="text-destructive">*</span>
            </label>
            <Input
              name="name"
              defaultValue={user.name}
              placeholder="Nhập tên..."
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Số điện thoại
            </label>
            <Input
              name="phone"
              defaultValue={user.phone || ""}
              placeholder="Nhập số điện thoại..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Vai trò
            </label>
            <select
              name="role"
              defaultValue={user.role}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ADMIN">👑 Admin</option>
              <option value="TEACHER">👨‍🏫 Giảng viên</option>
              <option value="STUDENT">👨‍🎓 Học sinh</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Giới thiệu
            </label>
            <textarea
              name="bio"
              defaultValue={user.bio || ""}
              placeholder="Nhập giới thiệu..."
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={loading}>
              <CheckCircle className="w-4 h-4" />
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
