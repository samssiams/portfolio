"use client";

import { Instagram, Linkedin, ArrowUpRight, Mail, FileUser } from "lucide-react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MessageModal from "../components/MessageModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#232732] font-chakra flex flex-col items-center">
      <Header />
      <Banner />

      {/* Animateable Content */}
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
              <p className="text-gray-300 mt-1 text-[16px]">
                Web Developer <span className="text-white">|</span> Project Management{" "}
                <span className="text-white">|</span> Photography
              </p>

              <div className="flex gap-6 mt-3 text-[17px] font-semibold text-[#81E6D9] tracking-[0.38px]">
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

                <a href="/Resume.pdf" download className="flex items-baseline gap-2">
                  <FileUser size={20} className="relative top-[2px]" />
                  <span className="relative group">
                    Resume
                    <span className="absolute left-0 -bottom-[2px] w-0 h-[2px] bg-[#81E6D9] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </a>
              </div>
            </div>

            <div>
              <img
                src="/profile.png"
                alt="Samuel Cruz"
                className="w-30 h-30 rounded-full border-2 border-white shadow-lg object-cover"
              />
            </div>
          </div>

          {/* About Me Section */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-10">
            <h3 className="text-white text-[20px] font-bold">About me</h3>
            <p className="text-gray-300 text-[16px] mt-3">
              <span className="pl-6 inline-block">I am</span>{" "}
              a <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">web developer</span> and{" "}
              <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">project manager</span> with a strong track record in
              delivering efficient, user-focused solutions. I excel at
              coordinating teams, streamlining workflows, and bridging the gap
              between creative vision and technical execution. Alongside my technical
              expertise, I&apos;m a <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">photographer</span> who enjoys capturing stories and moments
              through my camera.
            </p>
          </div>

          {/* Bio Section */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-7">
            <h3 className="text-white text-[20px] font-bold">Bio</h3>
            <div className="text-gray-300 text-[16] mt-3 space-y-2">
              <p>
                <span className="font-bold tracking-[0.38px] mr-4">2021</span>
                Graduated Senior High — With High Honors
              </p>
              <p>
                <span className="font-bold tracking-[0.38px] mr-4">2024</span>
                IC3 Digital Literacy Certification - <span className="font-bold tracking-[0.38px] text-[#81E6D9]">Acquired</span>
              </p>
              <p className="pl-14">
                Microsoft Office Specialist Associate (Microsoft 365) - <span className="font-bold tracking-[0.38px] text-[#81E6D9]">Acquired</span>
              </p>
              <p className="pl-14">
                Information Technology Specialist in Network Security - <span className="font-bold tracking-[0.38px] text-[#81E6D9]">Acquired</span>
              </p>
              <p className="pl-14">
                Information Technology Specialist in Networking - <span className="font-bold tracking-[0.38px] text-[#81E6D9]">Acquired</span>
              </p>
              <p>
                <span className="font-bold tracking-[0.38px] mr-4">2025</span>
                Graduated B.S. Computer Science — Latin Honors
              </p>
            </div>
          </div>

          {/* Projects Section */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-7">
            <h3 className="text-white text-[20px] font-bold">Projects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
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
            </div>
            <div className="flex justify-center mt-7">
              <a
                href="/projects/portfolio"
                className="flex items-center gap-2 bg-[#81E6D9] text-black font-semibold px-4 py-2.5 rounded-lg hover:bg-[#4FD1C5] transition tracking-[0.38px] cursor-pointer"
              >
                <span>Portfolio</span>
                <ArrowUpRight size={20} />
              </a>
            </div>
          </div>

          {/* Photography Section */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-7">
            <h3 className="text-white text-[20px] font-bold">Photography</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-5">
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/p1.jpg" alt="Project 1" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/p13.jpg" alt="Project 2" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/p14.jpg" alt="Project 3" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[262px] h-[150px]">
                <img src="/p2.jpg" alt="Project 4" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex justify-center mt-7">
              <a
                href="/photo/photography"
                className="flex items-center gap-2 bg-[#81E6D9] text-black font-semibold px-4 py-2.5 rounded-lg hover:bg-[#4FD1C5] transition tracking-[0.38px] cursor-pointer"
              >
                <span>Photography</span>
                <ArrowUpRight size={20} />
              </a>
            </div>
          </div>

          {/* Catch Me Here Section */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-7">
            <h3 className="text-white text-[20px] font-bold">Catch me here</h3>
            <p className="text-gray-300 text-[16px] mt-5">
              <span className="pl-6 inline-block">If you</span> need clarifications, have
              questions, or would like more information, simply click the{" "}
              <span className="font-semibold text-[#81E6D9] tracking-[0.38px]">
                button below
              </span>
              , and I&apos;ll review it for you. I&apos;ll provide the best response and give some
              good quality idea for you.
            </p>
          </div>

          {/* Contact Section with Bottom Space */}
          <div className="max-w-[800px] w-full mx-auto px-31 mt-10 mb-1">
            <div className="flex justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-[#81E6D9] text-black font-semibold px-4 py-2.5 rounded-lg hover:bg-[#4FD1C5] transition tracking-[0.38px] cursor-pointer"
              >
                <Mail size={20} />
                <span>Send me a message here</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <MessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Footer />
    </div>
  );
}
