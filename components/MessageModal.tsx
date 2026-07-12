"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, X } from "lucide-react";
import AnimatedTealEdge from "./AnimatedTealEdge";
import { SlotText } from "slot-text/react";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputStyle = {
  width: "100%",
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "14px",
  outline: "none",
  letterSpacing: "0.2px",
};

const fieldShellStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  padding: "11px 12px",
  borderRadius: "14px",
  background: "linear-gradient(180deg, rgba(15,18,25,0.78), rgba(15,18,25,0.52))",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  transition: "border 200ms ease, background 200ms ease, box-shadow 200ms ease",
};

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const MAX_ATTACHMENTS = 3;
const MAX_MESSAGE_WORDS = 110;
const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_ATTACHMENT_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".txt", ".doc", ".docx"];

const countWords = (value: string) => value.trim().match(/\S+/g)?.length ?? 0;

const limitWords = (value: string) => {
  const matches = [...value.matchAll(/\S+/g)];
  const firstExtraWord = matches[MAX_MESSAGE_WORDS];
  return firstExtraWord?.index === undefined ? value : value.slice(0, firstExtraWord.index).trimEnd();
};

const fields = ["name", "email", "subject", "message"] as const;
type FieldName = (typeof fields)[number];
type FormErrors = Partial<Record<FieldName, string>>;

const fieldLabels: Record<FieldName, string> = {
  name: "Name",
  email: "Email",
  subject: "Subject",
  message: "Message",
};

export default function MessageModal({ isOpen, onClose, onSuccess }: MessageModalProps) {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [attachmentToast, setAttachmentToast] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [messageLimitWarning, setMessageLimitWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageValueRef = useRef("");
  const attachmentToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageLimitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showAttachmentToast = (message: string) => {
    setAttachmentToast(message);
    if (attachmentToastTimeoutRef.current) {
      clearTimeout(attachmentToastTimeoutRef.current);
    }
    attachmentToastTimeoutRef.current = setTimeout(() => setAttachmentToast(""), 3000);
  };

  const showMessageLimitWarning = () => {
    setMessageLimitWarning(true);
    if (messageLimitTimeoutRef.current) {
      clearTimeout(messageLimitTimeoutRef.current);
    }
    messageLimitTimeoutRef.current = setTimeout(() => {
      setMessageLimitWarning(false);
      messageLimitTimeoutRef.current = null;
    }, 3000);
  };

  const getFieldShellStyle = (field: FieldName) => ({
    ...fieldShellStyle,
    border: errors[field]
      ? "1px solid rgba(255,100,100,0.55)"
      : focused === field
        ? "1px solid rgba(129,230,217,0.5)"
        : "1px solid rgba(255,255,255,0.12)",
    background: focused === field
      ? "linear-gradient(180deg, rgba(18,24,31,0.9), rgba(16,22,29,0.72))"
      : fieldShellStyle.background,
    boxShadow: focused === field
      ? "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 3px rgba(129,230,217,0.06)"
      : fieldShellStyle.boxShadow,
  });

  const validateForm = (values: Record<FieldName, string>) => {
    const nextErrors: FormErrors = {};
    const missingFields = fields.filter((field) => !values[field].trim());

    missingFields.forEach((field) => {
      nextErrors[field] = "Required";
    });

    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Invalid email";
      setFormError("Enter a valid email address.");
    } else if (missingFields.length === fields.length) {
      setFormError("Please fill out all fields.");
    } else if (missingFields.length === 1) {
      setFormError(`Please fill out the ${fieldLabels[missingFields[0]].toLowerCase()} field.`);
    } else if (missingFields.length > 1) {
      setFormError("Please complete the highlighted fields.");
    } else {
      setFormError("");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearFieldError = (field: FieldName) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const rest = { ...current };
      delete rest[field];
      if (Object.keys(rest).length === 0) {
        setFormError("");
      }
      return rest;
    });
  };

  const handleClose = () => {
    setErrors({});
    setFormError("");
    setShowSuccess(false);
    setLoading(false);
    setFocused(null);
    messageValueRef.current = "";
    setMessageLimitWarning(false);
    if (messageLimitTimeoutRef.current) {
      clearTimeout(messageLimitTimeoutRef.current);
      messageLimitTimeoutRef.current = null;
    }
    setAttachmentToast("");
    if (attachmentToastTimeoutRef.current) {
      clearTimeout(attachmentToastTimeoutRef.current);
      attachmentToastTimeoutRef.current = null;
    }
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > MAX_ATTACHMENTS) {
      showAttachmentToast(`You can only attach ${MAX_ATTACHMENTS} files.`);
      setAttachments([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      return (
        file.size > 0 &&
        file.size <= MAX_ATTACHMENT_SIZE &&
        ALLOWED_ATTACHMENT_TYPES.includes(file.type) &&
        ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension)
      );
    });

    if (validFiles.length !== selectedFiles.length) {
      setFormError("Only real PDF, image, text, or Word files up to 5 MB are allowed.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }

    setAttachments(validFiles);
  };

  const clearAttachments = () => {
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.currentTarget.value;
    const previousValue = messageValueRef.current;
    const limitedValue = limitWords(nextValue);
    const addsAfterLimit =
      countWords(previousValue) >= MAX_MESSAGE_WORDS && nextValue.length > previousValue.length;

    if (addsAfterLimit) {
      event.currentTarget.value = previousValue;
      showMessageLimitWarning();
    } else if (limitedValue !== nextValue) {
      event.currentTarget.value = limitedValue;
      messageValueRef.current = limitedValue;
      showMessageLimitWarning();
    } else {
      messageValueRef.current = nextValue;
    }
    clearFieldError("message");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const subject = formData.get("subject")?.toString() || "";
    const message = formData.get("message")?.toString() || "";

    if (!validateForm({ name, email, subject, message })) {
      return;
    }

    setLoading(true);

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        form.reset();
        setErrors({});
        setFormError("");
        setMessageLimitWarning(false);
        messageValueRef.current = "";
        setAttachments([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setShowSuccess(true);
        onSuccess?.();
        setTimeout(() => {
          setShowSuccess(false);
          handleClose();
        }, 3000);
      } else {
        let errorMessage = "Error sending message. Try again later.";

        try {
          const data = await res.json();
          if (typeof data.error === "string") {
            errorMessage = data.error;
          }
        } catch {
          // Keep the fallback message when the server does not return JSON.
        }

        setFormError(errorMessage);
      }
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong. Please try again.");
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
                type="button"
                onClick={handleClose}
                className="flex w-8 h-8 items-center justify-center p-0 rounded-full cursor-pointer ml-2 mt-1 shrink-0 text-gray-400 transition-all duration-200 hover:text-white hover:bg-white/10"
                style={{
                  background: "rgba(255,255,255,0.045)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                aria-label="Close message form"
              >
                <X size={18} />
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
              <form className="space-y-3" onSubmit={handleSubmit} noValidate>
                <AnimatePresence>
                  {formError && (
                    <motion.p
                      id="message-form-error"
                      className="rounded-lg px-3 py-2 text-[12px] tracking-[0.25px]"
                      style={{
                        color: "#FF8A8A",
                        background: "rgba(255,100,100,0.08)",
                        border: "1px solid rgba(255,100,100,0.22)",
                      }}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      {formError}
                    </motion.p>
                  )}
                </AnimatePresence>
                {(["name", "email", "subject"] as const).map((field) => (
                  <div key={field} style={getFieldShellStyle(field)}>
                    <input
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      placeholder={fieldLabels[field]}
                      onFocus={() => setFocused(field)}
                      onBlur={() => setFocused(null)}
                      onChange={() => clearFieldError(field)}
                      aria-invalid={Boolean(errors[field])}
                      aria-describedby={formError ? "message-form-error" : undefined}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <div>
                  <div style={{ ...getFieldShellStyle("message"), alignItems: "flex-start" }}>
                    <textarea
                      name="message"
                      placeholder="Message"
                      rows={3}
                      className="[scrollbar-color:rgba(129,230,217,0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-button]:hidden [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#81E6D9]/30 [&::-webkit-scrollbar-thumb:hover]:bg-[#81E6D9]/50"
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      onChange={handleMessageChange}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        [formError && "message-form-error", messageLimitWarning && "message-limit-warning"]
                          .filter(Boolean)
                          .join(" ") || undefined
                      }
                      style={{
                        ...inputStyle,
                        resize: "none",
                      }}
                    />
                  </div>
                  <AnimatePresence>
                    {messageLimitWarning && (
                      <motion.p
                        id="message-limit-warning"
                        role="status"
                        className="overflow-hidden px-2 text-[11px] text-[#FFC850]"
                        initial={{ height: 0, marginTop: 0, opacity: 0 }}
                        animate={{ height: "auto", marginTop: 6, opacity: 1 }}
                        exit={{ height: 0, marginTop: 0, opacity: 0 }}
                      >
                        You&apos;ve reached the {MAX_MESSAGE_WORDS}-word limit.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ALLOWED_ATTACHMENT_EXTENSIONS.join(",")}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] tracking-[0.25px] transition-all duration-200"
                    style={{
                      background: attachmentToast ? "rgba(255,200,80,0.1)" : "rgba(129,230,217,0.055)",
                      border: attachmentToast
                        ? "1px solid rgba(255,200,80,0.4)"
                        : "1px dashed rgba(129,230,217,0.24)",
                      color: attachmentToast ? "#FFC850" : "rgba(255,255,255,0.72)",
                    }}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Paperclip
                        size={15}
                        strokeWidth={1.9}
                        style={{ color: attachmentToast ? "#FFC850" : "#81E6D9" }}
                      />
                      <span className="truncate">
                        {attachmentToast ||
                          (attachments.length === 1
                            ? attachments[0].name
                            : attachments.length > 1
                              ? `${attachments.length} files attached`
                              : "Attach files")}
                      </span>
                    </span>
                  </button>

                  {attachments.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAttachments}
                      className="flex w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-xl text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                      aria-label="Remove all attachments"
                    >
                        <X
                          size={50}
                          strokeWidth={2}
                          style={{ transform: "translateY(10px, -10px)" }}
                        />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative isolate w-full overflow-hidden rounded-xl border-0 px-4 py-2.5 font-semibold tracking-[0.3px] transition-all duration-300"
                  style={{
                    color: loading ? "rgba(129,230,217,0.4)" : "#81E6D9",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.65 : 1,
                  }}
                >
                  <AnimatedTealEdge />
                  <SlotText
                    className="relative z-10"
                    text={loading ? "Sending..." : "Send"}
                    options={{
                      direction: loading ? "up" : "down",
                      stagger: 30,
                      duration: 260,
                      bounce: 0.3,
                      interrupt: false,
                    }}
                  />
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
