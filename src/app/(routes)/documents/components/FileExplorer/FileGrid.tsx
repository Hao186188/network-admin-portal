// src/app/(routes)/documents/components/FileExplorer/FileGrid.tsx
// FIXED: Thêm debug

"use client";

import { motion } from "framer-motion";
import { FileItem } from "./FileItem";
import { FileGridProps } from "./types";

export function FileGrid({
  items,
  onFolderClick,
  onDelete,
  selectedItems,
  setSelectedItems,
}: FileGridProps) {
  // ✅ Debug
  console.log("📊 FileGrid received items:", items.length);

  const handleSelect = (id: string, ctrlKey: boolean) => {
    if (ctrlKey) {
      setSelectedItems(
        selectedItems.includes(id)
          ? selectedItems.filter((i) => i !== id)
          : [...selectedItems, id],
      );
    } else {
      setSelectedItems([id]);
    }
  };

  if (items.length === 0) {
    console.log("⚠️ FileGrid: No items to display");
    return (
      <div className="text-center py-16 text-white/40">
        <p>Thư mục trống</p>
      </div>
    );
  }

  console.log("✅ FileGrid: Rendering", items.length, "items");
  console.log(
    "📋 Items:",
    items.map((d) => ({ id: d.id, title: d.title })),
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.5) }}
        >
          <FileItem
            item={item}
            onFolderClick={onFolderClick}
            onDelete={onDelete}
            isSelected={selectedItems.includes(item.id)}
            onSelect={handleSelect}
          />
        </motion.div>
      ))}
    </div>
  );
}
