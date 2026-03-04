import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Chakra_Petch } from "next/font/google";
import LenisScrollProvider from "@/providers/lenis-provider";
import InkCursor from "@/components/InkCursor";
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

const BASE_URL = "https://samssiams.vercel.app";

export const metadata: Metadata = {
  // ── Core ──────────────────────────────────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Samssiams — Samuel Cruz | Full Stack Developer & Project Manager",
    template: "%s | Samssiams",
  },
  description:
    "Samssiams is the personal portfolio of Samuel Cruz — a Full Stack Developer, Project Manager, and Photographer based in Bataan, Philippines. Explore projects, experience, and photography.",
  keywords: [
    "Samssiams",
    "Samuel Cruz",
    "Full Stack Developer Philippines",
    "Project Manager Philippines",
    "Next.js Developer Bataan",
    "Web Developer Portfolio",
    "Photographer Bataan",
    "samssiams.com",
  ],
  authors: [{ name: "Samuel Cruz", url: BASE_URL }],
  creator: "Samuel Cruz",
  publisher: "Samuel Cruz",

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: "/",
  },

  // ── Open Graph (Facebook, Discord, Messenger previews) ────────────────────
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Samssiams",
    title: "Samssiams — Samuel Cruz | Full Stack Developer & Project Manager",
    description:
      "Portfolio of Samuel Cruz (Samssiams) — Full Stack Developer, Project Manager, and Photographer from Bataan, Philippines.",
    images: [
      {
        url: "/og-image.png", // 📌 Add a 1200×630 image to your /public folder
        width: 1200,
        height: 630,
        alt: "Samssiams — Samuel Cruz Portfolio",
      },
    ],
    locale: "en_PH",
  },

  // ── Twitter / X Card ──────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Samssiams — Samuel Cruz | Full Stack Developer & Project Manager",
    description:
      "Portfolio of Samuel Cruz (Samssiams) — Full Stack Developer, Project Manager, and Photographer from Bataan, Philippines.",
    images: ["/og-image.png"],
    creator: "@samssiams",
  },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Icons ─────────────────────────────────────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  verification: {
    google: "google9e1efc589e721703",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// ── JSON-LD Structured Data (Person schema) ───────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Samuel Cruz",
  alternateName: "Samssiams",
  url: BASE_URL,
  image: `${BASE_URL}/profile.png`,
  jobTitle: ["Full Stack Developer", "Project Manager", "Photographer"],
  description:
    "Samssiams is Samuel Cruz — a Full Stack Developer, Project Manager, and Photographer based in Bataan, Philippines.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bataan",
    addressCountry: "PH",
  },
  sameAs: [
    "https://www.instagram.com/samssiams/",
    "https://www.linkedin.com/in/samssiams/",
    "https://github.com/samssiams",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${chakraPetch.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a1e28]`}
      >
        <InkCursor />
        {children}
      </body>
    </html>
  );
}