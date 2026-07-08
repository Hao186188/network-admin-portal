// src/app/(routes)/forum/create/page.tsx
// Vai trò: Trang tạo bài viết mới - HOÀN CHỈNH

"use client";

import { CreatePostHero } from "@/components/forum/CreatePostHero";
import { OnboardingGuide } from "@/components/forum/OnboardingGuide";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForum } from "@/hooks/use-forum";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    FileText,
    Hash,
    Info,
    Plus,
    Sparkles,
    Tag,
    X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const categories = [
  { value: "Thảo luận", label: "Thảo luận", icon: "💬", color: "bg-blue-500" },
  { value: "Hỏi đáp", label: "Hỏi đáp", icon: "❓", color: "bg-green-500" },
  { value: "Chia sẻ", label: "Chia sẻ", icon: "📤", color: "bg-purple-500" },
  {
    value: "Thông báo",
    label: "Thông báo",
    icon: "📢",
    color: "bg-orange-500",
  },
  {
    value: "Kinh nghiệm",
    label: "Kinh nghiệm",
    icon: "💡",
    color: "bg-pink-500",
  },
  { value: "Dự án", label: "Dự án", icon: "🚀", color: "bg-cyan-500" },
];

const tagSuggestions = [
  "Mạng máy tính",
  "Cisco",
  "VLAN",
  "Bảo mật",
  "Linux",
  "Windows Server",
  "Python",
  "Docker",
  "Cloud",
  "IoT",
];

export default function CreateForumPostPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { createPost } = useForum();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Thảo luận");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [charCount, setCharCount] = useState(0);

  // Kiểm tra đăng nhập
  if (!session?.user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Card className="border-destructive">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Vui lòng đăng nhập</h2>
                <p className="text-muted-foreground mb-4">
                  Bạn cần đăng nhập để tạo bài viết mới
                </p>
                <Link href="/login">
                  <Button className="gap-2">Đăng nhập</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (value.trim().length < 5 && value.trim().length > 0) {
      setTitleError("Tiêu đề cần ít nhất 5 ký tự");
    } else if (value.trim().length > 100) {
      setTitleError("Tiêu đề không được vượt quá 100 ký tự");
    } else {
      setTitleError("");
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setCharCount(value.length);
    if (value.trim().length < 20 && value.trim().length > 0) {
      setContentError("Nội dung cần ít nhất 20 ký tự");
    } else {
      setContentError("");
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      if (tags.length >= 10) {
        toast.warning("Chỉ được thêm tối đa 10 tags");
        return;
      }
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleTagSuggestionClick = (suggestion: string) => {
    if (!tags.includes(suggestion) && tags.length < 10) {
      setTags([...tags, suggestion]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (title.trim().length < 5) {
      toast.error("Tiêu đề cần ít nhất 5 ký tự");
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }
    if (content.trim().length < 20) {
      toast.error("Nội dung cần ít nhất 20 ký tự");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🚀 Submitting post...");
      const result = await createPost({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
      });

      if (result) {
        console.log("✅ Post created, redirecting to:", result.id);
        router.push(`/forum/${result.id}`);
      }
    } catch (error: any) {
      console.error("❌ Submit error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi tạo bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      title.trim().length >= 5 &&
      content.trim().length >= 20 &&
      !titleError &&
      !contentError
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        {/* Onboarding Guide */}
        <OnboardingGuide page="create" onComplete={() => setShowGuide(false)} />

        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Hero Section */}
          <CreatePostHero />

          {/* Back Button */}
          <Link href="/forum">
            <Button variant="ghost" className="gap-2 mb-4 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
              Quay lại diễn đàn
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-primary/20 shadow-2xl shadow-primary/5">
              <CardContent className="p-6 md:p-8">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl md:text-3xl font-bold gradient-text">
                      Tạo bài viết mới
                    </h1>
                  </div>
                  <p className="text-muted-foreground">
                    Chia sẻ kiến thức và thảo luận với cộng đồng
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Tiêu đề */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tiêu đề <span className="text-destructive">*</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        (5-100 ký tự)
                      </span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Nhập tiêu đề bài viết..."
                        className={`pl-10 border-2 transition-all ${
                          titleError
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-primary/50"
                        }`}
                        required
                        disabled={isLoading}
                        maxLength={100}
                      />
                    </div>
                    {titleError && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {titleError}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {title.length}/100
                    </p>
                  </div>

                  {/* Danh mục */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Danh mục <span className="text-destructive">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
                            category === cat.value
                              ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          disabled={isLoading}
                        >
                          <span className="text-lg">{cat.icon}</span>
                          <span className="text-sm font-medium">
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nội dung */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nội dung <span className="text-destructive">*</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        (Tối thiểu 20 ký tự)
                      </span>
                    </label>
                    <textarea
                      value={content}
                      onChange={handleContentChange}
                      placeholder="Nhập nội dung bài viết..."
                      rows={8}
                      className={`w-full px-4 py-2 rounded-xl border-2 bg-background text-foreground focus:outline-none transition-all resize-none ${
                        contentError
                          ? "border-red-500 focus:border-red-500"
                          : "focus:border-primary/50"
                      }`}
                      required
                      disabled={isLoading}
                    />
                    {contentError && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {contentError}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {charCount} ký tự
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tags
                      <span className="text-xs text-muted-foreground ml-2">
                        (Tối đa 10 tags)
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Thêm tag (nhấn Enter)..."
                          className="pl-10 border-2 focus:border-primary/50 transition-all"
                          disabled={isLoading || tags.length >= 10}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddTag}
                        disabled={
                          isLoading || !tagInput.trim() || tags.length >= 10
                        }
                        className="border-2"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Tag suggestions */}
                    {tags.length < 10 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Gợi ý:
                        </span>
                        {tagSuggestions
                          .filter((s) => !tags.includes(s))
                          .slice(0, 6)
                          .map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() =>
                                handleTagSuggestionClick(suggestion)
                              }
                              className="text-xs px-2 py-0.5 rounded-full bg-muted hover:bg-primary/10 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="gap-1 px-3 py-1.5 text-sm"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-destructive transition-colors ml-1"
                              disabled={isLoading}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-2"
                      onClick={() => router.push("/forum")}
                      disabled={isLoading}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                      disabled={isLoading || !isFormValid()}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Đang đăng bài...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Đăng bài
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Form validation summary */}
                  {!isFormValid() && (
                    <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Vui lòng hoàn thành các trường bắt buộc:
                        {title.trim().length < 5 &&
                          " • Tiêu đề (ít nhất 5 ký tự)"}
                        {content.trim().length < 20 &&
                          " • Nội dung (ít nhất 20 ký tự)"}
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
