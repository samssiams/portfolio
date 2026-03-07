"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SquareArrowOutUpRight, Download, Briefcase } from "lucide-react";

const tealScrollbar = `
  .modal-scroll::-webkit-scrollbar {
    display: none;
  }
  .modal-scroll {
    scrollbar-width: none;
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  year: string;
  stacks: string[];
  role?: string;
  contributions?: string[];
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
  role,
  contributions,
  description,
  image,
  github,
  website,
  apk,
}: ModalProps) {
  const hasStacks = stacks && stacks.length > 0;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{tealScrollbar}</style>
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[100] px-4"
            style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative max-w-md w-full shadow-xl"
              style={{
                background: "rgba(26, 30, 40, 0.65)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "16px",
                maxHeight: "85vh",
                overflow: "hidden",
              }}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bottom fade hint */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
                style={{
                  height: "48px",
                  borderRadius: "0 0 16px 16px",
                  background: "linear-gradient(to bottom, transparent, rgba(26,30,40,0.95))",
                }}
              />

              <div
                className="modal-scroll overflow-y-auto p-5 sm:p-6 pb-8"
                style={{ maxHeight: "85vh", borderRadius: "16px" }}
              >
                {/* Title + Year + Close */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-white text-[18px] sm:text-xl font-bold">{title}</h2>
                    <p className="text-[12px] sm:text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{year}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-7 h-7 rounded-full cursor-pointer mt-1 shrink-0 group"
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1L13 13M13 1L1 13" stroke="rgba(156,163,175,1)" strokeWidth="1.5" strokeLinecap="round" className="transition-all duration-200 group-hover:stroke-white"/>
                    </svg>
                  </button>
                </div>

                {/* Image */}
                {image && (
                  <div
                    className="mb-4 rounded-lg overflow-hidden"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-auto max-h-[220px] sm:max-h-[300px] object-contain rounded-lg"
                    />
                  </div>
                )}

                {/* Role OR Stacks */}
                {!hasStacks && role ? (
                  <div className="mb-3">
                    <p className="text-white font-semibold mb-2 text-[13px] sm:text-[14px]">Role</p>
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(129,230,217,0.06)",
                        border: "1px solid rgba(129,230,217,0.2)",
                      }}
                    >
                      <Briefcase size={13} color="#81E6D9" strokeWidth={1.5} />
                      <span
                        className="text-[12px] sm:text-[13px] font-medium tracking-wide"
                        style={{ color: "#81E6D9" }}
                      >
                        {role}
                      </span>
                    </div>
                  </div>
                ) : hasStacks ? (
                  <div className="mb-3">
                    <p className="text-white font-semibold mb-2 text-[13px] sm:text-[14px]">Stacks</p>
                    <div className="flex flex-wrap gap-2">
                      {stacks.map((stack, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-[12px] sm:text-sm font-medium rounded-lg"
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
                ) : null}

                {/* Full description */}
                <p className="text-gray-300 text-[13px] sm:text-[15px] leading-relaxed mb-4">
                  {description}
                </p>

                {/* Key Contributions */}
                {contributions && contributions.length > 0 && (
                  <div
                    className="mb-4 rounded-xl px-4 pt-3.5 pb-4"
                    style={{
                      background: "rgba(10, 12, 18, 0.5)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                    }}
                  >
                    <p className="text-white font-semibold text-[13px] sm:text-[14px] mb-2">
                      Key Contributions
                    </p>
                    <div
                      className="mb-3"
                      style={{ height: "0.5px", background: "rgba(255,255,255,0.06)" }}
                    />
                    <div className="flex flex-col gap-2">
                      {contributions.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span
                            className="shrink-0 mt-[-.1px] text-[13px]"
                            style={{ color: "rgba(129,230,217,0.4)" }}
                          >
                            ›
                          </span>
                          <span className="text-gray-400 text-[12px] sm:text-[13px] leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Divider + Links */}
                {(github || website || apk) && (
                  <>
                    <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", marginBottom: "12px" }} />
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
                  </>
                )}

              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}