import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants";
import { useQuestProgress } from "../hooks/useQuestProgress";
import Tag from "../shared/Tag";
import Btn from "../shared/Btn";
import BackButton from "../shared/BackButton";

// ---- entrance/float animation helpers -------------------------------

// Decorative elements: fade+slide in once, then hand off to a gentle
// infinite float. Uses CSS custom properties so each element keeps its
// own rotate/flip value through both animation stages (avoids the
// two animations fighting over `transform`).
function floatStyle({ rot = 0, flip = 1, dx = 0, dy = 28, delay = 0, floatDuration = 5 }) {
  return {
    "--rot": `${rot}deg`,
    "--flip": flip,
    "--dx": `${dx}px`,
    "--dy": `${dy}px`,
    animation:
      `enterUp 0.9s cubic-bezier(0.16,1,0.3,1) both ${delay}s, ` +
      `gentleFloat ${floatDuration}s ease-in-out ${delay + 0.9}s infinite`,
  };
}

// Main-content elements: fade+slide in once, no float (keeps text/buttons steady to read).
function enterStyle(delay = 0) {
  return {
    animation: `enterUp 0.7s cubic-bezier(0.16,1,0.3,1) both ${delay}s`,
  };
}

function EntranceStyles() {
  return (
    <style>{`
      @keyframes enterUp {
        from {
          opacity: 0;
          transform: translate(var(--dx, 0px), var(--dy, 24px)) rotate(var(--rot, 0deg)) scaleX(var(--flip, 1)) scale(0.94);
        }
        to {
          opacity: 1;
          transform: translate(0, 0) rotate(var(--rot, 0deg)) scaleX(var(--flip, 1)) scale(1);
        }
      }
      @keyframes gentleFloat {
        0%, 100% { transform: translate(0, 0) rotate(var(--rot, 0deg)) scaleX(var(--flip, 1)); }
        50% { transform: translate(0, -8px) rotate(var(--rot, 0deg)) scaleX(var(--flip, 1)); }
      }
      @keyframes roseSway {
        0%, 100% { transform: rotate(-3deg) scale(1); }
        50% { transform: rotate(3deg) scale(1.03); }
      }
      @keyframes heartBeat {
        0%, 100% { transform: scale(1); }
        14% { transform: scale(1.25); }
        28% { transform: scale(1); }
        42% { transform: scale(1.18); }
        70% { transform: scale(1); }
      }
      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 6px 16px rgba(168,69,58,0.35), 0 0 0 0 rgba(168,69,58,0.35); }
        50% { box-shadow: 0 6px 20px rgba(168,69,58,0.5), 0 0 0 8px rgba(168,69,58,0); }
      }
      @keyframes twinkle {
        0%, 100% { opacity: 0.4; transform: scale(0.85); }
        50% { opacity: 1; transform: scale(1.15); }
      }
      @keyframes popIn {
        0% { opacity: 0; transform: scale(0.7) translateY(6px); }
        60% { opacity: 1; transform: scale(1.06) translateY(0); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes shimmerText {
        0%, 100% { opacity: 0.85; }
        50% { opacity: 1; text-shadow: 0 0 12px rgba(168,69,58,0.25); }
      }
      @keyframes heartFall {
        0% {
          transform: translateY(-8vh) translateX(0) rotate(0deg);
          opacity: 0;
        }
        8% { opacity: var(--maxOpacity, 0.55); }
        85% { opacity: var(--maxOpacity, 0.55); }
        100% {
          transform: translateY(108vh) translateX(var(--drift, 20px)) rotate(var(--spin, 180deg));
          opacity: 0;
        }
      }
      .heartbeat {
        display: inline-block;
        animation: heartBeat 2.2s ease-in-out infinite;
      }
      .glow-pulse {
        animation: glowPulse 2.4s ease-in-out infinite;
      }
      .dot-twinkle {
        display: inline-block;
        animation: twinkle 1.8s ease-in-out infinite;
      }
      .title-shimmer {
        animation: shimmerText 3.5s ease-in-out infinite;
      }
      .heart-snow-flake {
        position: absolute;
        top: -10%;
        will-change: transform, opacity;
        animation-name: heartFall;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
      }
    `}</style>
  );
}

// gentle falling hearts across the whole viewport — sits behind everything
function HeartSnow({ count = 22 }) {
  const flakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = Math.random() * 100; // vw %
      const size = 10 + Math.random() * 18; // px
      const duration = 9 + Math.random() * 10; // s
      const delay = -(Math.random() * duration); // negative so they're already mid-fall on load
      const drift = (Math.random() - 0.5) * 120; // px sideways drift
      const spin = (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 180);
      const maxOpacity = 0.25 + Math.random() * 0.4;
      const color = Math.random() > 0.5 ? COLORS.rust : COLORS.gold;
      return { id: i, left, size, duration, delay, drift, spin, maxOpacity, color };
    });
  }, [count]);

  return (
    <div className="fixed inset-0 -z-[5] pointer-events-none overflow-hidden" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="heart-snow-flake"
          style={{
            left: `${f.left}%`,
            fontSize: `${f.size}px`,
            color: f.color,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            "--drift": `${f.drift}px`,
            "--spin": `${f.spin}deg`,
            "--maxOpacity": f.maxOpacity,
          }}
        >
          &hearts;
        </span>
      ))}
    </div>
  );
}

// a row of dots with the center heart beating and the dots gently twinkling
function DotDivider({ delay = 0 }) {
  const dots = ["•", "•", "•", "•"];
  return (
    <div className="text-xs tracking-[3px]" style={{ color: COLORS.gold, ...enterStyle(delay) }}>
      {dots.map((d, i) => (
        <span key={`l${i}`} className="dot-twinkle" style={{ animationDelay: `${i * 0.15}s` }}>
          {d}{" "}
        </span>
      ))}
      <span className="heartbeat" style={{ color: COLORS.rust }}>&hearts;</span>
      {" "}
      {dots.map((d, i) => (
        <span key={`r${i}`} className="dot-twinkle" style={{ animationDelay: `${0.6 + i * 0.15}s` }}>
          {" "}{d}
        </span>
      ))}
    </div>
  );
}

// ---- decorative pieces ------------------------------------------------

// simple lined/plain note card used for the left & right side notes.
// Desktop-only — on mobile there isn't room for these without crowding the text.
function SideNote({ text, posClass, rotate = -4, torn = false, clip = "tape", delay = 0, dx = 0, dy = 28 }) {
  return (
    <div
      className={`fixed z-[2] hidden lg:block pointer-events-none select-none w-32 ${posClass}`}
      style={floatStyle({ rot: rotate, dx, dy, delay })}
    >
      <div
        className="relative px-4 py-4"
        style={{
          background: torn
            ? `repeating-linear-gradient(${COLORS.cream}, ${COLORS.cream} 15px, rgba(94,70,50,0.18) 16px)`
            : COLORS.cream,
          boxShadow: "0 10px 20px rgba(60,40,20,0.3)",
          border: "1px solid rgba(94,70,50,0.2)",
        }}
      >
        {clip === "tape" ? (
          <div
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rotate-[-3deg]"
            style={{
              background: "linear-gradient(135deg, rgba(203,161,53,0.55), rgba(203,161,53,0.35))",
              boxShadow: "0 2px 4px rgba(94,70,50,0.2)",
            }}
          />
        ) : (
          <svg viewBox="0 0 20 40" className="absolute -top-4 right-2 w-4 h-9 opacity-80">
            <path
              d="M10 4 C 16 4, 16 14, 10 14 L10 30 C 10 34, 15 34, 15 30 L15 12"
              fill="none"
              stroke={COLORS.gold}
              strokeWidth="2"
            />
          </svg>
        )}
        <div
          className="text-center italic leading-snug"
          style={{ fontFamily: "'Playfair Display', serif", color: COLORS.rust, fontSize: "0.85rem" }}
        >
          {text}
        </div>
        <div className="text-center mt-1 heartbeat" style={{ color: COLORS.gold }}>
          &hearts;
        </div>
      </div>
    </div>
  );
}

// real dried rose photo — /images/dried-flowers.png (the two-rose bouquet with baby's-breath)
// `mobile` lets one instance stay visible at every size (small + corner-tucked);
// the rest stay desktop-only so the phone view isn't cluttered.
function DriedFlowers({ posClass, flip = false, delay = 0, dx = 0, dy = 24, mobile = false }) {
  return (
    <img
      src="/images/dried-flowers.png"
      alt="A bouquet of dried roses"
      className={`fixed z-[1] pointer-events-none select-none object-contain
        ${mobile ? "block w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28" : "hidden lg:block lg:w-28 lg:h-28"}
        ${posClass}`}
      style={floatStyle({ rot: 0, flip: flip ? -1 : 1, dx, dy, delay })}
    />
  );
}

// centered rose — sits inline in the main content column (not fixed),
// visible and centered at every breakpoint, with its own gentle sway.
function CenterRose({ delay = 0.15 }) {
  return (
    <div
      className="mx-auto"
      style={{
        animation: `enterUp 0.9s cubic-bezier(0.16,1,0.3,1) both ${delay}s, roseSway 4.5s ease-in-out ${delay + 0.9}s infinite`,
        transformOrigin: "50% 85%",
      }}
    >
      <img
        src="/images/dried-roses.png"
        alt="A bouquet of dried roses"
        className="w-20 sm:w-28 lg:w-36 object-contain mx-auto -mt-2 -mb-2 drop-shadow-[0_10px_16px_rgba(60,40,20,0.25)]"
      />
    </div>
  );
}

// tilted polaroid — used for both the childhood photo and the mirror selfie.
// `mobile` keeps it visible (small) at every size; otherwise desktop-only.
function Polaroid({ src, alt, posClass, rotate = -6, delay = 0, dx = 0, dy = 32, mobile = false }) {
  return (
    <div
      className={`fixed z-[2] pointer-events-none select-none
        ${mobile ? "block w-20 sm:w-32 lg:w-48" : "hidden lg:block lg:w-48"}
        ${posClass}`}
      style={floatStyle({ rot: rotate, dx, dy, delay, floatDuration: 6 })}
    >
      <div
        className="w-full p-2 pb-6 sm:p-2.5 sm:pb-8"
        style={{
          background: "#FFFDF8",
          borderRadius: "3px",
          boxShadow: "0 16px 28px rgba(60,40,20,0.32)",
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full object-cover"
          style={{ aspectRatio: "1 / 1", borderRadius: "2px", filter: "sepia(0.08) saturate(0.95)" }}
        />
        {/* twine bow */}
        <svg viewBox="0 0 60 30" className="absolute -bottom-3 left-4 w-12 h-6 hidden sm:block">
          <path
            d="M10 15 C 10 8, 22 8, 22 15 C 22 8, 34 8, 34 15 C 34 8, 46 8, 46 15"
            fill="none"
            stroke="#8f7355"
            strokeWidth="1.3"
          />
          <circle cx="28" cy="15" r="2.5" fill="#8f7355" />
        </svg>
      </div>
    </div>
  );
}

export default function GameScreen() {
  const navigate = useNavigate();
  const { unlock } = useQuestProgress();
  const [won, setWon] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const wrapRef = useRef(null);

  const goBack = () => navigate(-1);

  const dodge = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const maxX = Math.max(wrap.clientWidth - 80, 40);
    const maxY = Math.max(wrap.clientHeight - 60, 40);
    const x = (Math.random() - 0.5) * maxX * 1.6;
    const y = Math.random() * maxY * 0.9;
    setPos({ x, y });
  };

  const onContinue = () => {
    unlock("cake");
    navigate("/quest/cake");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <EntranceStyles />

      {/* warm antique-cream backdrop */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 18% 20%, rgba(203,161,53,0.16), transparent 55%)," +
            "radial-gradient(circle at 85% 15%, rgba(168,69,58,0.12), transparent 55%)," +
            "radial-gradient(circle at 20% 85%, rgba(168,69,58,0.10), transparent 55%)," +
            "radial-gradient(circle at 80% 85%, rgba(201,138,138,0.12), transparent 55%)," +
            "#F7EAD5",
        }}
      />
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(94,70,50,0.05) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          opacity: 0.5,
        }}
      />

      {/* falling heart snow, behind decorations/content but above the base gradient */}
      <HeartSnow count={22} />

      {/* top-left note + flowers (desktop only) */}
      <SideNote
        text={"made with\nall my love"}
        posClass="top-[9%] left-[5%]"
        rotate={-6}
        torn
        delay={0.2}
        dx={-24}
        dy={-16}
      />
      <DriedFlowers posClass="top-[16%] left-[10%]" delay={0.35} dx={-18} dy={-10} />

      {/* top-right note (desktop only) — the rose gets its mobile-visible corner spot here */}
      <SideNote
        text={"just for\nyou"}
        posClass="top-[8%] right-[5%]"
        rotate={5}
        clip="paperclip"
        delay={0.25}
        dx={24}
        dy={-16}
      />
      <DriedFlowers
        posClass="top-2 right-2 sm:top-3 sm:right-3 lg:top-[12%] lg:right-[9%]"
        delay={0.15}
        dx={16}
        dy={-10}
        mobile
      />

      {/* left-side polaroid (childhood photo, desktop only) + flowers */}
      <Polaroid
        src="/images/khalifa-childhood.jpeg"
        alt="A childhood photo of Khalifa"
        posClass="bottom-[8%] left-[4%]"
        rotate={-6}
        delay={0.4}
        dx={-28}
        dy={22}
      />
      <DriedFlowers posClass="bottom-[3%] left-[1%]" flip delay={0.55} dx={-18} dy={16} />

      {/* right-side note + flowers (desktop only) */}
      <SideNote
        text={"you make\nmy world better"}
        posClass="bottom-[16%] right-[5%]"
        rotate={-4}
        torn
        delay={0.3}
        dx={24}
        dy={16}
      />
      <DriedFlowers posClass="bottom-[4%] right-[4%]" delay={0.45} dx={18} dy={16} />

      {/*
        central content column — horizontally centered, anchored to the top
        (justify-start, not justify-center). Using justify-center here meant the
        whole column was re-centered as a group any time its total height changed
        (e.g. when the "won" block appears after clicking Yes), which shoved the
        rose/heading up and out of view. justify-start keeps the top of the column
        pinned, so new content below the buttons just extends the page downward
        instead of yanking everything above it upward.
      */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start max-w-md mx-auto px-5 sm:px-6 pt-20 sm:pt-24 pb-10 text-center">
        {/* back button — fixed, same position on every quest page */}
        <BackButton onClick={goBack} />

        <DotDivider delay={0.1} />

        <CenterRose delay={0.15} />

        <div style={enterStyle(0.2)}>
          <Tag>just one question</Tag>
        </div>

        <h2 className="mt-3 leading-tight" style={enterStyle(0.3)}>
          <span
            className="block text-lg sm:text-xl lg:text-2xl"
            style={{ fontFamily: "'Playfair Display', serif", color: "#5c3d1f" }}
          >
            Hey Paps, ready for your
          </span>
          <span
            className="block text-2xl sm:text-3xl lg:text-4xl mt-1 title-shimmer"
            style={{ fontFamily: "'Alex Brush', cursive", color: COLORS.rust }}
          >
            birthday surprise?
          </span>
        </h2>

        {/* torn-paper quote card */}
        <div className="relative w-full max-w-xs sm:w-64 mx-auto mt-6" style={enterStyle(0.5)}>
          <div
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 rotate-[-2deg] z-[1]"
            style={{
              background: "linear-gradient(135deg, rgba(203,161,53,0.55), rgba(203,161,53,0.35))",
              boxShadow: "0 2px 4px rgba(94,70,50,0.2)",
            }}
          />
          <div
            className="px-5 py-5"
            style={{
              background: "#F0E2C8",
              boxShadow: "0 10px 20px rgba(60,40,20,0.25)",
              clipPath: "polygon(0% 3%, 4% 0%, 96% 0%, 100% 3%, 100% 97%, 96% 100%, 4% 100%, 0% 97%)",
            }}
          >
            <div className="text-center heartbeat" style={{ color: COLORS.rust }}>&hearts;</div>
            <p
              className="text-center italic text-sm mt-2 leading-relaxed"
              style={{ fontFamily: "'Playfair Display', serif", color: "#5c3d1f" }}
            >
              something special is waiting for you&hellip; are you ready to begin?
            </p>
          </div>
        </div>

        <div
          ref={wrapRef}
          className="relative h-24 mt-6 flex gap-4 justify-center items-start"
          style={enterStyle(0.7)}
        >
          <Btn onClick={() => setWon(true)} className="rounded-full glow-pulse">
            Yes
          </Btn>
          <Btn
            ghost
            onMouseOver={dodge}
            onClick={dodge}
            onTouchStart={dodge}
            className="transition-transform duration-150"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
          >
            No
          </Btn>
        </div>

        {won && (
          <div className="mt-2" style={{ animation: "popIn 0.55s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <p className="text-sm mt-1.5" style={{ color: COLORS.brownSoft }}>
              knew you'd say yes <span className="heartbeat">&#128522;</span>
            </p>
            <Btn onClick={onContinue} className="mt-3.5">
              continue &rarr;
            </Btn>
          </div>
        )}

        <div className="mt-6">
          <DotDivider delay={0.9} />
        </div>
        {/* <div
          className="mt-2 text-xs sm:text-sm tracking-[2px] uppercase"
          style={{ color: COLORS.gold, opacity: 0.85, ...enterStyle(1.0) }}
        >
          your little journey starts here
        </div> */}
      </div>
    </div>
  );
}