import type { Metadata } from "next";

const BASE_URL = "https://samssiams.vercel.app";

export const metadata: Metadata = {
  title: "Photography - Bataan Photo Gallery",
  description:
    "Photography by Samuel Cruz featuring nature, macro, places, and animal photos captured around Bataan, Philippines.",
  alternates: {
    canonical: "/photography",
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/photography`,
    siteName: "Samssiams",
    title: "Samssiams Photography",
    description:
      "A Bataan photography gallery by Samuel Cruz, featuring nature, macro, places, and animal photography.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Samssiams photography gallery by Samuel Cruz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samssiams Photography",
    description:
      "Nature, macro, places, and animal photography captured around Bataan by Samuel Cruz.",
    images: ["/og-image.png"],
  },
};

const photosJsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Samssiams Photography",
  url: `${BASE_URL}/photography`,
  creator: {
    "@type": "Person",
    name: "Samuel Cruz",
    alternateName: "Samssiams",
  },
  contentLocation: {
    "@type": "Place",
    name: "Bataan, Philippines",
  },
  about: ["Nature photography", "Macro photography", "Places photography", "Animal photography"],
};

export default function PhotographyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photosJsonLd) }}
      />
      {children}
    </>
  );
}
