"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import PhotoModal from "@/components/PhotoModal";
import Skeleton from "@/components/Skeleton";


// Define a proper type for your photos
type Photo = {
  src: string;
  cc: string;
  location: string;
};

export default function PhotographyPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [view, setView] = useState<"photos" | "gallery">("photos");
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const photos: Photo[] = [
    { src: "/p1.jpg", cc: "Dreaming cat in slumber", location: "Tamarind Ridge, Bataan" },
    { src: "/p14.jpg", cc: "A fragile curve of beauty", location: "Masagana Village, Bataan" },
    { src: "/p2.jpg", cc: "Blue-eyed cat with a curious gaze", location: "Mulawin, Bataan" },
    { src: "/p4.jpg", cc: "Time at rest — the watch stills", location: "Balanga, Bataan" },
    { src: "/p13.jpg", cc: "A flower standing tall and proud", location: "Dinalupihan, Bataan" },
    { src: "/p3.jpg", cc: "A delicate bloom aged by time", location: "Memorial Park, Bataan" },
    { src: "/p12.jpg", cc: "A home embraced by whispering trees", location: "Sinag Tala, Bataan" },
    { src: "/p10.jpg", cc: "A sharpened pencil poised for ideas", location: "Balanga, Bataan" },
  ];

  // Divide photos into groups of 4 for the gallery
  const galleryBoxes: Photo[][] = [];
  for (let i = 0; i < photos.length; i += 4) {
    galleryBoxes.push(photos.slice(i, i + 4));
  }

  const handlePhotoClick = (photo: Photo) => setSelectedPhoto(photo);
  const handleImageLoad = (src: string) =>
    setLoadedImages((prev) => ({ ...prev, [src]: true }));

  return (
    <div className="min-h-screen bg-[#232732] font-chakra flex flex-col">
      <Header />
      <Banner />

      <AnimatePresence>
        <motion.div
          key="photography-page"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full mt-10 flex-grow"
        >
          <div className="max-w-[800px] w-full mx-auto px-31 flex flex-col gap-8">
            <h3 className="text-white text-[20px] font-bold">Photography</h3>

            {/* Section Buttons */}
            <div className="flex justify-center gap-8 mt-2">
              <button
                className={`relative group text-[17px] font-medium focus:outline-none cursor-pointer ${
                  view === "photos" ? "text-white" : "text-gray-300"
                }`}
                onClick={() => setView("photos")}
              >
                Photos <span className="text-[#81E6D9]">{photos.length}</span>
                <span
                  className={`absolute left-0 -bottom-[2px] h-[2px] bg-white transition-all duration-300 
                    ${view === "photos" ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </button>

              <button
                className={`relative group text-[17px] font-medium focus:outline-none cursor-pointer ${
                  view === "gallery" ? "text-white" : "text-gray-300"
                }`}
                onClick={() => setView("gallery")}
              >
                Gallery <span className="text-[#81E6D9]">{galleryBoxes.length}</span>
                <span
                  className={`absolute left-0 -bottom-[2px] h-[2px] bg-white transition-all duration-300 
                    ${view === "gallery" ? "w-full" : "w-0 group-hover:w-full"}`}
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
                      className="relative bg-[#2F3445] rounded-lg overflow-hidden shadow-lg w-[260px] h-[160px] mx-auto cursor-pointer group"
                      onClick={() => handlePhotoClick(photo)}
                    >
                      {!loadedImages[photo.src] && (
                        <Skeleton className="absolute inset-0" />
                      )}
                      <img
                        src={photo.src}
                        alt={`Photo ${index + 1}`}
                          className={`w-full h-full object-cover transition-opacity duration-500 ${
                          loadedImages[photo.src] ? "opacity-100" : "opacity-0"
                           }`}
                        onLoad={() => handleImageLoad(photo.src)}
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
                      className="relative bg-[#2F3445] rounded-lg p-4 shadow-lg"
                    >
                      {/* Grid of photos */}
                      <div className="grid grid-cols-2 gap-4">
                        {box.map((photo, index) => (
                          <div
                            key={index}
                            className="relative w-full h-[120px] overflow-hidden rounded-lg cursor-pointer group"
                            onClick={() => handlePhotoClick(photo)}
                          >
                            {!loadedImages[photo.src] && (
                              <Skeleton className="absolute inset-0" />
                            )}
                            <img
                              src={photo.src}
                              alt={`Gallery ${boxIndex * 4 + index + 1}`}
                              className="w-full h-full object-cover"
                              onLoad={() => handleImageLoad(photo.src)}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Profile and name (no box around) */}
                      <div className="mt-4 flex items-center gap-2">
                        <img
                          src="/profile.png"
                          alt="Samssiams"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-white text-[15px] font-medium">
                          Samssiams
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      <Footer />

      <PhotoModal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        image={selectedPhoto?.src || ""}
        cc={selectedPhoto?.cc || ""}
        location={selectedPhoto?.location || ""}
      />
    </div>
  );
}
