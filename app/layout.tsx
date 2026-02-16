import type { Metadata } from "next";
import { Geist, Geist_Mono, Chakra_Petch } from "next/font/google";
import LenisScrollProvider from "@/providers/lenis-provider";
import InkCursor from "@/components/InkCursor"; // 👈 import new cursor
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Samssiams",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${chakraPetch.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LenisScrollProvider>
            <InkCursor /> {/* ✅ custom Ink Cursor */}
            {children}
        </LenisScrollProvider>
      </body>
    </html>
  );
}
