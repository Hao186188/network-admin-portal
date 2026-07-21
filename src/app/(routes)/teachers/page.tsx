// src/app/(routes)/teachers/page.tsx
// Vai trò: Trang danh sách giáo viên và sinh viên

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/db/supabase-client";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Mail,
  Phone,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  student_id?: string;
  role: string;
  image?: string;
  created_at: string;
}

export default function TeachersPage() {
  const { data: session } = useSession();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"teachers" | "students">(
    "teachers",
  );

  // ✅ Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Fetch teachers only (exclude ADMIN)
        const { data: teachersData, error: teachersError } = await supabase
          .from("users")
          .select("*")
          .eq("role", "TEACHER")
          .order("created_at", { ascending: false });

        if (teachersError) throw teachersError;

        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from("users")
          .select("*")
          .eq("role", "STUDENT")
          .order("created_at", { ascending: false });

        if (studentsError) throw studentsError;

        setTeachers(teachersData || []);
        setStudents(studentsData || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchUsers();
    }
  }, [session]);

  // ✅ Filter users based on search
  const filterUsers = (users: User[]) => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query) ||
        user.student_id?.toLowerCase().includes(query),
    );
  };

  const filteredTeachers = filterUsers(teachers);
  const filteredStudents = filterUsers(students);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                  Giáo viên & Sinh viên
                </h1>
                <p className="text-muted-foreground mt-1">
                  Quản lý và theo dõi giáo viên, sinh viên trong hệ thống
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng giáo viên
                    </p>
                    <p className="text-3xl font-bold text-blue-500 mt-1">
                      {teachers.length}
                    </p>
                  </div>
                  <UserCheck className="w-8 h-8 text-blue-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng sinh viên
                    </p>
                    <p className="text-3xl font-bold text-green-500 mt-1">
                      {students.length}
                    </p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng người dùng
                    </p>
                    <p className="text-3xl font-bold text-purple-500 mt-1">
                      {teachers.length + students.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500/20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, username, mã sinh viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex gap-2 border-b border-border">
              <Button
                variant={activeTab === "teachers" ? "default" : "ghost"}
                onClick={() => setActiveTab("teachers")}
                className="gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Giáo viên ({filteredTeachers.length})
              </Button>
              <Button
                variant={activeTab === "students" ? "default" : "ghost"}
                onClick={() => setActiveTab("students")}
                className="gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                Sinh viên ({filteredStudents.length})
              </Button>
            </div>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : activeTab === "teachers" ? (
            filteredTeachers.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <UserCheck className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Không tìm thấy giáo viên
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Thử tìm kiếm với từ khóa khác"
                      : "Chưa có giáo viên nào trong hệ thống"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeachers.map((teacher, index) => (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/teachers/${teacher.id}`}>
                      <Card className="hover:shadow-lg transition-all duration-200 hover:border-primary/20 cursor-pointer h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16 border-2 border-blue-500/20">
                              <AvatarImage src={teacher.image || undefined} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                                {teacher.name?.charAt(0).toUpperCase() || "G"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate">
                                {teacher.name || "Chưa cập nhật"}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">
                                @{teacher.username || "username"}
                              </p>
                              <Badge
                                className={`mt-2 border-0 text-xs ${
                                  teacher.role === "ADMIN"
                                    ? "bg-red-500/10 text-red-500"
                                    : "bg-blue-500/10 text-blue-500"
                                }`}
                              >
                                {teacher.role === "ADMIN"
                                  ? "👑 Admin"
                                  : "👨‍🏫 Teacher"}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            {teacher.email && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">
                                  {teacher.email}
                                </span>
                              </div>
                            )}
                            {teacher.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span>{teacher.phone}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              Tham gia:{" "}
                              {new Date(teacher.created_at).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )
          ) : filteredStudents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Không tìm thấy sinh viên
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Thử tìm kiếm với từ khóa khác"
                    : "Chưa có sinh viên nào trong hệ thống"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/students/${student.id}`}>
                    <Card className="hover:shadow-lg transition-all duration-200 hover:border-primary/20 cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16 border-2 border-green-500/20">
                            <AvatarImage src={student.image || undefined} />
                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl">
                              {student.name?.charAt(0).toUpperCase() || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">
                              {student.name || "Chưa cập nhật"}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              @{student.username || "username"}
                            </p>
                            <Badge className="mt-2 bg-green-500/10 text-green-500 border-0 text-xs">
                              🎓 Student
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          {student.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{student.email}</span>
                            </div>
                          )}
                          {student.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              <span>{student.phone}</span>
                            </div>
                          )}
                          {student.student_id && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <GraduationCap className="w-4 h-4" />
                              <span>{student.student_id}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            Tham gia:{" "}
                            {new Date(student.created_at).toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
