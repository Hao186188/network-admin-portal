// src/app/(routes)/forum/page.tsx
// Vai trò: Trang forum - CẬP NHẬT HANDLERS

"use client";

import { ForumPostCard } from "@/components/forum/ForumPostCard";
import { ForumPostSkeleton } from "@/components/forum/ForumPostSkeleton";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForumInfinity } from "@/hooks/use-forum-infinity";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/db/supabase-client";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Filter, Plus, Search, Sparkles, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [showFilters, setShowFilters] = useState(false);

  const {
    posts,
    loading,
    hasMore,
    total,
    error,
    refreshing,
    lastElementRef,
    refresh,
  } = useForumInfinity({
    category: selectedCategory,
    search: searchQuery,
    limit: 10,
  });

  useEffect(() => {
    if (posts.length > 0 || error) {
      logger.log("📊 Forum state:", {
        posts: posts.length,
        loading,
        hasMore,
        total,
        error,
      });
    }
  }, [posts.length, loading, hasMore, total, error]);

  const handleCreatePost = useCallback(() => {
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập để tạo bài viết");
      router.push("/login");
      return;
    }
    router.push("/forum/create");
  }, [session?.user, toast, router]);

  const handleLike = useCallback(
    async (postId: string) => {
      if (!session?.user) {
        toast.error("Vui lòng đăng nhập");
        return;
      }

      try {
        // Toggle like
        const { data: existing } = await supabase
          .from("forum_likes")
          .select("*")
          .eq("post_id", postId)
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("forum_likes")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", session.user.id);

          await supabase
            .from("forum_posts")
            .update({ likes: supabase.rpc("decrement", { x: 1 }) })
            .eq("id", postId);
        } else {
          await supabase.from("forum_likes").insert({
            post_id: postId,
            user_id: session.user.id,
            created_at: new Date().toISOString(),
          });

          await supabase
            .from("forum_posts")
            .update({ likes: supabase.rpc("increment", { x: 1 }) })
            .eq("id", postId);
        }

        refresh();
      } catch (error: any) {
        logger.error("Error liking post:", error);
        toast.error(error.message || "Có lỗi xảy ra");
      }
    },
    [session?.user, toast, refresh],
  );

  const handleDelete = useCallback(
    async (postId: string) => {
      // Refresh lại danh sách
      refresh();
    },
    [refresh],
  );

  const handlePin = useCallback(
    async (postId: string) => {
      refresh();
    },
    [refresh],
  );

  const handleLock = useCallback(
    async (postId: string) => {
      refresh();
    },
    [refresh],
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      refresh();
    },
    [refresh],
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    refresh();
  }, [refresh]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 pt-16 md:pt-20">
        {/* Hero */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                  <Sparkles className="w-8 h-8 text-primary" />
                  Diễn đàn
                </h1>
                <p className="text-muted-foreground mt-1">
                  {total > 0
                    ? `Cộng đồng ${total} bài viết`
                    : "Chia sẻ kiến thức cùng nhau"}
                </p>
              </div>
              <Button
                onClick={handleCreatePost}
                className="gap-2 shadow-lg shadow-primary/25"
              >
                <Plus className="w-4 h-4" />
                Tạo bài viết
              </Button>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="max-w-4xl mx-auto px-4 py-4 sticky top-16 md:top-20 z-20 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </form>
            <Button
              variant="outline"
              className="gap-2 sm:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Lọc
            </Button>
          </div>

          {/* Category Filters */}
          <motion.div
            initial={false}
            animate={{
              height: showFilters ? "auto" : 0,
              opacity: showFilters ? 1 : 0,
            }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pt-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-all",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-muted hover:bg-muted/80 text-foreground",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Posts */}
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {error && (
            <div className="text-center py-8">
              <p className="text-destructive font-semibold">⚠️ {error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Vui lòng kiểm tra kết nối database hoặc thử lại sau
              </p>
              <Button variant="outline" className="mt-2" onClick={refresh}>
                Thử lại
              </Button>
            </div>
          )}

          {posts.map((post, index) => (
            <ForumPostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              onPin={handlePin}
              onLock={handleLock}
              index={index}
            />
          ))}

          {/* Loading skeletons */}
          {loading && (
            <>
              {[...Array(3)].map((_, i) => (
                <ForumPostSkeleton key={`skeleton-${i}`} />
              ))}
            </>
          )}

          {/* Infinite scroll loading indicator */}
          {!loading && hasMore && posts.length > 0 && (
            <div
              ref={lastElementRef}
              className="h-10 flex items-center justify-center"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Đang tải thêm...</span>
              </div>
            </div>
          )}

          {/* No more posts */}
          {!loading && !hasMore && posts.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <p>🎉 Đã tải hết {total} bài viết</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && posts.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chưa có bài viết</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== "Tất cả"
                  ? "Không tìm thấy bài viết phù hợp"
                  : "Hãy là người đầu tiên tạo bài viết"}
              </p>
              <Button className="mt-4 gap-2" onClick={handleCreatePost}>
                <Plus className="w-4 h-4" />
                Tạo bài viết mới
              </Button>
            </div>
          )}

          {/* Refreshing indicator */}
          {refreshing && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-background border border-border rounded-full px-4 py-2 shadow-lg text-sm flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Đang làm mới...
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
