import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants";
import { useQuestProgress } from "../hooks/useQuestProgress";
import { useAudio } from "../context/AudioContext";
import Tag from "../shared/Tag";
import FloatingParticles from "../shared/FloatingParticles";
import SparkleBurst from "../shared/SparkleBurst";

// small torn-paper + washi-tape note card, fades + slides in on mount
// two variants matching the two reference styles:
//  - "notebook": lined page over a torn kraft backing, postage stamp + botanical branch
//  - "graph": grid paper with a torn-paper flourish curling off the top-right corner
function CornerNote({ text, corner, rotate = -4, delay = 0, variant = "notebook" }) {
  const cornerStyles = {
    topLeft: { top: "7%", left: "4%" },
    topRight: { top: "7%", right: "4%" },
    bottomLeft: { bottom: "9%", left: "4%" },
    bottomRight: { bottom: "9%", right: "4%" },
  };

  const slideFrom = {
    topLeft: "translate(-40px, -30px)",
    topRight: "translate(40px, -30px)",
    bottomLeft: "translate(-40px, 30px)",
    bottomRight: "translate(40px, 30px)",
  };

  return (
    <div
      className="corner-note-in fixed z-[2] pointer-events-none select-none hidden lg:block"
      style={{
        ...cornerStyles[corner],
        "--rotate": `${rotate}deg`,
        "--slide-from": slideFrom[corner],
        "--delay": `${delay}ms`,
      }}
    >
      <div className="relative w-32 lg:w-36">
        {variant === "notebook" && (
          <>
            {/* kraft paper backing, torn deckle edge, peeking out behind/below the note */}
            <div
              className="absolute -bottom-3 -left-3 w-[104%] h-[92%] rotat[6deg]"
              style={{
                background: "linear-gradient(160deg, #b8935f, #8f6b3f)",
                clipPath:
                  "polygon(0% 8%, 6% 4%, 12% 9%, 18% 3%, 26% 8%, 34% 2%, 42% 7%, 50% 3%, 58% 8%, 66% 2%, 74% 7%, 82% 3%, 90% 8%, 100% 4%, 100% 100%, 0% 100%)",
                boxShadow: "0 12px 22px rgba(60,40,20,0.45)",
              }}
            />
            {/* botanical branch line-art, bottom right of the backing */}
            <svg
              viewBox="0 0 60 60"
              className="absolute -bottom-2 -right-4 w-12 h-12 opacity-95 rotate-[6deg]">
              <path
                d="M6 54 C 18 44, 22 30, 34 8"
                fill="none"
                stroke="#5c3d1f"
                strokeWidth="1.3"
              />
              <path d="M20 34 C 26 32, 28 26, 24 22" fill="none" stroke="#5c3d1f" strokeWidth="1.2" />
              <path d="M27 22 C 33 21, 35 15, 31 11" fill="none" stroke="#5c3d1f" strokeWidth="1.2" />
              <ellipse cx="22" cy="24" rx="4" ry="2" fill="#5c3d1f" opacity="0.8" transform="rotate(-30 22 24)" />
              <ellipse cx="29" cy="13" rx="4" ry="2" fill="#5c3d1f" opacity="0.8" transform="rotate(-30 29 13)" />
            </svg>
            {/* postage stamp / heart postmark, bottom-left of the backing */}
            <svg
              viewBox="0 0 40 40"
              className="absolute -bottom-1 -left-1 w-9 h-9 opacity-95 rotate-[6deg]"
            >
              <circle cx="20" cy="20" r="15" fill="none" stroke="#5c3d1f" strokeWidth="1.2" strokeDasharray="2 2" />
              <path
                d="M20 26 C 12 19, 15 12, 20 16 C 25 12, 28 19, 20 26 Z"
                fill="none"
                stroke="#5c3d1f"
                strokeWidth="1.4"
              />
              <path d="M2 24 C 8 22, 12 26, 18 24" fill="none" stroke="#5c3d1f" strokeWidth="1" />
            </svg>

            {/* the lined note itself, sitting on top of the backing */}
            <div
              className="relative px-4 pt-5 pb-4 rounded-[2px]"
              style={{
                background: `repeating-linear-gradient(${COLORS.cream}, ${COLORS.cream} 15px, rgba(120,140,160,0.28) 16px)`,
                boxShadow: "0 10px 20px rgba(60,40,20,0.35)",
                border: "1px solid rgba(94,70,50,0.25)",
              }}
            >
              {/* spiral-notepad holes along the left edge */}
              <div className="absolute left-1.5 top-2 bottom-2 flex flex-col justify-around">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "rgba(94,70,50,0.35)", boxShadow: "inset 0 0 0 1px rgba(94,70,50,0.2)" }}
                  />
                ))}
              </div>

              {/* washi tape */}
              <div
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rotate-[-3deg]"
                style={{
                  background: "linear-gradient(135deg, rgba(203,161,53,0.55), rgba(203,161,53,0.35))",
                  boxShadow: "0 2px 4px rgba(94,70,50,0.2)",
                }}
              />

              <div
                className="text-center italic leading-snug pl-2"
                style={{ fontFamily: "'Playfair Display', serif", color: COLORS.rust, fontSize: "0.78rem" }}
              >
                {text}
              </div>
              <div className="text-center mt-1 pl-2" style={{ color: COLORS.gold }}>
                ♡
              </div>
            </div>
          </>
        )}

        {variant === "graph" && (
          <>
            {/* torn paper flap curling off the top-right corner */}
            <svg viewBox="0 0 50 50" className="absolute -top-4 -right-4 w-12 h-12 z-[1] opacity-90">
              <path
                d="M4 4 L46 4 Q40 10 44 18 Q34 14 26 20 Q30 10 20 8 Q28 2 4 4 Z"
                fill="#efe4cf"
                stroke="rgba(94,70,50,0.15)"
                strokeWidth="0.6"
              />
              <path
                d="M14 10 C 22 8, 28 12, 30 20"
                fill="none"
                stroke={COLORS.rustSoft}
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>

            {/* the grid-paper note */}
            <div
              className="relative px-4 pt-6 pb-4 rounded-[2px]"
              style={{
                background: `
                  repeating-linear-gradient(90deg, rgba(120,140,160,0.16) 0 1px, transparent 1px 16px),
                  repeating-linear-gradient(0deg, rgba(120,140,160,0.16) 0 1px, transparent 1px 16px),
                  ${COLORS.cream}`,
                boxShadow: "0 10px 20px rgba(94,70,50,0.28)",
                border: "1px solid rgba(94,70,50,0.12)",
              }}
            >
              {/* washi tape */}
              <div
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rotate-[3deg] z-[2]"
                style={{
                  background: "linear-gradient(135deg, rgba(203,161,53,0.55), rgba(203,161,53,0.35))",
                  boxShadow: "0 2px 4px rgba(94,70,50,0.2)",
                }}
              />

              <div
                className="text-center italic leading-snug"
                style={{ fontFamily: "'Playfair Display', serif", color: COLORS.rust, fontSize: "0.78rem" }}
              >
                {text}
              </div>
              <div className="text-center mt-1" style={{ color: COLORS.gold }}>
                ♡
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// thin filigree corner bracket — sits right at the true screen edge,
// underneath the note cards which sit further in
function CornerFrame({ corner }) {
  const pos = {
    topLeft: { top: "18px", left: "18px" },
    topRight: { top: "18px", right: "18px" },
    bottomLeft: { bottom: "18px", left: "18px" },
    bottomRight: { bottom: "18px", right: "18px" },
  };
  const flip = {
    topLeft: "scaleX(1) scaleY(1)",
    topRight: "scaleX(-1) scaleY(1)",
    bottomLeft: "scaleX(1) scaleY(-1)",
    bottomRight: "scaleX(-1) scaleY(-1)",
  };

  return (
    <svg
      viewBox="0 0 90 90"
      className="fixed z-[1] pointer-events-none opacity-70 w-16 h-16 sm:w-24 sm:h-24"
      style={{ ...pos[corner], transform: flip[corner] }}
    >
      {/* outer frame line */}
      <path
        d="M2 46 L2 2 L46 2"
        fill="none"
        stroke={COLORS.rust}
        strokeWidth="1.2"
      />
      {/* inner, shorter frame line — gives the classic double-line picture-frame look */}
      <path
        d="M9 30 L9 9 L30 9"
        fill="none"
        stroke={COLORS.rust}
        strokeWidth="1"
        opacity="0.75"
      />
      {/* curling vine flourish growing out of the corner */}
      <path
        d="M2 2
           C 16 4, 26 4, 32 14
           C 36 21, 33 27, 27 25
           C 23 23.5, 24 19, 28 19"
        fill="none"
        stroke={COLORS.gold}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* small leaf off the vine */}
      <path
        d="M18 8 C 21 5, 25 6, 24 10 C 23 13, 19 12, 18 8 Z"
        fill={COLORS.gold}
        opacity="0.65"
      />
      {/* tiny accent dot at the very corner */}
      <circle cx="2" cy="2" r="1.8" fill={COLORS.rust} />
    </svg>
  );
}

export default function GiftScreen() {
  const navigate = useNavigate();
  const { unlock } = useQuestProgress();
  const { stopAudio } = useAudio();
  const [opening, setOpening] = useState(false);
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    if (opening) return;
    setOpening(true);

    setTimeout(() => {
      stopAudio();
      unlock("password");
      navigate("/quest/password");
    }, 750);
  };

  return (
    <div className="relative">
      <style>{`
        @keyframes corner-note-in {
          0% {
            opacity: 0;
            transform: var(--slide-from) rotate(var(--rotate));
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) rotate(var(--rotate));
          }
        }
        .corner-note-in {
          opacity: 0;
          animation: corner-note-in 0.7s ease-out forwards;
          animation-delay: var(--delay);
        }
      `}</style>

      {/* dynamic gradient backdrop — fixed so it fills the whole viewport, not just this narrow column */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, rgba(203,161,53,0.32), transparent 55%)," +
            "radial-gradient(circle at 85% 20%, rgba(168,69,58,0.28), transparent 55%)," +
            "radial-gradient(circle at 15% 85%, rgba(168,69,58,0.24), transparent 55%)," +
            "radial-gradient(circle at 85% 85%, rgba(138,154,122,0.26), transparent 55%)," +
            "radial-gradient(circle at 50% 50%, rgba(203,161,53,0.14), transparent 65%)",
        }}
      />
      <FloatingParticles />

      {/* four corner flourishes, tucked right at the screen edges */}
      <CornerFrame corner="topLeft" />
      <CornerFrame corner="topRight" />
      <CornerFrame corner="bottomLeft" />
      <CornerFrame corner="bottomRight" />

      {/* four note cards, staggered in — alternating notebook/graph paper styles */}
      <CornerNote
        text={"made with\nall my love"}
        corner="topLeft"
        rotate={-6}
        delay={300}
        variant="notebook"
      />
      <CornerNote
        text={"just for\nyou"}
        corner="topRight"
        rotate={5}
        delay={600}
        variant="graph"
      />
      <CornerNote
        text={"open with\na smile"}
        corner="bottomLeft"
        rotate={4}
        delay={900}
        variant="notebook"
      />
      <CornerNote
        text={"happy\nbirthday"}
        corner="bottomRight"
        rotate={-5}
        delay={1200}
        variant="graph"
      />

      <Tag color={COLORS.gold}>
        <span
          className="italic text-sm sm:text-base"
          style={{
            fontFamily: "'Playfair Display', serif",
            letterSpacing: "3px",
            textShadow: "0 0 10px rgba(203,161,53,0.6)",
          }}
        >
          a little something for
        </span>
      </Tag>

      <div
        className="mt-3 text-5xl sm:text-6xl quest-name-in"
        style={{ fontFamily: "'Alex Brush', cursive", color: COLORS.rust }}
      >
        Khalifa
      </div>

      <div
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`relative w-44 h-44 sm:w-52 sm:h-52 mx-auto mt-8 cursor-pointer transition-transform duration-300 ${
          !opening ? "gift-float" : ""
        } ${hover && !opening ? "gift-wobble" : ""}`}
        style={{
          filter: hover && !opening ? `drop-shadow(0 0 22px rgba(203,161,53,0.55)) drop-shadow(0 0 8px rgba(168,69,58,0.35))` : "none",
        }}
      >
        {/* bow */}
        <div
          className="absolute left-1/2 top-[10%] -translate-x-1/2 z-[5] transition-transform duration-500"
          style={opening ? { transform: "translateX(-50%) translateY(-80px) rotate(25deg) scale(0.7)", opacity: 0 } : {}}
        >
          <svg viewBox="0 0 70 46" className="w-14 h-9 sm:w-16 sm:h-11">
            <path
              d="M35 30 C15 30 5 10 20 5 C30 2 35 16 35 22 C35 16 40 2 50 5 C65 10 55 30 35 30 Z"
              fill={COLORS.cream}
              stroke={COLORS.rust}
              strokeWidth="1.5"
            />
            <circle cx="35" cy="26" r="6" fill={COLORS.rust} />
          </svg>
        </div>

        {/* lid */}
        <div
          className="absolute left-1/2 top-[28%] -translate-x-1/2 w-[92%] h-[18%] rounded-md z-[3] transition-all duration-700"
          style={{
            background: `linear-gradient(135deg, ${COLORS.rustSoft}, ${COLORS.rust})`,
            boxShadow: "0 10px 20px rgba(94,70,50,0.22)",
            transformOrigin: "50% 100%",
            ...(opening ? { transform: "translateX(-50%) translateY(-80px) rotate(-30deg)", opacity: 0 } : {}),
          }}
        />
        <div
          className="absolute left-1/2 top-[28%] -translate-x-1/2 w-[92%] h-[15%] z-[4] transition-opacity duration-300"
          style={{ background: COLORS.cream, opacity: opening ? 0 : 0.9 }}
        />

        {/* box: left half */}
        <div
          className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-[78%] h-[58%] rounded-md transition-all duration-700 ease-out"
          style={{
            background: `linear-gradient(135deg, ${COLORS.rust}, ${COLORS.rustSoft})`,
            boxShadow: "0 18px 34px rgba(94,70,50,0.28)",
            clipPath: "inset(0 50% 0 0)",
            ...(opening
              ? { transform: "translateX(calc(-50% - 55px)) rotate(-18deg)", opacity: 0 }
              : {}),
          }}
        />
        {/* box: right half */}
        <div
          className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-[78%] h-[58%] rounded-md transition-all duration-700 ease-out"
          style={{
            background: `linear-gradient(135deg, ${COLORS.rust}, ${COLORS.rustSoft})`,
            boxShadow: "0 18px 34px rgba(94,70,50,0.28)",
            clipPath: "inset(0 0 0 50%)",
            ...(opening
              ? { transform: "translateX(calc(-50% + 55px)) rotate(18deg)", opacity: 0 }
              : {}),
          }}
        />
        <div
          className="absolute left-1/2 top-[6%] -translate-x-1/2 w-[14%] h-[82%] z-[4] transition-opacity duration-300"
          style={{ background: COLORS.cream, opacity: opening ? 0 : 0.9 }}
        />

        {/* sparkle burst on open */}
        {opening && <SparkleBurst />}
      </div>

      {/* pill button — now in normal flow, with real spacing below the box */}
      <button
        type="button"
        onClick={handleClick}
        className="quest-pill-btn relative z-[6] mt-9 rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300"
        style={{
          background: hover ? COLORS.rust : COLORS.gold,
          color: COLORS.cream,
          boxShadow: "0 8px 16px rgba(94,70,50,0.25)",
          opacity: opening ? 0 : 1,
        }}
      >
        tap to open
      </button>

      <div
        className="mt-6 text-sm sm:text-base tracking-[2px] uppercase gift-bob"
        style={{ color: COLORS.gold, opacity: 0.9, textShadow: "0 0 8px rgba(203,161,53,0.4)" }}
      >
        ↑ tap the gift to begin ↑
      </div>
    </div>
  );
}