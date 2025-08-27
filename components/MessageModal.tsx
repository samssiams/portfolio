"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessageModal({ isOpen, onClose }: MessageModalProps) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const subject = formData.get("subject")?.toString() || ""; // ✅ include subject
    const message = formData.get("message")?.toString() || "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, subject, message }), // ✅ send subject
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        form.reset();
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
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
          className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-[#2F3445] border-2 border-[#81E6D9] rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {showSuccess ? (
              <motion.div
                className="flex flex-col items-center justify-center py-10 text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <CheckCircle2
                    size={64}
                    className="text-[#81E6D9] drop-shadow-lg"
                  />
                </motion.div>
                <motion.p
                  className="text-white text-[18px] font-sm mt-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Message sent successfully!
                </motion.p>
              </motion.div>
            ) : (
              <>
                <div className="mb-4 text-center">
                  <h2 className="text-white text-xl font-bold">
                    Send me a message
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Fill out the form below and I’ll get back to you.
                  </p>
                </div>

                <form className="space-y-3" onSubmit={handleSubmit}>
                  <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#1F2430] text-white border border-[#81E6D9] focus:outline-none focus:ring-2 focus:ring-[#81E6D9]"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#1F2430] text-white border border-[#81E6D9] focus:outline-none focus:ring-2 focus:ring-[#81E6D9]"
                  />
                  <input
                    name="subject"
                    type="text"
                    placeholder="Subject"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#1F2430] text-white border border-[#81E6D9] focus:outline-none focus:ring-2 focus:ring-[#81E6D9]"
                  />
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows={4}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#1F2430] text-white border border-[#81E6D9] focus:outline-none focus:ring-2 focus:ring-[#81E6D9]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-[#81E6D9] text-black font-semibold px-4 py-2.5 rounded-lg hover:bg-[#4FD1C5] transition ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Sending..." : "Send"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}