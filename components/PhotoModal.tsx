"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, MapPin } from "lucide-react";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  cc?: string;
  location?: string;
}

export default function PhotoModal({
  isOpen,
  onClose,
  image,
  cc,
  location,
}: PhotoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-[#2F3445] border-2 border-[#81E6D9] rounded-2xl shadow-xl p-4 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {image && (
              <div className="relative">
                <img
                  src={image}
                  alt="Selected Photo"
                  className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                />

                {/* Download button */}
                <a
                  href={image}
                  download
                  className="absolute bottom-3 right-3 text-white hover:text-[#81E6D9] transition-colors"
                >
                  <Download size={0} strokeWidth={2} />
                </a>
              </div>
            )}

            {/* Photo details */}
            <div className="mt-3 flex flex-col gap-1">
              {/* Location on top */}
              {location && (
                <span className="flex items-center gap-1 text-gray-200 text-sm">
                  <MapPin size={12} /> {location}
                </span>
              )}

              {/* CC below */}
              {cc && (
                <div className="flex items-center gap-1.5">
                  <span className="bg-gray-600 text-white text-[10px] font-medium px-1 py-0.5 rounded-sm">
                    cc
                  </span>
                  <span className="text-white text-sm">{cc}</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
