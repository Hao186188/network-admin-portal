// src/app/(routes)/chat/page.tsx
// Vai trò: Trang chat - FIXED (Online status real-time)

"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatSidebar } from "@/components/chat/ChatSideBar";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { useIsMobile } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isMobile = useIsMobile();
  const {
    friends,
    messages,
    loading,
    unreadCount,
    selectedFriendId,
    fetchMessages,
    sendMessage,
    setSelectedFriendId,
  } = useChat();

  const [showSidebar, setShowSidebar] = useState(!isMobile);

  const selectedFriend = friends.find((f) => f.id === selectedFriendId);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (!selectedFriendId && friends.length > 0) {
      setSelectedFriendId(friends[0].id);
    }
  }, [friends, selectedFriendId, setSelectedFriendId]);

  useEffect(() => {
    if (selectedFriendId) {
      fetchMessages(selectedFriendId);
      const params = new URLSearchParams(searchParams?.toString());
      params.set("user", selectedFriendId);
      router.replace(`/chat?${params.toString()}`);
    }
  }, [selectedFriendId, fetchMessages, router, searchParams]);

  useEffect(() => {
    if (isMobile && !selectedFriendId) {
      setShowSidebar(true);
    }
  }, [isMobile, selectedFriendId]);

  const handleSendMessage = useCallback(
    async (content: string, file?: File) => {
      if (!selectedFriendId) return;
      await sendMessage(selectedFriendId, content, file);
    },
    [selectedFriendId, sendMessage],
  );

  const handleSelectFriend = useCallback(
    (friendId: string) => {
      setSelectedFriendId(friendId);
      if (isMobile) {
        setShowSidebar(false);
      }
    },
    [isMobile, setSelectedFriendId],
  );

  const handleBack = useCallback(() => {
    if (isMobile) {
      setShowSidebar(true);
      setSelectedFriendId(null);
    }
  }, [isMobile, setSelectedFriendId]);

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
          <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] md:h-[calc(100vh-100px)]">
            <div className="flex h-full bg-background rounded-2xl shadow-2xl overflow-hidden border border-border items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Đang tải...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] md:h-[calc(100vh-100px)]">
          <div className="flex h-full bg-background rounded-2xl shadow-2xl overflow-hidden border border-border">
            {(!isMobile || showSidebar) && (
              <ChatSidebar
                friends={friends}
                selectedFriendId={selectedFriendId}
                onSelectFriend={handleSelectFriend}
                unreadCount={unreadCount}
              />
            )}

            {(!isMobile || !showSidebar) && (
              <div className="flex-1 flex flex-col">
                {selectedFriend ? (
                  <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/30">
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2"
                        onClick={handleBack}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                    )}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                      {selectedFriend.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{selectedFriend.name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{selectedFriend.username}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      {/* ✅ SỬA: Online status real-time */}
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          selectedFriend.is_online
                            ? "bg-green-500"
                            : "bg-gray-400",
                        )}
                      />
                      <span className="text-xs text-muted-foreground">
                        {selectedFriend.is_online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-b border-border text-center text-muted-foreground bg-muted/30">
                    {friends.length > 0
                      ? "Chọn một người bạn để bắt đầu trò chuyện"
                      : "Chưa có bạn bè"}
                  </div>
                )}

                <ChatMessages
                  messages={messages}
                  friendName={selectedFriend?.name || ""}
                  isLoading={loading}
                />

                {selectedFriend && (
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={loading}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
