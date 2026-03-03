"use client";

import { Instagram, Linkedin, ArrowUpRight, Mail, FileUser, MapPin } from "lucide-react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MessageModal from "../components/MessageModal";

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

const glassButtonStyle = {
  background: "rgba(129,230,217,0.08)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(129,230,217,0.3)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
  color: "#81E6D9",
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "error" } | null>(null);
  const [portfolioHovered, setPortfolioHovered] = useState(false);
  const [photoHovered, setPhotoHovered] = useState(false);
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

  const projectImages = [
    { src: "/protecture1.png", alt: "Protecture" },
    { src: "/pa1.png", alt: "Precision Arms" },
    { src: "/tat.png", alt: "Thrift and Trend" },
    { src: "/bankito.png", alt: "BankITO" },
  ];

  const photoImages = [
    { src: "/catp1.jpg", alt: "Photo 1" },
    { src: "/macrop4.jpg", alt: "Photo 2" },
    { src: "/cactus.jpg", alt: "Photo 3" },
    { src: "/macrop10.jpg", alt: "Photo 4" },
  ];

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

      <div
        className="fixed top-0 left-0 w-full pointer-events-none"
        style={{
          zIndex: 9,
          height: "40px",
          background: "linear-gradient(to bottom, #222732 0%, #222732 40%, rgba(34,39,50,0.7) 70%, transparent 100%)",
        }}
      />

      <Banner />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full mt-10"
        >
          {/* ── Hero / Profile ── */}
          <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31">

            {/* Mobile: stacked + centered */}
            <div className="flex flex-col items-center sm:hidden text-center mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/profile.png"
                alt="Samuel Cruz"
                className="w-24 h-24 rounded-full border-2 border-white shadow-lg object-cover"
              />
              <h2 className="text-white text-[26px] font-bold leading-tight mt-4">Samuel Cruz</h2>
              <p className="text-gray-300 mt-2 text-[14px] flex items-center justify-center gap-1.5">
                <MapPin size={14} strokeWidth={2} className="shrink-0" />
                Bataan, Philippines
              </p>
              <p className="text-gray-300 mt-1 text-[14px]">
                Web Developer <span className="text-white">|</span> Project Manager
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-4 text-[14px] font-semibold text-[#81E6D9] tracking-[0.38px]">
                <a href="https://www.instagram.com/samssiams/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                  <Instagram size={16} />
                  <span className="relative group">Samssiams<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                </a>
                <a href="https://www.linkedin.com/in/samssiams/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                  <Linkedin size={16} />
                  <span className="relative group">Samssiams<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                </a>
                <a href="/CV_Cruz.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                  <FileUser size={16} />
                  <span className="relative group">Resume<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                </a>
              </div>
            </div>

            {/* Desktop: side by side */}
            <div className="hidden sm:flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-white text-[32px] md:text-[35px] font-bold leading-tight">Samuel Cruz</h2>
                <p className="text-gray-300 mt-2 text-[16px] flex items-center gap-1.5">
                  <MapPin size={15} strokeWidth={2} className="relative top-[-1px] shrink-0" />
                  Bataan, Philippines
                </p>
                <p className="text-gray-300 mt-2 text-[16px]">
                  Web Developer <span className="text-white">|</span> Project Manager
                </p>
                <div className="flex flex-wrap gap-6 mt-4 text-[17px] font-semibold text-[#81E6D9] tracking-[0.38px]">
                  <a href="https://www.instagram.com/samssiams/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                    <Instagram size={17} />
                    <span className="relative group">Samssiams<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                  </a>
                  <a href="https://www.linkedin.com/in/samssiams/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                    <Linkedin size={17} />
                    <span className="relative group">Samssiams<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                  </a>
                  <a href="/CV_Cruz.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                    <FileUser size={17} />
                    <span className="relative group">Resume<span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" /></span>
                  </a>
                </div>
              </div>
              <div className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/profile.png"
                  alt="Samuel Cruz"
                  className="w-24 h-24 md:w-30 md:h-30 rounded-full border-2 border-white shadow-lg object-cover"
                />
              </div>
            </div>
          </div>

          {/* ── About Me ── */}
          <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-10">
            <h3 className="text-white text-[18px] sm:text-[20px] font-bold">About me</h3>
            <p className="text-gray-300 text-[14px] sm:text-[16px] mt-3 leading-relaxed">
              <span className="pl-6 inline-block">I am</span>{" "}
              a <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">web developer</span> and{" "}
              <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">project manager</span> with a strong track record in
              delivering efficient, user-focused solutions. I excel at coordinating teams, streamlining workflows, and bridging the gap
              between creative vision and technical execution. Alongside my technical expertise, I&apos;m a{" "}
              <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">photographer</span> who enjoys capturing stories and moments through my camera.
            </p>
          </div>

          {/* ── Experiences ── */}
          <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-7">
            <h3 className="text-white text-[18px] sm:text-[20px] font-bold">Experiences</h3>
            <div className="text-gray-300 text-[14px] sm:text-[16px] mt-3 flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <p className="leading-relaxed">
                  <span className="font-bold tracking-[0.38px] mr-2 sm:mr-4">2025 – Present</span>
                  Technical Project Manager —{" "}
                  <a href="https://www.freelancer.com/project-management" target="_blank" rel="noopener noreferrer"
                    className="relative group font-bold tracking-[0.38px] text-[#81E6D9]">
                    Freelancer
                    <span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" />
                  </a>
                </p>
                <div className="ml-1 mt-3 flex flex-col gap-3">
                  {[
                    { title: "Co-Pilot — Tamkeen Partnership Program", date: "2026", place: "Bonifacio Global City, Taguig", desc: "Worked closely with program leads and teams to keep the partnership on track, handles coordination and making sure key milestones were met." },
                    { title: "Prominence Bank – Digital Banking Platform", date: "2026", place: "Bonifacio Global City, Taguig", desc: "Managed the project from start to finish, keeping teams aligned, running sprints, and making sure the platform shipped on time and within scope." },
                    { title: "InnerX – AI-Based Emotional Analytics", date: "2025", place: "Bonifacio Global City, Taguig", desc: "Took the project from early concept to working prototype, staying on top of timelines, deliverables, and keeping everything moving in the right direction." },
                  ].map((project) => (
                    <div key={project.title} className="flex gap-3 sm:gap-4 cursor-default">
                      <div className="flex flex-col items-center pt-[6px]">
                        <div className="w-[6px] h-[6px] rounded-full bg-white shrink-0" />
                        <div className="w-px bg-gray-700 flex-1 mt-1" />
                      </div>
                      <div className="flex flex-col gap-[2px] pb-3">
                        <p className="text-gray-300 text-[14px] sm:text-[15px] font-semibold tracking-[0.3px]">{project.title}</p>
                        <p className="text-[12px] sm:text-[13px] tracking-[0.3px] flex items-baseline gap-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {project.date && <span>{project.date} ·</span>}
                          <MapPin size={11} className="relative top-[1px] shrink-0" /> {project.place}
                        </p>
                        <p className="text-[13px] sm:text-[15px] leading-relaxed mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{project.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="leading-relaxed">
                  <span className="font-bold tracking-[0.38px] mr-2 sm:mr-4">2024</span>
                  Full-Stack Web Developer Intern —{" "}
                  <a href="https://kynatech.ph/" target="_blank" rel="noopener noreferrer"
                    className="relative group font-bold tracking-[0.38px] text-[#81E6D9]">
                    Kynatech Technologies Co.
                    <span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" />
                  </a>
                </p>
                <div className="ml-1 mt-3 flex flex-col gap-3">
                  {[
                    { title: "Full Stack Web Development", place: "Bonifacio Global City, Taguig", desc: "Built a Next.js app with Supabase, Prisma, and NextAuth covering auth, timesheet, and payroll via REST APIs." },
                    { title: "Project Management", place: "Bonifacio Global City, Taguig", desc: "Ensured on-time delivery through progress monitoring, task verification, and Agile & Waterfall methodologies." },
                  ].map((project) => (
                    <div key={project.title} className="flex gap-3 sm:gap-4 cursor-default">
                      <div className="flex flex-col items-center pt-[6px]">
                        <div className="w-[6px] h-[6px] rounded-full bg-white shrink-0" />
                        <div className="w-px bg-gray-700 flex-1 mt-1" />
                      </div>
                      <div className="flex flex-col gap-[2px] pb-3">
                        <p className="text-gray-300 text-[14px] sm:text-[15px] font-semibold tracking-[0.3px]">{project.title}</p>
                        <p className="text-[12px] sm:text-[13px] tracking-[0.3px] flex items-baseline gap-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                          <MapPin size={11} className="relative top-[1px] shrink-0" /> {project.place}
                        </p>
                        <p className="text-[13px] sm:text-[15px] leading-relaxed mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{project.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Bio ── */}
          <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-7">
            <h3 className="text-white text-[18px] sm:text-[20px] font-bold">Bio</h3>
            <div className="text-gray-300 text-[14px] sm:text-[16px] mt-3 space-y-2">
              <p><span className="font-bold tracking-[0.38px] mr-4">2021</span>Graduated Senior High — With High Honors</p>
              <p><span className="font-bold tracking-[0.38px] mr-4">2024</span>Digital Credentials &amp; Certifications</p>
              <div className="ml-1 mt-3 flex flex-col gap-3">
                {[
                  { label: "IC3 Digital Literacy", href: "/IC3 GS6 Level 1.pdf" },
                  { label: "Microsoft Office Specialist Associate (Microsoft 365)", href: "/Microsoft Office Specialist  Associate.pdf" },
                  { label: "Information Technology Specialist in Network Security", href: "/Network Security.pdf" },
                  { label: "Information Technology Specialist in Networking", href: "/Networking.pdf" },
                ].map((cert) => (
                  <div key={cert.label} className="flex gap-3 sm:gap-4 cursor-default">
                    <div className="flex flex-col items-center pt-[6px]">
                      <div className="w-[6px] h-[6px] rounded-full bg-white shrink-0" />
                      <div className="w-px bg-gray-700 flex-1 mt-1" />
                    </div>
                    <div className="flex flex-col gap-[2px] pb-3">
                      <p className="text-gray-300 text-[14px] sm:text-[15px] font-semibold tracking-[0.3px]">{cert.label}</p>
                      <p className="text-[12px] sm:text-[13px] tracking-[0.3px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                        <a href={cert.href} target="_blank" rel="noopener noreferrer"
                          className="relative group italic font-light tracking-[0.38px] text-[#81E6D9]">
                          View Certification
                          <span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full" />
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2"><span className="font-bold tracking-[0.38px] mr-4">2025</span>Graduated B.S. Computer Science — Latin Honors</p>
            </div>
          </div>

          {/* ── Projects ── */}
          <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-7">
            <h3 className="text-white text-[18px] sm:text-[20px] font-bold">Projects</h3>
            {/* eslint-disable @next/next/no-img-element */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-5">
              {projectImages.map((img) => (
                <div key={img.alt} className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-full aspect-[7/4]">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {/* eslint-enable @next/next/no-img-element */}
            <div className="flex justify-center mt-7">
              <a
                href="/projects/portfolio"
                onMouseEnter={() => setPortfolioHovered(true)}
                onMouseLeave={() => setPortfolioHovered(false)}
                className="flex items-center justify-center font-semibold px-5 py-2 rounded-xl tracking-[0.38px] transition-colors duration-300"
                style={glassButtonStyle}
              >
                <span>Portfolio</span>
                <motion.span
                  animate={{ width: portfolioHovered ? 24 : 0, opacity: portfolioHovered ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ overflow: "hidden", display: "flex", alignItems: "center" }}
                >
                  <ArrowUpRight size={18} style={{ marginLeft: "6px", flexShrink: 0 }} />
                </motion.span>
              </a>
            </div>
          </div>

          {/* ── Photography ── */}
          <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-7">
            <h3 className="text-white text-[18px] sm:text-[20px] font-bold">Photography</h3>
            {/* eslint-disable @next/next/no-img-element */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-5">
              {photoImages.map((img) => (
                <div key={img.alt} className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-full aspect-[7/4]">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {/* eslint-enable @next/next/no-img-element */}
            <div className="flex justify-center mt-7">
              <a
                href="/photo/photography"
                onMouseEnter={() => setPhotoHovered(true)}
                onMouseLeave={() => setPhotoHovered(false)}
                className="flex items-center justify-center font-semibold px-5 py-2 rounded-xl tracking-[0.38px] transition-colors duration-300"
                style={glassButtonStyle}
              >
                <span>Photography</span>
                <motion.span
                  animate={{ width: photoHovered ? 24 : 0, opacity: photoHovered ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ overflow: "hidden", display: "flex", alignItems: "center" }}
                >
                  <ArrowUpRight size={18} style={{ marginLeft: "6px", flexShrink: 0 }} />
                </motion.span>
              </a>
            </div>
          </div>

          {/* ── Catch Me Here ── */}
          <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-7">
            <h3 className="text-white text-[18px] sm:text-[20px] font-bold">Catch me here</h3>
            <p className="text-gray-300 text-[14px] sm:text-[16px] mt-5 leading-relaxed">
              <span className="pl-6 inline-block">If you</span> need clarifications, have questions, or would like more information, simply click the{" "}
              <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">button below</span>, and I&apos;ll review it for you. I&apos;ll provide the best response and give some good quality idea for you.
            </p>
          </div>

          {/* ── Contact ── */}
          <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 mt-10 mb-1">
            <div className="flex justify-center">
              <button
                onClick={handleOpenModal}
                onMouseEnter={() => setMsgHovered(true)}
                onMouseLeave={() => setMsgHovered(false)}
                className="flex items-center justify-center font-semibold px-5 py-2 rounded-xl tracking-[0.38px] transition-colors duration-300 cursor-pointer"
                style={glassButtonStyle}
              >
                <motion.span
                  animate={{ width: msgHovered ? 24 : 0, opacity: msgHovered ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ overflow: "hidden", display: "flex", alignItems: "center" }}
                >
                  <Mail size={18} style={{ marginRight: "6px", flexShrink: 0 }} />
                </motion.span>
                <span>Send me a message here</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <MessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleMessageSent} />
      <Footer />
    </div>
  );
}