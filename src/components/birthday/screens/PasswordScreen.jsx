import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, CORRECT_PASSWORD } from "../constants";
import { useQuestProgress } from "../hooks/useQuestProgress";
import Tag from "../shared/Tag";
import Btn from "../shared/Btn";
import BackButton from "../shared/BackButton";

export default function PasswordScreen() {
  const navigate = useNavigate();
  const { unlock } = useQuestProgress();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const check = () => {
    const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, "");

    if (normalize(value) === normalize(CORRECT_PASSWORD)) {
      unlock("message");
      navigate("/quest/message");
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const goBack = () => {
    navigate("/quest/gift");
  };

  const heartPositions = [
    { top: "6%", left: "3%", size: "12px", delay: "0s" },
    { top: "10%", left: "20%", size: "10px", delay: "0.8s" },
    { top: "8%", left: "94%", size: "14px", delay: "0.4s" },
    { top: "18%", left: "78%", size: "16px", delay: "0.6s" },
    { top: "22%", left: "10%", size: "12px", delay: "1.4s" },
    { top: "28%", left: "88%", size: "10px", delay: "1.2s" },
    { top: "34%", left: "2%", size: "16px", delay: "0.2s" },
    { top: "40%", left: "95%", size: "14px", delay: "0.3s" },
    { top: "46%", left: "15%", size: "10px", delay: "1s" },
    { top: "52%", left: "85%", size: "12px", delay: "1.6s" },
    { top: "55%", left: "5%", size: "16px", delay: "0.9s" },
    { top: "62%", left: "92%", size: "12px", delay: "1.5s" },
    { top: "68%", left: "8%", size: "10px", delay: "0.5s" },
    { top: "74%", left: "80%", size: "14px", delay: "1s" },
    { top: "80%", left: "18%", size: "12px", delay: "0.7s" },
    { top: "84%", left: "90%", size: "10px", delay: "1.3s" },
    { top: "90%", left: "6%", size: "14px", delay: "0.4s" },
    { top: "94%", left: "70%", size: "12px", delay: "1.1s" },
  ];

  // Scattered star field across the full screen — avoids the center column where the form sits
  const starField = [
    { top: "4%", left: "38%", size: 3 },
    { top: "9%", left: "55%", size: 2 },
    { top: "14%", left: "8%", size: 4 },
    { top: "16%", left: "70%", size: 2.5 },
    { top: "22%", left: "45%", size: 2 },
    { top: "26%", left: "92%", size: 3 },
    { top: "30%", left: "3%", size: 2.5 },
    { top: "33%", left: "62%", size: 3.5 },
    { top: "38%", left: "25%", size: 2 },
    { top: "42%", left: "97%", size: 3 },
    { top: "48%", left: "12%", size: 2.5 },
    { top: "58%", left: "40%", size: 2 },
    { top: "60%", left: "96%", size: 3 },
    { top: "64%", left: "5%", size: 2.5 },
    { top: "70%", left: "60%", size: 3 },
    { top: "76%", left: "30%", size: 2 },
    { top: "78%", left: "94%", size: 3.5 },
    { top: "86%", left: "50%", size: 2.5 },
    { top: "88%", left: "10%", size: 3 },
    { top: "92%", left: "85%", size: 2 },
  ];

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {heartPositions.map((h, i) => (
          <span
            key={i}
            className="absolute select-none"
            style={{
              top: h.top,
              left: h.left,
              fontSize: h.size,
              color: COLORS.rustSoft,
              opacity: 0.35,
              animation: `heartFloat 3.5s ease-in-out ${h.delay} infinite`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Full-screen scattered star field */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {starField.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full twinkle-dot"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: COLORS.rust,
              opacity: 0.6,
              animationDelay: `${(i % 6) * 0.5}s`,
              animationDuration: `${2.2 + (i % 4) * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Small drifting cloud, top center-left, desktop only */}
      <div
        className="hidden md:block fixed left-1/3 top-10 z-0 pointer-events-none cloud-drift"
        style={{ width: "130px", height: "50px" }}
      >
        <svg viewBox="0 0 130 50" width="130" height="50" xmlns="http://www.w3.org/2000/svg">
          <g fill={COLORS.creamDeep} opacity="0.6">
            <ellipse cx="35" cy="32" rx="28" ry="14" />
            <ellipse cx="60" cy="24" rx="22" ry="18" />
            <ellipse cx="90" cy="30" rx="26" ry="15" />
          </g>
        </svg>
      </div>

      {/* Second drifting cloud, bottom right area, desktop only */}
      <div
        className="hidden lg:block fixed right-16 bottom-1/4 z-0 pointer-events-none cloud-drift"
        style={{ width: "100px", height: "40px", animationDelay: "2s" }}
      >
        <svg viewBox="0 0 100 40" width="100" height="40" xmlns="http://www.w3.org/2000/svg">
          <g fill={COLORS.creamDeep} opacity="0.5">
            <ellipse cx="25" cy="26" rx="22" ry="11" />
            <ellipse cx="48" cy="18" rx="18" ry="14" />
            <ellipse cx="72" cy="24" rx="20" ry="12" />
          </g>
        </svg>
      </div>

      {/* Main large moon — bottom-left, desktop only */}
      <div
        className="hidden md:block fixed left-6 bottom-10 z-0 pointer-events-none moon-enter"
        style={{ width: "220px", height: "250px" }}
      >
        <svg viewBox="0 0 280 320" width="220" height="250" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="crescentMask1">
              <circle cx="150" cy="120" r="65" fill="white" />
              <circle cx="182" cy="98" r="58" fill="black" />
            </mask>
          </defs>
          <circle cx="150" cy="120" r="80" fill={COLORS.gold} opacity="0.15" className="moon-glow" />
          <circle cx="150" cy="120" r="65" fill={COLORS.gold} mask="url(#crescentMask1)" />
          <g fill={COLORS.rust} opacity="0.85" className="twinkle">
            <circle cx="55" cy="90" r="4" />
            <circle cx="95" cy="160" r="3" />
            <circle cx="40" cy="215" r="5" />
            <circle cx="115" cy="245" r="3.5" />
            <circle cx="70" cy="285" r="4" />
            <circle cx="185" cy="220" r="3" />
          </g>
          <g stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" opacity="0.7">
            <path d="M55 78 L55 102 M43 90 L67 90" />
            <path d="M40 203 L40 227 M28 215 L52 215" />
          </g>
        </svg>
      </div>

      {/* Small crescent, top-right, desktop only */}
      <div
        className="hidden md:block fixed right-10 top-16 z-0 pointer-events-none moon-enter"
        style={{ width: "90px", height: "90px", animationDelay: "0.4s" }}
      >
        <svg viewBox="0 0 100 100" width="90" height="90" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="crescentMask2">
              <circle cx="50" cy="45" r="26" fill="white" />
              <circle cx="63" cy="36" r="23" fill="black" />
            </mask>
          </defs>
          <circle cx="50" cy="45" r="26" fill={COLORS.gold} mask="url(#crescentMask2)" opacity="0.85" />
          <g fill={COLORS.rust} opacity="0.7" className="twinkle">
            <circle cx="20" cy="75" r="2.5" />
            <circle cx="80" cy="20" r="2" />
          </g>
        </svg>
      </div>

      {/* Small star cluster, mid-right, larger desktop only */}
      <div
        className="hidden lg:block fixed right-24 bottom-32 z-0 pointer-events-none moon-enter"
        style={{ width: "60px", height: "60px", animationDelay: "0.6s" }}
      >
        <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
          <g fill={COLORS.rustSoft} opacity="0.75" className="twinkle">
            <circle cx="10" cy="10" r="3" />
            <circle cx="35" cy="25" r="2" />
            <circle cx="20" cy="45" r="3.5" />
            <circle cx="48" cy="12" r="2.5" />
          </g>
        </svg>
      </div>

      {/* Extra star cluster, top-left, desktop only */}
      <div
        className="hidden lg:block fixed left-24 top-24 z-0 pointer-events-none moon-enter"
        style={{ width: "50px", height: "50px", animationDelay: "0.8s" }}
      >
        <svg viewBox="0 0 50 50" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
          <g fill={COLORS.rustSoft} opacity="0.7" className="twinkle">
            <circle cx="8" cy="8" r="2.5" />
            <circle cx="30" cy="18" r="2" />
            <circle cx="18" cy="38" r="3" />
          </g>
        </svg>
      </div>

      {/* Mobile version — small crescent + stars, top-right corner */}
      <div
        className="block md:hidden fixed top-6 right-4 z-0 pointer-events-none moon-enter-mobile"
        style={{ width: "110px", height: "130px" }}
      >
        <svg viewBox="0 0 130 150" width="110" height="130" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="crescentMaskMobile">
              <circle cx="65" cy="55" r="34" fill="white" />
              <circle cx="82" cy="44" r="30" fill="black" />
            </mask>
          </defs>
          <circle cx="65" cy="55" r="34" fill={COLORS.gold} mask="url(#crescentMaskMobile)" opacity="0.8" />
          <g fill={COLORS.rust} opacity="0.7" className="twinkle">
            <circle cx="25" cy="100" r="2.5" />
            <circle cx="45" cy="130" r="2" />
            <circle cx="90" cy="110" r="3" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 w-full flex justify-center px-4">
        <div className={`relative w-full max-w-md min-h-[520px] ${shake ? "quest-shake" : ""}`}>
          {/* back button — fixed, same position on every quest page */}
          <BackButton onClick={goBack} />

          <div className="relative flex flex-col items-center px-2 sm:px-4">
            <div
              className="text-4xl sm:text-5xl mb-1"
              style={{
                color: COLORS.rust,
                animation: "heartPulse 1.8s ease-in-out infinite",
              }}
            >
              ♥
            </div>

            <h2
              className="italic text-xl sm:text-2xl mt-1 text-center"
              style={{ fontFamily: "'Playfair Display', serif", color: COLORS.brown }}
            >
              this part's locked
            </h2>

            <Tag>
              <span className="mt-2 inline-block">only you know the words</span>
            </Tag>

            <div
              className="mt-6 mb-1 w-full max-w-xs sm:max-w-sm mx-auto rounded-xl px-4 py-3 text-sm sm:text-base italic text-center"
              style={{
                fontFamily: "'Playfair Display', serif",
                background: "rgba(255,255,255,0.35)",
                border: `1px dashed ${COLORS.rustSoft}`,
                color: COLORS.brown,
              }}
            >
              what you whisper right before you close your eyes...
              <br />
              the three words just before "good night"
            </div>

            <div className="relative mt-4 w-full max-w-xs sm:max-w-sm mx-auto">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: error ? COLORS.rust : COLORS.rustSoft, opacity: 0.7 }}
              >
                ♥
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && check()}
                placeholder="Enter Password"
                autoComplete="off"
                className="w-full block text-center font-mono text-sm sm:text-lg tracking-[2px] sm:tracking-[3px] rounded-xl pl-9 pr-9 py-3 outline-none transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.45)",
                  border: `1.5px solid ${error ? COLORS.rust : COLORS.line}`,
                  color: COLORS.brown,
                  boxShadow: error ? "none" : `0 0 12px ${COLORS.rustSoft}33`,
                }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: error ? COLORS.rust : COLORS.rustSoft, opacity: 0.7 }}
              >
                ♥
              </span>
            </div>

            <div className="mt-3 h-5 text-sm text-center" style={{ color: COLORS.rust, opacity: error ? 1 : 0 }}>
              that's not quite it — try again
            </div>

            <Btn onClick={check} className="mt-2">
              unlock ♥
            </Btn>

            <div
              className="mt-10 mb-2 w-16 h-px"
              style={{ background: COLORS.rustSoft, opacity: 0.4 }}
            />

            <div className="text-2xl mb-2" style={{ color: COLORS.rustSoft, opacity: 0.5 }}>
              ♥ ♥ ♥
            </div>

            <div className="text-[0.7rem] opacity-60 text-center" style={{ color: COLORS.brownSoft }}></div>
          </div>

          <style>{`
            @keyframes heartFloat {
              0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
              50% { transform: translateY(-12px) scale(1.15); opacity: 0.6; }
            }
            @keyframes heartPulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.15); }
            }
            @keyframes moonRise {
              0% { opacity: 0; transform: translateY(30px) scale(0.9); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            .moon-enter {
              animation: moonRise 1.4s cubic-bezier(0.22, 1, 0.36, 1) both;
              animation-delay: 0.2s;
            }
            @keyframes moonRiseMobile {
              0% { opacity: 0; transform: translateY(-20px) scale(0.9); }
              100% { opacity: 0.85; transform: translateY(0) scale(1); }
            }
            .moon-enter-mobile {
              animation: moonRiseMobile 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
            }
            @keyframes twinkle {
              0%, 100% { opacity: 0.85; }
              50% { opacity: 0.3; }
            }
            .twinkle circle:nth-child(1) { animation: twinkle 2.4s ease-in-out infinite; }
            .twinkle circle:nth-child(2) { animation: twinkle 3.1s ease-in-out infinite 0.4s; }
            .twinkle circle:nth-child(3) { animation: twinkle 2.8s ease-in-out infinite 0.8s; }
            .twinkle circle:nth-child(4) { animation: twinkle 3.4s ease-in-out infinite 1.2s; }
            .twinkle circle:nth-child(5) { animation: twinkle 2.6s ease-in-out infinite 0.6s; }
            .twinkle circle:nth-child(6) { animation: twinkle 3s ease-in-out infinite 1s; }
            @keyframes twinkleDot {
              0%, 100% { opacity: 0.15; }
              50% { opacity: 0.7; }
            }
            .twinkle-dot {
              animation-name: twinkleDot;
              animation-timing-function: ease-in-out;
              animation-iteration-count: infinite;
            }
            @keyframes moonGlowPulse {
              0%, 100% { opacity: 0.1; transform: scale(1); }
              50% { opacity: 0.22; transform: scale(1.08); }
            }
            .moon-glow {
              animation: moonGlowPulse 3.5s ease-in-out infinite;
              transform-origin: center;
            }
            @keyframes cloudDrift {
              0% { transform: translateX(0); }
              50% { transform: translateX(30px); }
              100% { transform: translateX(0); }
            }
            .cloud-drift {
              animation: cloudDrift 8s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>
    </>
  );
}