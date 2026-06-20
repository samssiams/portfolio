"use client";

import { Instagram, Linkedin, ArrowUpRight, Mail, FileUser, MapPin, ChevronDown } from "lucide-react";
import Image from "next/image";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import AnimatedTealEdge from "../components/AnimatedTealEdge";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

const MessageModal = dynamic(() => import("../components/MessageModal"), {
  ssr: false,
});

const AskSamWidget = dynamic(() => import("../components/AskSamWidget"), {
  ssr: false,
});

const MAX_MESSAGES = 3;
const STORAGE_KEY = "msg_data";

function getMessageData(): { count: number; date: string } {
  if (typeof window === "undefined") return { count: 0, date: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: "" };
    return JSON.parse(raw);
  } catch {
    return { count: 0, date: "" };
  }
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

const mediaButtonStyle = {
  color: "#81E6D9",
} as const;

function ProjectCard({ title, date, place, desc }: { title: string; date?: string; place: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex gap-3 sm:gap-4 cursor-default"
      onMouseEnter={() => { if (canHover) setHovered(true); }}
      onMouseLeave={() => { if (canHover) setHovered(false); }}
    >
      <div className="flex flex-col items-center pt-[6px]">
        <div
          className="w-[6px] h-[6px] rounded-full shrink-0 transition-all duration-300"
          style={{
            background: hovered ? "#81E6D9" : "white",
            boxShadow: hovered ? "0 0 8px rgba(129,230,217,0.8)" : "none",
          }}
        />
        <div className="w-px bg-gray-700 flex-1 mt-1" />
      </div>
      <div className="flex flex-col gap-[2px] pb-3">
        <p
          className="text-[14px] sm:text-[15px] font-semibold tracking-[0.3px] transition-colors duration-200"
          style={{ color: hovered ? "white" : "rgb(209,213,219)" }}
        >
          {title}
        </p>
        <p className="text-[12px] sm:text-[13px] tracking-[0.3px] flex items-center gap-1" style={{ color: "rgba(255,255,255,0.6)" }}>
          {date && <span>{date} &middot;</span>}
          <MapPin size={11} className="shrink-0" /> {place}
        </p>
        <p className="text-[13px] sm:text-[15px] leading-relaxed mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{desc}</p>
      </div>
    </div>
  );
}

function CertCard({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  return (
    <div
      className="flex gap-3 sm:gap-4 cursor-default"
      onMouseEnter={() => { if (canHover) setHovered(true); }}
      onMouseLeave={() => { if (canHover) setHovered(false); }}
    >
      <div className="flex flex-col items-center pt-[6px]">
        <div
          className="w-[6px] h-[6px] rounded-full shrink-0 transition-all duration-300"
          style={{
            background: hovered ? "#81E6D9" : "white",
            boxShadow: hovered ? "0 0 8px rgba(129,230,217,0.8)" : "none",
          }}
        />
        <div className="w-px bg-gray-700 flex-1 mt-1" />
      </div>
      <div className="flex flex-col gap-[2px] pb-3">
        <p
          className="text-[14px] sm:text-[15px] font-semibold tracking-[0.3px] transition-colors duration-200"
          style={{ color: hovered ? "white" : "rgb(209,213,219)" }}
        >
          {label}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap--1 italic font-light tracking-[0.38px] text-[#81E6D9] text-[12px] sm:text-[13px]"
          style={{ marginLeft: "2px" }}
          onMouseEnter={() => { if (canHover) setLinkHovered(true); }}
          onMouseLeave={() => { if (canHover) setLinkHovered(false); }}
        >
          <motion.span
            animate={{ x: linkHovered ? -4 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            View Certification
          </motion.span>
          <span style={{ width: 16, height: 16, display: "inline-flex", alignItems: "center", overflow: "hidden" }}>
            <motion.span
              animate={linkHovered ? { x: 0, y: 0, opacity: 1 } : { x: -6, y: 6, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ display: "flex", alignItems: "center" }}
            >
              <ArrowUpRight size={13} style={{ flexShrink: 0 }} />
            </motion.span>
          </span>
        </a>
      </div>
    </div>
  );
}

function TimelineItem({ title, subtitle, desc, place }: { title: string; subtitle?: string; desc?: string; place?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex gap-3 sm:gap-4 cursor-default"
      onMouseEnter={() => { if (canHover) setHovered(true); }}
      onMouseLeave={() => { if (canHover) setHovered(false); }}
    >
      <div className="flex flex-col items-center pt-[6px]">
        <div
          className="w-[6px] h-[6px] rounded-full shrink-0 transition-all duration-300"
          style={{ background: hovered ? "#81E6D9" : "white", boxShadow: hovered ? "0 0 8px rgba(129,230,217,0.8)" : "none" }}
        />
        <div className="w-px bg-gray-700 flex-1 mt-1" />
      </div>
      <div className="flex flex-col gap-[2px] pb-3">
        <p className="text-[14px] sm:text-[15px] font-semibold tracking-[0.3px] transition-colors duration-200" style={{ color: hovered ? "white" : "rgb(209,213,219)" }}>{title}</p>
        {subtitle && (
          <p className="text-[12px] sm:text-[13px] tracking-[0.3px] flex items-center gap-1" style={{ color: "rgba(255,255,255,0.6)" }}>
            <MapPin size={11} className="shrink-0" />
            {subtitle}{place ? ` · ${place}` : ""}
          </p>
        )}
        {desc && <p className="text-[13px] sm:text-[15px] leading-relaxed mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{desc}</p>}
      </div>
    </div>
  );
}

function ExperienceLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => { if (canHover) setHovered(true); }}
      onMouseLeave={() => { if (canHover) setHovered(false); }}
      className="inline-flex items-center font-bold tracking-[0.38px] text-[#81E6D9]"
      style={{ marginLeft: "6px" }}
    >
      <motion.span animate={{ x: hovered ? -2 : 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
        {label}
      </motion.span>
      <span style={{ width: 22, height: 22, display: "inline-flex", alignItems: "center", overflow: "hidden", marginLeft: hovered ? "1px" : "0px", transition: "margin 0.25s ease" }}>
        <motion.span
          animate={hovered ? { x: 0, y: 0, opacity: 1 } : { x: -8, y: 8, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <ArrowUpRight size={18} style={{ flexShrink: 0 }} />
        </motion.span>
      </span>
    </a>
  );
}

export default function HomeClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMoreExp, setShowMoreExp] = useState(false);
  const [showMoreCerts, setShowMoreCerts] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "error" } | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [msgHovered, setMsgHovered] = useState(false);

  useEffect(() => {
    const data = getMessageData();
    const today = getTodayString();
    if (data.date !== today) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 0, date: today }));
    }
  }, []);

  const showToast = (message: string, type: "success" | "warning" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenModal = () => {
    const today = getTodayString();
    const data = getMessageData();
    if (data.date !== today) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 0, date: today }));
    }
    const currentCount = data.date !== today ? 0 : data.count;
    if (currentCount >= MAX_MESSAGES) {
      showToast("You've reached the 3 message limit for today. Try again tomorrow.", "error");
      return;
    }
    setIsModalOpen(true);
  };

  const handleMessageSent = () => {
    const today = getTodayString();
    const data = getMessageData();
    const currentCount = data.date !== today ? 0 : data.count;
    const newCount = currentCount + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: newCount, date: today }));
    const remaining = MAX_MESSAGES - newCount;
    if (remaining === 0) {
      showToast("Message sent! You've used all 3 messages for today.", "warning");
    } else {
      showToast(`Message sent! You have ${remaining} message${remaining > 1 ? "s" : ""} left today.`, "success");
    }
  };

  const mediaSections = [
    {
      label: "Projects",
      href: "/projects/portfolio",
      key: "portfolio",
      images: [
        { src: "/protecture1.png", alt: "Protecture" },
        { src: "/pa1.png", alt: "Precision Arms" },
        { src: "/tat.png", alt: "Thrift and Trend" },
        { src: "/bankito.png", alt: "BankITO" },
      ],
    },
    {
      label: "Photography",
      href: "/photo/photography",
      key: "photography",
      images: [
        { src: "/catp1.jpg", alt: "Photo 1" },
        { src: "/macrop4.jpg", alt: "Photo 2" },
        { src: "/cactus.jpg", alt: "Photo 3" },
        { src: "/macrop10.jpg", alt: "Photo 4" },
      ],
    },
  ];

  return (
    <div
      className="min-h-screen font-chakra flex flex-col items-center relative"
      style={{ backgroundColor: "#1a1e28" }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2, opacity: 0.18,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat", backgroundSize: "200px 200px", mixBlendMode: "overlay",
        }}
      />
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
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: "radial-gradient(circle, rgba(129,230,217,0.09) 1px, transparent 1px)",
          backgroundSize: "24px 24px", backgroundAttachment: "fixed",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 40%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 40%, black 40%, transparent 100%)",
        }}
      />
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(129,230,217,0.035) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "20%", width: "400px", height: "400px", background: "radial-gradient(ellipse, rgba(100,120,200,0.025) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="relative w-full flex flex-col items-center" style={{ zIndex: 10 }}>
        <Header />
        <div
          className="fixed top-0 left-0 w-full pointer-events-none"
          style={{ zIndex: 9, height: "40px", background: "linear-gradient(to bottom, #1a1e28 0%, #1a1e28 40%, rgba(26,30,40,0.7) 70%, transparent 100%)" }}
        />
        <Banner />

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-5 right-4 z-50 px-4 py-3 rounded-lg text-[13px] font-medium tracking-[0.3px] shadow-lg max-w-[calc(100vw-2rem)]"
              style={{
                background: toast.type === "success" ? "rgba(129,230,217,0.15)" : toast.type === "warning" ? "rgba(255,200,80,0.15)" : "rgba(255,100,100,0.15)",
                border: `1px solid ${toast.type === "success" ? "rgba(129,230,217,0.4)" : toast.type === "warning" ? "rgba(255,200,80,0.4)" : "rgba(255,100,100,0.4)"}`,
                color: toast.type === "success" ? "#81E6D9" : toast.type === "warning" ? "#FFC850" : "#FF6464",
              }}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full mt-10"
          >
            <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31">
              {/* Mobile header */}
              <div className="flex flex-col items-center sm:hidden text-center mb-6">
                <div className="relative w-24 h-24 rounded-full border-2 border-white shadow-lg overflow-hidden">
                  <Image src="/profile.png" alt="Samuel Cruz" fill priority sizes="96px" className="object-cover" />
                </div>
                <h2 className="text-white text-[26px] font-bold leading-tight mt-4">Samuel Cruz</h2>
                <p className="text-gray-300 mt-2 text-[14px] flex items-center justify-center gap-1.5">
                  <MapPin size={14} strokeWidth={2} className="relative top-[-1px] shrink-0" /> Bataan, Philippines
                </p>
                <p className="text-gray-300 mt-1 text-[14px]">Full Stack Developer <span className="text-white">|</span> Project Manager</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4 text-[14px] font-semibold text-[#81E6D9] tracking-[0.38px]">
                  <a href="https://www.instagram.com/samssiams/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                    <Instagram size={16} style={{ position: "relative", top: "-1px" }} />
                    <span className="relative group">Samssiams<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                  </a>
                  <a href="https://www.linkedin.com/in/samssiams/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                    <Linkedin size={16} style={{ position: "relative", top: "-1px" }} />
                    <span className="relative group">Samssiams<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                  </a>
                  <a href="/Cruz_CV.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                    <FileUser size={16} style={{ position: "relative", top: "-1px" }} />
                    <span className="relative group">Resume<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                  </a>
                </div>
              </div>

              {/* Desktop header */}
              <div className="hidden sm:flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-white text-[32px] md:text-[35px] font-bold leading-tight">Samuel Cruz</h2>
                  <p className="text-gray-300 mt-2 text-[16px] flex items-center gap-1.5">
                    <MapPin size={15} strokeWidth={2} className="relative top-[-1px] shrink-0" /> Bataan, Philippines
                  </p>
                  <p className="text-gray-300 mt-2 text-[16px]">Full Stack Developer <span className="text-white">|</span> Project Manager</p>
                  <div className="flex flex-wrap gap-6 mt-3 text-[17px] font-semibold text-[#81E6D9] tracking-[0.38px]">
                    <a href="https://www.instagram.com/samssiams/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      <Instagram size={17} style={{ position: "relative", top: "-1.5px" }} />
                      <span className="relative group">Samssiams<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                    </a>
                    <a href="https://www.linkedin.com/in/samssiams/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      <Linkedin size={17} style={{ position: "relative", top: "-1.5px" }} />
                      <span className="relative group">Samssiams<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                    </a>
                    <a href="/Cruz_CV.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      <FileUser size={17} style={{ position: "relative", top: "-1.5px" }} />
                      <span className="relative group">Resume<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                    </a>
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="relative w-24 h-24 md:w-[120px] md:h-[120px] rounded-full border-2 border-white shadow-lg overflow-hidden">
                    <Image src="/profile.png" alt="Samuel Cruz" fill priority sizes="(min-width: 768px) 120px, 96px" className="object-cover" />
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-7">
              <h3 className="text-white text-[18px] sm:text-[20px] font-bold">About me</h3>
              <p className="text-gray-300 text-[14px] sm:text-[16px] mt-3 leading-relaxed">
                <span className="pl-6 inline-block">I am</span>{" "}
                a <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">developer</span> and{" "}
                <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">project manager</span> who builds polished, user-first web experiences while keeping teams aligned and delivery on track. I&apos;m also a{" "}
                <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">photographer</span> who enjoys capturing stories and moments through my camera.
              </p>
            </div>

            <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-7">
              <h3 className="text-white text-[18px] sm:text-[20px] font-bold">Experiences</h3>
              <div className="text-gray-300 text-[14px] sm:text-[16px] mt-3 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="leading-relaxed">
                    <span className="font-bold tracking-[0.38px] mr-2 sm:mr-4">2025 &ndash; Present</span>
                    Technical Project Manager &mdash;{" "}
                    <ExperienceLink href="https://www.freelancer.com/project-management" label="Freelancer" />
                  </p>
                  <div className="ml-1 mt-3 flex flex-col gap-3">
                    <ProjectCard title="Kreative Arts – Cross-Platform E-Commerce" date="2026" place="Bataan, Philippines" desc="Managed a Shopify-Etsy integration project, defining delivery phases and milestones, keeping client communications aligned throughout the progress." />
                    <ProjectCard title="Co-Pilot — Tamkeen Partnership Program" date="2026" place="Bataan, Philippines" desc="Worked closely with program leads and teams to keep the partnership on track, handles coordination and making sure key milestones were met." />
                    <ProjectCard title="Noticer – Mobile Version Implementation" date="2026" place="Bataan, Philippines" desc="Led the mobile adaptation of Noticer, coordinating cross-functional teams to translate the web platform into a responsive mobile experience." />
                  
                    <AnimatePresence>
                      {showMoreExp && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <ProjectCard title="Prominence Bank – Digital Banking Platform" date="2026" place="Bataan, Philippines" desc="Managed the project from start to finish, keeping teams aligned, running sprints, and making sure the platform shipped on time and within scope." />
                          <ProjectCard title="InnerX – AI-Based Emotional Analytics" date="2025" place="Bataan, Philippines" desc="Took the project from early concept to working prototype, staying on top of timelines, deliverables, and keeping everything moving in the right direction." />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3 sm:gap-2">
                      <div className="flex flex-col items-center pt-[6px]">
                        <div className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: "transparent" }} />
                      </div>
                      <button
                        onClick={() => setShowMoreExp((prev) => !prev)}
                        className="flex items-center gap-1.5 cursor-pointer w-fit"
                        style={{ color: "#81E6D9", fontSize: "13px", letterSpacing: "0.3px", background: "none", border: "none", padding: 0, marginTop: "-8px" }}
                      >
                        <motion.span animate={{ rotate: showMoreExp ? 180 : 0 }} transition={{ duration: 0.25, ease: "easeOut" }} style={{ display: "flex", alignItems: "center" }}>
                          <ChevronDown size={14} />
                        </motion.span>
                        <span>{showMoreExp ? "Show less" : "View more"}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="leading-relaxed">
                    <span className="font-bold tracking-[0.38px] mr-2 sm:mr-4">2024</span>
                    Full-Stack Web Developer Intern &mdash;{" "}
                    <ExperienceLink href="https://kynatech.ph/" label="Kynatech Co." />
                  </p>
                  <div className="ml-1 mt-3 flex flex-col gap-3">
                    <ProjectCard title="Full Stack Web Development" place="Bataan, Philippines" desc="Built a Next.js app with Supabase, Prisma, and NextAuth covering auth, timesheet, and payroll via REST APIs." />
                    <ProjectCard title="Project Management" place="Bataan, Philippines" desc="Ensured on-time delivery through progress monitoring, task verification, and Agile & Waterfall methodologies." />
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-7">
              <h3 className="text-white text-[18px] sm:text-[20px] font-bold">Bio</h3>
              <div className="text-gray-300 text-[14px] sm:text-[16px] mt-3 space-y-2">
                <p><span className="font-bold tracking-[0.38px] mr-4">2024</span>Certifications</p>
                <div className="ml-1 mt-3 flex flex-col gap-3">
                  <CertCard label="IC3 Digital Literacy" href="/IC3 GS6 Level 1.pdf" />
                  <CertCard label="Microsoft Office Specialist Associate (Microsoft 365)" href="/Microsoft Office Specialist  Associate.pdf" />
                  <CertCard label="Information Technology Specialist in Network Security" href="/Network Security.pdf" />
                  <AnimatePresence>
                    {showMoreCerts && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} style={{ overflow: "hidden" }}>
                        <CertCard label="Information Technology Specialist in Networking" href="/Networking.pdf" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                    <div className="flex gap-3 sm:gap-2">
                      <div className="flex flex-col items-center pt-[6px]">
                        <div className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: "transparent" }} />
                      </div>
                      <button
                        onClick={() => setShowMoreCerts((prev) => !prev)}
                        className="flex items-center gap-1.5 cursor-pointer w-fit"
                        style={{ color: "#81E6D9", fontSize: "13px", letterSpacing: "0.3px", background: "none", border: "none", padding: 0, marginTop: "-8px" }}
                      >
                        <motion.span animate={{ rotate: showMoreCerts ? 180 : 0 }} transition={{ duration: 0.25, ease: "easeOut" }} style={{ display: "flex", alignItems: "center" }}>
                          <ChevronDown size={14} />
                        </motion.span>
                        <span>{showMoreCerts ? "Show less" : "View more"}</span>
                      </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p><span className="font-bold tracking-[0.38px] mr-4">2025</span>Milestones</p>
                  <div className="ml-1 mt-3 flex flex-col gap-3">
                    <TimelineItem title="Graduated B.S. Computer Science — Latin Honors" />
                    <TimelineItem title="Technical Project Manager" subtitle="Bonifacio Global City, Taguig" desc="Led cross-functional teams, coordinated sprints, and ensured timely delivery of product milestones." />
                  </div>
                </div>
              </div>
            </div>

            {mediaSections.map(({ label, href, key, images }) => (
              <div key={key} className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-7">
                <h3 className="text-white text-[18px] sm:text-[20px] font-bold">{label}</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-5">
                  {images.map((img) => (
                    <div
                      key={img.alt}
                      className="relative w-full aspect-[7/4] rounded-[10px] overflow-hidden"
                      style={{
                        background: "rgba(22,26,35,0.95)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                        backdropFilter: "blur(24px)",
                        WebkitBackdropFilter: "blur(24px)",
                      }}
                    >
                      <div className="absolute inset-[6px] rounded-[6px] overflow-hidden">
                        <Image src={img.src} alt={img.alt} fill loading="lazy" sizes="(min-width: 640px) 350px, 50vw" className="object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-7">
                  {/* Arrow always visible — animates upright on hover */}
                  <a
                    href={href}
                    onMouseEnter={() => { if (canHover) setHoveredSection(key); }}
                    onMouseLeave={() => { if (canHover) setHoveredSection(null); }}
                    className="group relative isolate flex items-center justify-center gap-1.5 overflow-hidden rounded-xl border-0 px-5 py-2 font-semibold tracking-[0.38px] transition-all duration-300"
                    style={mediaButtonStyle}
                  >
                    <AnimatedTealEdge animated={false} />
                    <span className="relative z-10">{label}</span>
                    <motion.span
                      animate={hoveredSection === key ? { x: 2, y: -2 } : { x: 0, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="relative z-10"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <ArrowUpRight size={16} />
                    </motion.span>
                  </a>
                </div>
              </div>
            ))}

            <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-7">
              <h3 className="text-white text-[18px] sm:text-[20px] font-bold">Catch me here</h3>
              <p className="text-gray-300 text-[14px] sm:text-[16px] mt-5 leading-relaxed">
                <span className="pl-6 inline-block">If you</span> need clarifications, have questions, or would like more information, simply click the{" "}
                <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">button below</span>, and I&apos;ll review it for you. I&apos;ll provide the best response and give some good quality idea for you.
              </p>
            </div>

            <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-10 mb-1">
              <div className="flex justify-center">
                {/* Mail icon always visible — animates on hover */}
                <button
                  onClick={handleOpenModal}
                  onMouseEnter={() => { if (canHover) setMsgHovered(true); }}
                  onMouseLeave={() => { if (canHover) setMsgHovered(false); }}
                  className="group relative isolate flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border-0 px-5 py-2 font-semibold tracking-[0.38px] text-[#81E6D9] transition-colors duration-300"
                >
                  <AnimatedTealEdge animated={false} />
                  <motion.span
                    animate={msgHovered ? { rotate: -15, scale: 1.2 } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative z-10"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Mail size={16} />
                  </motion.span>
                  <span className="relative z-10">Send me a message here</span>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {isModalOpen && (
          <MessageModal isOpen onClose={() => setIsModalOpen(false)} onSuccess={handleMessageSent} />
        )}
        <AskSamWidget />
        <Footer />
      </div>
    </div>
  );
}
