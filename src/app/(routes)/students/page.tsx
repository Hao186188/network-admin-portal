// src/app/(routes)/students/page.tsx
// Vai trò: Trang danh sách sinh viên

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/db/supabase-client";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Phone, Search, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Student {
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

export default function StudentsPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);

        // Check if user is admin
        if (session?.user?.role === "ADMIN") {
          setIsAdmin(true);
        }

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("role", "STUDENT")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setStudents(data || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchStudents();
    }
  }, [session]);

  // ✅ Filter students based on search
  const filteredStudents = students.filter((student) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.username?.toLowerCase().includes(query) ||
      student.student_id?.toLowerCase().includes(query)
    );
  });

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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                  Danh sách Sinh viên
                </h1>
                <p className="text-muted-foreground mt-1">
                  Quản lý và theo dõi sinh viên trong hệ thống
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
                      Đang hiển thị
                    </p>
                    <p className="text-3xl font-bold text-blue-500 mt-1">
                      {filteredStudents.length}
                    </p>
                  </div>
                  <User className="w-8 h-8 text-blue-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Vai trò</p>
                    <p className="text-3xl font-bold text-purple-500 mt-1">
                      🎓 Student
                    </p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-0">
                    STUDENT
                  </Badge>
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
                placeholder="Tìm kiếm sinh viên theo tên, email, username, mã sinh viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </motion.div>

          {/* Students Grid */}
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
