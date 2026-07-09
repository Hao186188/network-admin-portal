// src/components/forum/ForumImageViewer.tsx
// Vai trò: Modal hiển thị ảnh fullscreen

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    X,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ForumImageViewerProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export function ForumImageViewer({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
}: ForumImageViewerProps) {
  const [index, setIndex] = useState(currentIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const currentImage = images[index] || images[0];

  // Reset khi đóng
  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Update index khi currentIndex thay đổi
  useEffect(() => {
    if (currentIndex !== index) {
      setIndex(currentIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    const newIndex = index > 0 ? index - 1 : images.length - 1;
    setIndex(newIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onIndexChange?.(newIndex);
  }, [index, images.length, onIndexChange]);

  const handleNext = useCallback(() => {
    const newIndex = index < images.length - 1 ? index + 1 : 0;
    setIndex(newIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onIndexChange?.(newIndex);
  }, [index, images.length, onIndexChange]);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.5, 0.5));
    if (scale <= 0.5) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  const handleDownload = useCallback(() => {
    if (currentImage) {
      const link = document.createElement("a");
      link.href = currentImage;
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [currentImage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext, handleZoomIn, handleZoomOut]);

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    },
    [handleZoomIn, handleZoomOut],
  );

  // Drag to pan
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale > 1) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      }
    },
    [scale, position],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleZoomOut}
          >
            <ZoomOut className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleZoomIn}
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleDownload}
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-sm z-10">
            {index + 1} / {images.length}
          </div>
        )}

        {/* Image */}
        <div
          className="relative w-full h-full flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <motion.img
            src={currentImage}
            alt={`Image ${index + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain select-none"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transition: isDragging ? "none" : "transform 0.2s ease-out",
            }}
            drag={false}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-10",
                "hidden sm:block",
              )}
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-10",
                "hidden sm:block",
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 overflow-x-auto max-w-[80vw] px-4">
            {images.map((img, i) => (
              <button
                key={i}
                className={cn(
                  "w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                  i === index
                    ? "border-white scale-110"
                    : "border-white/30 hover:border-white/60",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                  onIndexChange?.(i);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
