// src/components/forum/UserProfileModal.tsx
// Vai trò: Modal hiển thị thông tin người dùng - FIXED

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useChat } from "@/hooks/use-chat";
import { AnimatePresence, motion } from "framer-motion";
import {
  Badge,
  Mail,
  MessageCircle,
  Phone,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  image?: string;
  bio?: string;
  role: string;
  created_at: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
}: UserProfileModalProps) {
  const { data: session } = useSession();
  const { sendFriendRequest, friends } = useChat(); // ✅ Đã có sendFriendRequest
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  if (!user || !isOpen) return null;

  const isFriend = friends.some((f) => f.id === user.id);
  const isSelf = session?.user?.id === user.id;

  const handleAddFriend = async () => {
    setIsLoading(true);
    await sendFriendRequest(user.id);
    setIsLoading(false);
  };

  const handleChat = () => {
    setShowChat(true);
    window.location.href = `/chat?user=${user.id}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md mx-4"
          >
            <Card className="overflow-hidden border-primary/20 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold gradient-text">
                    Hồ sơ người dùng
                  </h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg shadow-primary-500/25">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-semibold mt-3">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                  <Badge className="mt-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0">
                    {user.role || "Thành viên"}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.bio && (
                    <div className="p-3 rounded-xl bg-muted/50 text-sm">
                      {user.bio}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>
                      Tham gia từ:{" "}
                      {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!isSelf && (
                    <>
                      {isFriend ? (
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={handleChat}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Nhắn tin
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={handleAddFriend}
                          disabled={isLoading}
                        >
                          <UserPlus className="w-4 h-4" />
                          {isLoading ? "Đang xử lý..." : "Kết bạn"}
                        </Button>
                      )}
                    </>
                  )}
                  <Button variant="ghost" className="flex-1" onClick={onClose}>
                    Đóng
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
