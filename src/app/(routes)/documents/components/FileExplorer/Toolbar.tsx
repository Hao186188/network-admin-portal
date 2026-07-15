// src/app/(routes)/documents/components/FileExplorer/Toolbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    FolderPlus,
    Grid3x3,
    Home,
    List,
    RefreshCw,
    Upload,
} from "lucide-react";
import { useRef } from "react";
import { ToolbarProps } from "./types";

export function Toolbar({
  viewMode,
  onViewModeChange,
  onNewFolder,
  onUpload,
  onRefresh,
  currentFolderId,
  onNavigateUp,
  onNavigateHome,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border-b border-white/5 bg-black/40">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/5"
          onClick={onNavigateUp}
          disabled={!currentFolderId}
          title="Quay lại"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/5"
          onClick={onNavigateHome}
          title="Về thư viện"
        >
          <Home className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-white/70 hover:text-white hover:bg-white/5"
          onClick={onNewFolder}
        >
          <FolderPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Thư mục mới</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-white/70 hover:text-white hover:bg-white/5"
          onClick={handleUploadClick}
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Tải lên</span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.jpg,.jpeg,.png,.gif,.svg,.webp,.mp4,.mp3,.txt,.md,.json,.xml,.yaml,.yml,.js,.ts,.jsx,.tsx,.html,.css,.py,.java,.c,.cpp,.go,.rs,.sh,.bat,.pkt,.pka,.cfg,.conf,.log"
        />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/5"
          onClick={onRefresh}
          title="Làm mới"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1" />

      {/* View Mode */}
      <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 rounded-md",
            viewMode === "grid"
              ? "bg-cyan-500/20 text-cyan-400"
              : "text-white/40 hover:text-white hover:bg-white/5",
          )}
          onClick={() => onViewModeChange("grid")}
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 rounded-md",
            viewMode === "list"
              ? "bg-cyan-500/20 text-cyan-400"
              : "text-white/40 hover:text-white hover:bg-white/5",
          )}
          onClick={() => onViewModeChange("list")}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
