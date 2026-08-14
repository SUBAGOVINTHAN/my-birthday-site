import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, MEMORY_SLIDES } from "../constants";
import { useQuestProgress } from "../hooks/useQuestProgress";
import { useCountdown } from "../hooks/useCountdown";
import Tag from "../shared/Tag";
import Btn from "../shared/Btn";
import BackButton from "../shared/BackButton";


// -----------------------------
// Floating vintage petals/hearts background
// -----------------------------
function VintageSnow({ count = 20 }) {
  const flakes = useMemo(() => {
    const glyphs = ["♡", "✦", "❦"];
    return Array.from({ length: count }, (_, i) => {
      const left = Math.random() * 100;
      const size = 10 + Math.random() * 16;
      const duration = 10 + Math.random() * 10;
      const delay = -(Math.random() * duration);
      const drift = (Math.random() - 0.5) * 110;
      const spin = (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 160);
      const maxOpacity = 0.2 + Math.random() * 0.35;
      const color = Math.random() > 0.5 ? COLORS.rust : COLORS.gold;
      const glyph = glyphs[i % glyphs.length];
      return { id: i, left, size, duration, delay, drift, spin, maxOpacity, color, glyph };
    });
  }, [count]);

  return (
    <div className="fixed inset-0 -z-[5] pointer-events-none overflow-hidden" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="vintage-snow-flake"
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
          {f.glyph}
        </span>
      ))}
    </div>
  );
}


// -----------------------------
// Confetti burst — fired once when the candle is blown out
// -----------------------------
function ConfettiBurst({ active }) {
  const pieces = useMemo(() => {
    if (!active) return [];
    const shapes = ["♡", "✦", "❦", "•"];
    return Array.from({ length: 26 }, (_, i) => {
      const angle = (Math.random() - 0.5) * 220 - 90; // mostly upward
      const distance = 90 + Math.random() * 160;
      const dx = Math.cos((angle * Math.PI) / 180) * distance;
      const dy = Math.sin((angle * Math.PI) / 180) * distance - 40;
      const size = 10 + Math.random() * 12;
      const delay = Math.random() * 0.15;
      const duration = 0.9 + Math.random() * 0.6;
      const spin = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360);
      const color = Math.random() > 0.5 ? COLORS.rust : COLORS.gold;
      const glyph = shapes[i % shapes.length];
      return { id: i, dx, dy, size, delay, duration, spin, color, glyph };
    });
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute left-1/2 top-8 w-0 h-0 pointer-events-none z-[6]" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute confetti-piece"
          style={{
            fontSize: `${p.size}px`,
            color: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--cx": `${p.dx}px`,
            "--cy": `${p.dy}px`,
            "--cspin": `${p.spin}deg`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}


// -----------------------------
// Vintage countdown box — smaller on mobile
// -----------------------------
function CountdownBox({ label, value, rotate }) {
  return (
    <div
      className="vintage-countdown-card"
      style={{
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div
        className="relative px-2.5 py-2 sm:px-4 sm:py-3 min-w-[48px] sm:min-w-[72px] text-center"
        style={{
          background: `
            linear-gradient(
              rgba(255,255,255,0.15),
              rgba(255,255,255,0)
            ),
            ${COLORS.cream}
          `,
          border: "1px solid rgba(94,70,50,0.22)",
          boxShadow: "2px 4px 10px rgba(94,70,50,0.12)",
        }}
      >
        {/* tiny paper corner */}
        <div
          className="absolute top-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3"
          style={{
            background: COLORS.creamDeep,
            clipPath: "polygon(100% 0, 0 0, 100% 100%)",
          }}
        />

        <b
          className="block text-base sm:text-2xl"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: COLORS.rust,
          }}
        >
          {String(value).padStart(2, "0")}
        </b>

        <small
          className="text-[0.45rem] sm:text-[0.52rem] tracking-[1.5px] sm:tracking-[2px] uppercase"
          style={{
            color: COLORS.brownSoft,
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {label}
        </small>
      </div>
    </div>
  );
}


// -----------------------------
// Vintage cake illustration — flame is interactive (click/tap to blow it out)
// Layers now animate in one-by-one, top to bottom, on mount.
// A thin "cut seam" appears down the middle once the cake has been cut.
// -----------------------------
function VintageCake({ blown, onBlow, cutting, cut }) {
  return (
    <div className="relative w-56 h-48 sm:w-64 sm:h-52 mx-auto mt-3 cake-vintage">

      {/* little botanical branch - left */}
      <svg
        viewBox="0 0 80 120"
        className="absolute left-1 top-16 w-16 h-24 opacity-80 cake-layer-in"
        style={{ animationDelay: "0.55s" }}
      >
        <path
          d="M65 110 C 55 82, 38 58, 20 20"
          fill="none"
          stroke={COLORS.sage}
          strokeWidth="1.5"
        />

        <ellipse cx="24" cy="28" rx="8" ry="3" fill={COLORS.sage} transform="rotate(55 24 28)" />
        <ellipse cx="34" cy="47" rx="8" ry="3" fill={COLORS.sage} transform="rotate(35 34 47)" />
        <ellipse cx="45" cy="66" rx="8" ry="3" fill={COLORS.sage} transform="rotate(55 45 66)" />
        <ellipse cx="54" cy="86" rx="7" ry="3" fill={COLORS.sage} transform="rotate(30 54 86)" />
      </svg>


      {/* little botanical branch - right */}
      <svg
        viewBox="0 0 80 120"
        className="absolute right-1 top-14 w-16 h-24 opacity-80 cake-layer-in"
        style={{ animationDelay: "0.6s" }}
      >
        <path
          d="M15 110 C 25 80, 42 55, 60 20"
          fill="none"
          stroke={COLORS.sage}
          strokeWidth="1.5"
        />

        <ellipse cx="57" cy="27" rx="8" ry="3" fill={COLORS.sage} transform="rotate(-55 57 27)" />
        <ellipse cx="46" cy="47" rx="8" ry="3" fill={COLORS.sage} transform="rotate(-35 46 47)" />
        <ellipse cx="36" cy="67" rx="8" ry="3" fill={COLORS.sage} transform="rotate(-55 36 67)" />
      </svg>


      {/* candle glow — first thing to drop in — fades out once blown */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-1 w-14 h-14 rounded-full transition-opacity duration-500 cake-layer-in"
        style={{
          background: "radial-gradient(circle, rgba(203,161,53,0.35), transparent 70%)",
          filter: "blur(4px)",
          opacity: blown ? 0 : 1,
          animationDelay: "0s",
        }}
      />

      {/* smoke wisp — appears only right after blowing */}
      {blown && !cut && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-3 w-2 h-10 smoke-wisp z-[5]"
          style={{ background: "linear-gradient(180deg, rgba(150,140,130,0.5), transparent)" }}
        />
      )}

      {/* candle flame — click/tap to blow it out — drops in 2nd */}
      <button
        type="button"
        onClick={onBlow}
        aria-label={blown ? "candle blown out" : "tap to blow out the candle"}
        className="absolute left-1/2 -translate-x-1/2 top-5 z-[6] cake-layer-in"
        style={{
          width: "26px",
          height: "26px",
          transform: "translateX(-50%)",
          cursor: blown ? "default" : "pointer",
          background: "transparent",
          border: "none",
          padding: 0,
          animationDelay: "0.08s",
        }}
        disabled={blown}
      >
        <span
          className="block mx-auto transition-all duration-300"
          style={{
            width: "11px",
            height: blown ? "0px" : "17px",
            background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.rust})`,
            borderRadius: "50%",
            transform: `rotate(3deg) scaleY(${blown ? 0 : 1})`,
            transformOrigin: "bottom center",
            boxShadow: blown ? "none" : "0 0 12px rgba(203,161,53,0.65)",
            animation: blown ? "none" : "vintageFlame 1.4s ease-in-out infinite",
            opacity: blown ? 0 : 1,
          }}
        />
      </button>


      {/* candle — drops in 3rd */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-9 z-[4] cake-layer-in"
        style={{
          width: "9px",
          height: "42px",
          background: `
            repeating-linear-gradient(
              135deg,
              ${COLORS.sage} 0px,
              ${COLORS.sage} 4px,
              #d8c7a8 4px,
              #d8c7a8 7px
            )
          `,
          borderRadius: "3px 3px 1px 1px",
          boxShadow: "1px 2px 5px rgba(94,70,50,0.2)",
          animationDelay: "0.16s",
        }}
      />


      {/* candle holder — drops in 4th */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[47px] z-[4] cake-layer-in"
        style={{
          width: "18px",
          height: "6px",
          borderRadius: "50%",
          background: COLORS.gold,
          animationDelay: "0.24s",
        }}
      />


      {/* top cake layer — drops in 5th */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[66px] z-[3] cake-layer-in"
        style={{
          width: "135px",
          height: "48px",
          background: `linear-gradient(180deg, #efd8bd 0%, #e2bd98 100%)`,
          borderRadius: "8px 8px 3px 3px",
          border: "1px solid rgba(94,70,50,0.18)",
          boxShadow: "0 8px 12px rgba(94,70,50,0.15)",
          animationDelay: "0.34s",
        }}
      >
        {/* cream dripping */}
        <div
          className="absolute -bottom-2 left-0 w-full h-7"
          style={{
            background: COLORS.cream,
            clipPath:
              "polygon(0 0, 100% 0, 100% 35%, 88% 35%, 84% 85%, 76% 85%, 73% 35%, 60% 35%, 56% 70%, 47% 70%, 44% 35%, 30% 35%, 26% 90%, 18% 90%, 15% 35%, 0 35%)",
          }}
        />

        <span className="absolute left-5 top-3 text-xs" style={{ color: COLORS.rust }}>✿</span>
        <span className="absolute right-5 top-3 text-xs" style={{ color: COLORS.rust }}>✿</span>

        {/* cut wedge notch on the top layer, revealed once cut */}
        {cut && (
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 cut-wedge-fade"
            style={{
              borderLeft: "13px solid transparent",
              borderRight: "13px solid transparent",
              borderBottom: `48px solid ${COLORS.creamDeep}`,
              opacity: 0.9,
            }}
          />
        )}
      </div>


      {/* bottom cake layer — drops in 6th */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[105px] z-[2] cake-layer-in"
        style={{
          width: "175px",
          height: "52px",
          background: `linear-gradient(180deg, ${COLORS.rustSoft}, ${COLORS.rust})`,
          borderRadius: "7px 7px 4px 4px",
          border: "1px solid rgba(94,70,50,0.25)",
          boxShadow: "0 12px 18px rgba(94,70,50,0.22)",
          animationDelay: "0.44s",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-4"
          style={{
            background: COLORS.cream,
            clipPath:
              "polygon(0 0,100% 0,100% 55%,90% 55%,86% 100%,77% 55%,63% 55%,59% 100%,49% 55%,36% 55%,32% 100%,21% 55%,10% 55%,6% 100%,0 55%)",
          }}
        />

        <div className="absolute left-5 top-25" style={{ color: COLORS.gold }}>•</div>
        <div className="absolute left-1/2 -translate-x-1/2 top-25" style={{ color: COLORS.gold }}>•</div>
        <div className="absolute right-5 top-25" style={{ color: COLORS.gold }}>•</div>

        {/* cut wedge notch on the bottom layer */}
        {cut && (
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 cut-wedge-fade"
            style={{
              borderLeft: "17px solid transparent",
              borderRight: "17px solid transparent",
              borderBottom: `52px solid ${COLORS.rust}`,
              filter: "brightness(0.85)",
              opacity: 0.9,
            }}
          />
        )}
      </div>


      {/* cake plate — drops in last */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[16px] cake-layer-in"
        style={{
          width: "210px",
          height: "15px",
          borderRadius: "50%",
          background: "rgba(94,70,50,0.13)",
          boxShadow: "0 2px 5px rgba(94,70,50,0.12)",
          animationDelay: "0.54s",
        }}
      />

      <span className="absolute left-16 top-10 text-sm cake-layer-in" style={{ color: COLORS.rustSoft, animationDelay: "0.6s" }}>♡</span>
      <span className="absolute right-16 top-12 text-xs cake-layer-in" style={{ color: COLORS.gold, animationDelay: "0.64s" }}>✦</span>

      {/* knife — sweeps down through the cake while cutting */}
      {cutting && (
        <svg
          viewBox="0 0 40 130"
          className="absolute left-1/2 top-0 w-7 h-32 z-[7] knife-cut"
          style={{ transform: "translateX(-50%)" }}
        >
          <rect x="16" y="0" width="8" height="55" rx="3" fill={COLORS.brownSoft} />
          <path d="M8 52 L32 52 L26 118 L14 118 Z" fill="#e9e9e9" stroke="rgba(94,70,50,0.3)" strokeWidth="1" />
        </svg>
      )}
    </div>
  );
}


// -----------------------------
// Plated slice — appears once the cake has been cut
// -----------------------------
function PlatedSlice({ visible }) {
  return (
    <div
      className={`relative w-40 h-32 mx-auto mt-4 ${visible ? "slice-in" : "opacity-0"}`}
      aria-hidden={!visible}
    >
      {/* plate */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0"
        style={{
          width: "150px",
          height: "56px",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at 50% 35%, #ffffff 0%, ${COLORS.cream} 70%)`,
          border: "1px solid rgba(94,70,50,0.18)",
          boxShadow: "0 8px 16px rgba(94,70,50,0.2)",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[6px]"
        style={{
          width: "118px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid rgba(203,161,53,0.35)",
        }}
      />

      {/* slice, side profile */}
      <svg viewBox="0 0 90 70" className="absolute left-1/2 -translate-x-1/2 bottom-[14px] w-24 h-20">
        {/* bottom layer */}
        <path d="M8 62 L45 8 L82 62 Z" fill={COLORS.rustSoft} stroke="rgba(94,70,50,0.25)" strokeWidth="1" />
        {/* cream between layers */}
        <path d="M17 48 L45 8 L73 48 L66 48 L45 20 L24 48 Z" fill={COLORS.cream} />
        {/* top layer */}
        <path d="M22 40 L45 8 L68 40 L62 40 L45 18 L28 40 Z" fill="#efd8bd" />
        {/* little cherry on top */}
        <circle cx="45" cy="10" r="4" fill={COLORS.rust} />
      </svg>

      {/* fork */}
      <div
        className="absolute -right-2 bottom-3 rotate-[18deg]"
        style={{ color: COLORS.brownSoft, fontSize: "1.1rem", opacity: 0.75 }}
      >
        🍴
      </div>
    </div>
  );
}


// -----------------------------
// Vintage memory card — smaller on mobile so memories fit without scroll
// -----------------------------
function MemoryCard({ image, caption }) {
  return (
    <div className="relative w-52 sm:w-64 mx-auto" style={{ transform: "rotate(-2deg)" }}>
      <div
        className="absolute inset-0"
        style={{
          background: "#d2b98f",
          transform: "rotate(3deg)",
          boxShadow: "0 15px 30px rgba(94,70,50,0.2)",
        }}
      />

      <div
        className="relative p-2.5 sm:p-3 pb-3 sm:pb-4 w-full"
        style={{
          background: "#fdf9f2",
          border: "1px solid rgba(94,70,50,0.18)",
          boxShadow: "0 10px 20px rgba(94,70,50,0.18)",
        }}
      >
        {/* photo frame — aspect-[4/5] fits a portrait phone photo without
            cropping off heads/feet the way a short, wide box would */}
        <div
          className="w-full aspect-[4/5] flex flex-col items-center justify-center text-center overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 50% 40%, rgba(203,161,53,0.16), transparent 55%),
              ${COLORS.creamDeep}
            `,
            border: "1px solid rgba(94,70,50,0.12)",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={caption || "a memory"}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 15%", filter: "sepia(0.12) saturate(1.05)" }}
            />
          ) : (
            <>
              <span className="text-3xl opacity-70">📸</span>
              <span
                className="mt-3 px-4 text-xs sm:text-sm italic leading-relaxed"
                style={{ fontFamily: "'Playfair Display', serif", color: COLORS.brownSoft }}
              >
                {caption}
              </span>
            </>
          )}
        </div>

        {image && caption && (
          <div
            className="mt-1.5 sm:mt-2 px-2 text-center italic text-[0.7rem] sm:text-xs leading-snug"
            style={{ fontFamily: "'Playfair Display', serif", color: COLORS.brownSoft }}
          >
            {caption}
          </div>
        )}

        <div
          className="mt-1.5 sm:mt-2 text-center"
          style={{ fontFamily: "'Alex Brush', cursive", color: COLORS.rust, fontSize: "1rem" }}
        >
          a memory to keep ♡
        </div>
      </div>
    </div>
  );
}


// -----------------------------
// "Tap the flame" hint — a parachute now falls from the very top of the
// browser window and lands exactly on this message, wherever it sits on
// the page. We measure the message's real screen position and drive the
// fall with that, so it works regardless of scroll position or layout.
// The canopy also sways independently (parachute-sway) for a floaty,
// gliding feel instead of a rigid straight drop.
// -----------------------------
function ParachuteHint({ text }) {
  const msgRef = useRef(null);
  const [land, setLand] = useState(null); // { x, y } in viewport pixels

  useLayoutEffect(() => {
    const measure = () => {
      if (!msgRef.current) return;
      const rect = msgRef.current.getBoundingClientRect();
      setLand({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center">
      <span
        ref={msgRef}
        className="message-pop italic text-xs sm:text-sm px-3 py-1 whitespace-nowrap"
        style={{
          color: COLORS.brownSoft,
          background: COLORS.cream,
          border: "1px solid rgba(94,70,50,0.18)",
          borderRadius: "3px",
          boxShadow: "0 4px 10px rgba(94,70,50,0.15)",
        }}
      >
        {text}
      </span>

      {land && (
        <>
          {/* falls in from the top of the actual browser window,
              lands precisely on the message above, then pops away */}
          <div
            className="fixed z-[50] pointer-events-none parachute-falling flex flex-col items-center"
            style={{ left: land.x, top: 0, "--landY": `${land.y}px` }}
          >
            {/* canopy + strings + gift sway together, independent of the
                fall path, so the parachute glides instead of dropping rigidly */}
            <div className="parachute-sway">
              <svg viewBox="0 0 70 34" className="w-14 h-7 sm:w-16 sm:h-8" style={{ display: "block" }}>
                <path
                  d="M2 32 C 2 12, 20 2, 35 2 C 50 2, 68 12, 68 32"
                  fill={COLORS.rust}
                  opacity="0.85"
                />
                <path d="M35 2 L35 32" stroke={COLORS.cream} strokeWidth="1" opacity="0.5" />
                <path d="M18 5 C 14 14, 12 24, 13 32" stroke={COLORS.cream} strokeWidth="1" opacity="0.5" fill="none" />
                <path d="M52 5 C 56 14, 58 24, 57 32" stroke={COLORS.cream} strokeWidth="1" opacity="0.5" fill="none" />
                <path
                  d="M2 32 Q 9 37 16 32 Q 23 37 30 32 Q 35 36 40 32 Q 47 37 54 32 Q 61 37 68 32"
                  fill="none"
                  stroke={COLORS.rust}
                  strokeWidth="1.4"
                  opacity="0.9"
                />
              </svg>

              <svg viewBox="0 0 70 14" className="w-14 h-3.5 sm:w-16 sm:h-4 -mt-px" style={{ display: "block" }}>
                <line x1="10" y1="0" x2="33" y2="14" stroke={COLORS.brownSoft} strokeWidth="1" opacity="0.55" />
                <line x1="60" y1="0" x2="37" y2="14" stroke={COLORS.brownSoft} strokeWidth="1" opacity="0.55" />
                <line x1="35" y1="0" x2="35" y2="14" stroke={COLORS.brownSoft} strokeWidth="1" opacity="0.55" />
              </svg>

              <div
                className="-mt-0.5"
                style={{
                  width: "12px",
                  height: "12px",
                  background: COLORS.gold,
                  borderRadius: "2px",
                  boxShadow: "0 2px 5px rgba(94,70,50,0.25)",
                  position: "relative",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent 45%, ${COLORS.rust} 45%, ${COLORS.rust} 55%, transparent 55%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* boom burst — punches outward right at the measured landing point */}
          <div
            className="fixed z-[49] pointer-events-none boom-anchor"
            style={{ left: land.x, top: land.y }}
          >
            <span className="boom-ring" style={{ borderColor: COLORS.gold }} />
            <span className="boom-ring boom-ring-2" style={{ borderColor: COLORS.rust }} />
          </div>
        </>
      )}
    </div>
  );
}


// -----------------------------
// Desktop-only side note (matches GameScreen / MessageScreen pattern)
// -----------------------------
function SideNote({ text, posClass, rotate = -4 }) {
  return (
    <div
      className={`fixed z-[2] hidden lg:block pointer-events-none select-none w-32 side-note-float ${posClass}`}
      style={{ "--rot": `${rotate}deg` }}
    >
      <div
        className="relative px-4 py-4"
        style={{
          background: COLORS.cream,
          boxShadow: "0 10px 20px rgba(60,40,20,0.3)",
          border: "1px solid rgba(94,70,50,0.2)",
        }}
      >
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rotate-[-3deg]"
          style={{
            background: "linear-gradient(135deg, rgba(203,161,53,0.55), rgba(203,161,53,0.35))",
            boxShadow: "0 2px 4px rgba(94,70,50,0.2)",
          }}
        />
        <div
          className="text-center italic leading-snug"
          style={{ fontFamily: "'Playfair Display', serif", color: COLORS.rust, fontSize: "0.85rem" }}
        >
          {text}
        </div>
        <div className="text-center mt-1" style={{ color: COLORS.gold }}>&hearts;</div>
      </div>
    </div>
  );
}

function SideFlowers({ posClass, flip = false }) {
  return (
    <img
      src="/images/dried-flowers.png"
      alt="A bouquet of dried roses"
      className={`fixed z-[1] hidden lg:block lg:w-28 lg:h-28 pointer-events-none select-none object-contain side-note-float ${posClass}`}
      style={{ "--rot": "0deg", transform: flip ? "scaleX(-1)" : "none" }}
    />
  );
}


export default function CakeScreen() {
  const navigate = useNavigate();
  const { unlock } = useQuestProgress();
  const cd = useCountdown();

  const [showMemories, setShowMemories] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [blown, setBlown] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // cake-cutting / plating state
  const [cutting, setCutting] = useState(false); // knife mid-swipe
  const [cut, setCut] = useState(false); // cut finished, wedge visible on cake
  const [plated, setPlated] = useState(false); // slice-on-plate revealed

  const goBack = () => navigate(-1);

  // keep top content visible on mobile
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (showMemories) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [showMemories]);

  useEffect(() => {
    if (!showMemories) return;
    const id = setInterval(() => {
      setSlideIdx((i) => (i + 1) % MEMORY_SLIDES.length);
    }, 2600);
    return () => clearInterval(id);
  }, [showMemories]);

  const onBlow = () => {
    if (blown) return;
    setBlown(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1400);
  };

  const onCut = () => {
    if (cutting || cut) return;
    setCutting(true);
    // knife finishes its swipe, then the wedge appears on the cake
    setTimeout(() => {
      setCutting(false);
      setCut(true);
    }, 750);
    // shortly after, the plated slice fades in
    setTimeout(() => {
      setPlated(true);
    }, 950);
  };

  const onContinue = () => {
    unlock("categories");
    navigate("/quest/categories");
  };


  return (
    <div className="relative min-h-[75vh] flex flex-col items-center overflow-x-hidden pt-10 sm:pt-4">

      {/* vintage background decoration */}
      <div
        className="fixed inset-0 pointer-events-none z-[-1]"
        style={{
          background: `radial-gradient(ellipse at center, transparent 35%, rgba(94,70,50,0.08) 100%)`,
        }}
      />

      {/* floating hearts/petals across the page */}
      <VintageSnow count={20} />

      {/* left/right desktop balance — polaroid-style note + dried flowers, mirroring GameScreen/MessageScreen */}
      <SideNote text={"24 candles,\none big wish"} posClass="top-[14%] left-[5%]" rotate={-6} />
      <SideFlowers posClass="top-[24%] left-[9%]" />

      <SideNote text={"love you \npapu ♡"} posClass="top-[16%] right-[5%]" rotate={5} />
      <SideFlowers posClass="top-[26%] right-[9%]" flip />

      {/* back button — fixed, same position on every quest page */}
      <BackButton onClick={goBack} />


      {/* top vintage divider */}
      <div className="flex items-center gap-3 mb-1" style={{ color: COLORS.gold, opacity: 0.8, fontSize: "12px" }}>
        <span>✦</span>
        <span>❦</span>
        <span>✦</span>
      </div>


      <Tag>
        <span style={{ letterSpacing: "3px" }}>make a wish</span>
      </Tag>

      {/* 24th birthday — compact + always visible on mobile */}
      <div className="mt-1 sm:mt-3 text-center px-3 birthday-mention">
        <div
          style={{
            fontFamily: "'Alex Brush', cursive",
            color: COLORS.rust,
            fontSize: "clamp(1.15rem, 4.8vw, 1.6rem)",
            lineHeight: 1.15,
          }}
        >
          celebrating your 24th birthday
        </div>
        <div
          className="mt-0.5"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: COLORS.brownSoft,
            fontSize: "clamp(0.7rem, 3vw, 0.85rem)",
            fontStyle: "italic",
          }}
        >
          Happy Birthday Ammu ♡
        </div>
        <div
          className="mt-1 text-[0.55rem] sm:text-xs uppercase"
          style={{ color: COLORS.gold, letterSpacing: "2.5px" }}
        >
          September 10
        </div>
      </div>

      {/* hint / result line — sits ABOVE the cake so the parachute lands there */}
      {!showMemories && !plated && (
        <div className="mt-1 text-center min-h-[1.2rem]" style={{ fontFamily: "'Playfair Display', serif" }}>
          {cutting ? (
            <span className="italic text-sm" style={{ color: COLORS.rust }}>
              slicing your cake ♡
            </span>
          ) : blown ? (
            <span
              className="italic text-sm"
              style={{ color: COLORS.rust, animation: "wishPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}
            >
              wish made ♡ may it all come true
            </span>
          ) : (
            <ParachuteHint text="tap the flame to make your wish" />
          )}
        </div>
      )}

      {/* vintage cake — interactive candle + confetti + cut wedge */}
      {!showMemories && !plated && (
        <div className="relative scale-[0.88] sm:scale-100 origin-top">
          <VintageCake blown={blown} onBlow={onBlow} cutting={cutting} cut={cut} />
          <ConfettiBurst active={showConfetti} />
        </div>
      )}

      {/* plated slice replaces the whole cake once cutting is done */}
      {!showMemories && plated && <PlatedSlice visible={plated} />}

      {plated && !showMemories && (
        <div
          className="mt-1 text-center italic text-sm slice-in"
          style={{ fontFamily: "'Playfair Display', serif", color: COLORS.rust }}
        >
          plated with love ♡ first slice is yours
        </div>
      )}


      {/* countdown — only before memories; smaller on mobile */}
      {!showMemories && (
        cd ? (
          <div className="flex gap-1 sm:gap-2.5 justify-center mt-1 flex-wrap px-2">
            <CountdownBox label="days" value={cd.d} rotate={-2} />
            <CountdownBox label="hrs" value={cd.h} rotate={1} />
            <CountdownBox label="min" value={cd.m} rotate={-1} />
            <CountdownBox label="sec" value={cd.s} rotate={2} />
          </div>
        ) : (
          <div
            className="mt-2 text-xl sm:text-2xl"
            style={{ fontFamily: "'Alex Brush', cursive", color: COLORS.rust }}
          >
            it's finally your day 🎂
          </div>
        )
      )}


      {/* cut-the-cake button — shows after the wish, before the cake is cut */}
      {!showMemories && blown && !cut && (
        <button
          type="button"
          onClick={onCut}
          disabled={cutting}
          className="vintage-memory-btn mt-4 sm:mt-6 px-7 py-3"
          style={{
            color: COLORS.cream,
            background: COLORS.rust,
            border: `1px solid ${COLORS.rust}`,
            boxShadow: "0 8px 18px rgba(94,70,50,0.22)",
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.8rem",
            letterSpacing: "2px",
            opacity: cutting ? 0.7 : 1,
            cursor: cutting ? "default" : "pointer",
          }}
        >
          🔪 &nbsp; {cutting ? "cutting..." : "cut the cake"} &nbsp; 🔪
        </button>
      )}

      {/* memories button — shows once the cake has been cut and plated */}
      {!showMemories && plated && (
        <button
          type="button"
          onClick={() => setShowMemories(true)}
          className="vintage-memory-btn mt-4 sm:mt-6 px-7 py-3"
          style={{
            color: COLORS.cream,
            background: COLORS.rust,
            border: `1px solid ${COLORS.rust}`,
            boxShadow: "0 8px 18px rgba(94,70,50,0.22)",
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.8rem",
            letterSpacing: "2px",
          }}
        >
          ❦ &nbsp; see our memories &nbsp; ❦
        </button>
      )}


      {/* memories — compact single-screen layout on mobile (no scroll) */}
      {showMemories && (
        <div className="mt-2 flex flex-col items-center w-full px-3 max-h-[calc(100dvh-130px)] overflow-hidden">
          <div
            className="mb-2 italic shrink-0"
            style={{
              fontFamily: "'Alex Brush', cursive",
              color: COLORS.rust,
              fontSize: "clamp(1.15rem, 5vw, 1.5rem)",
            }}
          >
            little moments, forever ♡
          </div>

          <div className="relative w-full max-w-[220px] sm:max-w-[256px] shrink">
            {MEMORY_SLIDES.map((slide, i) => (
              <div
                key={i}
                className="transition-all duration-700"
                style={{ display: i === slideIdx ? "block" : "none" }}
              >
                <MemoryCard image={slide.image} caption={slide.caption} />
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 justify-center mt-2 shrink-0">
            {MEMORY_SLIDES.map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: i === slideIdx ? COLORS.rust : "rgba(94,70,50,0.22)",
                }}
              />
            ))}
          </div>

          <Btn onClick={onContinue} className="mt-3 shrink-0">
            next surprise →
          </Btn>
        </div>
      )}


      {/* bottom ornamental divider — hide when memories open to save space */}
      {!showMemories && (
        <div className="flex items-center gap-3 mt-7" style={{ color: COLORS.gold, opacity: 0.65, fontSize: "11px" }}>
          <span>—</span>
          <span>❦</span>
          <span>—</span>
        </div>
      )}


      <style>{`

        @keyframes vintageFall {
          0% { transform: translateY(-8vh) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: var(--maxOpacity, 0.5); }
          85% { opacity: var(--maxOpacity, 0.5); }
          100% { transform: translateY(108vh) translateX(var(--drift, 20px)) rotate(var(--spin, 180deg)); opacity: 0; }
        }

        .vintage-snow-flake {
          position: absolute;
          top: -10%;
          will-change: transform, opacity;
          animation-name: vintageFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes birthdayIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .birthday-mention {
          animation: birthdayIn 0.9s cubic-bezier(0.16,1,0.3,1) both 0.15s;
        }

        @keyframes vintageFlame {
          0%, 100% { transform: translateX(-50%) scale(1) rotate(3deg); opacity: 0.85; }
          50% { transform: translateX(-50%) scale(1.12) rotate(-4deg); opacity: 1; }
        }

        @keyframes smokeRise {
          0% { transform: translateY(0) scaleX(1); opacity: 0.6; }
          100% { transform: translateY(-34px) scaleX(2.2); opacity: 0; }
        }

        .smoke-wisp {
          animation: smokeRise 1.1s ease-out both;
        }

        @keyframes wishPop {
          0% { opacity: 0; transform: translateY(4px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes confettiBurst {
          0% { transform: translate(-50%, -50%) translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--cx), var(--cy)) rotate(var(--cspin)); opacity: 0; }
        }

        .confetti-piece {
          left: 0;
          top: 0;
          animation-name: confettiBurst;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-fill-mode: both;
        }

        @keyframes sideFloat {
          0%, 100% { transform: rotate(var(--rot, 0deg)) translateY(0); }
          50% { transform: rotate(var(--rot, 0deg)) translateY(-8px); }
        }

        .side-note-float {
          animation: sideFloat 5s ease-in-out infinite;
        }

        /* outer cake wrapper — no longer scales/fades itself,
           each layer inside animates on its own now */
        .cake-vintage {
          opacity: 1;
        }

        /* each cake layer drops in from above, top layer first,
           in sequence, thanks to the staggered animationDelay set inline */
        @keyframes layerDropIn {
          0% {
            opacity: 0;
            transform: translateY(-26px);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cake-layer-in {
          animation: layerDropIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .vintage-memory-btn {
          position: relative;
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        .vintage-memory-btn::before,
        .vintage-memory-btn::after {
          content: "";
          position: absolute;
          inset: 4px;
          border: 1px solid rgba(255,255,255,0.25);
          pointer-events: none;
        }

        .vintage-memory-btn:hover {
          transform: translateY(-2px) rotate(-1deg);
          box-shadow: 0 12px 24px rgba(94,70,50,0.25);
        }

        @keyframes vintageCardIn {
          from { opacity: 0; transform: translateY(12px) rotate(0deg); }
          to { opacity: 1; }
        }

        .vintage-countdown-card {
          animation: vintageCardIn 0.7s ease-out both;
        }

        /* knife sweeping down through the cake */
        @keyframes knifeSwipe {
          0% { transform: translate(-50%, -30px) rotate(-6deg); opacity: 0; }
          15% { opacity: 1; }
          55% { transform: translate(-50%, 70px) rotate(4deg); opacity: 1; }
          80% { transform: translate(-50%, 78px) rotate(4deg); opacity: 1; }
          100% { transform: translate(-50%, 78px) rotate(4deg); opacity: 0; }
        }

        .knife-cut {
          left: 50%;
          animation: knifeSwipe 0.75s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        /* the cut wedge fading into view once the knife passes */
        @keyframes wedgeFadeIn {
          from { opacity: 0; }
          to { opacity: 0.9; }
        }

        .cut-wedge-fade {
          animation: wedgeFadeIn 0.4s ease-out both;
        }

        /* the plated slice arriving */
        @keyframes sliceIn {
          0% { opacity: 0; transform: translateY(14px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .slice-in {
          animation: sliceIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* gentle pendulum swing on the canopy while it glides down —
           independent of the falling translate, gives a floaty
           "actually flying" feel instead of a rigid straight drop */
        @keyframes parachuteSway {
          0%   { transform: rotate(-7deg); }
          25%  { transform: rotate(5deg); }
          50%  { transform: rotate(-4deg); }
          75%  { transform: rotate(6deg); }
          100% { transform: rotate(-7deg); }
        }

        .parachute-sway {
          transform-origin: 50% 0%;
          animation: parachuteSway 1.1s ease-in-out infinite;
        }

        /* the parachute falls from the real top of the browser window, sways
           down in a smooth glide, and lands exactly on the measured message
           position (--landY), then pops away right as it touches down */
        @keyframes parachuteFallFull {
          0% {
            opacity: 0;
            transform: translate(-50%, -120px) rotate(0deg) scale(0.92);
          }
          12% {
            opacity: 1;
          }
          30% {
            transform: translate(-35%, calc(var(--landY) * 0.28)) rotate(4deg) scale(1);
          }
          50% {
            transform: translate(-64%, calc(var(--landY) * 0.55)) rotate(-4deg) scale(1);
          }
          70% {
            transform: translate(-40%, calc(var(--landY) * 0.8)) rotate(3deg) scale(1);
          }
          88% {
            transform: translate(-54%, calc(var(--landY) * 0.97)) rotate(-1deg) scale(1);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, var(--landY)) rotate(0deg) scale(1);
          }
        }

        @keyframes parachutePopFull {
          0% { transform: translate(-50%, var(--landY)) scale(1) rotate(0deg); opacity: 1; }
          35% { transform: translate(-50%, var(--landY)) scale(1.3) rotate(-8deg); opacity: 1; }
          100% { transform: translate(-50%, var(--landY)) scale(0.1) rotate(12deg); opacity: 0; }
        }

        .parachute-falling {
          animation:
            parachuteFallFull 1.7s cubic-bezier(0.33, 0.6, 0.4, 1) 0.7s both,
            parachutePopFull 0.4s ease-in 2.4s both;
        }

        /* boom — a couple of rings punching outward right as the
           parachute lands */
        .boom-anchor {
          transform: translate(-50%, -50%);
        }

        .boom-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 14px;
          height: 14px;
          margin: -7px;
          border-radius: 50%;
          border: 2px solid;
          opacity: 0;
          animation: boomExpand 0.55s ease-out 2.38s both;
        }

        .boom-ring-2 {
          animation-delay: 2.47s;
        }

        @keyframes boomExpand {
          0% { transform: scale(0.3); opacity: 0; }
          12% { opacity: 0.9; }
          60% { opacity: 0.45; }
          100% { transform: scale(3.4); opacity: 0; }
        }

        /* the message pops out of the boom */
        @keyframes messagePopIn {
          0% { opacity: 0; transform: scale(0.5) translateY(6px); }
          55% { opacity: 1; transform: scale(1.1) translateY(-3px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .message-pop {
          display: inline-block;
          animation: messagePopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 2.5s both;
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
        }

      `}</style>

    </div>
  );
}