import type { Metadata } from "next";
import HomeClient from "./Homeclient";

export const metadata: Metadata = {
  title: "Samssiams - Full Stack Developer & Technical Project Manager",
  description:
    "Samuel Cruz — Full Stack Developer, Project Manager, and Photographer based in Bataan, Philippines.",
  alternates: {
    canonical: "https://samssiams.vercel.app/",
  },
  openGraph: {
    title: "Samssiams - Full Stack Developer & Technical Project Manager",
    description:
      "Samuel Cruz — Full Stack Developer, Project Manager, and Photographer based in Bataan, Philippines.",
    url: "https://samssiams.vercel.app/",
  },
};

export default function Page() {
  return <HomeClient />;
}