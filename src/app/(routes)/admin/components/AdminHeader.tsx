// src/app/(routes)/admin/components/AdminHeader.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Crown, LogOut, RefreshCw, Users } from "lucide-react";

interface AdminHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

export function AdminHeader({
  loading,
  onRefresh,
  onLogout,
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent flex items-center gap-3">
          <Crown className="w-8 h-8 text-primary" />
          Quản trị hệ thống
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Quản lý tài khoản và cấu hình hệ thống
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="outline"
          className="gap-2"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
        <Button variant="outline" className="gap-2" onClick={onLogout}>
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}
