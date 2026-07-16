// src/app/(routes)/lectures/CreateLectureModal.tsx
// CẬP NHẬT - HỖ TRỢ LINK WAYGROUND, GOOGLE DOCS, GOOGLE SHEETS

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLectures } from "@/hooks/useLectures";

import {
  ExternalLink,
  Loader2,
  Upload,
  X
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";

interface CreateLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const typeOptions = [
  { value: "video", label: "🎬 Video" },
  { value: "slide", label: "📊 Slide" },
  { value: "lab", label: "💻 Lab" },
  { value: "document", label: "📄 Tài liệu" },
];

const subjectOptions = [
  "Quản trị mạng",
  "Mạng máy tính",
  "Bảo mật mạng",
  "Hệ điều hành",
  "Lập trình mạng",
  "Cisco",
  "Linux",
];

// ✅ Link options
const linkOptions = [
  { value: "youtube", label: "YouTube", icon: "🎬" },
  { value: "wayground", label: "Wayground", icon: "🌐" },
  { value: "google_docs", label: "Google Docs", icon: "📄" },
  { value: "google_sheets", label: "Google Sheets", icon: "📊" },
  { value: "other", label: "Link khác", icon: "🔗" },
];

// ✅ Hàm kiểm tra loại link
const detectLinkType = (url: string): string => {
  if (!url) return "other";
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be"))
    return "youtube";
  if (lowerUrl.includes("wayground.com") || lowerUrl.includes("wayground"))
    return "wayground";
  if (lowerUrl.includes("docs.google.com")) {
    if (lowerUrl.includes("spreadsheets") || lowerUrl.includes("sheet"))
      return "google_sheets";
    return "google_docs";
  }
  return "other";
};

// ✅ Hàm lấy placeholder theo loại link
const getLinkPlaceholder = (type: string): string => {
  switch (type) {
    case "youtube":
      return "https://youtube.com/watch?v=...";
    case "wayground":
      return "https://wayground.com/...";
    case "google_docs":
      return "https://docs.google.com/document/d/...";
    case "google_sheets":
      return "https://docs.google.com/spreadsheets/d/...";
    default:
      return "https://...";
  }
};

// ✅ Hàm lấy icon theo loại link
const getLinkIcon = (type: string) => {
  switch (type) {
    case "youtube":
      return "🎬";
    case "wayground":
      return "🌐";
    case "google_docs":
      return "📄";
    case "google_sheets":
      return "📊";
    default:
      return "🔗";
  }
};

export function CreateLectureModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateLectureModalProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const { createLecture } = useLectures();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    type: "video",
    subject: "",
    duration: "",
    duration_minutes: 0,
    teacher: "",
    tags: [] as string[],
    video_url: "",
    linkType: "youtube" as string,
    thumbnail: "",
    thumbnailFile: null as File | null,
  });
  const [tagInput, setTagInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLinkTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      linkType: value,
      video_url: "", // Reset URL khi đổi loại link
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnailFile: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Vui lòng đăng nhập để đăng bài");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Tạo description với thông tin link
      let fullDescription = formData.description;
      if (formData.video_url) {
        const linkIcon = getLinkIcon(formData.linkType);
        fullDescription += `\n\n${linkIcon} Link bài giảng: ${formData.video_url}`;
      }

      await createLecture({
        title: formData.title,
        description: fullDescription,
        content: formData.content,
        type: formData.type as "video" | "slide" | "lab" | "document",
        subject: formData.subject,
        duration: formData.duration,
        duration_minutes: formData.duration_minutes,
        teacher: formData.teacher || session.user.name || "Giảng viên",
        tags: formData.tags,
        video_url: formData.video_url,
        thumbnail: formData.thumbnail,
        thumbnailFile: formData.thumbnailFile || undefined,
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      // Error handled in mutation
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      type: "video",
      subject: "",
      duration: "",
      duration_minutes: 0,
      teacher: "",
      tags: [],
      video_url: "",
      linkType: "youtube",
      thumbnail: "",
      thumbnailFile: null,
    });
    setTagInput("");
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            📝 Đăng bài giảng mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tiêu đề */}
          <div>
            <Label className="text-sm font-medium">Tiêu đề *</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Nhập tiêu đề bài giảng..."
              className="mt-1"
              required
            />
          </div>

          {/* Loại bài giảng & Môn học */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Loại bài giảng *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Môn học</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => handleChange("subject", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Giảng viên & Thời lượng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Giảng viên</Label>
              <Input
                value={formData.teacher}
                onChange={(e) => handleChange("teacher", e.target.value)}
                placeholder="Tên giảng viên..."
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Thời lượng</Label>
              <Input
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="VD: 45 phút"
                className="mt-1"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <Label className="text-sm font-medium">Mô tả *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Nhập mô tả ngắn về bài giảng..."
              rows={3}
              className="mt-1 resize-none"
              required
            />
          </div>

          {/* Nội dung */}
          <div>
            <Label className="text-sm font-medium">Nội dung chi tiết</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Nhập nội dung chi tiết bài giảng..."
              rows={5}
              className="mt-1 resize-none"
            />
          </div>

          {/* ✅ Link video - NÂNG CẤP với nhiều loại link */}
          <div>
            <Label className="text-sm font-medium">Link bài giảng</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
              {/* Chọn loại link */}
              <div>
                <Select
                  value={formData.linkType}
                  onValueChange={handleLinkTypeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại link" />
                  </SelectTrigger>
                  <SelectContent>
                    {linkOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.icon} {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Input link */}
              <div className="sm:col-span-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      {getLinkIcon(formData.linkType)}
                    </span>
                    <Input
                      value={formData.video_url}
                      onChange={(e) =>
                        handleChange("video_url", e.target.value)
                      }
                      placeholder={getLinkPlaceholder(formData.linkType)}
                      className="pl-8"
                    />
                  </div>
                  {formData.video_url && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => window.open(formData.video_url, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Hỗ trợ: YouTube, Wayground, Google Docs, Google Sheets
                </p>
              </div>
            </div>
          </div>

          {/* Thẻ tags */}
          <div>
            <Label className="text-sm font-medium">Thẻ tags</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Nhập tag và nhấn Enter..."
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Thêm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <Label className="text-sm font-medium">Ảnh thumbnail</Label>
            <div className="mt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Thumbnail preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Nhấn để tải ảnh lên
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang đăng...
                </>
              ) : (
                "Đăng bài giảng"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
