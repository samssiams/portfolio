"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  if (!isOpen || photos.length === 0) return null;

  const [dragging, setDragging] = useState(false);

  const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
  const nextIndex = (currentIndex + 1) % photos.length;

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDragEnd = (
    _: any,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const swipe = info.offset.x;

    if (swipe < -100) {
      // dragged left → next image
      setCurrentIndex((currentIndex + 1) % photos.length);
    } else if (swipe > 100) {
      // dragged right → previous image
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
            className="relative bg-transparent rounded-2xl p-4 max-w-5xl w-full mx-4 flex flex-col items-center"
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
                  whileHover={{ scale: 1.05, opacity: 0.7 }}
                  drag="x"
                  dragConstraints={{ left: -30, right: 30 }}
                  dragElastic={0.3}
                  onClick={() => !dragging && handleSelect(prevIndex)}
                />
              )}

              {/* Current (draggable to change image) */}
              <motion.img
                key={`current-${currentPhoto.src}`}
                src={currentPhoto.src}
                alt="Selected"
                className="w-[500px] max-h-[420px] object-contain rounded-xl border-2 border-[#81E6D9] shadow-xl cursor-grab active:cursor-grabbing"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragStart={() => setDragging(true)}
                onDragEnd={handleDragEnd}
              />

              {/* Next */}
              {photos.length > 1 && (
                <motion.img
                  key={`next-${photos[nextIndex].src}`}
                  src={photos[nextIndex].src}
                  alt="Next"
                  className="w-[200px] h-[140px] object-cover rounded-lg opacity-50 cursor-pointer"
                  whileHover={{ scale: 1.05, opacity: 0.7 }}
                  drag="x"
                  dragConstraints={{ left: -30, right: 30 }}
                  dragElastic={0.3}
                  onClick={() => !dragging && handleSelect(nextIndex)}
                />
              )}
            </div>

            {/* Photo Info */}
            <div className="mt-3 flex flex-col gap-1 text-center">
              {currentPhoto.location && (
                <span className="flex items-center gap-1 text-gray-200 text-sm justify-center">
                  <MapPin size={12} /> {currentPhoto.location}
                </span>
              )}

              {currentPhoto.cc && (
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="bg-gray-600 text-white text-[10px] font-medium px-1 py-0.5 rounded-sm">
                    cc
                  </span>
                  <span className="text-white text-sm">{currentPhoto.cc}</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
