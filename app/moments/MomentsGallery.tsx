"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const photos = [
  { src: "/moments/f.jpg", shape: "aspect-[3/4]", width: 1536, height: 2048 },
  { src: "/moments/fi.jpg", shape: "aspect-[3/4]", width: 1536, height: 2048 },
  { src: "/moments/vin1.jpg", shape: "aspect-[3/4]", width: 3024, height: 4032 },
  { src: "/moments/vin2.jpg", shape: "aspect-[3/4]", width: 3024, height: 4032 },
  { src: "/moments/vin3.jpg", shape: "aspect-[3/4]", width: 3024, height: 4032 },
];

function MomentsPhotoViewer({ selectedIndex, setSelectedIndex, onClose }: {
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (selectedIndex === null) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
      if (event.key === "ArrowRight") setSelectedIndex((selectedIndex + 1) % photos.length);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, setSelectedIndex, onClose]);

  const photo = selectedIndex === null ? null : photos[selectedIndex];
  if (!photo || selectedIndex === null || typeof document === "undefined") return null;
  const previousIndex = (selectedIndex - 1 + photos.length) % photos.length;
  const nextIndex = (selectedIndex + 1) % photos.length;
  const previousPhoto = photos[previousIndex];
  const nextPhoto = photos[nextIndex];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-3 py-4 backdrop-blur-md sm:px-6"
      onClick={onClose}
    >
      <div
        className="flex max-w-full flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex min-h-0 max-w-[96vw] items-center justify-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setSelectedIndex(previousIndex)}
            aria-label="Previous image"
            className="relative hidden h-[100px] w-[140px] shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 opacity-50 transition-opacity hover:opacity-80 sm:block md:h-[140px] md:w-[200px]"
          >
            <Image src={previousPhoto.src} alt="" fill sizes="192px" className="object-cover" />
          </button>

          <div className="flex max-w-[86vw] flex-col items-center rounded-2xl border border-white/15 bg-[#1a1e28]/95 p-2 shadow-2xl sm:max-w-[70vw] sm:p-2.5">
            <div className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-xl bg-black/30">
              <Image
                src={photo.src}
                alt="Photo from the hidden gallery"
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 82vw, 500px"
                priority
                className="h-auto w-auto max-w-[82vw] rounded-xl object-contain sm:max-w-[min(500px,65vw)]"
                style={{ maxHeight: "min(60dvh, 520px)" }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedIndex(nextIndex)}
            aria-label="Next image"
            className="relative hidden h-[100px] w-[140px] shrink-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 opacity-50 transition-opacity hover:opacity-80 sm:block md:h-[140px] md:w-[200px]"
          >
            <Image src={nextPhoto.src} alt="" fill sizes="192px" className="object-cover" />
          </button>
        </div>

        <div className="flex items-center gap-6 pt-2 sm:hidden">
          <button type="button" onClick={() => setSelectedIndex(previousIndex)} aria-label="Previous image" className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => setSelectedIndex(nextIndex)} aria-label="Next image" className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <ChevronRight size={20} />
          </button>
        </div>
        <p className="mt-4 text-center text-[11px] font-medium text-white/35">Click anywhere outside to close</p>
      </div>
    </div>,
    document.body
  );
}

export default function MomentsGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  return (
    <>
      <div className="mt-6 columns-2 gap-3 sm:gap-4">
        {photos.map((photo, index) => (
          <figure key={photo.src} className={`relative ${photo.shape} mb-3 break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] sm:mb-4`}>
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View photo ${index + 1} full size`}
              className="group absolute inset-0 h-full w-full cursor-pointer"
            >
              <Image
                src={photo.src}
                alt="Photo from the hidden gallery"
                fill
                priority={index === 0}
                sizes="(min-width: 640px) 380px, 46vw"
                className="scale-[1.06] object-cover transition-transform duration-500 group-hover:scale-[1.12]"
              />
            </button>
          </figure>
        ))}
      </div>

      <MomentsPhotoViewer
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        setSelectedIndex={setSelectedIndex}
      />
    </>
  );
}
