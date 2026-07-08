// src/app/(routes)/forum/[id]/page.tsx
// Vai trò: Trang chi tiết bài viết - HOÀN CHỈNH

"use client";

import { OnboardingGuide } from "@/components/forum/OnboardingGuide";
import { PostDetailContent } from "@/components/forum/PostDetailContent";
import { PostDetailHeader } from "@/components/forum/PostDetailHeader";
import { PostDetailHero } from "@/components/forum/PostDetailHero";
import { PostDetailReplies } from "@/components/forum/PostDetailReplies";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useForum } from "@/hooks/use-forum";
import { useLikeStatus } from "@/hooks/use-like-status";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Helper kiểm tra UUID hợp lệ
const isValidUUID = (str: string) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export default function ForumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { getPostDetail, getReplies, addReply, toggleLike, incrementViews } =
    useForum();
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const postId = params.id as string;

  // Sử dụng hook quản lý like
  const {
    isLiked,
    setIsLiked,
    likesCount,
    setLikesCount,
    loading: likeLoading,
  } = useLikeStatus(postId, session?.user?.id);

  // Kiểm tra ID hợp lệ
  useEffect(() => {
    if (postId && !isValidUUID(postId)) {
      setError("ID bài viết không hợp lệ");
      setLoading(false);
      return;
    }
  }, [postId]);

  // Fetch dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      if (!postId || !isValidUUID(postId)) return;

      try {
        setLoading(true);
        setError(null);

        // Tăng view
        await incrementViews(postId);

        // Lấy chi tiết bài viết
        const postData = await getPostDetail(postId);
        if (!postData) {
          setError("Không tìm thấy bài viết");
          setLoading(false);
          return;
        }
        setPost(postData);

        // Lấy replies
        const repliesData = await getReplies(postId);
        setReplies(repliesData || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Có lỗi xảy ra khi tải bài viết");
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  // Xử lý like
  const handleLike = async () => {
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập để thích");
      return;
    }

    try {
      const result = await toggleLike(postId);
      if (result?.success) {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        toast.success(isLiked ? "Đã bỏ thích" : "Đã thích bài viết");
      }
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    }
  };

  // Xử lý reply
  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast.error("Vui lòng nhập nội dung trả lời");
      return;
    }
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập để trả lời");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addReply(postId, replyContent);
      if (result) {
        setReplies([...replies, result]);
        setReplyContent("");
        toast.success("Đã thêm trả lời thành công!");
      }
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto text-destructive opacity-50" />
              <h2 className="text-2xl font-bold mt-4">
                {error === "ID bài viết không hợp lệ"
                  ? "Đường dẫn không hợp lệ"
                  : "Không tìm thấy bài viết"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {error || "Bài viết không tồn tại hoặc đã bị xóa"}
              </p>
              <Link href="/forum">
                <Button className="mt-4 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại diễn đàn
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        {/* Onboarding Guide */}
        <OnboardingGuide page="detail" onComplete={() => setShowGuide(false)} />

        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Hero Section */}
          <PostDetailHero title={post.title} />

          {/* Back Button */}
          <div className="flex justify-between items-center mb-4">
            <Link href="/forum">
              <Button variant="ghost" className="gap-2 hover:bg-muted">
                <ArrowLeft className="w-4 h-4" />
                Quay lại diễn đàn
              </Button>
            </Link>
          </div>

          {/* Post Content */}
          <div className="space-y-6">
            <PostDetailHeader post={post} />

            <PostDetailContent
              content={post.content}
              tags={post.tags || []}
              likes={likesCount}
              isLiked={isLiked}
              onLike={handleLike}
              isLoading={likeLoading}
            />

            <PostDetailReplies
              replies={replies}
              isAuthenticated={!!session?.user}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSubmit={handleReply}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
