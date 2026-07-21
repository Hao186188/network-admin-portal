// src/app/(routes)/students/[id]/page.tsx
// Vai trò: Trang hồ sơ chi tiết sinh viên

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/db/supabase-client";
import { motion } from "framer-motion";
import {
    Calendar,
    GraduationCap,
    Mail,
    Phone,
    School
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  student_id?: string;
  role: string;
  image?: string;
  bio?: string;
  created_at: string;
}

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id as string;
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", studentId)
          .eq("role", "STUDENT")
          .single();

        if (error) throw error;
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!student) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8 text-center py-12">
            <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Không tìm thấy sinh viên
            </h2>
            <p className="text-muted-foreground">
              Sinh viên không tồn tại hoặc đã bị xóa
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-green-500/20">
                    <AvatarImage src={student.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-3xl">
                      {student.name?.charAt(0).toUpperCase() || "S"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">
                        {student.name || "Chưa cập nhật"}
                      </h1>
                      <Badge className="bg-green-500/10 text-green-500 border-0">
                        🎓 Student
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      @{student.username || "username"}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {student.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {student.email}
                        </span>
                      )}
                      {student.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {student.phone}
                        </span>
                      )}
                      {student.student_id && (
                        <span className="flex items-center gap-1">
                          <School className="w-4 h-4" />
                          {student.student_id}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {student.bio && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold mb-2">Giới thiệu</h3>
                    <p className="text-muted-foreground">{student.bio}</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Tham gia:{" "}
                    {new Date(student.created_at).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
