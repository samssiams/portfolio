import Header from "@/components/Header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import MomentsGallery from "./MomentsGallery";

export default function MomentsPage() {
  return (
    <div className="min-h-screen font-chakra flex flex-col items-center relative bg-[#1a1e28]">
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.18, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "200px 200px", mixBlendMode: "overlay" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(129,230,217,0.04) 0%, transparent 70%), radial-gradient(ellipse 100% 80% at 50% 100%, rgba(10,12,18,0.6) 0%, transparent 60%), radial-gradient(ellipse 60% 100% at 0% 50%, rgba(10,12,18,0.3) 0%, transparent 70%), radial-gradient(ellipse 60% 100% at 100% 50%, rgba(10,12,18,0.3) 0%, transparent 70%)` }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, backgroundImage: "radial-gradient(circle, rgba(129,230,217,0.09) 1px, transparent 1px)", backgroundSize: "24px 24px", backgroundAttachment: "fixed", maskImage: "radial-gradient(ellipse 90% 90% at 50% 40%, black 40%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 40%, black 40%, transparent 100%)" }} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(129,230,217,0.035) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "20%", left: "20%", width: "400px", height: "400px", background: "radial-gradient(ellipse, rgba(100,120,200,0.025) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>
      <Header />
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="fixed top-0 left-0 w-full pointer-events-none" style={{ zIndex: 9, height: "40px", background: "linear-gradient(to bottom, #1a1e28 0%, #1a1e28 40%, rgba(26,30,40,0.7) 70%, transparent 100%)" }} />
        <Banner message="Shanna" />
        <section className="w-full max-w-[800px] px-5 sm:px-8 md:px-31 mt-10" aria-labelledby="moments-title">
          <p className="text-[#81E6D9] text-[11px] uppercase tracking-[0.18em]">A hidden page</p>
          <h1 id="moments-title" className="mt-2 text-white text-[24px] sm:text-[30px] font-bold">A little corner of you</h1>

          <MomentsGallery />

        </section>
        <Footer />
      </div>
    </div>
  );
}
