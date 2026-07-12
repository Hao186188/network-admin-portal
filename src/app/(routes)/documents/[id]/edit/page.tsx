// src/app/(routes)/documents/[id]/edit/page.tsx
// EDIT DOCUMENT PAGE

"use client";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Edit2, Save, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDocuments } from "../../hooks/useDocuments";
import { Document } from "../../types";

const CATEGORIES = [
  "Tài liệu",
  "Giáo trình",
  "Bài giảng",
  "Hướng dẫn",
  "Bài tập",
  "Ôn tập",
  "Đề thi",
];
const SUBJECTS = [
  "Quản trị Mạng 3",
  "Bảo mật Mạng",
  "Linux Server",
  "Mạng máy tính",
  "Python",
  "Docker",
];

export default function EditDocumentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { documents, loading, updateDocument } = useDocuments();
  const [document, setDocument] = useState<Document | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (documents.length > 0) {
      const doc = documents.find((d) => d.id === id);
      if (doc) {
        setDocument(doc);
        setTitle(doc.title || "");
        setDescription(doc.description || "");
        setCategory(doc.category || "Tài liệu");
        setSubject(doc.subject || "Quản trị Mạng 3");
        setTags((doc.tags || []).join(", "));
      }
    }
  }, [documents, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    setIsLoading(true);
    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await updateDocument(document.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        subject,
        tags: tagsArray,
      });

      toast.success("Đã cập nhật tài liệu thành công!");
      router.push(`/documents/${document.id}`);
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật tài liệu");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !document) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-20">
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-white/10 rounded w-1/3" />
              <div className="h-12 bg-white/10 rounded w-full" />
              <div className="h-32 bg-white/10 rounded w-full" />
              <div className="h-12 bg-white/10 rounded w-full" />
              <div className="h-12 bg-white/10 rounded w-full" />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push(`/documents/${document.id}`)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </motion.button>

          {/* Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 rounded-2xl p-6 border border-white/10"
          >
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Edit2 className="w-6 h-6 text-cyan-400" />
              Chỉnh sửa tài liệu
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">
                  Tiêu đề <span className="text-red-400">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">
                  Mô tả
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả chi tiết..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 resize-none"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">
                    Danh mục
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
                    disabled={isLoading}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">
                    Môn học
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
                    disabled={isLoading}
                  >
                    {SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">
                  Thẻ (cách nhau bằng dấu phẩy)
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="VD: CCNA, Cisco, Mạng máy tính"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-white/10 text-white/60 hover:text-white hover:border-white/20"
                  onClick={() => router.push(`/documents/${document.id}`)}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Cập nhật
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
