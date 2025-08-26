"use client";

import { motion } from "framer-motion";

export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      className={`bg-gray-700 ${className}`}
    />
  );
}
