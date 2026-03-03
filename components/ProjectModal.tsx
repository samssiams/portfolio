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
  apk?: string;
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
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="rounded-2xl shadow-xl p-6 max-w-md w-full mx-4"
            style={{
              background: "rgba(34, 39, 50, 0.65)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title + Year + Close */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white text-xl font-bold">{title}</h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{year}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors duration-200 mt-1 cursor-pointer"
                style={{ lineHeight: 1 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Image — static, no hover interaction */}
            {image && (
              <div
                className="mb-4 rounded-lg overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full h-auto max-h-[300px] object-contain rounded-lg"
                />
              </div>
            )}

            {/* Stacks */}
            <div className="mb-3">
              <p className="text-white font-semibold mb-2 text-[14px]">Stacks</p>
              <div className="flex flex-wrap gap-2">
                {stacks.map((stack, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm font-medium rounded-lg"
                    style={{
                      background: "rgba(129,230,217,0.08)",
                      border: "1px solid rgba(129,230,217,0.3)",
                      color: "#81E6D9",
                    }}
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-[15px] leading-relaxed mb-4">
              {description}
            </p>

            {/* Divider */}
            <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", marginBottom: "12px" }} />

            {/* Links */}
            <div className="flex items-center gap-4 flex-wrap">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-1 text-[13px] cursor-pointer group"
                  style={{ color: "#81E6D9" }}
                >
                  <span>GitHub</span>
                  <SquareArrowOutUpRight size={12} />
                  <span className="absolute bottom-[-2px] left-0 w-0 h-[1px] bg-[#81E6D9] transition-all duration-500 group-hover:w-full" />
                </a>
              )}

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-1 text-[13px] cursor-pointer group"
                  style={{ color: "#81E6D9" }}
                >
                  <span>Website</span>
                  <SquareArrowOutUpRight size={12} />
                  <span className="absolute bottom-[-2px] left-0 w-0 h-[1px] bg-[#81E6D9] transition-all duration-500 group-hover:w-full" />
                </a>
              )}

              {apk && (
                <a
                  href={apk}
                  download
                  className="relative inline-flex items-center gap-1 text-[13px] cursor-pointer group"
                  style={{ color: "#81E6D9" }}
                >
                  <span>Download APK</span>
                  <Download size={12} />
                  <span className="absolute bottom-[-2px] left-0 w-0 h-[1px] bg-[#81E6D9] transition-all duration-500 group-hover:w-full" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}