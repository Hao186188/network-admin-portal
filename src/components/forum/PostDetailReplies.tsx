// src/components/forum/PostDetailReplies.tsx
// Vai trò: Phần trả lời bài viết

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import Link from "next/link";

interface Reply {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

interface PostDetailRepliesProps {
  replies: Reply[];
  isAuthenticated: boolean;
  replyContent: string;
  setReplyContent: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function PostDetailReplies({
  replies,
  isAuthenticated,
  replyContent,
  setReplyContent,
  onSubmit,
  isSubmitting,
}: PostDetailRepliesProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8"
    >
      <Card className="border-primary/10 shadow-xl">
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Trả lời ({replies.length})
          </h3>

          {isAuthenticated ? (
            <form onSubmit={onSubmit} className="mb-6">
              <div className="flex gap-3">
                <Input
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Viết trả lời..."
                  className="flex-1 border-2 focus:border-primary/50 transition-all"
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !replyContent.trim()}
                  className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-muted-foreground mb-4">
              <Link href="/login" className="text-primary hover:underline">
                Đăng nhập
              </Link>{" "}
              để trả lời
            </p>
          )}

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {replies.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Chưa có trả lời nào. Hãy là người đầu tiên!
              </p>
            ) : (
              replies.map((reply, index) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-primary-500/25">
                    {reply.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{reply.user_name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatDate(reply.created_at)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mt-1 leading-relaxed">
                      {reply.content}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
