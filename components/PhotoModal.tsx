"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { MapPin } from "lucide-react";
import { useState } from "react";

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
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative rounded-2xl p-4 max-w-5xl w-full mx-4 flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Row */}
            <div className="relative flex items-center justify-center w-full gap-4">
              {/* Prev */}
              {photos.length > 1 && (
                <motion.img
                  key={`prev-${photos[prevIndex].src}`}
                  src={photos[prevIndex].src}
                  alt="Previous"
                  className="w-[200px] h-[140px] object-cover rounded-lg opacity-50 cursor-pointer"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                  whileHover={{ scale: 1.05, opacity: 0.7 }}
                  drag="x"
                  dragConstraints={{ left: -30, right: 30 }}
                  dragElastic={0.3}
                  onClick={() => !dragging && handleSelect(prevIndex)}
                />
              )}

              {/* Current — glassy frame with info inside */}
              <motion.div
                key={`frame-${currentPhoto.src}`}
                className="flex flex-col rounded-2xl"
                style={{
                  background: "rgba(22, 26, 35, 0.82)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                  padding: "8px 8px 0px 8px",
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Image */}
                <motion.img
                  src={currentPhoto.src}
                  alt="Selected"
                  className="w-[500px] max-h-[420px] object-contain rounded-xl cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragStart={() => setDragging(true)}
                  onDragEnd={handleDragEnd}
                />

                {/* Info bar inside the frame */}
                <div className="flex items-center justify-between px-4 py-4 mt-1">
                  {/* CC */}
                  {currentPhoto.cc ? (
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-medium px-1 py-0.5 rounded-sm"
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.6)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        cc
                      </span>
                      <span className="text-white text-sm">{currentPhoto.cc}</span>
                    </div>
                  ) : <span />}

                  {/* Location */}
                  {currentPhoto.location && (
                    <span
                      className="flex items-center gap-1 text-sm"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      <MapPin size={12} />
                      {currentPhoto.location}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Next */}
              {photos.length > 1 && (
                <motion.img
                  key={`next-${photos[nextIndex].src}`}
                  src={photos[nextIndex].src}
                  alt="Next"
                  className="w-[200px] h-[140px] object-cover rounded-lg opacity-50 cursor-pointer"
                  style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                  whileHover={{ scale: 1.05, opacity: 0.7 }}
                  drag="x"
                  dragConstraints={{ left: -30, right: 30 }}
                  dragElastic={0.3}
                  onClick={() => !dragging && handleSelect(nextIndex)}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}