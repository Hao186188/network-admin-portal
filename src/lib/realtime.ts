// src/lib/realtime.ts
// Vai trò: Utility quản lý realtime

"use client";

import { supabase } from "@/lib/db/supabase-client";
import { logger } from "@/lib/logger";

export interface RealtimeConfig {
  topic: string;
  events: string[];
  onMessage?: (payload: any) => void;
  onSubscribe?: () => void;
  onError?: (error: any) => void;
}

export class RealtimeManager {
  private channels: Map<string, any> = new Map();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  async init() {
    if (this.isInitialized) return;
    try {
      await supabase.realtime.setAuth();
      this.isInitialized = true;
      logger.log("✅ Realtime initialized");
    } catch (error) {
      logger.error("❌ Realtime init error:", error);
    }
  }

  subscribe(config: RealtimeConfig) {
    const { topic, events, onMessage, onSubscribe, onError } = config;

    // Kiểm tra channel đã tồn tại
    if (this.channels.has(topic)) {
      logger.log(`⏭️ Channel ${topic} already exists`);
      return this.channels.get(topic);
    }

    // Tạo channel
    const channel = supabase.channel(topic, {
      config: {
        broadcast: { self: true },
        presence: { key: topic },
      },
    });

    // Đăng ký events
    events.forEach((event) => {
      channel.on("broadcast", { event }, ({ payload }) => {
        logger.log(`📨 Broadcast ${event} on ${topic}:`, payload);
        if (onMessage) onMessage(payload);
      });
    });

    // Subscribe
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        logger.log(`✅ Subscribed to ${topic}`);
        if (onSubscribe) onSubscribe();
      } else if (status === "CHANNEL_ERROR") {
        logger.error(`❌ Channel error on ${topic}`);
        if (onError) onError(status);
      }
    });

    // Lưu channel
    this.channels.set(topic, channel);
    return channel;
  }

  unsubscribe(topic: string) {
    const channel = this.channels.get(topic);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(topic);
      logger.log(`✅ Unsubscribed from ${topic}`);
    }
  }

  send(topic: string, event: string, payload: any) {
    const channel = this.channels.get(topic);
    if (!channel) {
      logger.warn(`❌ Channel ${topic} not found`);
      return;
    }

    channel.send({
      type: "broadcast",
      event,
      payload,
    });
  }

  cleanup() {
    this.channels.forEach((channel, topic) => {
      supabase.removeChannel(channel);
      this.channels.delete(topic);
    });
    logger.log("✅ All channels cleaned up");
  }
}

// Singleton instance
export const realtimeManager = new RealtimeManager();
