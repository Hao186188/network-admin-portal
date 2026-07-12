// src/app/(routes)/admin/components/UserTable.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Filter, Search, UserPlus, Users, X } from "lucide-react";
import { useState } from "react";
import { AdminUser } from "../types";
import { UserRow } from "./UserRow";

interface UserTableProps {
  users: AdminUser[];
  loading?: boolean;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onRoleChange: (user: AdminUser, role: string) => void;
  onAddUser: () => void;
}

export function UserTable({
  users,
  loading = false,
  onEdit,
  onDelete,
  onRoleChange,
  onAddUser,
}: UserTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("Tất cả");
  const [showFilters, setShowFilters] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "Tất cả" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // ✅ Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Quản lý tài khoản</span>
          <Badge variant="secondary" className="ml-2">
            {filteredUsers.length} tài khoản
          </Badge>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onAddUser}
          >
            <UserPlus className="w-4 h-4" />
            Thêm tài khoản
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Lọc
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-12"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setSearchQuery("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="flex flex-wrap gap-2 pt-2 pb-4 border-b border-border">
              {["Tất cả", "ADMIN", "TEACHER", "STUDENT"].map((role) => (
                <Badge
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedRole(role)}
                >
                  {role === "Tất cả" ? "Tất cả" : role}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Người dùng
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Vai trò
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Ngày tạo
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                SĐT
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <UserRow
                key={user.id}
                user={user}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onRoleChange={onRoleChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">
            Không tìm thấy tài khoản
          </h3>
          <p className="text-muted-foreground">
            Không có tài khoản nào phù hợp với tìm kiếm
          </p>
        </div>
      )}
    </div>
  );
}
