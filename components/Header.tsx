"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks } from "@/routers/router";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";

const shakeVariants = {
  idle: { rotate: 0 },
  shake: {
    rotate: [0, -8, 8, -5, 5, -2, 2, 0],
    transition: { duration: 0.8, ease: "easeInOut" as const },
  },
};

const Header = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      {/* ── Desktop Header ── */}
      <header
        className={`fixed left-1/2 z-[49] -translate-x-1/2 py-1 transition-all duration-300 hidden md:block w-[800px]
          ${scrolled
            ? "top-4 rounded-2xl bg-[#1a1e28]/75 backdrop-blur-md border border-white/10"
            : "top-0 bg-transparent border-transparent shadow-none"
          }`}
      >
        <div className="flex w-full max-w-[800px] items-center justify-between px-6 py-2 text-[20px] font-bold">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavClick("/")}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <motion.div
              variants={shakeVariants}
              animate={logoHovered ? "shake" : "idle"}
            >
              <Image src="/Rectangle 93.svg" alt="Logo" width={40} height={40} priority />
            </motion.div>
            <span className="text-white">Samssiams</span>
          </div>
          <nav className="flex gap-9 text-[16px] font-semibold tracking-[0.38px]">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              const isHome = href === "/" && pathname === "/";
              return (
                <span
                  key={href}
                  className="group relative text-white cursor-pointer"
                  onClick={() => handleNavClick(href)}
                >
                  {label}
                  {!isHome && (
                    <span className={`absolute left-0 bottom-0 h-[2px] bg-white transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                  )}
                </span>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── Mobile Header ── */}
      <header
        className={`fixed left-0 right-0 z-[49] transition-all duration-300 md:hidden
          ${scrolled
            ? "top-3 mx-4 rounded-2xl bg-[#1a1e28]/85 backdrop-blur-md border border-white/10"
            : "top-0 bg-[#1a1e28]/90 backdrop-blur-sm border-b border-white/5"
          }`}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick("/")}>
            <Image src="/Rectangle 93.svg" alt="Logo" width={32} height={32} priority />
            <span className="text-white font-bold text-[17px]">Samssiams</span>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-1 cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Dropdown Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[48] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed left-4 right-4 z-[49] md:hidden rounded-2xl overflow-hidden"
              style={{
                top: scrolled ? "68px" : "60px",
                background: "rgba(22, 26, 35, 0.95)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <nav className="flex flex-col py-2">
                {navLinks.map(({ label, href }, i) => {
                  const isActive = pathname === href;
                  return (
                    <motion.span
                      key={href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleNavClick(href)}
                      className="px-6 py-3 text-[15px] font-semibold tracking-[0.38px] cursor-pointer flex items-center justify-between"
                      style={{
                        color: isActive ? "#81E6D9" : "rgba(255,255,255,0.85)",
                        borderBottom: i < navLinks.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      }}
                    >
                      {label}
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#81E6D9" }} />
                      )}
                    </motion.span>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;