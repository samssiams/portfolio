import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Chakra_Petch } from "next/font/google";
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
    "Samuel Cruz is a full stack developer and technical project manager focused on reliable web products, delivery coordination, and photography-driven visual storytelling.",
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
      "Samuel Cruz is a full stack developer and technical project manager focused on reliable web products, delivery coordination, and photography-driven visual storytelling.",
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
      "Samuel Cruz is a full stack developer and technical project manager focused on reliable web products, delivery coordination, and photography-driven visual storytelling.",
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

  // ✅ SEO IMPROVEMENT 1: Added category — helps Google classify your site type
  category: "technology",

  verification: {
    google: "8Q50KcwGCkpRr4aU-vcuDd1zZcNc5Js0dcFSgNInD3w",
  },
};

// ── Viewport (accessibility fix) ─────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // maximumScale removed — allows users to zoom for accessibility
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
    "Samssiams is Samuel Cruz, a full stack developer and technical project manager in Bataan, Philippines, focused on reliable web products, delivery coordination, and photography.",
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
  // ✅ SEO IMPROVEMENT 2: Added knowsAbout — tells Google your areas of expertise
  knowsAbout: [
    "Full Stack Web Development",
    "Project Management",
    "Next.js",
    "Supabase",
    "Photography",
    "Agile Methodology",
  ],
  // ✅ SEO IMPROVEMENT 3: Added nationality and worksFor — richer Google Knowledge Panel
  nationality: {
    "@type": "Country",
    name: "Philippines",
  },
  worksFor: {
    "@type": "Organization",
    name: "Freelancer",
    url: "https://www.freelancer.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* ✅ SEO IMPROVEMENT 4: DNS prefetch for external domains —
            speeds up page load which is a Google ranking factor */}
        <link rel="dns-prefetch" href="//www.instagram.com" />
        <link rel="dns-prefetch" href="//www.linkedin.com" />
        <link rel="dns-prefetch" href="//github.com" />
      </head>
      <body
        suppressHydrationWarning
        className={`${chakraPetch.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a1e28]`}
      >
        <InkCursor />
        {/* <main> satisfies the landmark accessibility requirement */}
        <main>{children}</main>
      </body>
    </html>
  );
}
