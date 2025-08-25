"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
}

export default function PhotoModal({ isOpen, onClose, image }: PhotoModalProps) {
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
                {/* Plain white download icon bottom-right */}
                <a
                  href={image}
                  download
                  className="absolute bottom-2 right-4 text-white"
                >
                  <Download size={17} />
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
