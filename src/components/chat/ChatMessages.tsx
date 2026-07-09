// src/components/chat/ChatMessages.tsx
// Vai trò: Hiển thị tin nhắn - ĐÃ THÊM READ STATUS

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Check, CheckCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { TypingIndicator } from "./TypingIndicator";

interface ChatMessagesProps {
  messages: ChatMessage[];
  friendName: string;
  isLoading?: boolean;
  isTyping?: boolean;
}

export function ChatMessages({
  messages,
  friendName,
  isLoading,
  isTyping = false,
}: ChatMessagesProps) {
  const { data: session } = useSession();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.created_at);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
      return groups;
    },
    {} as Record<string, ChatMessage[]>,
  );

  const formatDateHeader = (dateKey: string) => {
    const date = new Date(dateKey);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      return "Hôm nay";
    }
    if (format(date, "yyyy-MM-dd") === format(yesterday, "yyyy-MM-dd")) {
      return "Hôm qua";
    }
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg">💬</p>
          <p>Chưa có tin nhắn nào</p>
          <p className="text-sm">Hãy bắt đầu trò chuyện với {friendName}</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-6">
        {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
          <div key={dateKey}>
            <div className="flex justify-center mb-4">
              <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                {formatDateHeader(dateKey)}
              </span>
            </div>
            <div className="space-y-2">
              {dateMessages.map((message) => {
                const isOwn = message.sender_id === session?.user?.id;
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end gap-2",
                      isOwn ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {!isOwn && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.sender_image || undefined} />
                        <AvatarFallback>
                          {message.sender_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      {!isOwn && (
                        <p className="text-xs font-medium mb-1">
                          {message.sender_name}
                        </p>
                      )}
                      {message.content && (
                        <p className="text-sm break-words whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}
                      {message.file_url && (
                        <div className="mt-1">
                          {message.file_type?.startsWith("image/") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={message.file_url}
                              alt={message.file_name || "Image"}
                              className="max-w-full rounded-lg max-h-60 object-cover"
                            />
                          ) : (
                            <a
                              href={message.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm underline flex items-center gap-1"
                            >
                              📎 {message.file_name || "File đính kèm"}
                            </a>
                          )}
                        </div>
                      )}
                      <div
                        className={cn(
                          "flex items-center gap-1 mt-1 text-xs",
                          isOwn
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        <span>
                          {format(new Date(message.created_at), "HH:mm")}
                        </span>
                        {isOwn && (
                          <>
                            {message.read ? (
                              <CheckCheck className="w-3 h-3 text-primary-foreground/80" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ✅ Typing indicator */}
        {isTyping && <TypingIndicator name={friendName} />}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
