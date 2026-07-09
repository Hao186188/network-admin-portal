// src/components/forum/ForumImageGallery.tsx
// Vai trò: Hiển thị gallery ảnh trong bài viết

"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { ForumImageViewer } from "./ForumImageViewer";

interface ForumImageGalleryProps {
  images: string[];
  className?: string;
  maxDisplay?: number;
}

export function ForumImageGallery({
  images,
  className,
  maxDisplay = 4,
}: ForumImageGalleryProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const displayImages = images.slice(0, maxDisplay);
  const remaining = images.length - maxDisplay;

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  // Grid layout based on number of images
  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-2 grid-rows-2";
    if (count === 4) return "grid-cols-2 grid-rows-2";
    return "grid-cols-3";
  };

  const getImageClass = (index: number, total: number) => {
    if (total === 3 && index === 0) return "col-span-2 row-span-2";
    if (total === 1) return "max-h-[600px]";
    return "";
  };

  return (
    <>
      <div
        className={cn(
          "grid gap-1 rounded-xl overflow-hidden",
          getGridClass(displayImages.length),
          className,
        )}
      >
        {displayImages.map((img, index) => (
          <button
            key={index}
            className={cn(
              "relative group cursor-zoom-in overflow-hidden bg-muted",
              getImageClass(index, displayImages.length),
              // For 3 images, first image is larger
              displayImages.length === 3 && index === 0
                ? "aspect-auto"
                : "aspect-square",
            )}
            onClick={() => openViewer(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

            {/* Show remaining count */}
            {index === maxDisplay - 1 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  +{remaining}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Image Viewer Modal */}
      <ForumImageViewer
        images={images}
        currentIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onIndexChange={setViewerIndex}
      />
    </>
  );
}
