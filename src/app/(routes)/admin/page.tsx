// src/app/(routes)/admin/page.tsx
"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { AnimatePresence, motion } from "framer-motion";
import {
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Crown,
    Edit,
    Filter,
    Home,
    Lock,
    LogOut,
    MoreVertical,
    RefreshCw,
    Search,
    Shield,
    Trash2,
    User,
    UserCog,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  phone: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, color, change }: any) {
  return (
    <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {change && (
              <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                <ChevronRight className="w-3 h-3 rotate-90" />
                {change}
              </p>
            )}
          </div>
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// User Table Row Component
function UserRow({
  user,
  index,
  onEdit,
  onDelete,
  onRoleChange,
}: {
  user: User;
  index: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onRoleChange: (user: User, role: string) => void;
}) {
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

// Edit User Modal
function EditUserModal({
  isOpen,
  user,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setRole(user.role || "STUDENT");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: name.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
          role: role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Cập nhật thông tin thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Họ và tên <span className="text-destructive">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
              className="w-full"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Số điện thoại
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại..."
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Vai trò
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
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
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Nhập giới thiệu..."
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Confirm Delete Modal
function ConfirmDeleteModal({
  isOpen,
  user,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (user: User) => void;
}) {
  if (!isOpen || !user) return null;

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
            onClick={() => onConfirm(user)}
          >
            <Trash2 className="w-4 h-4" />
            Xóa tài khoản
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("Tất cả");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  // Fetch users from database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Redirect nếu không phải admin
  useEffect(() => {
    if (status === "authenticated" && !isAdmin) {
      toast.error("Bạn không có quyền truy cập trang này");
      router.push("/dashboard");
    }
  }, [status, isAdmin, router, toast]);

  // Stats
  const stats = {
    totalUsers: users.length,
    totalAdmins: users.filter((u) => u.role === "ADMIN").length,
    totalTeachers: users.filter((u) => u.role === "TEACHER").length,
    totalStudents: users.filter((u) => u.role === "STUDENT").length,
    activeUsers: users.length,
    newUsers: users.filter(
      (u) =>
        new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ).length,
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "Tất cả" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleRoleChange = async (user: User, newRole: string) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, role: newRole as "ADMIN" | "TEACHER" | "STUDENT" }
            : u,
        ),
      );
      toast.success(`Đã chuyển ${user.name} sang ${newRole}`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thay đổi vai trò");
    }
  };

  const handleConfirmDelete = async (user: User) => {
    try {
      const { error } = await supabase.from("users").delete().eq("id", user.id);

      if (error) throw error;

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success(`Đã xóa tài khoản ${user.name}`);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa tài khoản");
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  // Loading state
  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="space-y-6">
              <Skeleton className="h-12 w-48" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Card className="border-destructive">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <Lock className="w-10 h-10 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Truy cập bị từ chối</h2>
                <p className="text-muted-foreground mb-4">
                  Bạn không có quyền truy cập trang này. Chỉ Admin mới được
                  phép.
                </p>
                <Link href="/dashboard">
                  <Button className="gap-2">
                    <Home className="w-4 h-4" />
                    Về trang chủ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
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
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Làm mới
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatsCard
              title="Tổng người dùng"
              value={stats.totalUsers}
              icon={Users}
              color="from-blue-500 to-blue-600"
              change={`+${stats.newUsers} mới`}
            />
            <StatsCard
              title="Admin"
              value={stats.totalAdmins}
              icon={Crown}
              color="from-red-500 to-red-600"
            />
            <StatsCard
              title="Giảng viên"
              value={stats.totalTeachers}
              icon={Shield}
              color="from-purple-500 to-purple-600"
            />
            <StatsCard
              title="Học sinh"
              value={stats.totalStudents}
              icon={User}
              color="from-green-500 to-green-600"
            />
          </motion.div>

          {/* User Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-primary" />
                  Quản lý tài khoản
                  <Badge variant="secondary" className="ml-2">
                    {filteredUsers.length} tài khoản
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  <Button variant="outline" size="sm" className="gap-2">
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
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="space-y-4 mb-4">
                  <div className="relative flex-1">
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

                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 pt-2">
                          {["Tất cả", "ADMIN", "TEACHER", "STUDENT"].map(
                            (role) => (
                              <Badge
                                key={role}
                                variant={
                                  selectedRole === role ? "default" : "outline"
                                }
                                className="cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => setSelectedRole(role)}
                              >
                                {role === "Tất cả" ? "Tất cả" : role}
                              </Badge>
                            ),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onRoleChange={handleRoleChange}
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
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* Edit Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        user={selectedUser}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          fetchUsers();
        }}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        user={selectedUser}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
