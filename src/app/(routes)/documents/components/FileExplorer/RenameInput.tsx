// src/app/(routes)/documents/components/FileExplorer/RenameInput.tsx

"use client";

import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RenameInputProps } from "./types";

export function RenameInput({
  initialValue,
  onSave,
  onCancel,
  isLoading = false,
}: RenameInputProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleSave = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    if (trimmed === initialValue) {
      onCancel();
      return;
    }
    await onSave(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div
      className="flex items-center gap-1 flex-1 min-w-0"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-black/50 border border-cyan-500/50 rounded px-2 py-0.5 text-sm text-white outline-none focus:border-cyan-400 min-w-0"
        disabled={isLoading}
        maxLength={100}
      />
      <button
        onClick={handleSave}
        className="p-0.5 text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
        disabled={isLoading || !value.trim()}
        title="Lưu"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={onCancel}
        className="p-0.5 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
        disabled={isLoading}
        title="Hủy"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
