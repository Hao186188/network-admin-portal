// src/components/ui/confirm-dialog.tsx
// CONFIRM DIALOG COMPONENT

"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger",
}: ConfirmDialogProps) {
  const variantColors = {
    danger: {
      button: "bg-red-500 hover:bg-red-600",
      icon: "text-red-500",
      border: "border-red-500/20",
    },
    warning: {
      button: "bg-yellow-500 hover:bg-yellow-600",
      icon: "text-yellow-500",
      border: "border-yellow-500/20",
    },
    info: {
      button: "bg-blue-500 hover:bg-blue-600",
      icon: "text-blue-500",
      border: "border-blue-500/20",
    },
  };

  const colors = variantColors[variant];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full bg-${variant === "danger" ? "red" : variant === "warning" ? "yellow" : "blue"}-500/10`}
            >
              <AlertTriangle className={`w-5 h-5 ${colors.icon}`} />
            </div>
            <DialogTitle className="text-white">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-white/60 pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/10 text-white/60 hover:text-white hover:border-white/20"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 ${colors.button} text-white`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
