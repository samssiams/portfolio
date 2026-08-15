"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const resetScroll = () => window.scrollTo(0, 0);
    resetScroll();
    const frameId = window.requestAnimationFrame(resetScroll);
    window.addEventListener("pageshow", resetScroll);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pageshow", resetScroll);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSamePageClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);

    if (pathname === href) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`fixed left-1/2 z-[49] -translate-x-1/2 py-1 transition-all duration-300 hidden md:block w-[800px]
          ${scrolled
            ? "top-4 rounded-2xl bg-[#1a1e28]/75 backdrop-blur-md border border-white/10"
            : "top-0 bg-transparent border-transparent shadow-none"
          } ${menuOpen ? "overflow-hidden" : ""}`}
      >
        <div className="flex w-full max-w-[800px] items-center justify-between px-6 py-2 text-[20px] font-bold">
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer"
            onClick={(event) => handleSamePageClick(event, "/")}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            aria-label="Samssiams home"
          >
            <motion.div
              variants={shakeVariants}
              animate={logoHovered ? "shake" : "idle"}
            >
              <Image src="/Rectangle 93.svg" alt="Samssiams logo" width={40} height={40} priority />
            </motion.div>
            <span className="text-white">Samssiams</span>
          </Link>
          <nav className="flex gap-9 text-[16px] font-semibold tracking-[0.38px]" aria-label="Primary navigation">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              const isHome = href === "/" && pathname === "/";
              return (
                <Link
                  key={href}
                  href={href}
                  data-cuelume-hover="tick"
                  className="group relative text-white cursor-pointer"
                  onClick={(event) => handleSamePageClick(event, href)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                  {!isHome && (
                    <span className={`absolute left-0 bottom-0 h-[2px] bg-white transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header
        className={`fixed left-0 right-0 z-[49] transition-[top,background-color,border-color] duration-300 md:hidden
          ${scrolled
            ? "top-3 mx-4 rounded-2xl bg-[#1a1e28]/85 backdrop-blur-md border border-white/10"
            : "top-0 bg-[#1a1e28]/90 backdrop-blur-sm border-b border-white/5"
          }`}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer"
            onClick={(event) => handleSamePageClick(event, "/")}
            aria-label="Samssiams home"
          >
            <Image src="/Rectangle 93.svg" alt="Samssiams logo" width={32} height={32} priority />
            <span className="text-white font-bold text-[17px]">Samssiams</span>
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            data-cuelume-hover="toggle"
            className={`flex h-9 w-9 items-center justify-center rounded-full text-white cursor-pointer transition-all duration-200 ${
              menuOpen
                ? "bg-white/10 border border-white/15"
                : "border border-transparent"
            }`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="flex flex-col overflow-hidden border-t border-white/10 py-2"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0, y: -6 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {navLinks.map(({ label, href }, i) => {
                const isActive = pathname === href;
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.24, delay: 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={href}
                      data-cuelume-hover="tick"
                      onClick={(event) => handleSamePageClick(event, href)}
                      className="flex items-center justify-between px-5 py-3 text-[15px] font-semibold tracking-[0.38px] cursor-pointer"
                      style={{
                        color: isActive ? "#81E6D9" : "rgba(255,255,255,0.85)",
                        borderBottom: i < navLinks.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      }}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {label}
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#81E6D9" }} />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-[48] md:hidden" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Header;
