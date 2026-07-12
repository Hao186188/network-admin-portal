// src/app/(routes)/admin/components/UserRow.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, Edit, MoreVertical, Shield, Trash2, User } from "lucide-react";
import { useState } from "react";
import { AdminUser } from "../types";

interface UserRowProps {
  user: AdminUser;
  index: number;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onRoleChange: (user: AdminUser, role: string) => void;
}

export function UserRow({
  user,
  index,
  onEdit,
  onDelete,
  onRoleChange,
}: UserRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getRoleBadge = (role: string) => {
    const config = {
      ADMIN: { color: "bg-red-500 text-white", icon: Crown, label: "Admin" },
      TEACHER: {
        color: "bg-blue-500 text-white",
        icon: Shield,
        label: "Giảng viên",
      },
      STUDENT: {
        color: "bg-green-500 text-white",
        icon: User,
        label: "Học sinh",
      },
    };
    const {
      color,
      icon: Icon,
      label,
    } = config[role as keyof typeof config] || config.STUDENT;
    return (
      <Badge className={`${color} border-0 gap-1`}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="border-b border-border hover:bg-muted/50 transition-colors"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground">
        {new Date(user.created_at).toLocaleDateString("vi-VN")}
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">
        {user.phone || "Chưa cập nhật"}
      </td>
      <td className="py-3 px-4 text-right">
        <div className="relative inline-block">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 mt-2 w-48 bg-background rounded-xl shadow-2xl border border-border overflow-hidden z-50"
              >
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                  onClick={() => {
                    onEdit(user);
                    setIsMenuOpen(false);
                  }}
                >
                  <Edit className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Chỉnh sửa</span>
                </button>
                <div className="border-t border-border">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                    onClick={() => {
                      onRoleChange(user, "ADMIN");
                      setIsMenuOpen(false);
                    }}
                  >
                    <Crown className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Chuyển Admin</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                    onClick={() => {
                      onRoleChange(user, "TEACHER");
                      setIsMenuOpen(false);
                    }}
                  >
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Chuyển Giảng viên</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                    onClick={() => {
                      onRoleChange(user, "STUDENT");
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Chuyển Học sinh</span>
                  </button>
                </div>
                <div className="border-t border-border">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
                    onClick={() => {
                      onDelete(user);
                      setIsMenuOpen(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                    <span className="text-sm text-destructive">
                      Xóa tài khoản
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </td>
    </motion.tr>
  );
}
