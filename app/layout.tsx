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
    default: "Samssiams - Full Stack Developer & Technical Project Manager",
    template: "%s | Samssiams",
  },
  description:
    "Developer and Technical Project Manager delivering efficient, user-focused solutions. I coordinate teams, manage workflows, and capture stories through photography.",
  keywords: [
    "Samssiams",
    "Samuel Cruz",
    "Full Stack Developer Philippines",
    "Quality Assurance Philippines",
    "Technical Project Manager Philippines",
    "Project Manager Philippines",
    "Next.js Developer Bataan",
    "Web Developer Portfolio",
    "Photographer Bataan",
    "Photography",
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
    title: "Samssiams - Full Stack Developer & Technical Project Manager",
    description:
      "Developer and Technical Project Manager delivering efficient, user-focused solutions. I coordinate teams, manage workflows, and capture stories through photography.",
    images: [
      {
        url: "/og-image.png",
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
    title: "Samssiams - Full Stack Developer & Technical Project Manager",
    description:
      "Developer and Technical Project Manager delivering efficient, user-focused solutions. I coordinate teams, manage workflows, and capture stories through photography.",
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
    icon: "/icon.png",
    apple: "/icon.png",
  },

  verification: {
    google: "8Q50KcwGCkpRr4aU-vcuDd1zZcNc5Js0dcFSgNInD3w",
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