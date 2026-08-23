"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { MapPin } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface Photo {
  src: string;
  cc: string;
  location: string;
  theme: string;
}

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export default function PhotoModal({
  isOpen,
  onClose,
  photos,
  currentIndex,
  setCurrentIndex,
}: PhotoModalProps) {
  const [dragging, setDragging] = useState(false);

  if (!isOpen || photos.length === 0) return null;

  const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
  const nextIndex = (currentIndex + 1) % photos.length;

  const handleSelect = (index: number) => setCurrentIndex(index);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    const swipe = info.offset.x;
    if (swipe < -100) {
      setCurrentIndex((currentIndex + 1) % photos.length);
    } else if (swipe > 100) {
      setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
    }
    setDragging(false);
  };

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative rounded-2xl w-full max-w-5xl flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Row */}
            <div className="relative flex items-center justify-center w-full gap-2 sm:gap-4">

              {/* Prev — hidden on mobile */}
              {photos.length > 1 && (
                <div
                  className="hidden sm:block relative w-[140px] md:w-[200px] h-[100px] md:h-[140px] rounded-lg overflow-hidden opacity-50 hover:opacity-70 cursor-pointer flex-shrink-0 transition-opacity duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                  onClick={() => !dragging && handleSelect(prevIndex)}
                >
                  <Image
                    src={photos[prevIndex].src}
                    alt="Previous"
                    fill
                    loading="lazy"
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Current — glassy frame — DRAGGABLE */}
              <motion.div
                key={`frame-${currentPhoto.src}`}
                className="flex flex-col rounded-2xl w-full sm:w-auto cursor-grab active:cursor-grabbing"
                style={{
                  background: "rgba(26, 30, 40, 0.82)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                  padding: "8px 8px 0px 8px",
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragStart={() => setDragging(true)}
                onDragEnd={handleDragEnd}
              >
                {/* Current image */}
                <div className="relative w-full sm:w-[500px] max-h-[55vh] sm:max-h-[420px] aspect-[4/3] pointer-events-none select-none">
                  <Image
                    src={currentPhoto.src}
                    alt="Selected"
                    fill
                    priority
                    sizes="(min-width: 640px) 500px, 100vw"
                    className="object-contain rounded-xl"
                    draggable={false}
                  />
                </div>

                {/* Info bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-3 sm:py-4 mt-1 gap-1.5 sm:gap-0">
                  {currentPhoto.cc ? (
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-medium px-1 py-0.5 rounded-sm shrink-0"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.6)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        cc
                      </span>
                      <span className="text-white text-[12px] sm:text-sm leading-tight">{currentPhoto.cc}</span>
                    </div>
                  ) : <span />}

                  {currentPhoto.location && (
                    <span
                      className="flex items-center gap-1 text-[11px] sm:text-sm"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      <MapPin size={11} className="shrink-0" />
                      {currentPhoto.location}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Next — hidden on mobile */}
              {photos.length > 1 && (
                <div
                  className="hidden sm:block relative w-[140px] md:w-[200px] h-[100px] md:h-[140px] rounded-lg overflow-hidden opacity-50 hover:opacity-70 cursor-pointer flex-shrink-0 transition-opacity duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                  onClick={() => !dragging && handleSelect(nextIndex)}
                >
                  <Image
                    src={photos[nextIndex].src}
                    alt="Next"
                    fill
                    loading="lazy"
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Close hint */}
            {photos.length > 1 && (
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <span
                  className="text-[11px] tracking-[0.4px]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Click anywhere outside to close
                </span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
