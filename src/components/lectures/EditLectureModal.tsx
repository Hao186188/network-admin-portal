// src/components/lectures/EditLectureModal.tsx
// MODAL CHỈNH SỬA BÀI GIẢNG - FIXED

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
import { Lecture } from "@/types";
import { Loader2, Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

interface EditLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: Lecture | null;
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

export function EditLectureModal({
  isOpen,
  onClose,
  lecture,
  onSuccess,
}: EditLectureModalProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Lecture>>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (lecture) {
      setFormData({
        title: lecture.title,
        description: lecture.description,
        content: lecture.content || "",
        type: lecture.type,
        subject: lecture.subject || "",
        duration: lecture.duration,
        duration_minutes: lecture.duration_minutes || 0,
        teacher: lecture.teacher,
        tags: lecture.tags || [],
        video_url: lecture.video_url || "",
        thumbnail: lecture.thumbnail || "",
      });
      setPreviewUrl(lecture.thumbnail || null);
      setThumbnailFile(null);
    }
  }, [lecture]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setThumbnailFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lecture?.id) {
      toast.error("Không tìm thấy bài giảng");
      return;
    }

    if (!formData.title?.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    if (!formData.description?.trim()) {
      toast.error("Vui lòng nhập mô tả");
      return;
    }

    setIsLoading(true);

    try {
      let thumbnailUrl = formData.thumbnail;

      // Nếu có thumbnail file mới, upload lên
      if (thumbnailFile) {
        const file = thumbnailFile;
        const fileExt = file.name.split(".").pop() || "unknown";
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `lectures/${fileName}`;

        // Upload lên Supabase Storage
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("path", filePath);

        const uploadResponse = await fetch("/api/lectures/upload-thumbnail", {
          method: "POST",
          body: formDataUpload,
        });

        const uploadResult = await uploadResponse.json();

        if (uploadResponse.ok && uploadResult.url) {
          thumbnailUrl = uploadResult.url;
        } else {
          console.error("Upload thumbnail error:", uploadResult.error);
          toast.warning("Không thể upload ảnh thumbnail, giữ nguyên ảnh cũ");
        }
      }

      // ✅ Gọi API cập nhật
      const response = await fetch(
        `/api/lectures?id=${lecture.id}&action=update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              title: formData.title?.trim(),
              description: formData.description?.trim(),
              content: formData.content?.trim(),
              type: formData.type,
              subject: formData.subject,
              duration: formData.duration,
              duration_minutes: formData.duration_minutes,
              teacher: formData.teacher,
              tags: formData.tags,
              video_url: formData.video_url,
              thumbnail: thumbnailUrl,
            },
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Không thể cập nhật bài giảng");
      }

      toast.success("Cập nhật bài giảng thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  if (!lecture) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            ✏️ Chỉnh sửa bài giảng
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tiêu đề */}
          <div>
            <Label className="text-sm font-medium">Tiêu đề *</Label>
            <Input
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
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
                value={formData.teacher || ""}
                onChange={(e) => handleChange("teacher", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Thời lượng</Label>
              <Input
                value={formData.duration || ""}
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
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="mt-1 resize-none"
              required
            />
          </div>

          {/* Nội dung */}
          <div>
            <Label className="text-sm font-medium">Nội dung chi tiết</Label>
            <Textarea
              value={formData.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              rows={5}
              className="mt-1 resize-none"
            />
          </div>

          {/* Tags */}
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
              {formData.tags?.map((tag) => (
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

          {/* Link video */}
          <div>
            <Label className="text-sm font-medium">Link video</Label>
            <Input
              value={formData.video_url || ""}
              onChange={(e) => handleChange("video_url", e.target.value)}
              placeholder="https://youtube.com/..."
              className="mt-1"
            />
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
                id="thumbnail-upload-edit"
              />
              <label
                htmlFor="thumbnail-upload-edit"
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

          {/* Actions */}
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
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
