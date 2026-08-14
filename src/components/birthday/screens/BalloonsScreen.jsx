import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, WISHES, BALLOON_COLORS } from "../constants";
import { useQuestProgress } from "../hooks/useQuestProgress";
import Tag from "../shared/Tag";
import Btn from "../shared/Btn";
import BackButton from "../shared/BackButton";

// -----------------------------
// A single realistic-looking balloon: SVG teardrop body with a
// radial gradient fill + soft highlight streak, a little knot, and a
// curly string — instead of a flat CSS rectangle. `gid` must be
// unique per balloon since SVG gradient ids are global to the page.
// -----------------------------
function BalloonSVG({ color, gid }) {
  return (
    <svg
      viewBox="0 0 60 92"
      className="w-full h-full"
      style={{ display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`balloon-grad-${gid}`} cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="35%" stopColor={color} stopOpacity="0.92" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>

      {/* body */}
      <path
        d="M30 2 C46 2 54 18 54 34 C54 52 42 68 30 74 C18 68 6 52 6 34 C6 18 14 2 30 2 Z"
        fill={`url(#balloon-grad-${gid})`}
      />

      {/* highlight streak */}
      <ellipse
        cx="20"
        cy="23"
        rx="7"
        ry="12"
        fill="#ffffff"
        opacity="0.35"
        transform="rotate(-18 20 23)"
      />

      {/* knot */}
      <path d="M27 74 L33 74 L30 80 Z" fill={color} opacity="0.9" />

      {/* curly string */}
      <path
        d="M30 80 C 33 84, 27 87, 30 91"
        fill="none"
        stroke="rgba(94,70,50,0.4)"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function BalloonsScreen() {
  const navigate = useNavigate();
  const { unlock } = useQuestProgress();
  const [popped, setPopped] = useState(() => Array(WISHES.length).fill(false));
  const [wish, setWish] = useState("");
  const poppedCount = popped.filter(Boolean).length;

  // Randomised per-balloon float parameters, generated once (per mount)
  // so every balloon drifts on its own rhythm instead of sitting at a
  // fixed left-% forever. Now also spreads balloons across the full
  // height of the scene (not just anchored to the bottom edge), so
  // the whole cluster reads as centered instead of huddled at the
  // very bottom.
  const layout = useMemo(
    () =>
      WISHES.map(() => {
        const left = 8 + Math.random() * 76; // % across the scene, width-wise
        const top = 8 + Math.random() * 62; // % down the scene, height-wise
        const driftX = 16 + Math.random() * 24; // sideways sway, px
        const bobY = 8 + Math.random() * 12; // small up/down bob, px
        const rise = 10 + Math.random() * 14; // bigger periodic lift, px
        const duration = 5 + Math.random() * 3.5; // seconds per float cycle
        const tiltDuration = 3 + Math.random() * 2.5;
        const delay = -(Math.random() * duration); // desync start points
        const tiltDelay = -(Math.random() * tiltDuration);
        const size = 0.85 + Math.random() * 0.3; // subtle size variety
        return { left, top, driftX, bobY, rise, duration, tiltDuration, delay, tiltDelay, size };
      }),
    []
  );

  const pop = (i) => {
    if (popped[i]) return;
    const next = [...popped];
    next[i] = true;
    setPopped(next);
    setWish(WISHES[i]);
  };

  const onContinue = () => {
    unlock("puzzle");
    navigate("/quest/puzzle");
  };

  return (
    <div className="relative h-screen max-h-screen flex flex-col items-center overflow-hidden">
      {/* full-bleed backdrop — direct fixed divs in the tree (not a
          portal), same approach that works reliably on the categories
          screen. Different palette on purpose: a soft dusk-sky
          gradient instead of the cream/paper vintage tone, since
          floating balloons read better against an evening sky. */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.35), transparent 45%), " +
            "radial-gradient(circle at 80% 85%, rgba(255,255,255,0.2), transparent 50%), " +
            "linear-gradient(160deg, #f6dfc0 0%, #eec5a0 35%, #d99b86 70%, #b97a72 100%)",
        }}
      />

      {/* soft cloud wisps drifting slowly, for atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="balloon-cloud"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${8 + ((i * 53) % 70)}%`,
              width: `${40 + (i % 4) * 18}px`,
              animationDuration: `${18 + (i % 5) * 4}s`,
              animationDelay: `${-(i * 3)}s`,
            }}
          />
        ))}
      </div>

      <BackButton onClick={() => navigate(-1)} />

      <div
        className="flex items-center gap-3 mt-10 mb-1"
        style={{ color: COLORS.gold, opacity: 0.85, fontSize: "12px" }}
      >
        <span>✦</span>
        <span>❦</span>
        <span>✦</span>
      </div>

      <Tag>pop the wishes</Tag>
      <h2
        className="mt-1 italic text-lg sm:text-xl"
        style={{ fontFamily: "'Playfair Display', serif", color: COLORS.brown }}
      >
        pop each balloon
      </h2>

      <div className="relative w-full max-w-lg h-[34vh] sm:h-[38vh] mx-auto mt-2">
        {WISHES.map((_, i) => {
          const L = layout[i];
          return (
            <button
              key={i}
              type="button"
              aria-label={popped[i] ? "wish revealed" : "tap to pop this balloon"}
              onClick={() => pop(i)}
              disabled={popped[i]}
              className={`absolute ${popped[i] ? "balloon-pop" : "balloon-float"}`}
              style={{
                left: `${L.left}%`,
                top: `${L.top}%`,
                width: `${3.2 * L.size}rem`,
                height: `${4.6 * L.size}rem`,
                background: "none",
                border: "none",
                padding: 0,
                cursor: popped[i] ? "default" : "pointer",
                opacity: popped[i] ? 0 : 1,
                pointerEvents: popped[i] ? "none" : "auto",
                "--driftX": `${L.driftX}px`,
                "--bobY": `${L.bobY}px`,
                "--rise": `${L.rise}px`,
                animationDuration: `${L.duration}s, ${L.tiltDuration}s`,
                animationDelay: `${L.delay}s, ${L.tiltDelay}s`,
                filter: "drop-shadow(0 8px 10px rgba(94,70,50,0.25))",
              }}
            >
              <BalloonSVG color={BALLOON_COLORS[i % BALLOON_COLORS.length]} gid={i} />
            </button>
          );
        })}
      </div>

      <div
        className="mt-2 min-h-[2.6em] text-2xl sm:text-3xl font-semibold px-6 text-center leading-snug"
        style={{
          fontFamily: "'Alex Brush', cursive",
          color: "#e8562f",
          textShadow: "0 1px 12px rgba(232,86,47,0.35)",
        }}
      >
        {wish && `"${wish}"`}
      </div>
      <div className="mt-1 text-xs" style={{ color: COLORS.brownSoft }}>
        {poppedCount} / {WISHES.length} popped
      </div>

      {poppedCount >= WISHES.length && (
        <Btn onClick={onContinue} className="mt-3 mb-4">
          continue
        </Btn>
      )}

      <style>{`
        /* balloon drifts sideways and bobs/lifts up and down in a
           loose, irregular loop — using CSS custom properties set
           per-balloon inline, so every balloon moves differently */
        @keyframes balloonFloat {
          0%   { translate: 0px 0px; }
          25%  { translate: calc(var(--driftX) * 0.55) calc(var(--bobY) * -1); }
          50%  { translate: var(--driftX) calc(var(--rise) * -1); }
          75%  { translate: calc(var(--driftX) * 0.25) calc(var(--bobY) * -0.6); }
          100% { translate: 0px 0px; }
        }

        /* independent gentle tilt, running as its own animation on the
           rotate CSS property so it doesn't fight the translate
           animation above (both can run at once on the same element) */
        @keyframes balloonTilt {
          0%, 100% { rotate: -4deg; }
          50% { rotate: 4deg; }
        }

        .balloon-float {
          animation-name: balloonFloat, balloonTilt;
          animation-timing-function: ease-in-out, ease-in-out;
          animation-iteration-count: infinite, infinite;
          will-change: translate, rotate;
        }

        @keyframes balloonPopOut {
          0% { scale: 1; opacity: 1; }
          40% { scale: 1.18; opacity: 1; }
          100% { scale: 0.2; opacity: 0; }
        }

        .balloon-pop {
          animation: balloonPopOut 0.35s ease-in both;
        }

        @keyframes cloudDrift {
          0% { transform: translateX(-10vw); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateX(110vw); opacity: 0; }
        }

        .balloon-cloud {
          position: absolute;
          height: 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.55);
          filter: blur(2px);
          animation: cloudDrift linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .balloon-float, .balloon-cloud { animation: none !important; }
        }
      `}</style>
    </div>
  );
}