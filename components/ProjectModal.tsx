"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SquareArrowOutUpRight, Download } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  year: string;
  stacks: string[];
  description: string;
  image: string;
  github: string;
  website?: string;
  apk?: string; // ✅ Added APK support
}

export default function Modal({
  isOpen,
  onClose,
  title,
  year,
  stacks,
  description,
  image,
  github,
  website,
  apk,
}: ModalProps) {
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
            className="bg-[#2F3445] border-2 border-[#81E6D9] rounded-2xl shadow-xl p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title + Year */}
            <div className="mb-4">
              <h2 className="text-white text-xl font-bold">{title}</h2>
              <p className="text-gray-400 text-sm">{year}</p>
            </div>

            {/* Image */}
            {image && (
              <div className="mb-4 flex justify-center">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-auto max-h-[300px] object-contain rounded-lg"
                />
              </div>
            )}

            {/* Stacks */}
            <div className="mb-3">
              <p className="text-white-400 font-semibold mb-1">Stacks</p>
              <div className="flex flex-wrap gap-2">
                {stacks.map((stack, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm font-medium bg-[#1F2430] border border-[#81E6D9] text-[#81E6D9] rounded-lg"
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-[15px] leading-relaxed mb-3">
              {description}
            </p>

            {/* GitHub + Website + APK Links */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* GitHub */}
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-1 text-[#81E6D9] text-[13px] cursor-pointer group"
                >
                  <span>GitHub</span>
                  <SquareArrowOutUpRight size={12} />
                  <span className="absolute bottom-[-2px] left-0 w-0 h-[1px] bg-[#81E6D9] transition-all duration-500 group-hover:w-full"></span>
                </a>
              )}

              {/* Website */}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-1 text-[#81E6D9] text-[13px] cursor-pointer group"
                >
                  <span>Website</span>
                  <SquareArrowOutUpRight size={12} />
                  <span className="absolute bottom-[-2px] left-0 w-0 h-[1px] bg-[#81E6D9] transition-all duration-500 group-hover:w-full"></span>
                </a>
              )}

              {/* APK Download */}
              {apk && (
                <a
                  href={apk}
                  download
                  className="relative inline-flex items-center gap-1 text-[#81E6D9] text-[13px] cursor-pointer group"
                >
                  <span>Download APK</span>
                  <Download size={12} />
                  <span className="absolute bottom-[-2px] left-0 w-0 h-[1px] bg-[#81E6D9] transition-all duration-500 group-hover:w-full"></span>
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}