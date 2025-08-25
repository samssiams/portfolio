"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Modal from "@/components/ProjectModal";

interface Project {
  title: string;
  year: string;
  stacks: string[];
  description: string;
  image: string;
  github: string;
  website?: string;
  apk?: string;
}

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      title: "Protecture",
      year: "2025",
      stacks: ["Next.js", "JavaScript", "Tailwind", "Supabase"],
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
      description:
        "BankITO is a banking system that securely manages customer accounts and transactions, ensuring efficiency and reliability in financial operations.",
      image: "/bankito.png",
      github: "https://github.com/samssiams/BankITO",
      website: "",
    },
  ];

  const highlightWords = (text: string) => {
    const keywords = ["Protecture", "Thrift and Trend", "Precision Arms", "BankITO"];
    let highlightedText = text;

    keywords.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span class="text-[#81E6D9]">$1</span>`
      );
    });

    return highlightedText;
  };

  return (
    <div className="min-h-screen bg-[#232732] font-chakra flex flex-col">
      <Header />
      <Banner />

      {/* Animate entire Portfolio content like Home */}
      <AnimatePresence mode="wait">
        <motion.div
          key="portfolio-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* Projects Section */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-10">
            <h3 className="text-white text-[20px] font-bold">Portfolio</h3>

            {projects.map((project, index) => (
              <div key={index} className="mt-5">
                <div className="text-gray-300 text-[16px] space-y-1">
                  <p>
                    {project.title} —{" "}
                    <span className="tracking-[0.38px] text-[#81E6D9]">
                      {project.year}
                    </span>
                  </p>
                  <p>
                    Stacks —{" "}
                    {project.stacks.map((stack, idx) => (
                      <span
                        key={idx}
                        className="tracking-[0.38px] text-[#81E6D9] mr-1"
                      >
                        {stack}
                        {idx < project.stacks.length - 1 && ","}{" "}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 items-center">
                  <div
                    className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[250px] h-[150px] cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <img
                      src={project.image}
                      alt={`${project.title} Preview`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="text-gray-300 text-[15px] leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: `<p class="indent-8">${highlightWords(
                        project.description
                      )}</p>`,
                    }}
                  />
                </div>

                {index !== projects.length - 1 && (
                  <div className="w-full max-w-[800px] mx-auto mt-10">
                    <div className="h-[0.5px] bg-gray-500 opacity-50"></div>
                  </div>
                )}
              </div>
            ))}

            <Footer />
          </div>

          {/* Modal with APK support */}
          <Modal
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
            title={selectedProject?.title || ""}
            year={selectedProject?.year || ""}
            stacks={selectedProject?.stacks || []}
            description={selectedProject?.description || ""}
            image={selectedProject?.image || ""}
            github={selectedProject?.github || ""}
            website={selectedProject?.website || ""}
            apk={selectedProject?.apk || ""}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}