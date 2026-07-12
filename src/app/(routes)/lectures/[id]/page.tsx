// src/app/(routes)/lectures/[id]/page.tsx
// TRANG CHI TIẾT BÀI GIẢNG - HOÀN CHỈNH

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLectures } from "@/hooks/useLectures";
import { formatRelativeTime } from "@/lib/utils";
import { ArrowLeft, Calendar, Eye, Heart, Play, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LectureDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { useLecture, incrementView } = useLectures();
  const { data: lecture, isLoading, error } = useLecture(id as string);

  // ✅ Tăng view khi xem - incrementView đã là function, gọi trực tiếp
  useEffect(() => {
    if (id) {
      incrementView(id as string);
    }
  }, [id, incrementView]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20">
          <div className="max-w-4xl mx-auto p-4">
            <Skeleton className="h-12 w-32 mb-4" />
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !lecture) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20">
          <div className="max-w-4xl mx-auto p-4 text-center">
            <h2 className="text-2xl font-bold">Không tìm thấy bài giảng</h2>
            <Button onClick={() => router.back()} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>

          <Card className="overflow-hidden">
            {/* Thumbnail - Click để mở video */}
            {lecture.thumbnail && (
              <div
                className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center cursor-pointer relative group"
                onClick={() => {
                  if (lecture.video_url) {
                    window.open(lecture.video_url, "_blank");
                  }
                }}
              >
                <img
                  src={lecture.thumbnail}
                  alt={lecture.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {lecture.video_url && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <CardContent className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold">
                {lecture.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {lecture.teacher}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatRelativeTime(lecture.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {lecture.views || 0} lượt xem
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {lecture.likes || 0} lượt thích
                </span>
                {lecture.duration && (
                  <span className="px-2 py-1 rounded-full bg-muted text-xs">
                    {lecture.duration}
                  </span>
                )}
              </div>

              <div className="mt-6 prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground">{lecture.description}</p>
                {lecture.content && (
                  <div dangerouslySetInnerHTML={{ __html: lecture.content }} />
                )}
              </div>

              {lecture.tags && lecture.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {lecture.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {lecture.video_url && (
                <div className="mt-6">
                  <Button
                    className="gap-2"
                    onClick={() => window.open(lecture.video_url, "_blank")}
                  >
                    <Play className="w-4 h-4" />
                    Xem video
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
