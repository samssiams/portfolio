"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks } from "@/routers/router";

const Header = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  return (
<header
  className={`fixed left-1/2 z-10 -translate-x-1/2 py-1 transition-all duration-300 w-[800px]
${scrolled
  ? "top-4 rounded-2xl bg-[#1a1e2a]/75 backdrop-blur-md border border-white/10"
  : "top-0 bg-transparent border-transparent shadow-none"
}`}
>
      <div className="flex w-full max-w-[800px] items-center justify-between px-6 py-2 text-[20px] font-bold">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavClick("/")}
        >
          <Image src="/Rectangle 93.svg" alt="Logo" width={40} height={40} priority />
          <span className="text-white">Samssiams</span>
        </div>

        {/* Navigation */}
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
  );
};

export default Header;