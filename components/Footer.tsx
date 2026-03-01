"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#222732] backdrop-blur-sm py-1">
      <div className="flex items-center justify-center text-[13px] font-regular text-gray-400 tracking-[0.38px] mb-8 mt-10">
        © {new Date().getFullYear()} Samuel Cruz. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
