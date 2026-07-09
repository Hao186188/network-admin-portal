// src/app/(routes)/forum/create/page.tsx
// Vai trò: Trang tạo bài viết mới - FIX TYPE ERROR

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
import { useStorage } from "@/hooks/use-storage";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  File,
  FileText,
  Hash,
  Image as ImageIcon,
  Info,
  Loader2,
  Plus,
  Sparkles,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

// ============================================
// CONSTANTS
// ============================================

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
  "Network",
  "Security",
  "Server",
  "Database",
];

const MAX_TAGS = 10;
const MAX_ATTACHMENTS = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_TITLE_LENGTH = 5;
const MAX_TITLE_LENGTH = 100;
const MIN_CONTENT_LENGTH = 20;

// ============================================
// COMPONENTS
// ============================================

function CategorySelector({
  category,
  setCategory,
  disabled,
}: {
  category: string;
  setCategory: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {categories.map((cat) => (
        <motion.button
          key={cat.value}
          type="button"
          onClick={() => setCategory(cat.value)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200",
            category === cat.value
              ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
              : "border-border hover:border-primary/50 hover:bg-muted/50",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          disabled={disabled}
        >
          <span className="text-lg">{cat.icon}</span>
          <span className="text-sm font-medium">{cat.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

function TagInput({
  tags,
  setTags,
  tagInput,
  setTagInput,
  disabled,
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
  tagInput: string;
  setTagInput: (value: string) => void;
  disabled?: boolean;
}) {
  const { toast } = useToast();

  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    if (tags.includes(trimmedTag)) {
      toast.warning("Tag đã tồn tại");
      return;
    }

    if (tags.length >= MAX_TAGS) {
      toast.warning(`Chỉ được thêm tối đa ${MAX_TAGS} tags`);
      return;
    }

    setTags([...tags, trimmedTag]);
    setTagInput("");
  }, [tagInput, tags, setTags, setTagInput, toast]);

  const handleRemoveTag = useCallback(
    (tag: string) => {
      setTags(tags.filter((t) => t !== tag));
    },
    [tags, setTags],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      if (tags.includes(suggestion)) {
        toast.warning("Tag đã tồn tại");
        return;
      }
      if (tags.length >= MAX_TAGS) {
        toast.warning(`Chỉ được thêm tối đa ${MAX_TAGS} tags`);
        return;
      }
      setTags([...tags, suggestion]);
    },
    [tags, setTags, toast],
  );

  const remainingTags = MAX_TAGS - tags.length;

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Thêm tag (nhấn Enter)..."
            className="pl-10 border-2 focus:border-primary/50 transition-all"
            disabled={disabled || tags.length >= MAX_TAGS}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddTag}
          disabled={disabled || !tagInput.trim() || tags.length >= MAX_TAGS}
          className="border-2"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {remainingTags > 0 && (
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
                onClick={() => handleSuggestionClick(suggestion)}
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
              className="gap-1 px-3 py-1.5 text-sm animate-in fade-in"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-destructive transition-colors ml-1"
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <span className="text-xs text-muted-foreground self-center">
            ({tags.length}/{MAX_TAGS})
          </span>
        </div>
      )}
    </div>
  );
}

function FileAttachments({
  attachments,
  setAttachments,
  disabled,
  isUploading,
}: {
  attachments: File[];
  setAttachments: (files: File[]) => void;
  disabled?: boolean;
  isUploading?: boolean;
}) {
  const { toast } = useToast();

  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newFiles = Array.from(files);

      // Kiểm tra số lượng file
      if (attachments.length + newFiles.length > MAX_ATTACHMENTS) {
        toast.error(`Chỉ được đính kèm tối đa ${MAX_ATTACHMENTS} file`);
        return;
      }

      // Kiểm tra file size
      const oversized = newFiles.filter((f) => f.size > MAX_FILE_SIZE);
      if (oversized.length > 0) {
        toast.error(`File quá lớn (tối đa ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
        return;
      }

      // Kiểm tra loại file
      const invalidTypes = newFiles.filter(
        (f) =>
          !f.type.startsWith("image/") &&
          ![
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/zip",
            "application/x-rar-compressed",
          ].includes(f.type),
      );
      if (invalidTypes.length > 0) {
        toast.error("Chỉ hỗ trợ hình ảnh, PDF, DOC, DOCX, ZIP, RAR");
        return;
      }

      setAttachments([...attachments, ...newFiles]);
    },
    [attachments, setAttachments, toast],
  );

  const removeAttachment = useCallback(
    (index: number) => {
      setAttachments(attachments.filter((_, i) => i !== index));
    },
    [attachments, setAttachments],
  );

  return (
    <div>
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
          attachments.length > 0
            ? "border-primary/50 bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          (disabled || isUploading) && "opacity-50 cursor-not-allowed",
        )}
        onClick={() => {
          if (!disabled && !isUploading) {
            document.getElementById("file-upload")?.click();
          }
        }}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.zip,.rar"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
          disabled={
            disabled || isUploading || attachments.length >= MAX_ATTACHMENTS
          }
        />
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
            <p className="text-sm font-medium">Đang upload...</p>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Click để chọn file</p>
            <p className="text-xs text-muted-foreground mt-1">
              Hỗ trợ: Hình ảnh, PDF, DOC, DOCX, ZIP, RAR (tối đa{" "}
              {MAX_ATTACHMENTS} file, mỗi file {MAX_FILE_SIZE / 1024 / 1024}MB)
            </p>
            {attachments.length > 0 && (
              <p className="text-xs text-primary mt-2">
                Đã chọn {attachments.length}/{MAX_ATTACHMENTS} file
              </p>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2 overflow-hidden"
          >
            {attachments.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
              >
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="w-5 h-5 text-primary" />
                ) : (
                  <File className="w-5 h-5 text-primary" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeAttachment(index)}
                  disabled={disabled || isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CreateForumPostPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { createPost } = useForum();
  const { uploadFile, isUploading, saveAttachment } = useStorage();

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Thảo luận");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [charCount, setCharCount] = useState(0);

  // Validation
  const validateTitle = useCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed.length < MIN_TITLE_LENGTH) {
      return `Tiêu đề cần ít nhất ${MIN_TITLE_LENGTH} ký tự`;
    }
    if (trimmed.length > MAX_TITLE_LENGTH) {
      return `Tiêu đề không được vượt quá ${MAX_TITLE_LENGTH} ký tự`;
    }
    return "";
  }, []);

  const validateContent = useCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed.length < MIN_CONTENT_LENGTH) {
      return `Nội dung cần ít nhất ${MIN_CONTENT_LENGTH} ký tự`;
    }
    return "";
  }, []);

  // Handlers
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTitle(value);
      setTitleError(validateTitle(value));
    },
    [validateTitle],
  );

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setContent(value);
      setCharCount(value.length);
      setContentError(validateContent(value));
    },
    [validateContent],
  );

  const isFormValid = useCallback(() => {
    return (
      title.trim().length >= MIN_TITLE_LENGTH &&
      content.trim().length >= MIN_CONTENT_LENGTH &&
      !titleError &&
      !contentError
    );
  }, [title, content, titleError, contentError]);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra session
    if (!session?.user) {
      toast.error("Vui lòng đăng nhập để tạo bài viết");
      router.push("/login");
      return;
    }

    // Validate
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }
    if (title.trim().length < MIN_TITLE_LENGTH) {
      toast.error(`Tiêu đề cần ít nhất ${MIN_TITLE_LENGTH} ký tự`);
      return;
    }
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }
    if (content.trim().length < MIN_CONTENT_LENGTH) {
      toast.error(`Nội dung cần ít nhất ${MIN_CONTENT_LENGTH} ký tự`);
      return;
    }

    setIsLoading(true);
    try {
      // Upload files
      const uploadedFiles: Array<{
        url: string;
        name: string;
        type: string;
        size: number;
      }> = [];

      for (const file of attachments) {
        const filePath = `forum/${session.user.id}/${Date.now()}_${file.name}`;
        const result = await uploadFile({
          bucket: "forum-attachments",
          path: filePath,
          file: file,
        });

        if (result.success) {
          // ✅ FIX: Đảm bảo type và size luôn có giá trị
          const fileType = file.type || "application/octet-stream";
          const fileSize = file.size || 0;

          uploadedFiles.push({
            url: result.url || "",
            name: file.name,
            type: fileType,
            size: fileSize,
          });
        } else {
          throw new Error(result.error || "Upload failed");
        }
      }

      // Create post
      const result = await createPost({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
      });

      if (!result) {
        throw new Error("Không thể tạo bài viết");
      }

      // Save attachments
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const saveResult = await saveAttachment({
            postId: result.id,
            userId: session.user.id,
            fileUrl: file.url,
            fileName: file.name,
            fileType: file.type || undefined,
            fileSize: file.size || undefined,
          });

          if (!saveResult.success) {
            console.error("Error saving attachment:", saveResult.error);
            // Không throw lỗi để bài viết vẫn được tạo
          }
        }
      }

      toast.success("✅ Đã tạo bài viết thành công!");
      router.push(`/forum/${result.id}`);
    } catch (error: any) {
      console.error("❌ Submit error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi tạo bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  // Check login
  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-center h-[60vh]">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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

          {/* Form */}
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
                    <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                    <h1 className="text-2xl md:text-3xl font-bold gradient-text">
                      Tạo bài viết mới
                    </h1>
                  </div>
                  <p className="text-muted-foreground">
                    Chia sẻ kiến thức và thảo luận với cộng đồng
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tiêu đề <span className="text-destructive">*</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({MIN_TITLE_LENGTH}-{MAX_TITLE_LENGTH} ký tự)
                      </span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Nhập tiêu đề bài viết..."
                        className={cn(
                          "pl-10 border-2 transition-all",
                          titleError
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-primary/50",
                        )}
                        required
                        disabled={isLoading}
                        maxLength={MAX_TITLE_LENGTH}
                      />
                    </div>
                    <AnimatePresence>
                      {titleError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-xs text-red-500 mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {titleError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {title.length}/{MAX_TITLE_LENGTH}
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Danh mục <span className="text-destructive">*</span>
                    </label>
                    <CategorySelector
                      category={category}
                      setCategory={setCategory}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nội dung <span className="text-destructive">*</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        (Tối thiểu {MIN_CONTENT_LENGTH} ký tự)
                      </span>
                    </label>
                    <textarea
                      value={content}
                      onChange={handleContentChange}
                      placeholder="Nhập nội dung bài viết..."
                      rows={8}
                      className={cn(
                        "w-full px-4 py-2 rounded-xl border-2 bg-background text-foreground focus:outline-none transition-all resize-none",
                        contentError
                          ? "border-red-500 focus:border-red-500"
                          : "focus:border-primary/50",
                      )}
                      required
                      disabled={isLoading}
                    />
                    <AnimatePresence>
                      {contentError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-xs text-red-500 mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {contentError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {charCount} ký tự
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tags
                      <span className="text-xs text-muted-foreground ml-2">
                        (Tối đa {MAX_TAGS} tags)
                      </span>
                    </label>
                    <TagInput
                      tags={tags}
                      setTags={setTags}
                      tagInput={tagInput}
                      setTagInput={setTagInput}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Đính kèm hình ảnh/file
                      <span className="text-xs text-muted-foreground ml-2">
                        (Tối đa {MAX_ATTACHMENTS} file, mỗi file{" "}
                        {MAX_FILE_SIZE / 1024 / 1024}MB)
                      </span>
                    </label>
                    <FileAttachments
                      attachments={attachments}
                      setAttachments={setAttachments}
                      disabled={isLoading}
                      isUploading={isUploading}
                    />
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
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {isUploading
                            ? "Đang upload file..."
                            : "Đang đăng bài..."}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Đăng bài
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Validation summary */}
                  <AnimatePresence>
                    {!isFormValid() && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                          <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Vui lòng hoàn thành các trường bắt buộc:
                            {title.trim().length < MIN_TITLE_LENGTH &&
                              " • Tiêu đề (ít nhất 5 ký tự)"}
                            {content.trim().length < MIN_CONTENT_LENGTH &&
                              " • Nội dung (ít nhất 20 ký tự)"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
