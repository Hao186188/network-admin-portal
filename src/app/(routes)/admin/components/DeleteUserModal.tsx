// src/app/(routes)/admin/components/DeleteUserModal.tsx

"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { AdminUser } from "../types";

interface DeleteUserModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (user: AdminUser) => Promise<boolean>;
}

export function DeleteUserModal({
  user,
  isOpen,
  onClose,
  onConfirm,
}: DeleteUserModalProps) {
  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    await onConfirm(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">Xác nhận xóa</h2>
          <p className="text-muted-foreground mt-2">
            Bạn có chắc chắn muốn xóa tài khoản <br />
            <span className="font-medium text-foreground">{user.name}</span>?
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Email: {user.email}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-2"
            onClick={handleConfirm}
          >
            <Trash2 className="w-4 h-4" />
            Xóa tài khoản
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
