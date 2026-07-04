// src/components/forms/input-with-icon.tsx
// Vai trò: Input với icon bên trái

"use client";

import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label?: string;
  required?: boolean;
}

export const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ icon: Icon, label, required, className, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="text-sm font-medium mb-2 block">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input ref={ref} className={`pl-10 ${className}`} {...props} />
        </div>
      </div>
    );
  },
);

InputWithIcon.displayName = "InputWithIcon";
