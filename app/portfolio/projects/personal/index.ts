import type { Project } from "../types";

export const personalProjects: Project[] = [
  {
    title: "Protecture",
    year: "2025",
    stacks: ["Next.js", "JavaScript", "Tailwind", "Supabase"],
    shortDescription:
      "A Next.js and Supabase web system that uses FGSM adversarial perturbation to protect architectural images from being scraped and replicated by AI models.",
    description:
      "Protecture is a system designed to secure architectural images by applying FGSM-based encryption, protecting them from unauthorized AI use.",
    image: "/protecture1.png",
    github: "https://github.com/samssiams/Protecture",
    website: "https://protectures.vercel.app/auth/login",
  },
  {
    title: "Thrift and Trend",
    year: "2024",
    stacks: ["Android Studio", "Java", "Firebase"],
    shortDescription:
      "An Android thrift store app built with Java and Firebase that makes buying and selling secondhand clothing straightforward, affordable, and worth trusting.",
    description:
      "Thrift and Trend is a thrift store offering a wide selection of used and second-hand clothing that focuses on providing pre-loved fashion items at affordable prices.",
    image: "/tat.png",
    github: "https://github.com/samssiams/Thrift-and-Trend",
    website: "",
    apk: "/Finals_ThriftandTrend.apk",
  },
  {
    title: "Precision Arms",
    year: "2023",
    stacks: ["HTML", "PHP", "Tailwind", "MySql"],
    shortDescription:
      "A PHP and MySQL weblog built for firearm enthusiasts who want clean, readable content without the noise. Gear specs, reviews, and analysis laid out to actually be useful.",
    description:
      "Precision Arms is a weblog for gun enthusiasts, offering insights, expert advice, and detailed analysis of firearms and accessories to enhance knowledge and decision-making.",
    image: "/pa1.png",
    github: "https://github.com/samssiams/Precision-Arms",
    website: "",
  },
  {
    title: "BankITO",
    year: "2022",
    stacks: ["C#", "CSS", "MySQL"],
    shortDescription:
      "A C# desktop banking system backed by MySQL where getting the data model right was everything. Built with reliability in mind from the very first table.",
    description:
      "BankITO is a banking system that securely manages customer accounts and transactions, ensuring efficiency and reliability in financial operations.",
    image: "/bankito.png",
    github: "https://github.com/samssiams/BankITO",
    website: "",
  },
];
