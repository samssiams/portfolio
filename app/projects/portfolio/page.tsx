"use client";
import { useState } from "react";
import Image from "next/image";
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
      description: "Protecture is a system designed to secure architectural images by applying FGSM-based encryption, protecting them from unauthorized AI use.",
      image: "/protecture1.png",
      github: "https://github.com/samssiams/Protecture",
      website: "https://protectures.vercel.app/auth/login",
    },
    {
      title: "Thrift and Trend",
      year: "2024",
      stacks: ["Android Studio", "Java", "Firebase"],
      description: "Thrift and Trend is a thrift store offering a wide selection of used and second-hand clothing that focuses on providing pre-loved fashion items at affordable prices.",
      image: "/tat.png",
      github: "https://github.com/samssiams/Thrift-and-Trend",
      website: "",
      apk: "/Finals_ThriftandTrend.apk",
    },
    {
      title: "Precision Arms",
      year: "2023",
      stacks: ["HTML", "PHP", "Tailwind", "MySql"],
      description: "Precision Arms is a weblog for gun enthusiasts, offering insights, expert advice, and detailed analysis of firearms and accessories to enhance knowledge and decision-making.",
      image: "/pa1.png",
      github: "https://github.com/samssiams/Precision-Arms",
      website: "",
    },
    {
      title: "BankITO",
      year: "2022",
      stacks: ["C#", "CSS", "MySQL"],
      description: "BankITO is a banking system that securely manages customer accounts and transactions, ensuring efficiency and reliability in financial operations.",
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
      highlightedText = highlightedText.replace(regex, `<span class="text-[#81E6D9]">$1</span>`);
    });
    return highlightedText;
  };

  return (
    <div
      className="min-h-screen font-chakra flex flex-col items-center relative"
      style={{ backgroundColor: "#1a1e28" }}
    >
      {/* ── Static Film Grain ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          opacity: 0.18,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          mixBlendMode: "overlay",
        }}
      />

      {/* ── Vignette ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(129,230,217,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 100% 80% at 50% 100%, rgba(10,12,18,0.6) 0%, transparent 60%),
            radial-gradient(ellipse 60% 100% at 0% 50%, rgba(10,12,18,0.3) 0%, transparent 70%),
            radial-gradient(ellipse 60% 100% at 100% 50%, rgba(10,12,18,0.3) 0%, transparent 70%)
          `,
        }}
      />

      {/* ── Dot Grid ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: "radial-gradient(circle, rgba(129,230,217,0.09) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundAttachment: "fixed",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 40%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 40%, black 40%, transparent 100%)",
        }}
      />

      {/* ── Ambient Glow Blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{
          position: "absolute",
          top: "10%", left: "50%",
          transform: "translateX(-50%)",
          width: "600px", height: "300px",
          background: "radial-gradient(ellipse, rgba(129,230,217,0.035) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "20%", left: "20%",
          width: "400px", height: "400px",
          background: "radial-gradient(ellipse, rgba(100,120,200,0.025) 0%, transparent 70%)",
          filter: "blur(60px)",
        }} />
      </div>

      {/* ── All Content ── */}
      <div className="relative w-full flex flex-col items-center" style={{ zIndex: 10 }}>
        <Header />

        <div
          className="fixed top-0 left-0 w-full pointer-events-none"
          style={{
            zIndex: 9,
            height: "40px",
            background: "linear-gradient(to bottom, #1a1e28 0%, #1a1e28 40%, rgba(26,30,40,0.7) 70%, transparent 100%)",
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
            className="w-full"
          >
            <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-10">
              <h3 className="text-white text-[18px] sm:text-[20px] font-bold">Portfolio</h3>

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
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3">
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

                          <div className="text-gray-300 text-[14px] sm:text-[16px] space-y-1">
                            <p>
                              {project.title} —{" "}
                              <span className="tracking-[0.38px] text-[#81E6D9]">{project.year}</span>
                            </p>
                            <p className="flex flex-wrap gap-x-0">
                              Stacks —{" "}
                              {project.stacks.map((stack, idx) => (
                                <span
                                  key={idx}
                                  className="tracking-[0.38px] text-white mr-1"
                                >
                                  {stack}{idx < project.stacks.length - 1 && ","}{" "}
                                </span>
                              ))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:items-center pl-5">
                      {/* Image */}
                      <div
                        className="relative bg-[#2F3445] rounded-lg overflow-hidden shadow-lg cursor-pointer group w-full sm:w-[250px] h-[180px] sm:h-[150px]"
                        onClick={() => setSelectedProject(project)}
                        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
                      >
                        <Image
                          src={project.image}
                          alt={`${project.title} Preview`}
                          fill
                          loading="lazy"
                          sizes="(min-width: 640px) 250px, 100vw"
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg"
                          style={{
                            background: "rgba(26, 30, 40, 0.82)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                            transition: "opacity 300ms ease-in-out",
                          }}
                        >
                          <span className="text-white text-[15px] font-medium tracking-[0.3px] italic">View</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div
                        className="text-gray-300 text-[13px] sm:text-[15px] leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: `<p class="sm:indent-8">${highlightWords(project.description)}</p>`,
                        }}
                      />
                    </div>

                    {index !== projects.length - 1 && (
                      <div className="w-full max-w-[800px] mx-auto mt-10">
                        <div className="h-[0.5px] bg-gray-500 opacity-50" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              <Footer />
            </div>

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
    </div>
  );
}