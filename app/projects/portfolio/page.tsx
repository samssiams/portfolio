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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    <div
      className="min-h-screen font-chakra flex flex-col items-center"
      style={{
        backgroundColor: "#222732",
        backgroundImage: "radial-gradient(circle, rgba(129,230,217,0.15) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        backgroundAttachment: "fixed",
      }}
    >
      <Header />
      {/* Scroll fade mask */}
      <div
        className="fixed top-0 left-0 w-full pointer-events-none"
        style={{
          zIndex: 9,
          height: "40px",
          background: "linear-gradient(to bottom, #222732 0%, #222732 40%, rgba(34,39,50,0.7) 70%, transparent 100%)",
        }}
      />
      <Banner />

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

            {projects.map((project, index) => {
              const isHovered = hoveredIndex === index;
              const isDimmed = hoveredIndex !== null && !isHovered;

              return (
                <motion.div
                  key={index}
                  className="mt-5"
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  animate={{ opacity: isDimmed ? 0.35 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Project header with counter + teal left border indicator */}
                  <div className="flex items-start gap-3">
                    {/* No indicator — number only */}

                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        {/* Editorial counter */}
                        <span
                          style={{
                            fontSize: "13px",
                            color: isHovered ? "#81E6D9" : "rgba(129,230,217,0.25)",
                            fontVariantNumeric: "tabular-nums",
                            transition: "color 300ms ease, text-shadow 300ms ease",
                            letterSpacing: "0.05em",
                            flexShrink: 0,
                            textShadow: isHovered ? "0 0 8px rgba(129,230,217,0.6)" : "none",
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

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
                              <motion.span
                                key={idx}
                                className="tracking-[0.38px] text-white mr-1"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + idx * 0.06 }}
                              >
                                {stack}
                                {idx < project.stacks.length - 1 && ","}{" "}
                              </motion.span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 items-center pl-5">
                    {/* Image with glass hover overlay + subtle teal glow */}
                    <div
                      className="relative bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[250px] h-[150px] cursor-pointer group"
                      onClick={() => setSelectedProject(project)}
                      style={{
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      }}
                    >
                      <img
                        src={project.image}
                        alt={`${project.title} Preview`}
                        className="w-full h-full object-cover"
                      />
                      {/* Glass overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg"
                        style={{
                          background: "rgba(34, 39, 50, 0.82)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          border: "1px solid rgba(255,255,255,0.18)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                          transition: "opacity 300ms ease-in-out, backdrop-filter 500ms ease-in-out, -webkit-backdrop-filter 500ms ease-in-out",
                        }}
                      >
                        <span className="text-white text-[15px] font-medium tracking-[0.3px] italic">
                          View
                        </span>
                      </div>
                    </div>

                    <div
                      className="text-gray-300 text-[15px] leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: `<p class="indent-8">${highlightWords(project.description)}</p>`,
                      }}
                    />
                  </div>

                  {/* Animated divider */}
                  {index !== projects.length - 1 && (
                    <motion.div
                      className="w-full max-w-[800px] mx-auto mt-10"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      style={{ transformOrigin: "left" }}
                    >
                      <div className="h-[0.5px] bg-gray-500 opacity-50" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            <Footer />
          </div>

          {/* Modal */}
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