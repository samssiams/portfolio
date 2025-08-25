"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import PhotoModal from "@/components/PhotoModal";

export default function PhotographyPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [view, setView] = useState<"photos" | "gallery">("photos");
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const photos = [
    "/p1.jpg",
    "/p14.jpg",
    "/p2.jpg",
    "/p4.jpg",
    "/p13.jpg",
    "/p3.jpg",
    "/p12.jpg",
    "/p10.jpg",
  ];

  const galleryBoxes = [];
  for (let i = 0; i < photos.length; i += 4) {
    galleryBoxes.push(photos.slice(i, i + 4));
  }

  const handlePhotoClick = (photo: string) => setSelectedPhoto(photo);
  const handleImageLoad = (src: string) =>
    setLoadedImages((prev) => ({ ...prev, [src]: true }));

  return (
    <div className="min-h-screen bg-[#232732] font-chakra flex flex-col">
      <Header />
      <Banner />

      {/* Animate entire body content like Home/Portfolio */}
      <motion.div
        key="photography-body"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="max-w-[800px] w-full mx-auto px-31 mt-10 flex flex-col gap-3"
      >
        <h3 className="text-white text-[20px] font-bold">Photography</h3>

        {/* Section Buttons */}
        <div className="flex justify-center gap-8 mt-2">
          <button
            className={`relative text-[17px] font-medium focus:outline-none cursor-pointer ${
              view === "photos" ? "text-white" : "text-gray-300"
            }`}
            onClick={() => setView("photos")}
          >
            Photos <span className="text-[#81E6D9]">{photos.length}</span>
            <span
              className={`absolute left-0 -bottom-[2px] w-0 h-[2px] bg-white transition-all duration-300 ${
                view === "photos" ? "w-full" : "group-hover:w-full"
              }`}
            />
          </button>
          <button
            className={`relative text-[17px] font-medium focus:outline-none cursor-pointer ${
              view === "gallery" ? "text-white" : "text-gray-300"
            }`}
            onClick={() => setView("gallery")}
          >
            Gallery <span className="text-[#81E6D9]">{galleryBoxes.length}</span>
            <span
              className={`absolute left-0 -bottom-[2px] w-0 h-[2px] bg-white transition-all duration-300 ${
                view === "gallery" ? "w-full" : "group-hover:w-full"
              }`}
            />
          </button>
        </div>

        {/* Animate Photos/Gallery transition */}
        <AnimatePresence mode="wait">
          {view === "photos" && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 gap-6 mt-2"
            >
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[260px] h-[160px] mx-auto cursor-pointer"
                  onClick={() => handlePhotoClick(photo)}
                >
                  {!loadedImages[photo] && (
                    <div className="absolute inset-0 bg-gray-700 animate-pulse" />
                  )}
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => handleImageLoad(photo)}
                  />
                </div>
              ))}
            </motion.div>
          )}

          {view === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6 mt-2"
            >
              {galleryBoxes.map((box, boxIndex) => (
                <div
                  key={boxIndex}
                  className="relative bg-[#2F3445] rounded-lg p-4 shadow-lg cursor-pointer"
                >
                  <div className="grid grid-cols-2 gap-4 pb-8">
                    {box.map((photo, index) => (
                      <div
                        key={index}
                        className="relative w-full h-[120px] overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => handlePhotoClick(photo)}
                      >
                        {!loadedImages[photo] && (
                          <div className="absolute inset-0 bg-gray-700 animate-pulse" />
                        )}
                        <img
                          src={photo}
                          alt={`Gallery ${boxIndex * 4 + index + 1}`}
                          className="w-full h-full object-cover"
                          onLoad={() => handleImageLoad(photo)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <img
                      src="/profile.png"
                      alt="SamSiams"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-white text-sm font-medium">Samssiams</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Footer />

      <PhotoModal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        image={selectedPhoto || ""}
      />
    </div>
  );
}
