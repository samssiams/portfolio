"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "10px",
  background: "rgba(15, 18, 25, 0.55)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "white",
  fontSize: "14px",
  outline: "none",
  transition: "border 200ms ease",
};

export default function MessageModal({ isOpen, onClose, onSuccess }: MessageModalProps) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const subject = formData.get("subject")?.toString() || "";
    const message = formData.get("message")?.toString() || "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, subject, message }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        form.reset();
        setShowSuccess(true);
        onSuccess?.();
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 3000);
      } else {
        alert("Error sending message. Try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative rounded-2xl shadow-xl p-5 sm:p-6 max-w-sm w-full"
            style={{
              background: "rgba(26, 30, 40, 0.88)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-white text-[18px] sm:text-xl font-bold leading-tight">
                  Send me a message
                </h2>
                <p className="text-[12px] sm:text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Fill out the form and I&apos;ll get back to you.
                </p>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer ml-2 mt-1 transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: "0.5px", background: "rgba(255,255,255,0.08)", marginBottom: "16px" }} />

            {showSuccess ? (
              <motion.div
                className="flex flex-col items-center justify-center py-8 sm:py-10 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative flex items-center justify-center">
                  <motion.div
                    className="absolute rounded-full"
                    style={{ border: "1px solid rgba(129,230,217,0.3)", width: 72, height: 72 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.4, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.div
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: 64,
                      height: 64,
                      background: "rgba(129,230,217,0.06)",
                      border: "1px solid rgba(129,230,217,0.3)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <motion.svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                      <motion.path
                        d="M6 14.5L11.5 20L22 9"
                        stroke="#81E6D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
                      />
                    </motion.svg>
                  </motion.div>
                </div>

                <motion.p className="text-white text-[15px] font-medium mt-5 tracking-[0.3px]"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  Message sent successfully!
                </motion.p>
                <motion.p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  I&apos;ll get back to you soon.
                </motion.p>
              </motion.div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubmit}>
                {(["name", "email", "subject"] as const).map((field) => (
                  <input
                    key={field}
                    name={field}
                    type={field === "email" ? "email" : "text"}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    required
                    onFocus={() => setFocused(field)}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputStyle,
                      border: focused === field
                        ? "1px solid rgba(129,230,217,0.5)"
                        : "1px solid rgba(255,255,255,0.12)",
                    }}
                  />
                ))}
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={3}
                  required
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  style={{
                    ...inputStyle,
                    resize: "none",
                    border: focused === "message"
                      ? "1px solid rgba(129,230,217,0.5)"
                      : "1px solid rgba(255,255,255,0.12)",
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold px-4 py-2.5 rounded-xl tracking-[0.3px] transition-all duration-300 cursor-pointer"
                  style={{
                    background: loading ? "rgba(129,230,217,0.05)" : "rgba(129,230,217,0.08)",
                    border: "1px solid rgba(129,230,217,0.3)",
                    color: loading ? "rgba(129,230,217,0.4)" : "#81E6D9",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={e => {
                    if (!loading) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(129,230,217,0.15)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(129,230,217,0.5)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!loading) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(129,230,217,0.08)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(129,230,217,0.3)";
                    }
                  }}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}