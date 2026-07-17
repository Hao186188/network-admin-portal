// src/app/(routes)/documents/components/FileExplorer/FileGrid.tsx

"use client";

import { motion } from "framer-motion";
import { FileItem } from "./FileItem";
import { FileGridProps } from "./types";

export function FileGrid({
  items,
  onFolderClick,
  onDelete,
  onRename,
  selectedItems,
  setSelectedItems,
}: FileGridProps) {
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
    return (
      <div className="text-center py-16 text-white/40">
        <p>Thư mục trống</p>
      </div>
    );
  }

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
            onRename={onRename}
            isSelected={selectedItems.includes(item.id)}
            onSelect={handleSelect}
          />
        </motion.div>
      ))}
    </div>
  );
}
