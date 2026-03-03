"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import PhotoModal from "@/components/PhotoModal";
import Skeleton from "@/components/Skeleton";

type Photo = {
  src: string;
  cc: string;
  location: string;
  theme: "Animals" | "Nature" | "Places" | "Macro";
};

export default function PhotographyPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activePhotos, setActivePhotos] = useState<Photo[]>([]);
  const [view, setView] = useState<"photos" | "gallery">("photos");
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  const photos: Photo[] = [
    { src: "/catp1.jpg", cc: "Dreaming cat in slumber", location: "Tamarind Ridge, Bataan", theme: "Animals" },
    { src: "/macrop4.jpg", cc: "Time at rest — the watch stills", location: "Balanga, Bataan", theme: "Macro" },
    { src: "/urbanp12.jpg", cc: "A home embraced by whispering trees", location: "Sinag Tala, Bataan", theme: "Places" },
    { src: "/flowerp13.jpg", cc: "A flower standing tall and proud", location: "Dinalupihan, Bataan", theme: "Nature" },
    { src: "/flowerp3.jpg", cc: "A delicate bloom aged by time", location: "Memorial Park, Bataan", theme: "Nature" },
    { src: "/catp2.jpg", cc: "Blue-eyed cat with a curious gaze", location: "Mulawin, Bataan", theme: "Animals" },
    { src: "/macrop10.jpg", cc: "A sharpened pencil poised for ideas", location: "Balanga, Bataan", theme: "Macro" },
    { src: "/cactus.jpg", cc: "A spiny cactus with sharp detail", location: "Beverly Heights, Bataan", theme: "Macro" },
    { src: "/dry.jpg", cc: "Dried dandelion in the middle of the field", location: "Dona, Bataan", theme: "Nature" },
    { src: "/beaches.jpg", cc: "A serene beach at sunset", location: "Bagac, Bataan", theme: "Places" },
  ];

  const groupedByTheme = photos.reduce<Record<string, Photo[]>>((acc, photo) => {
    if (!acc[photo.theme]) acc[photo.theme] = [];
    acc[photo.theme].push(photo);
    return acc;
  }, {});

  const handlePhotoClick = (photo: Photo, index: number, group?: Photo[]) => {
    setSelectedPhoto(photo);
    setActivePhotos(group ?? photos);
    setCurrentIndex(index);
  };

  const handleImageLoad = (src: string) =>
    setLoadedImages((prev) => ({ ...prev, [src]: true }));

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

        <AnimatePresence>
          <motion.div
            key="photography-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full mt-10 flex-grow"
          >
            <div className="max-w-[800px] w-full mx-auto px-5 sm:px-8 md:px-31 flex flex-col gap-8">
              <h3 className="text-white text-[18px] sm:text-[20px] font-bold">Photography</h3>

              {/* Section Buttons */}
              <div className="flex justify-center gap-8 mt-2">
                <button
                  className={`relative group text-[15px] sm:text-[17px] font-medium focus:outline-none cursor-pointer ${view === "photos" ? "text-white" : "text-gray-300"}`}
                  onClick={() => setView("photos")}
                >
                  Photos <span className="text-[#81E6D9]">{photos.length}</span>
                  <span className={`absolute left-0 -bottom-[2px] h-[2px] bg-white transition-all duration-300 ${view === "photos" ? "w-full" : "w-0 group-hover:w-full"}`} />
                </button>

                <button
                  className={`relative group text-[15px] sm:text-[17px] font-medium focus:outline-none cursor-pointer ${view === "gallery" ? "text-white" : "text-gray-300"}`}
                  onClick={() => setView("gallery")}
                >
                  Gallery <span className="text-[#81E6D9]">{Object.keys(groupedByTheme).length}</span>
                  <span className={`absolute left-0 -bottom-[2px] h-[2px] bg-white transition-all duration-300 ${view === "gallery" ? "w-full" : "w-0 group-hover:w-full"}`} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {view === "photos" && (
                  <motion.div
                    key="photos"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-2 w-full">
                      {(showAll ? photos : photos.slice(0, 6)).map((photo, index) => (
                        <div
                          key={photo.src}
                          className="relative bg-[#2F3445] border border-gray-600 shadow-md rounded-lg overflow-hidden w-full sm:w-[260px] h-[200px] sm:h-[160px] mx-auto cursor-pointer group"
                          onClick={() => handlePhotoClick(photo, index)}
                        >
                          {!loadedImages[photo.src] && <Skeleton className="absolute inset-0" />}
                          <Image
                            src={photo.src}
                            alt={`Photo ${index + 1}`}
                            fill
                            loading="lazy"
                            sizes="(min-width: 640px) 260px, 100vw"
                            className={`object-cover transition-opacity duration-500 ${loadedImages[photo.src] ? "opacity-100" : "opacity-0"}`}
                            onLoad={() => handleImageLoad(photo.src)}
                          />
                        </div>
                      ))}
                    </div>

                    {!showAll && photos.length > 6 && (
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
                    )}
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
                    {Object.entries(groupedByTheme).map(([theme, themePhotos], themeIndex) => {
                      const [featured, ...rest] = themePhotos;
                      return (
                        <div
                          key={themeIndex}
                          className="relative rounded-2xl p-4 shadow-lg"
                          style={{
                            background: "rgba(26, 30, 40, 0.6)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-white text-sm font-semibold tracking-[0.3px]">{theme}</span>
                            <span style={{ color: "rgba(255,255,255,0.4)" }} className="text-xs tracking-[0.3px]">
                              {themePhotos.length} photo{themePhotos.length > 1 ? "s" : ""}
                            </span>
                          </div>

                          <div className="flex gap-2" style={{ height: "140px" }}>
                            {/* Featured */}
                            <div
                              className="relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
                              style={{ width: "55%", height: "100%" }}
                              onClick={() => handlePhotoClick(featured, 0, themePhotos)}
                            >
                              {!loadedImages[featured.src] && <Skeleton className="absolute inset-0" />}
                              <Image
                                src={featured.src}
                                alt={featured.cc}
                                fill
                                loading="lazy"
                                sizes="30vw"
                                className={`object-cover transition-transform duration-300 hover:scale-105 ${loadedImages[featured.src] ? "opacity-100" : "opacity-0"}`}
                                onLoad={() => handleImageLoad(featured.src)}
                              />
                            </div>

                            {/* Rest */}
                            <div className="flex flex-col gap-2 flex-1">
                              {rest.length === 0 ? (
                                <div className="flex-1 rounded-lg flex items-center justify-center"
                                  style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                                  <span style={{ color: "rgba(255,255,255,0.2)" }} className="text-xs">only one photo</span>
                                </div>
                              ) : (
                                rest.slice(0, 3).map((photo, index) => (
                                  <div
                                    key={photo.src}
                                    className="relative rounded-lg overflow-hidden cursor-pointer flex-1"
                                    onClick={() => handlePhotoClick(photo, index + 1, themePhotos)}
                                  >
                                    {!loadedImages[photo.src] && <Skeleton className="absolute inset-0" />}
                                    <Image
                                      src={photo.src}
                                      alt={photo.cc}
                                      fill
                                      loading="lazy"
                                      sizes="15vw"
                                      className={`object-cover transition-transform duration-300 hover:scale-105 ${loadedImages[photo.src] ? "opacity-100" : "opacity-0"}`}
                                      onLoad={() => handleImageLoad(photo.src)}
                                    />
                                    {index === 2 && rest.length > 3 && (
                                      <div className="absolute inset-0 flex items-center justify-center rounded-lg"
                                        style={{ background: "rgba(0,0,0,0.55)" }}>
                                        <span className="text-white font-semibold text-sm">+{rest.length - 3}</span>
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <div className="relative w-7 h-7 rounded-full overflow-hidden">
                              <Image
                                src="/profile.png"
                                alt="Samssiams"
                                fill
                                loading="lazy"
                                sizes="28px"
                                className="object-cover"
                              />
                            </div>
                            <span style={{ color: "rgba(255,255,255,0.7)" }} className="text-[13px] font-medium">Samssiams</span>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        <Footer />
      </div>

      <PhotoModal
        isOpen={!!selectedPhoto}
        onClose={() => {
          setSelectedPhoto(null);
          setActivePhotos([]);
        }}
        photos={activePhotos}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}