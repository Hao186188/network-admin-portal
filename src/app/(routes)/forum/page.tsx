// src/app/(routes)/forum/page.tsx
// Vai trò: Trang diễn đàn - SỬ DỤNG COMPONENTS MỚI

"use client";

import { ForumFilters } from "@/components/forum/ForumFilters";
import { ForumPageHero } from "@/components/forum/ForumPageHero";
import { ForumSkeleton } from "@/components/forum/ForumSkeleton";
import { OnboardingGuide } from "@/components/forum/OnboardingGuide";
import { PostCardEnhanced } from "@/components/forum/PostCardEnhanced";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useForum } from "@/hooks/use-forum";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { MessageCircle, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const categories = [
  "Tất cả",
  "Thảo luận",
  "Hỏi đáp",
  "Chia sẻ",
  "Thông báo",
  "Kinh nghiệm",
  "Dự án",
];

export default function ForumPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { posts, loading, error, totalPosts, fetchPosts, toggleLike } =
    useForum();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [showGuide, setShowGuide] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalReplies: 0,
    totalMembers: 0,
    totalLikes: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const totalReplies = posts.reduce((acc, p) => acc + p.replies, 0);
      const totalLikes = posts.reduce((acc, p) => acc + p.likes, 0);
      setStats({
        totalPosts: posts.length,
        totalReplies,
        totalMembers: new Set(posts.map((p) => p.author_id)).size,
        totalLikes,
      });
    }
  }, [posts, mounted]);

  const handleFilter = () => {
    fetchPosts({
      category: selectedCategory === "Tất cả" ? undefined : selectedCategory,
      search: searchQuery || undefined,
    });
  };

  const handleLike = async (postId: string) => {
    await toggleLike(postId);
  };

  const handleCreatePost = () => {
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập để tạo bài viết");
      router.push("/login");
      return;
    }
    router.push("/forum/create");
  };

  if (!mounted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <ForumSkeleton />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <OnboardingGuide page="forum" onComplete={() => setShowGuide(false)} />
        <ForumPageHero stats={stats} onCreatePost={handleCreatePost} />

        <div
          className="max-w-7xl mx-auto p-4 md:p-8 space-y-6"
          id="search-section"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Bài viết</h2>
              {!loading && (
                <Badge variant="secondary" className="text-sm animate-pulse">
                  {totalPosts} bài viết
                </Badge>
              )}
            </div>
            <Button
              onClick={handleCreatePost}
              className="gap-2 w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              Tạo bài viết mới
            </Button>
          </motion.div>

          <ForumFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onFilter={handleFilter}
            categories={categories}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            {loading ? (
              <ForumSkeleton />
            ) : error ? (
              <Card className="border-destructive">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-destructive opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    Lỗi tải dữ liệu
                  </h3>
                  <p className="text-muted-foreground">{error}</p>
                  <Button className="mt-4" onClick={handleFilter}>
                    Thử lại
                  </Button>
                </CardContent>
              </Card>
            ) : posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                  <MessageCircle className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery || selectedCategory !== "Tất cả"
                    ? "Không tìm thấy bài viết"
                    : "Chưa có bài viết nào"}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory !== "Tất cả"
                    ? "Hãy thử tìm kiếm với từ khóa khác"
                    : "Hãy là người đầu tiên tạo bài viết"}
                </p>
                <Button className="mt-4 gap-2" onClick={handleCreatePost}>
                  <Plus className="w-4 h-4" />
                  Tạo bài viết mới
                </Button>
              </motion.div>
            ) : (
              posts.map((post, index) => (
                <PostCardEnhanced
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  index={index}
                />
              ))
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
