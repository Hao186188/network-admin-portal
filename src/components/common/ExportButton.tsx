// src/components/common/ExportButton.tsx
// Vai trò: Nút xuất dữ liệu

"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExport } from "@/hooks/use-export";
import { useToast } from "@/hooks/use-toast";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";

interface ExportButtonProps {
  type: "submissions" | "assignments";
  filters?: {
    assignment_id?: string;
    assignment_title?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "ALL";
    from_date?: string;
    to_date?: string;
  };
}

export function ExportButton({ type, filters = {} }: ExportButtonProps) {
  const { toast } = useToast();
  const { exportSubmissionsToCSV, exportAssignmentsToCSV } = useExport();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "csv" | "excel") => {
    setIsExporting(true);
    try {
      let result;
      if (type === "submissions") {
        result = await exportSubmissionsToCSV(filters);
      } else {
        result = await exportAssignmentsToCSV();
      }

      if (result?.success) {
        toast.success(`Đã xuất ${result.count} bản ghi thành công!`);
      } else {
        toast.error(result?.error || "Xuất dữ liệu thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xuất dữ liệu");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={isExporting}>
          <Download className="w-4 h-4" />
          {isExporting ? "Đang xuất..." : "Xuất dữ liệu"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")} className="gap-2">
          <FileText className="w-4 h-4" />
          Xuất CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("excel")}
          className="gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Xuất Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
