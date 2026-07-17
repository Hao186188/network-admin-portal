// src/app/(routes)/admin/page.tsx
// Vai trò: Trang quản trị - HOÀN CHỈNH

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Check,
  Crown,
  Edit,
  Loader2,
  Search,
  Trash2,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminUsers } from "./hooks/useAdminUsers";
import { AdminUser } from "./types";

// ============================================
// STATS CARD COMPONENT
// ============================================

function StatsCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-white mt-1">
              {value}
            </p>
          </div>
          <div
            className={cn(
              "p-3 rounded-xl",
              color === "blue" && "bg-blue-500/20 text-blue-400",
              color === "green" && "bg-green-500/20 text-green-400",
              color === "yellow" && "bg-yellow-500/20 text-yellow-400",
              color === "purple" && "bg-purple-500/20 text-purple-400",
              color === "red" && "bg-red-500/20 text-red-400",
              color === "cyan" && "bg-cyan-500/20 text-cyan-400",
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// MAIN ADMIN PAGE
// ============================================

export default function AdminPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { users, loading, refresh, changeRole, deleteUser, getStats } =
    useAdminUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check admin permission
  const isAdmin = useMemo(() => {
    return session?.user?.role?.toUpperCase() === "ADMIN";
  }, [session?.user?.role]);

  useEffect(() => {
    if (mounted && status !== "loading" && !isAdmin) {
      router.push("/dashboard");
    }
  }, [mounted, status, isAdmin, router]);

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.username?.toLowerCase().includes(query) ||
        u.phone?.includes(query),
    );
  }, [users, searchQuery]);

  // Stats
  const stats = useMemo(() => getStats(), [getStats]);

  // Edit user
  const handleEditUser = useCallback((user: AdminUser) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  }, []);

  // Save edit
  const handleSaveEdit = useCallback(async () => {
    if (!editingUser) return;

    const success = await changeRole(editingUser.id, editingUser.role);
    if (success) {
      setIsEditDialogOpen(false);
      setEditingUser(null);
    }
  }, [editingUser, changeRole]);

  // Delete user
  const handleDeleteUser = useCallback(async () => {
    if (!selectedUserId) return;
    const success = await deleteUser(selectedUserId);
    if (success) {
      setIsDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  }, [selectedUserId, deleteUser]);

  // Change role directly
  const handleChangeRole = useCallback(
    async (userId: string, newRole: string) => {
      setIsChangingRole(true);
      try {
        await changeRole(userId, newRole);
      } finally {
        setIsChangingRole(false);
      }
    },
    [changeRole],
  );

  // Get role color
  const getRoleColor = useCallback((role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "bg-red-500/20 text-red-400 border-red-500/20";
      case "TEACHER":
        return "bg-blue-500/20 text-blue-400 border-blue-500/20";
      case "STUDENT":
        return "bg-green-500/20 text-green-400 border-green-500/20";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/20";
    }
  }, []);

  // Get role label
  const getRoleLabel = useCallback((role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "👑 Admin";
      case "TEACHER":
        return "👨‍🏫 Teacher";
      case "STUDENT":
        return "🎓 Student";
      default:
        return "👤 User";
    }
  }, []);

  if (!mounted || status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-16 md:pt-20">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <Crown className="w-7 h-7 text-yellow-400" />
                Quản trị hệ thống
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Quản lý người dùng và vai trò trong hệ thống
              </p>
            </div>
            <Button
              onClick={refresh}
              variant="outline"
              className="border-white/10 text-white/60 hover:text-white hover:border-white/20"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <span>🔄 Làm mới</span>
              )}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Tổng người dùng"
              value={stats.totalUsers}
              icon={Users}
              color="blue"
            />
            <StatsCard
              title="Admin"
              value={stats.totalAdmins}
              icon={Crown}
              color="red"
            />
            <StatsCard
              title="Giáo viên"
              value={stats.totalTeachers}
              icon={UserCog}
              color="cyan"
            />
            <StatsCard
              title="Học sinh"
              value={stats.totalStudents}
              icon={UserCheck}
              color="green"
            />
          </div>

          {/* Users Table */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="border-b border-white/5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <CardTitle className="text-white text-lg font-medium">
                  Danh sách người dùng
                </CardTitle>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-white/40 font-medium">
                      Người dùng
                    </TableHead>
                    <TableHead className="text-white/40 font-medium hidden md:table-cell">
                      Email
                    </TableHead>
                    <TableHead className="text-white/40 font-medium hidden lg:table-cell">
                      Số điện thoại
                    </TableHead>
                    <TableHead className="text-white/40 font-medium">
                      Vai trò
                    </TableHead>
                    <TableHead className="text-white/40 font-medium text-right">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-8 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-24 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-white/40"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-12 h-12 text-white/20" />
                          <p>Không tìm thấy người dùng</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">
                                {user.name || "Chưa cập nhật"}
                              </p>
                              <p className="text-white/30 text-xs">
                                @{user.username || "username"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-white/60 text-sm">
                            {user.email}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-white/40 text-sm">
                            {user.phone || "---"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "border text-xs font-medium",
                              getRoleColor(user.role),
                            )}
                          >
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-white/5"
                                  disabled={isChangingRole}
                                >
                                  <UserCog className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-slate-900 border-white/10">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleChangeRole(user.id, "STUDENT")
                                  }
                                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                                  disabled={user.role === "STUDENT"}
                                >
                                  <span className="mr-2">🎓</span> Học sinh
                                  {user.role === "STUDENT" && (
                                    <Check className="w-4 h-4 ml-2 text-green-400" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleChangeRole(user.id, "TEACHER")
                                  }
                                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                                  disabled={user.role === "TEACHER"}
                                >
                                  <span className="mr-2">👨‍🏫</span> Giáo viên
                                  {user.role === "TEACHER" && (
                                    <Check className="w-4 h-4 ml-2 text-blue-400" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleChangeRole(user.id, "ADMIN")
                                  }
                                  className="text-white/70 hover:text-white hover:bg-white/5 cursor-pointer"
                                  disabled={user.role === "ADMIN"}
                                >
                                  <span className="mr-2">👑</span> Admin
                                  {user.role === "ADMIN" && (
                                    <Check className="w-4 h-4 ml-2 text-red-400" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-white/40 hover:text-cyan-400 hover:bg-white/5"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-white/40 hover:text-red-400 hover:bg-white/5"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Chỉnh sửa người dùng
            </DialogTitle>
            <DialogDescription className="text-white/40">
              Thay đổi vai trò cho người dùng
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-white/60">Tên</Label>
                <Input
                  value={editingUser.name || ""}
                  disabled
                  className="bg-white/5 border-white/10 text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60">Tên đăng nhập</Label>
                <Input
                  value={editingUser.username || ""}
                  disabled
                  className="bg-white/5 border-white/10 text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60">Email</Label>
                <Input
                  value={editingUser.email}
                  disabled
                  className="bg-white/5 border-white/10 text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60">Vai trò hiện tại</Label>
                <Badge
                  className={cn(
                    "border text-xs font-medium",
                    getRoleColor(editingUser.role),
                  )}
                >
                  {getRoleLabel(editingUser.role)}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-white/60">Vai trò mới</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) =>
                    setEditingUser({
                      ...editingUser,
                      role: value as "ADMIN" | "TEACHER" | "STUDENT",
                    })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="STUDENT">🎓 Học sinh</SelectItem>
                    <SelectItem value="TEACHER">👨‍🏫 Giáo viên</SelectItem>
                    <SelectItem value="ADMIN">👑 Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingUser(null);
              }}
              className="border-white/10 text-white/60 hover:text-white hover:border-white/20"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-400">
              Xác nhận xóa
            </DialogTitle>
            <DialogDescription className="text-white/40">
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUserId(null);
              }}
              className="border-white/10 text-white/60 hover:text-white hover:border-white/20"
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
