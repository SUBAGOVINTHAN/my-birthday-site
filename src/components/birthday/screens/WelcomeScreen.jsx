import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants";
import { useAudio } from "../context/AudioContext";
import bowImg from "../../../assets/bow2.png";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { startAudio } = useAudio();
  const [opening, setOpening] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    if (opening) return;
    startAudio();
    setOpening(true);

    setTimeout(() => {
      navigate("/quest/gift");
    }, 850);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center px-4">
      <style>{`
        @keyframes bow-split-left {
          0% { transform: translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(-120%) rotate(-15deg); opacity: 0; }
        }
        @keyframes bow-split-right {
          0% { transform: translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(120%) rotate(15deg); opacity: 0; }
        }
        @keyframes bow-enter {
          0% { opacity: 0; transform: scale(0.85) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bow-idle-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes hint-fade {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .bow-half-left.opening {
          animation: bow-split-left 0.85s ease-in forwards;
        }
        .bow-half-right.opening {
          animation: bow-split-right 0.85s ease-in forwards;
        }
        .bow-enter {
          animation: bow-enter 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .bow-idle {
          animation: bow-idle-pulse 2.6s ease-in-out infinite;
        }
        .hint-enter {
          animation: hint-fade 0.7s ease-out 0.6s forwards;
          opacity: 0;
        }
      `}</style>

      {/* cream background */}
      <div className="fixed inset-0 -z-10" style={{ background: COLORS.cream }} />

      {/* ===== FULL-WIDTH BOW ===== */}
      <div className="relative w-screen mb-10">
        {/* left half */}
        <div
          onClick={handleStart}
          className={`bow-half-left absolute inset-0 cursor-pointer ${mounted ? "bow-enter" : ""} ${!opening && mounted ? "bow-idle" : ""} ${opening ? "opening" : ""}`}
          style={{
            clipPath: "inset(0 50% 0 0)",
            backgroundImage: `url(${bowImg})`,
            backgroundSize: "100vw auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "28vw",          // keeps proportions nice on mobile
            minHeight: "110px",
            maxHeight: "180px",
            opacity: mounted ? undefined : 0,
          }}
        />
        {/* right half */}
        <div
          onClick={handleStart}
          className={`bow-half-right absolute inset-0 cursor-pointer ${mounted ? "bow-enter" : ""} ${!opening && mounted ? "bow-idle" : ""} ${opening ? "opening" : ""}`}
          style={{
            clipPath: "inset(0 0 0 50%)",
            backgroundImage: `url(${bowImg})`,
            backgroundSize: "100vw auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "28vw",
            minHeight: "110px",
            maxHeight: "180px",
            opacity: mounted ? undefined : 0,
          }}
        />
      </div>

      {/* title */}
      <div
        className="relative z-10 px-8 py-3 mb-5 pointer-events-none transition-opacity duration-300 hint-enter"
        style={{
          background: COLORS.rust,
          color: COLORS.cream,
          clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
          boxShadow: "0 10px 20px rgba(94,70,50,0.3)",
          opacity: opening ? 0 : undefined,
        }}
      >
        <span
          className="italic text-lg tracking-wide"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          A Birthday Surprise
        </span>
      </div>

      {/* hint */}
      <p
        className="relative z-10 text-sm sm:text-base pointer-events-none transition-opacity duration-300 hint-enter"
        style={{ color: COLORS.brown, opacity: opening ? 0 : undefined }}
      >
        tap the bow to begin the journey ✨
      </p>
    </div>
  );
}