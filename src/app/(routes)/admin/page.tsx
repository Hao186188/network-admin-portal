// src/app/(routes)/admin/page.tsx
// TRANG ADMIN - HOÀN CHỈNH

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Components
import { AdminHeader } from "./components/AdminHeader";
import { AdminStats } from "./components/AdminStats";
import { DeleteUserModal } from "./components/DeleteUserModal";
import { EditUserModal } from "./components/EditUserModal";
import { UserTable } from "./components/UserTable";
import { useAdminUsers } from "./hooks/useAdminUsers";
import { AdminUser } from "./types";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    users,
    loading,
    error,
    refresh,
    updateUser,
    deleteUser,
    changeRole,
    getStats,
  } = useAdminUsers();
  const stats = getStats();

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  // ✅ Debug logs
  useEffect(() => {
    if (users.length > 0 || !loading) {
      console.log("🔍 [AdminPage] Users:", users.length, "Loading:", loading);
    }
  }, [users.length, loading]);

  // ✅ Kiểm tra quyền - CHỈ CHẠY 1 LẦN
  useEffect(() => {
    if (status === "authenticated" && !isAdmin) {
      toast.error("Bạn không có quyền truy cập trang này");
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // ✅ Chỉ phụ thuộc vào status

  // ✅ Handlers với useCallback
  const handleLogout = useCallback(() => {
    // signOut({ callbackUrl: "/login" });
  }, []);

  const handleEdit = useCallback((user: AdminUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  }, []);

  const handleRoleChange = useCallback(
    async (user: AdminUser, role: string) => {
      await changeRole(user.id, role);
    },
    [changeRole],
  );

  const handleAddUser = useCallback(() => {
    router.push("/register");
  }, [router]);

  // ✅ Memoize components
  const adminHeader = useMemo(
    () => (
      <AdminHeader
        loading={loading}
        onRefresh={refresh}
        onLogout={handleLogout}
      />
    ),
    [loading, refresh, handleLogout],
  );

  const adminStats = useMemo(
    () => <AdminStats stats={stats} loading={loading} />,
    [stats, loading],
  );

  const userTable = useMemo(
    () => (
      <UserTable
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRoleChange={handleRoleChange}
        onAddUser={handleAddUser}
      />
    ),
    [users, loading, handleEdit, handleDelete, handleRoleChange, handleAddUser],
  );

  // ✅ Loading state
  if (status === "loading" || (loading && users.length === 0)) {
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

  // ✅ Not admin
  if (!session || !isAdmin) {
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

  // ✅ Success state
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {adminHeader}
          {adminStats}

          <Card>
            <CardContent className="p-6">{userTable}</CardContent>
          </Card>
        </div>
      </div>
      <Footer />

      {/* Modals */}
      <EditUserModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={updateUser}
      />

      <DeleteUserModal
        user={selectedUser}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={async (user) => {
          const success = await deleteUser(user.id);
          if (success) {
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
          }
          return success;
        }}
      />
    </>
  );
}
