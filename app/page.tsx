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

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "error" } | null>(null);

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

  return (
    <div className="min-h-screen bg-[#222732] font-chakra flex flex-col items-center">
      <Header />
      <Banner />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 right-5 z-50 px-5 py-3 rounded-lg text-[14px] font-medium tracking-[0.3px] shadow-lg"
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
          {/* Samuel Cruz Info */}
          <div className="max-w-[800px] w-full mx-auto px-31 flex items-center justify-between">
            <div>
              <h2 className="text-white text-[35px] font-bold">Samuel Cruz</h2>
              <p className="text-gray-300 mt-2 text-[16px] flex items-center gap-2">
                <MapPin size={18} strokeWidth={2} className="relative top-[-2px]" />
                Bataan, Philippines
              </p>
              <p className="text-gray-300 mt-3 text-[16px]">
                Web Developer <span className="text-white">|</span> Project Manager
              </p>
              <div className="flex gap-6 mt-4 text-[17px] font-semibold text-[#81E6D9] tracking-[0.38px]">
                <a href="https://www.instagram.com/samssiams/" target="_blank" rel="noopener noreferrer" className="flex items-baseline gap-2">
                  <Instagram size={20} className="relative top-[2px]" />
                  <span className="relative group">
                    Samssiams
                    <span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
                <a href="https://www.linkedin.com/in/samssiams/" target="_blank" rel="noopener noreferrer" className="flex items-baseline gap-2">
                  <Linkedin size={20} className="relative top-[2px]" />
                  <span className="relative group">
                    Samssiams
                    <span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
                <a href="/CV_Cruz.pdf" target="_blank" rel="noopener noreferrer" className="flex items-baseline gap-2">
                  <FileUser size={20} className="relative top-[2px]" />
                  <span className="relative group">
                    Resume
                    <span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </div>
            </div>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/profile.png" alt="Samuel Cruz" className="w-30 h-30 rounded-full border-2 border-white shadow-lg object-cover" />
            </div>
          </div>

          {/* About Me */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-10">
            <h3 className="text-white text-[20px] font-bold">About me</h3>
            <p className="text-gray-300 text-[16px] mt-3">
              <span className="pl-6 inline-block">I am</span>{" "}
              a <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">web developer</span> and{" "}
              <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">project manager</span> with a strong track record in
              delivering efficient, user-focused solutions. I excel at coordinating teams, streamlining workflows, and bridging the gap
              between creative vision and technical execution. Alongside my technical expertise, I&apos;m a{" "}
              <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">photographer</span> who enjoys capturing stories and moments through my camera.
            </p>
          </div>

          {/* Work */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-7">
            <h3 className="text-white text-[20px] font-bold">Experiences</h3>
            <div className="text-gray-300 text-[16px] mt-3 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p>
                  <span className="font-bold tracking-[0.38px] mr-4">2025 – Present</span>
                  Technical Project Manager —{" "}
                  <span className="font-bold tracking-[0.38px] text-[#81E6D9]">Freelancer.com</span>
                </p>
                <div className="ml-1 mt-3 flex flex-col gap-3">
                  {[
                    { title: "Co-Pilot — Tamkeen Partnership Program", date: "2026", place: "Bonifacio Global City, Taguig", desc: "Coordinated stakeholders and teams to deliver a structured mentorship and partnership initiative." },
                    { title: "Prominence Bank – Digital Banking Platform", date: "2026", place: "Bonifacio Global City, Taguig", desc: "Managed cross-functional teams and sprint planning for end-to-end digital banking delivery." },
                    { title: "InnerX – AI-Based Emotional Analytics", date: "2025", place: "Bonifacio Global City, Taguig", desc: "Oversaw the development lifecycle of an AI-driven emotional analytics tool from concept to prototype." },
                  ].map((project) => (
                    <div key={project.title} className="project-card flex gap-4 cursor-default">
                      <div className="flex flex-col items-center pt-[6px]">
                        <div className="project-dot-inner w-[6px] h-[6px] rounded-full bg-white shrink-0" />
                        <div className="w-px bg-gray-700 flex-1 mt-1" />
                      </div>
                      <div className="flex flex-col gap-[2px] pb-3">
                        <p className="project-card-title text-gray-300 text-[15px] font-semibold tracking-[0.3px] transition-colors duration-200">{project.title}</p>
                        <p className="text-[13px] tracking-[0.3px]" style={{ color: "rgba(255,255,255,0.6)" }}>{project.date} · {project.place}</p>
                        <p className="text-[15px] leading-relaxed mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{project.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p>
                  <span className="font-bold tracking-[0.38px] mr-4">2024</span>
                  Full-Stack Web Developer Intern —{" "}
                  <span className="font-bold tracking-[0.38px] text-[#81E6D9]">Kynatech Technologies Co.</span>
                </p>
                <div className="ml-1 mt-3 flex flex-col gap-3">
                  {[
                    { title: "Full Stack Web Development", date: "2024", place: "Bonifacio Global City, Taguig", desc: "Built a Next.js app with Supabase, Prisma, and NextAuth covering auth, timesheet, and payroll via REST APIs." },
                    { title: "Project Management", date: "2024", place: "Bonifacio Global City, Taguig", desc: "Ensured on-time delivery through progress monitoring, task verification, and Agile & Waterfall methodologies." },
                  ].map((project) => (
                    <div key={project.title} className="project-card flex gap-4 cursor-default">
                      <div className="flex flex-col items-center pt-[6px]">
                        <div className="project-dot-inner w-[6px] h-[6px] rounded-full bg-white shrink-0" />
                        <div className="w-px bg-gray-700 flex-1 mt-1" />
                      </div>
                      <div className="flex flex-col gap-[2px] pb-3">
                        <p className="project-card-title text-gray-300 text-[15px] font-semibold tracking-[0.3px] transition-colors duration-200">{project.title}</p>
                        <p className="text-[13px] tracking-[0.3px]" style={{ color: "rgba(255,255,255,0.6)" }}>{project.date} · {project.place}</p>
                        <p className="text-[15px] leading-relaxed mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{project.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-7">
            <h3 className="text-white text-[20px] font-bold">Bio</h3>
            <div className="text-gray-300 text-[16px] mt-3 space-y-2">
              <p>
                <span className="font-bold tracking-[0.38px] mr-4">2021</span>
                Graduated Senior High — With High Honors
              </p>
              <p>
                <span className="font-bold tracking-[0.38px] mr-4">2024</span>
                Digital Credentials & Certifications
              </p>
              <div className="ml-1 mt-3 flex flex-col gap-3">
                {[
                  { label: "IC3 Digital Literacy Certification", href: "/IC3 GS6 Level 1.pdf", date: "2024" },
                  { label: "Microsoft Office Specialist Associate (Microsoft 365)", href: "/Microsoft Office Specialist  Associate.pdf", date: "2024" },
                  { label: "Information Technology Specialist in Network Security", href: "/Network Security.pdf", date: "2024" },
                  { label: "Information Technology Specialist in Networking", href: "/Networking.pdf", date: "2024" },
                ].map((cert) => {
                  const linkClass = "relative group italic font-light tracking-[0.38px] text-[#81E6D9]";
                  const spanClass = "absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full";
                  return (
                    <div key={cert.label} className="cert-card flex gap-4 cursor-default">
                      <div className="flex flex-col items-center pt-[6px]">
                        <div className="project-dot-inner w-[6px] h-[6px] rounded-full bg-white shrink-0" />
                        <div className="w-px bg-gray-700 flex-1 mt-1" />
                      </div>
                      <div className="flex flex-col gap-[2px] pb-3">
                        <p className="cert-title text-gray-300 text-[15px] font-semibold tracking-[0.3px] transition-colors duration-200">{cert.label}</p>
                        <p className="text-[13px] tracking-[0.3px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {cert.date} ·{" "}
                          <a href={cert.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                            View
                            <span className={spanClass} />
                          </a>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2">
                <span className="font-bold tracking-[0.38px] mr-4">2025</span>
                Graduated B.S. Computer Science — Latin Honors
              </p>
            </div>
          </div>

          {/* Projects */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-7">
            <h3 className="text-white text-[20px] font-bold">Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
              {/* eslint-disable @next/next/no-img-element */}
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/protecture1.png" alt="Project 1" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/pa1.png" alt="Project 2" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/tat.png" alt="Project 3" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/bankito.png" alt="Project 4" className="w-full h-full object-cover" />
              </div>
              {/* eslint-enable @next/next/no-img-element */}
            </div>
            <div className="flex justify-center mt-7">
              <a href="/projects/portfolio" className="flex items-center gap-2 bg-[#81E6D9] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#4FD1C5] transition tracking-[0.38px]">
                <span>Portfolio</span>
                <ArrowUpRight size={20} />
              </a>
            </div>
          </div>

          {/* Photography */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-7">
            <h3 className="text-white text-[20px] font-bold">Photography</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
              {/* eslint-disable @next/next/no-img-element */}
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/catp1.jpg" alt="Photo 1" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/macrop4.jpg" alt="Photo 2" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/cactus.jpg" alt="Photo 3" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/macrop10.jpg" alt="Photo 4" className="w-full h-full object-cover" />
              </div>
              {/* eslint-enable @next/next/no-img-element */}
            </div>
            <div className="flex justify-center mt-7">
              <a href="/photo/photography" className="flex items-center gap-2 bg-[#81E6D9] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#4FD1C5] transition tracking-[0.38px]">
                <span>Photography</span>
                <ArrowUpRight size={20} />
              </a>
            </div>
          </div>

          {/* Catch Me Here */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-7">
            <h3 className="text-white text-[20px] font-bold">Catch me here</h3>
            <p className="text-gray-300 text-[16px] mt-5">
              <span className="pl-6 inline-block">If you</span> need clarifications, have questions, or would like more information, simply click the{" "}
              <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">button below</span>, and I&apos;ll review it for you. I&apos;ll provide the best response and give some good quality idea for you.
            </p>
          </div>

          {/* Contact */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-10 mb-1">
            <div className="flex justify-center">
              <button
                onClick={handleOpenModal}
                className="flex items-center gap-2 bg-[#81E6D9] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#4FD1C5] transition tracking-[0.38px]"
              >
                <Mail size={20} />
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