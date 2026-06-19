"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Modal from "@/components/ProjectModal";
import AskSamWidget from "@/components/AskSamWidget";

interface Project {
  title: string;
  year: string;
  stacks: string[];
  role?: string;
  contributions?: string[];
  shortDescription: string;
  description: string;
  image: string;
  github: string;
  website?: string;
  apk?: string;
}

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const visibleProjects: Project[] = [
    {
      title: "Tamkeen",
      year: "2026",
      stacks: [],
      role: "Co-Pilot",
      contributions: [
        "Coordinated between program leads and partner teams",
        "Tracked deliverables and flagged blockers early",
        "Maintained alignment across all stakeholders throughout the engagement",
      ],
      shortDescription: "A real-world industry engagement where I stepped in as Co-Pilot, making sure the right people had the right information and that nothing slipped between the cracks.",
      description: "Tamkeen is a partnership program under Co-Pilot, where I worked closely with program leads and teams to keep the partnership on track, handling coordination and ensuring key milestones were met.",
      image: "/tk.png",
      github: "",
      website: "",
    },
    {
      title: "Noticer",
      year: "2026",
      stacks: [],
      role: "Technical Project Manager",
      contributions: [
        "Led sprint planning and milestone tracking",
        "Coordinated cross-functional teams across design and development",
        "Maintained delivery timeline and kept scope from drifting",
      ],
      shortDescription: "A mobile adaptation project I managed end-to-end, focused on bringing an existing web platform to mobile without losing the experience that made it work in the first place.",
      description: "Noticer is a mobile adaptation project where I led cross-functional teams to translate the existing web platform into a responsive mobile experience.",
      image: "/nn.png",
      github: "",
      website: "",
    },
    {
      title: "Prominence Bank",
      year: "2026",
      stacks: [],
      role: "Technical Project Manager",
      contributions: [
        "Led sprint planning and milestone tracking",
        "Coordinated cross-functional teams across design and development",
        "Maintained delivery timeline and scope from kickoff to launch",
      ],
      shortDescription: "A high-stakes digital banking build with no room for loose ends. I kept the team focused, the sprints moving, and the scope locked so the product actually shipped.",
      description: "Prominence Bank is a digital banking platform I managed from start to finish — keeping teams aligned, running sprints, and ensuring the platform shipped on time and within scope.",
      image: "/pb.png",
      github: "",
      website: "",
    },
    {
      title: "InnerX",
      year: "2025",
      stacks: [],
      role: "Technical Project Manager",
      contributions: [
        "Led sprint planning and milestone tracking",
        "Coordinated cross-functional teams across design and development",
        "Drove the project from early concept through to working prototype",
      ],
      shortDescription: "Took an emotional analytics concept from a rough idea to a working AI prototype, staying hands-on with the timeline and making sure every deliverable landed on time.",
      description: "InnerX is an AI-based emotional analytics tool I took from early concept to working prototype, staying on top of timelines, deliverables, and keeping everything moving in the right direction.",
      image: "/ix.png",
      github: "",
      website: "",
    },
  ];

  const hiddenProjects: Project[] = [
    {
      title: "Protecture",
      year: "2025",
      stacks: ["Next.js", "JavaScript", "Tailwind", "Supabase"],
      shortDescription: "A Next.js and Supabase web system that uses FGSM adversarial perturbation to protect architectural images from being scraped and replicated by AI models.",
      description: "Protecture is a system designed to secure architectural images by applying FGSM-based encryption, protecting them from unauthorized AI use.",
      image: "/protecture1.png",
      github: "https://github.com/samssiams/Protecture",
      website: "https://protectures.vercel.app/auth/login",
    },
    {
      title: "Thrift and Trend",
      year: "2024",
      stacks: ["Android Studio", "Java", "Firebase"],
      shortDescription: "An Android thrift store app built with Java and Firebase that makes buying and selling secondhand clothing straightforward, affordable, and worth trusting.",
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
      shortDescription: "A PHP and MySQL weblog built for firearm enthusiasts who want clean, readable content without the noise. Gear specs, reviews, and analysis laid out to actually be useful.",
      description: "Precision Arms is a weblog for gun enthusiasts, offering insights, expert advice, and detailed analysis of firearms and accessories to enhance knowledge and decision-making.",
      image: "/pa1.png",
      github: "https://github.com/samssiams/Precision-Arms",
      website: "",
    },
    {
      title: "BankITO",
      year: "2022",
      stacks: ["C#", "CSS", "MySQL"],
      shortDescription: "A C# desktop banking system backed by MySQL where getting the data model right was everything. Built with reliability in mind from the very first table.",
      description: "BankITO is a banking system that securely manages customer accounts and transactions, ensuring efficiency and reliability in financial operations.",
      image: "/bankito.png",
      github: "https://github.com/samssiams/BankITO",
      website: "",
    },
  ];

  const displayedProjects = showAll
    ? [...visibleProjects, ...hiddenProjects]
    : visibleProjects;

  const highlightWords = (text: string) => {
    const keywords = [
      "Tamkeen", "Noticer", "Prominence Bank", "InnerX",
      "Protecture", "Thrift and Trend", "Precision Arms", "BankITO",
      "Co-Pilot", "Technical Project Manager",
      "Next.js", "Supabase", "Java", "Firebase", "Android",
      "PHP", "MySQL", "C#", "FGSM",
      "mobile adaptation", "digital banking", "emotional analytics",
      "adversarial encryption", "weblog", "thrift store",
    ];
    let highlighted = text;
    keywords.forEach((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      highlighted = highlighted.replace(regex, `<span class="text-[#81E6D9]">$1</span>`);
    });
    return highlighted;
  };

  const canHover = !isTouch;

  const handleMouseEnter = (index: number) => {
    if (canHover) setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    if (canHover) setHoveredIndex(null);
  };

  const askIsabelAboutProject = (project: Project) => {
    const projectDetails = [
      `Project: ${project.title}`,
      `Year: ${project.year}`,
      project.role ? `Role: ${project.role}` : null,
      project.stacks.length > 0 ? `Stacks: ${project.stacks.join(", ")}` : null,
      `Description: ${project.description}`,
      project.contributions && project.contributions.length > 0
        ? `Key contributions: ${project.contributions.join("; ")}`
        : null,
    ].filter(Boolean);

    window.dispatchEvent(
      new CustomEvent("ask-isabel-about-project", {
        detail: {
          question: `Tell me more about Sam's work on ${project.title}. Include the most relevant tech stack and key contributions when useful.\n\n${projectDetails.join("\n")}`,
          displayText: `Let me know about this project: ${project.title}`,
        },
      })
    );
  };

  return (
    <div
      className="min-h-screen font-chakra flex flex-col items-center relative"
      style={{ backgroundColor: "#1a1e28" }}
      onTouchStart={() => setIsTouch(true)}
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
          opacity: 1,
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
          opacity: 1,
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
            opacity: 1,
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
              <h1 className="text-white text-[18px] sm:text-[20px] font-bold">Portfolio Projects</h1>

              {displayedProjects.map((project, index) => {
                const isHovered = hoveredIndex === index;

                return (
                  <motion.div
                    key={project.title}
                    className="mt-5"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={(event) => {
                      if (event.shiftKey) {
                        askIsabelAboutProject(project);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3">
                          <span
                            style={{
                              fontSize: "13px",
                              color: isHovered && canHover ? "#81E6D9" : "rgba(129,230,217,0.25)",
                              fontVariantNumeric: "tabular-nums",
                              transition: "color 300ms ease, text-shadow 300ms ease",
                              letterSpacing: "0.05em",
                              flexShrink: 0,
                              textShadow: isHovered && canHover ? "0 0 8px rgba(129,230,217,0.6)" : "none",
                            }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div className="text-gray-300 text-[14px] sm:text-[16px] space-y-1">
                            <p>
                              {project.title} —{" "}
                              <span className="tracking-[0.38px] text-[#81E6D9]">{project.year}</span>
                            </p>
                            {project.role && (
                              <p>
                                Role —{" "}
                                <span className="tracking-[0.38px] text-white">{project.role}</span>
                              </p>
                            )}
                            {project.stacks.length > 0 && (
                              <p className="flex flex-wrap gap-x-0">
                                Stacks —{" "}
                                {project.stacks.map((stack, idx) => (
                                  <span key={idx} className="tracking-[0.38px] text-white mr-1">
                                    {stack}{idx < project.stacks.length - 1 && ","}{" "}
                                  </span>
                                ))}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:items-center pl-5">
                      {/* Framed Image */}
                      <div
                        className="relative cursor-pointer group w-full sm:w-[250px] h-[180px] sm:h-[150px] rounded-[10px] overflow-hidden"
                        onClick={(event) => {
                          if (!event.shiftKey) {
                            setSelectedProject(project);
                          }
                        }}
                        style={{
                          background: "rgba(22,26,35,0.95)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                          backdropFilter: "blur(24px)",
                          WebkitBackdropFilter: "blur(24px)",
                        }}
                      >
                        {/* Inset image */}
                        <div className="absolute inset-[7px] rounded-[6px] overflow-hidden">
                          <Image
                            src={project.image}
                            alt={`${project.title} project preview by Samuel Cruz`}
                            fill
                            priority={index === 0}
                            sizes="(min-width: 640px) 250px, 100vw"
                            className="object-cover"
                          />
                        </div>

                        {/* Hover overlay — matches image bounds exactly, frame stays clean */}
                        <div
                          className="absolute inset-[6px] rounded-[6px] sm:opacity-0 sm:group-hover:opacity-100 opacity-0 flex items-center justify-center"
                          style={{
                            background: "rgba(26, 30, 40, 0.82)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            transition: "opacity 300ms ease-in-out",
                            zIndex: 10,
                          }}
                        >
                          <span className="text-white text-[15px] font-medium tracking-[0.3px] italic">View</span>
                        </div>
                      </div>

                      {/* Short Description */}
                      <div
                        className="text-gray-300 text-[13px] sm:text-[15px] leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: `<p class="sm:indent-8">${highlightWords(project.shortDescription)}</p>`,
                        }}
                      />
                    </div>

                    {/* Divider or View More */}
                    {index === visibleProjects.length - 1 && !showAll ? (
                      <div className="w-full max-w-[800px] mx-auto mt-10 flex items-center">
                        <div className="flex-grow h-[0.5px] bg-gray-500 opacity-50"></div>
                        <button
                          onClick={() => setShowAll(true)}
                          className="mx-4 text-white font-medium text-sm hover:text-[#81E6D9] transition cursor-pointer"
                        >
                          View More
                        </button>
                        <div className="flex-grow h-[0.5px] bg-gray-500 opacity-50"></div>
                      </div>
                    ) : index !== displayedProjects.length - 1 ? (
                      <div className="w-full max-w-[800px] mx-auto mt-10">
                        <div className="h-[0.5px] bg-gray-500 opacity-50" />
                      </div>
                    ) : null}
                  </motion.div>
                );
              })}

              <Footer />
            </div>

          </motion.div>
        </AnimatePresence>

        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject?.title || ""}
          year={selectedProject?.year || ""}
          stacks={selectedProject?.stacks || []}
          role={selectedProject?.role || ""}
          contributions={selectedProject?.contributions || []}
          description={selectedProject?.description || ""}
          image={selectedProject?.image || ""}
          github={selectedProject?.github || ""}
          website={selectedProject?.website || ""}
          apk={selectedProject?.apk || ""}
        />
        <AskSamWidget />
      </div>
    </div>
  );
}
