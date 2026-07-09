// src/components/chat/ChatInput.tsx
// Vai trò: Input gửi tin nhắn

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { File, Image as ImageIcon, Paperclip, Send, X } from "lucide-react";
import { useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (content: string, file?: File) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() && !file) return;
    onSendMessage(message, file || undefined);
    setMessage("");
    setFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 50 * 1024 * 1024) {
        alert("File quá lớn (tối đa 50MB)");
        return;
      }
      setFile(selected);
    }
    e.target.value = "";
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 border-t border-border">
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 p-2 mb-2 rounded-lg bg-muted/50"
          >
            <File className="w-4 h-4 text-primary" />
            <span className="text-sm flex-1 truncate">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(0)} KB
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleRemoveFile}
            >
              <X className="w-3 h-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-5 h-5" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.zip,.rar"
            className="hidden"
            onChange={handleFileSelect}
            multiple={false}
          />
        </div>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && !file) || isLoading}
          className="gap-2"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Gửi</span>
        </Button>
      </div>
    </div>
  );
}
