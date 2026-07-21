// src/app/(routes)/teachers/[id]/page.tsx
// Vai trò: Trang hồ sơ chi tiết giáo viên

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/db/supabase-client";
import { motion } from "framer-motion";
import { Calendar, Mail, Phone, UserCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  role: string;
  image?: string;
  bio?: string;
  created_at: string;
}

export default function TeacherProfilePage() {
  const params = useParams();
  const teacherId = params.id as string;
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", teacherId)
          .eq("role", "TEACHER")
          .single();

        if (error) throw error;
        setTeacher(data);
      } catch (error) {
        console.error("Error fetching teacher:", error);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacher();
    }
  }, [teacherId]);

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

  if (!teacher) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8 text-center py-12">
            <UserCheck className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Không tìm thấy giáo viên
            </h2>
            <p className="text-muted-foreground">
              Giáo viên không tồn tại hoặc đã bị xóa
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Admin không được hiển thị trong trang giáo viên
  const isAdmin = false;

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
                  <Avatar className="w-24 h-24 border-4 border-blue-500/20">
                    <AvatarImage src={teacher.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl">
                      {teacher.name?.charAt(0).toUpperCase() || "G"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">
                        {teacher.name || "Chưa cập nhật"}
                      </h1>
                      <Badge className="bg-blue-500/10 text-blue-500 border-0">
                        👨‍🏫 Teacher
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      @{teacher.username || "username"}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {teacher.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {teacher.email}
                        </span>
                      )}
                      {teacher.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {teacher.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {teacher.bio && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-sm font-semibold mb-2">Giới thiệu</h3>
                    <p className="text-muted-foreground">{teacher.bio}</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Tham gia:{" "}
                    {new Date(teacher.created_at).toLocaleDateString("vi-VN")}
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
