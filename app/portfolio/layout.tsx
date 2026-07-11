import type { Metadata } from "next";

const BASE_URL = "https://samssiams.vercel.app";

export const metadata: Metadata = {
  title: "Work & Projects - Technical Project Manager & Developer",
  description:
    "Selected projects by Samuel Cruz, including technical project management, full-stack development, digital banking, mobile adaptation, AI analytics, and web systems.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/portfolio`,
    siteName: "Samssiams",
    title: "Samssiams Work & Projects",
    description:
      "Explore Samuel Cruz's project work across technical project management, full-stack development, AI prototypes, mobile adaptation, and web systems.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Samssiams duck logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samssiams Work & Projects",
    description:
      "Technical project management and full-stack development work by Samuel Cruz.",
    images: ["/og-image.png"],
  },
};

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Samssiams Work & Projects",
  url: `${BASE_URL}/portfolio`,
  description:
    "A portfolio of selected project management and development work by Samuel Cruz.",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      "Upcoming App Bar Project",
      "Tamkeen",
      "Noticer",
      "Prominence Bank",
      "InnerX",
      "Protecture",
      "Thrift and Trend",
      "Precision Arms",
      "BankITO",
    ].map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
    })),
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      {children}
    </>
  );
}
