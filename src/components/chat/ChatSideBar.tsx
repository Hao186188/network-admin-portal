// src/components/chat/ChatSidebar.tsx
// Vai trò: Sidebar chat - FIXED (đổi tên từ ChatSideBar)

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ChatFriend } from "@/types";
import { Search, UserPlus } from "lucide-react";
import { useState } from "react";

interface ChatSidebarProps {
  friends: ChatFriend[];
  selectedFriendId: string | null;
  onSelectFriend: (friendId: string) => void;
  unreadCount: number;
}

export function ChatSidebar({
  friends,
  selectedFriendId,
  onSelectFriend,
  unreadCount,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full md:w-80 border-r border-border flex flex-col bg-muted/10">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tin nhắn</h2>
          <Badge variant="secondary" className="gap-1">
            {unreadCount} chưa đọc
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bạn bè..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Friend List */}
      <ScrollArea className="flex-1">
        {filteredFriends.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có bạn bè</p>
            <p className="text-xs">Hãy kết bạn để bắt đầu trò chuyện</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredFriends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => onSelectFriend(friend.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                  selectedFriendId === friend.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50",
                )}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={friend.image || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                    {friend.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{friend.name}</p>
                    {friend.last_message_time && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(friend.last_message_time).toLocaleDateString(
                          "vi-VN",
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {friend.last_message || "Bắt đầu trò chuyện..."}
                  </p>
                </div>
                {/* ✅ Online status dot */}
                <div
                  className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    friend.is_online ? "bg-green-500" : "bg-gray-300",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
