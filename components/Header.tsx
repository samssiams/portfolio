"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks } from "@/routers/router";

const Header = () => {
  const pathname = usePathname();

  const handleNavClick = (href: string) => {
    if (pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = href;
    }
  };

  return (
    <header className="fixed top-0 left-1/2 z-10 w-full -translate-x-1/2 bg-[#222732]/90 backdrop-blur-sm py-1">
      <div className="mx-auto flex w-full max-w-[900px] items-center justify-between px-6 py-2 text-[20px] font-bold">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavClick("/")}
        >
          <Image
            src="/Rectangle 93.svg"
            alt="Logo"
            width={40}
            height={40}
            priority
          />
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
                  <span
                    className={`absolute left-0 bottom-0 h-[2px] bg-white transition-all duration-300 
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
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
