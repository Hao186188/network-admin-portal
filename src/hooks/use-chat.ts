// src/hooks/use-chat.ts
// Vai trò: Hook quản lý chat - THÊM sendFriendRequest

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { logger } from "@/lib/logger";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "./use-toast";

export interface ChatFriend {
  id: string;
  name: string;
  email: string;
  username: string;
  image: string;
  status: string;
  is_online?: boolean;
  last_seen?: string;
  last_message?: string;
  last_message_time?: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  read: boolean;
  created_at: string;
  sender_name: string;
  sender_image: string;
}

export function useChat() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [friends, setFriends] = useState<ChatFriend[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  const subscriptionRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const friendsFetchedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ============================================
  // LẤY DANH SÁCH BẠN BÈ
  // ============================================

  const fetchFriends = useCallback(
    async (signal?: AbortSignal) => {
      if (friendsFetchedRef.current && !signal) {
        return;
      }

      if (!session?.user?.id) {
        return;
      }

      try {
        setLoading(true);

        const { data, error } = await supabase.rpc("get_friends", {
          user_id_param: session.user.id,
        });

        if (error) throw error;

        const friendIds = (data || []).map((f: any) => f.id);
        let onlineStatus: Record<string, boolean> = {};

        if (friendIds.length > 0) {
          const { data: onlineData } = await supabase
            .from("user_status")
            .select("user_id, is_online, last_seen")
            .in("user_id", friendIds);

          onlineStatus = (onlineData || []).reduce((acc: any, curr: any) => {
            acc[curr.user_id] = curr.is_online || false;
            return acc;
          }, {});
        }

        const mappedFriends: ChatFriend[] = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name || "Unknown",
          email: item.email || "",
          username: item.username || "",
          image: item.image || "",
          status: item.status || "pending",
          is_online: onlineStatus[item.id] || false,
          last_seen: item.last_seen || "",
          last_message: item.last_message || "",
          last_message_time: item.last_message_time || "",
        }));

        setFriends(mappedFriends);
        friendsFetchedRef.current = true;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        logger.error("Error fetching friends:", error);
        toast.error("Không thể tải danh sách bạn bè");
      } finally {
        setLoading(false);
      }
    },
    [session?.user?.id, toast],
  );

  // ============================================
  // ✅ GỬI KẾT BẠN - THÊM VÀO HOOK
  // ============================================

  const sendFriendRequest = useCallback(
    async (friendId: string) => {
      if (!session?.user?.id) {
        toast.error("Vui lòng đăng nhập");
        return false;
      }

      if (friendId === session.user.id) {
        toast.error("Không thể kết bạn với chính mình");
        return false;
      }

      try {
        // Kiểm tra đã gửi yêu cầu chưa
        const { data: existing } = await supabase
          .from("friends")
          .select("*")
          .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
          .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`)
          .maybeSingle();

        if (existing) {
          toast.warning("Đã gửi yêu cầu hoặc đã là bạn bè");
          return false;
        }

        const { error } = await supabase.from("friends").insert({
          user_id: session.user.id,
          friend_id: friendId,
          status: "pending",
        });

        if (error) throw error;

        toast.success("Đã gửi yêu cầu kết bạn");
        friendsFetchedRef.current = false;
        await fetchFriends();
        return true;
      } catch (error: any) {
        toast.error(error?.message || "Có lỗi xảy ra");
        return false;
      }
    },
    [session?.user?.id, toast, fetchFriends],
  );

  // ============================================
  // CHẤP NHẬN KẾT BẠN
  // ============================================

  const acceptFriendRequest = useCallback(
    async (friendId: string) => {
      if (!session?.user?.id) return false;

      try {
        const { error } = await supabase
          .from("friends")
          .update({ status: "accepted", updated_at: new Date().toISOString() })
          .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`)
          .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)
          .eq("status", "pending");

        if (error) throw error;

        toast.success("Đã chấp nhận kết bạn");
        friendsFetchedRef.current = false;
        await fetchFriends();
        return true;
      } catch (error: any) {
        toast.error(error?.message || "Có lỗi xảy ra");
        return false;
      }
    },
    [session?.user?.id, toast, fetchFriends],
  );

  // ============================================
  // GỬI TIN NHẮN
  // ============================================

  const sendMessage = useCallback(
    async (receiverId: string, content: string, file?: File) => {
      if (!session?.user?.id) {
        toast.error("Vui lòng đăng nhập");
        return null;
      }

      if (!receiverId) {
        toast.error("Vui lòng chọn người nhận");
        return null;
      }

      try {
        let fileUrl = null;
        let fileName = null;
        let fileType = null;
        let fileSize = null;

        if (file) {
          const filePath = `messages/${session.user.id}/${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("chat-files")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from("chat-files")
            .getPublicUrl(filePath);

          fileUrl = urlData.publicUrl;
          fileName = file.name;
          fileType = file.type;
          fileSize = file.size;
        }

        const messageData = {
          sender_id: session.user.id,
          receiver_id: receiverId,
          content: content.trim() || "",
          file_url: fileUrl,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          read: false,
          created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("messages")
          .insert(messageData)
          .select(
            `
          *,
          sender:sender_id(name, image)
        `,
          )
          .single();

        if (error) throw error;

        const formattedMessage: ChatMessage = {
          id: data.id,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          content: data.content || "",
          file_url: data.file_url || undefined,
          file_name: data.file_name || undefined,
          file_type: data.file_type || undefined,
          file_size: data.file_size || undefined,
          read: data.read || false,
          created_at: data.created_at,
          sender_name: data.sender?.name || "Unknown",
          sender_image: data.sender?.image || "",
        };

        if (selectedFriendId === receiverId) {
          setMessages((prev) => [...prev, formattedMessage]);
        }

        return formattedMessage;
      } catch (error: any) {
        logger.error("Error sending message:", error);
        toast.error(error?.message || "Có lỗi xảy ra khi gửi tin nhắn");
        return null;
      }
    },
    [session?.user?.id, selectedFriendId, toast],
  );

  // ============================================
  // LẤY TIN NHẮN
  // ============================================

  const fetchMessages = useCallback(
    async (friendId: string, limit: number = 50) => {
      if (!session?.user?.id) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setLoading(true);
        const { data, error } = await supabase.rpc("get_messages", {
          user_id_param: session.user.id,
          friend_id_param: friendId,
          limit_count: limit,
        });

        if (controller.signal.aborted) return;
        if (error) throw error;

        const formattedMessages: ChatMessage[] = (data || []).map(
          (item: any) => ({
            id: item.id,
            sender_id: item.sender_id,
            receiver_id: item.receiver_id,
            content: item.content || "",
            file_url: item.file_url || undefined,
            file_name: item.file_name || undefined,
            file_type: item.file_type || undefined,
            file_size: item.file_size || undefined,
            read: item.read || false,
            created_at: item.created_at,
            sender_name: item.sender_name || "Unknown",
            sender_image: item.sender_image || "",
          }),
        );

        const sortedMessages = formattedMessages.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );

        setMessages(sortedMessages);
        setSelectedFriendId(friendId);

        await supabase
          .from("messages")
          .update({ read: true })
          .eq("sender_id", friendId)
          .eq("receiver_id", session.user.id)
          .eq("read", false);

        await countUnreadMessages();
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        logger.error("Error fetching messages:", error);
        toast.error("Không thể tải tin nhắn");
      } finally {
        setLoading(false);
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [session?.user?.id, toast],
  );

  // ============================================
  // ĐẾM TIN NHẮN CHƯA ĐỌC
  // ============================================

  const countUnreadMessages = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", session.user.id)
        .eq("read", false);

      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (error) {
      logger.error("Error counting unread messages:", error);
    }
  }, [session?.user?.id]);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    if (!session?.user?.id) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetchFriends(controller.signal);

    return () => {
      controller.abort();
      abortControllerRef.current = null;
    };
  }, [session?.user?.id, fetchFriends]);

  // Realtime subscription
  useEffect(() => {
    if (!session?.user?.id) return;

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
      isSubscribedRef.current = false;
    }

    const setupSubscription = async () => {
      const channel = supabase
        .channel(`messages-${session.user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${session.user.id}`,
          },
          async (payload) => {
            const newMessage = payload.new as any;

            const { data: sender } = await supabase
              .from("users")
              .select("name, image")
              .eq("id", newMessage.sender_id)
              .single();

            const formattedMessage: ChatMessage = {
              id: newMessage.id,
              sender_id: newMessage.sender_id,
              receiver_id: newMessage.receiver_id,
              content: newMessage.content || "",
              file_url: newMessage.file_url || undefined,
              file_name: newMessage.file_name || undefined,
              file_type: newMessage.file_type || undefined,
              file_size: newMessage.file_size || undefined,
              read: newMessage.read || false,
              created_at: newMessage.created_at,
              sender_name: sender?.name || "Unknown",
              sender_image: sender?.image || "",
            };

            if (selectedFriendId === newMessage.sender_id) {
              setMessages((prev) => [...prev, formattedMessage]);
            }

            if (newMessage.sender_id !== session.user.id) {
              setUnreadCount((prev) => prev + 1);
              toast.info(`📩 Tin nhắn mới từ ${sender?.name || "Unknown"}`);
            }
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            logger.log("✅ Subscribed to messages channel");
            isSubscribedRef.current = true;
          }
        });

      subscriptionRef.current = channel;
    };

    setupSubscription();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [session?.user?.id, selectedFriendId, toast]);

  return {
    friends,
    messages,
    loading,
    unreadCount,
    selectedFriendId,
    fetchFriends,
    sendFriendRequest, // ✅ Đã thêm
    acceptFriendRequest, // ✅ Đã thêm
    sendMessage,
    fetchMessages,
    countUnreadMessages,
    setSelectedFriendId,
  };
}
