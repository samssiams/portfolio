import type { Metadata } from "next";
import HomeClient from "./Homeclient";

export const metadata: Metadata = {
  title: "Samssiams - Full Stack Developer & Technical Project Manager",
  description:
    "Samuel Cruz is a full stack developer and technical project manager in Bataan, Philippines, focused on reliable web products, delivery coordination, and visual storytelling.",
  alternates: {
    canonical: "https://samssiams.vercel.app/",
  },
  openGraph: {
    title: "Samssiams - Full Stack Developer & Technical Project Manager",
    description:
      "Samuel Cruz is a full stack developer and technical project manager in Bataan, Philippines, focused on reliable web products, delivery coordination, and visual storytelling.",
    url: "https://samssiams.vercel.app/",
  },
};

export default function Page() {
  return <HomeClient />;
}