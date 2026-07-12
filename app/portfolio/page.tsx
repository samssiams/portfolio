"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Modal from "@/components/ProjectModal";
import { projectFolders, type Project, type ProjectFolderId } from "./projects";

function AppBarIcon() {
  return (
    <svg viewBox="0 0 36 32" aria-hidden="true" className="h-7 w-8" fill="none">
      <path d="M6 6.5 15 26M12 8.5h16M15 15.5h11M18 22.5h10" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="32" cy="15.5" r="1.8" fill="currentColor" />
    </svg>
  );
}

function FreelancerIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7" fill="currentColor">
      <path d="M27.4 9.1c-.8.4-1.7.7-2.7.8a4.7 4.7 0 0 0 2-2.6c-.9.6-1.9.9-3 1.2a4.65 4.65 0 0 0-8 4.2A13.2 13.2 0 0 1 6.1 7.8a4.65 4.65 0 0 0 1.4 6.2c-.8 0-1.5-.2-2.1-.6v.1c0 2.3 1.6 4.2 3.7 4.6-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1a4.66 4.66 0 0 0 4.3 3.2A9.34 9.34 0 0 1 5.5 23c-.4 0-.7 0-1.1-.1A13.15 13.15 0 0 0 11.5 25c8.5 0 13.2-7.1 13.2-13.2v-.6c.9-.6 1.7-1.4 2.3-2.4l.4.3Z" />
    </svg>
  );
}

function PersonalIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7" fill="none">
      <path d="m11.5 10-6 6 6 6M20.5 10l6 6-6 6M18 6l-4 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderCategoryIcon({ id }: { id: ProjectFolderId }) {
  if (id === "appbar") return <AppBarIcon />;
  if (id === "freelancer") return <FreelancerIcon />;
  return <PersonalIcon />;
}

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<ProjectFolderId | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const selectedFolder = projectFolders.find((folder) => folder.id === selectedFolderId) || null;

  const highlightWords = (text: string) => {
    const keywords = [
      "Upcoming App Bar Project", "App Bar",
      "Tamkeen", "Noticer", "Prominence Bank", "InnerX",
      "Protecture", "Thrift and Trend", "Precision Arms", "BankITO",
      "Co-Pilot", "Project Manager", "Technical Project Manager",
      "Next.js", "Supabase", "Java", "Firebase", "Android",
      "PHP", "MySQL", "C#", "FGSM",
      "mobile adaptation", "digital banking", "emotional analytics",
      "placeholder",
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

  const handleMouseEnter = (key: string) => {
    if (canHover) setHoveredItem(key);
  };

  const handleMouseLeave = () => {
    if (canHover) setHoveredItem(null);
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
            <div className="mx-auto mt-10 flex min-h-[calc(100vh-170px)] w-full max-w-[800px] flex-col px-5 sm:px-8 md:px-31">
              <h1 className="text-white text-[18px] sm:text-[20px] font-bold">Work &amp; Projects</h1>

              {selectedFolder && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[13px] sm:text-[14px] tracking-[0.3px]">
                  <button
                    onClick={() => {
                      setSelectedFolderId(null);
                      setSelectedProject(null);
                    }}
                    className="cursor-pointer text-[#81E6D9] transition-colors hover:text-white"
                  >
                    Work &amp; Projects
                  </button>
                  <ChevronRight size={14} className="text-white/35" />
                  <span className="text-gray-300">{selectedFolder.title}</span>
                  {selectedProject && (
                    <>
                      <ChevronRight size={14} className="text-white/35" />
                      <span className="text-white">{selectedProject.title}</span>
                    </>
                  )}
                </div>
              )}

              {!selectedFolder ? (
                <motion.div
                  key="project-folders"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="mt-7 border-t border-white/10"
                >
                    {projectFolders.map((folder) => {
                      const isHovered = hoveredItem === folder.id;

                      return (
                          <motion.button
                            key={folder.id}
                            type="button"
                            data-cuelume-hover="whisper"
                            onClick={() => setSelectedFolderId(folder.id)}
                            onMouseEnter={() => handleMouseEnter(folder.id)}
                            onMouseLeave={handleMouseLeave}
                            className="group flex w-full cursor-pointer items-center gap-4 border-b border-white/10 bg-transparent px-1 py-5 text-left sm:gap-5 sm:py-6"
                          >
                            <span
                              className={`flex h-11 w-11 shrink-0 items-center justify-center transition-colors duration-200 sm:h-12 sm:w-12 ${
                                isHovered && canHover ? "text-[#81E6D9]" : "text-white/55"
                              }`}
                            >
                              <FolderCategoryIcon id={folder.id} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-[15px] font-medium tracking-[0.25px] text-white sm:text-[16px]">
                                {folder.title}
                              </span>
                              <span className="mt-1 block text-[12px] leading-relaxed text-white/60 sm:text-[13px]">
                                {folder.description}
                              </span>
                              <span className="mt-1 block truncate text-[11px] tracking-[0.25px] text-white/35 sm:text-[12px]">
                                {folder.eyebrow}
                              </span>
                            </span>
                            <span className="hidden shrink-0 text-[11px] tracking-[0.12em] text-white/35 sm:block">
                              {String(folder.projects.length).padStart(2, "0")}
                            </span>
                            <ChevronRight
                              size={17}
                              className="shrink-0 text-white/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#81E6D9]"
                            />
                          </motion.button>
                      );
                    })}
                </motion.div>
              ) : (
                <motion.div
                  key={`folder-${selectedFolder.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="mt-6"
                >
                    <button
                      type="button"
                      onClick={() => {
                        setHoveredItem(null);
                        setSelectedFolderId(null);
                        setSelectedProject(null);
                      }}
                      className="mb-1 inline-flex cursor-pointer items-center gap-2 text-[13px] font-medium tracking-[0.3px] text-[#81E6D9] transition-colors hover:text-white"
                    >
                      <ArrowLeft size={15} />
                      Back to folders
                    </button>

                    <div>
                      {selectedFolder.projects.map((project, index) => {
                        const projectKey = `${selectedFolder.id}-${project.title}`;
                        const isHovered = hoveredItem === projectKey;

                        return (
                          <motion.div
                            key={project.title}
                            className={index === 0 ? "mt-3" : "mt-5"}
                            onMouseEnter={() => handleMouseEnter(projectKey)}
                            onMouseLeave={handleMouseLeave}
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
                              <div
                                className="relative cursor-pointer group w-full sm:w-[250px] h-[180px] sm:h-[150px] rounded-[10px] overflow-hidden"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedProject(project);
                                }}
                                style={{
                                  background: "rgba(22,26,35,0.95)",
                                  border: "1px solid rgba(255,255,255,0.12)",
                                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                                  backdropFilter: "blur(24px)",
                                  WebkitBackdropFilter: "blur(24px)",
                                }}
                              >
                                <div className="absolute inset-[7px] rounded-[6px] overflow-hidden">
                                  {!loadedImages[project.image] && (
                                    <div
                                      aria-hidden="true"
                                      className="absolute inset-0 animate-pulse"
                                      style={{
                                        background:
                                          "linear-gradient(110deg, rgba(255,255,255,0.035) 20%, rgba(129,230,217,0.12) 45%, rgba(255,255,255,0.035) 70%)",
                                        backgroundSize: "200% 100%",
                                      }}
                                    />
                                  )}
                                  <Image
                                    src={project.image}
                                    alt={`${project.title} project preview by Samuel Cruz`}
                                    fill
                                    priority={index === 0}
                                    sizes="(min-width: 640px) 250px, 100vw"
                                    onLoad={() =>
                                      setLoadedImages((current) => ({ ...current, [project.image]: true }))
                                    }
                                    className={`object-cover transition-opacity duration-300 ${
                                      loadedImages[project.image] ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                </div>

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

                              <div
                                className="text-gray-300 text-[13px] sm:text-[15px] leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: `<p class="sm:indent-8">${highlightWords(project.shortDescription)}</p>`,
                                }}
                              />
                            </div>

                            {index !== selectedFolder.projects.length - 1 && (
                              <div className="w-full max-w-[800px] mx-auto mt-10">
                                <div className="h-[0.5px] bg-gray-500 opacity-50" />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                </motion.div>
              )}

              <div className="mt-auto pt-12">
                <Footer />
              </div>
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
      </div>
    </div>
  );
}
