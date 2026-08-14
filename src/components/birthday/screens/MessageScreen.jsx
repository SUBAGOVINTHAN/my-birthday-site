import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants";
import { useQuestProgress } from "../hooks/useQuestProgress";
import Tag from "../shared/Tag";
import Btn from "../shared/Btn";
import BackButton from "../shared/BackButton";

export default function MessageScreen() {
  const navigate = useNavigate();
  const { unlock } = useQuestProgress();

  const onContinue = () => {
    unlock("game");
    navigate("/quest/game");
  };

  const goBack = () => {
    navigate("/quest/password");
  };

  const heartPositions = [
    { top: "6%", left: "42%", size: "12px", delay: "0s" },
    { top: "10%", left: "96%", size: "16px", delay: "0.6s" },
    { top: "50%", left: "30%", size: "12px", delay: "1.2s" },
    { top: "92%", left: "60%", size: "10px", delay: "0.4s" },
    { top: "75%", left: "40%", size: "10px", delay: "0.9s" },
  ];

  return (
    <>
      {/* Brightness wash — lifts the overall page so it doesn't read dull */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 40%, transparent 70%)",
        }}
      />

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
              opacity: 0.45,
              animation: `heartFloat 3.5s ease-in-out ${h.delay} infinite`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Rose — desktop version, full size, left side */}
      <div
        className="hidden md:block fixed bottom-0 z-0 pointer-events-none rose-enter"
        style={{
          left: "30px",
          width: "440px",
          height: "92vh",
          maxHeight: "860px",
          background: "url('/images/rose.png') left bottom / contain no-repeat",
          filter: "drop-shadow(0 6px 16px rgba(94,70,50,0.15))",
          transformOrigin: "bottom left",
        }}
      />

      {/* Rose — mobile version, smaller, tucked top-right behind content, soft presence not overwhelming */}
      <div
        className="block md:hidden fixed top-0 right-0 z-0 pointer-events-none rose-enter-mobile"
        style={{
          width: "150px",
          height: "42vh",
          maxHeight: "320px",
          background: "url('/images/rose.png') top right / contain no-repeat",
          filter: "drop-shadow(0 4px 10px rgba(94,70,50,0.12))",
          opacity: 0.55,
          transformOrigin: "top right",
        }}
      />

      <div
        className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-0 flex-col items-center pointer-events-none"
        style={{ transform: "translateY(-50%) rotate(4deg)" }}
      >
        <div
          className="p-3 pb-8"
          style={{ background: "#fdf9f2", border: `1px solid ${COLORS.line}`, boxShadow: "0 8px 20px rgba(94,70,50,0.18)" }}
        >
          <div
            className="w-40 h-40 flex flex-col items-center justify-center"
            style={{ background: COLORS.creamDeep }}
          >
            <p className="italic text-lg" style={{ fontFamily: "'Alex Brush', cursive", color: COLORS.brown }}>
              just for
            </p>
            <p className="italic text-lg" style={{ fontFamily: "'Alex Brush', cursive", color: COLORS.brown }}>
              you
            </p>
            <span className="mt-1" style={{ color: COLORS.rustSoft }}>♥</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full flex justify-center px-4 py-6">
        <div className="relative w-full max-w-md">
          {/* back button — fixed, same position on every quest page */}
          <BackButton onClick={goBack} />

          <div className="relative flex flex-col items-center px-2 sm:px-4">
            <svg width="40" height="30" viewBox="0 0 40 30" className="mb-1" style={{ opacity: 0.9 }}>
              <path
                d="M6 22 L10 8 L16 16 L20 4 L24 16 L30 8 L34 22 Z"
                fill="none"
                stroke={COLORS.rust}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>

            <Tag>before anything else</Tag>

            <h2
              className="mt-3 italic text-xl sm:text-3xl leading-snug text-center"
              style={{ fontFamily: "'Playfair Display', serif", color: COLORS.rust }}
            >
              there's something special
              <br />
              I want to tell you <span style={{ color: COLORS.rustSoft }}>♥</span>
            </h2>
            <p
  className="mt-5 text-center italic text-sm sm:text-base"
  style={{
    fontFamily: "'Playfair Display', serif",
    color: COLORS.brownSoft,
  }}
>
  Happy birthday, thangapoo <span style={{ color: COLORS.rustSoft }}>♥</span>
</p>
            <div
              className="mt-6 w-full max-w-xs sm:max-w-sm rounded-2xl px-5 py-4 text-center"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: `1px dashed ${COLORS.rustSoft}`,
              }}
            >
              <p
                className="italic text-sm sm:text-base leading-relaxed"
                style={{ fontFamily: "'Playfair Display', serif", color: COLORS.brown }}
              >
                <span className="quest-editable">
                  "before the surprises start, just know — today is about you."
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 mb-6 w-full max-w-[220px]">
              <div className="h-px flex-1" style={{ background: COLORS.rustSoft, opacity: 0.5 }} />
              <span style={{ color: COLORS.rustSoft, opacity: 0.85 }}>♥</span>
              <div className="h-px flex-1" style={{ background: COLORS.rustSoft, opacity: 0.5 }} />
            </div>

            <Btn onClick={onContinue} className="flex items-center gap-2">
              <span>♥</span>
              <span>continue</span>
            </Btn>

            <div className="mt-10 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 w-full">
              {[
                { icon: "♥", label: "you make\nmy world better" },
                { icon: "♛", label: "you're\nso special" },
                { icon: "∞", label: "always\ntogether" },
                { icon: "♥", label: "happy\nbirthday khalifa" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="text-lg mb-1" style={{ color: COLORS.rust, opacity: 0.9 }}>
                    {item.icon}
                  </div>
                  <p
                    className="italic text-xs sm:text-sm leading-tight whitespace-pre-line"
                    style={{ fontFamily: "'Playfair Display', serif", color: COLORS.brown }}
                  >
                    {item.label}
                  </p>
                  <div className="text-[10px] mt-1" style={{ color: COLORS.rustSoft, opacity: 0.6 }}>
                    ♥
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mb-4 w-16 h-px"
              style={{ background: COLORS.rustSoft, opacity: 0.5 }}
            />
          </div>

          <style>{`
            @keyframes heartFloat {
              0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
              50% { transform: translateY(-12px) scale(1.15); opacity: 0.6; }
            }

            @keyframes roseGiven {
              0% {
                opacity: 0;
                transform: translateY(60px) rotate(-8deg) scale(0.9);
              }
              60% {
                opacity: 1;
                transform: translateY(-8px) rotate(8deg) scale(1.02);
              }
              80% {
                transform: translateY(2px) rotate(4deg) scale(0.995);
              }
              100% {
                opacity: 1;
                transform: translateY(0) rotate(6deg) scale(1);
              }
            }

            .rose-enter {
              animation: roseGiven 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
            }

            @keyframes roseGivenMobile {
              0% {
                opacity: 0;
                transform: translateY(-30px) rotate(6deg) scale(0.9);
              }
              100% {
                opacity: 0.55;
                transform: translateY(0) rotate(-4deg) scale(1);
              }
            }

            .rose-enter-mobile {
              animation: roseGivenMobile 1.3s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
            }
          `}</style>
        </div>
      </div>
    </>
  );
}