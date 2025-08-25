"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/routers/router";

const Header = () => {
  return (
    <header className="fixed top-0 left-1/2 z-10 w-full -translate-x-1/2 bg-[#232732]/50 backdrop-blur-sm py-1">
      <div className="mx-auto flex w-full max-w-[900px] items-center justify-between px-6 py-2 text-[20px] font-bold">
        {/* Logo */}
        <div className="flex items-center gap-3">
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
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="group relative text-white"
            >
              <span>{label}</span>
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
