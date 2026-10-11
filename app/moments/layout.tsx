import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Little Corner for Us",
  robots: { index: false, follow: false },
};

export default function MomentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
