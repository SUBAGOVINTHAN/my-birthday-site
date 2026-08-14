import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants";
import { useQuestProgress } from "../hooks/useQuestProgress";
import Tag from "../shared/Tag";
import Btn from "../shared/Btn";
import BackButton from "../shared/BackButton";

// full-page falling hearts backdrop — same approach as GameScreen's HeartSnow,
// sits fixed behind the whole screen so it's actually visible (not trapped
// behind the opaque scratch-card layers)
function HeartRain({ count = 20 }) {
  const flakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = Math.random() * 100;
      const size = 10 + Math.random() * 16;
      const duration = 8 + Math.random() * 9;
      const delay = -(Math.random() * duration);
      const drift = (Math.random() - 0.5) * 100;
      const spin = (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 170);
      const maxOpacity = 0.2 + Math.random() * 0.35;
      const color = Math.random() > 0.5 ? COLORS.rust : COLORS.gold;
      return { id: i, left, size, duration, delay, drift, spin, maxOpacity, color };
    });
  }, [count]);

  return (
    <div className="fixed inset-0 -z-[5] pointer-events-none overflow-hidden" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="heart-rain-flake"
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

export default function ScratchScreen() {
  const navigate = useNavigate();
  const { unlock } = useQuestProgress();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [revealPercent, setRevealPercent] = useState(0);
  const scratching = useRef(false);
  const lastCheck = useRef(0);

  const [accepted, setAccepted] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const btnWrapRef = useRef(null);

  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  // start the bgm the moment the card is revealed — this fires from the same
  // user gesture (scratching) that triggered the reveal, so browsers allow it
  useEffect(() => {
    if (revealed && audioRef.current) {
      audioRef.current.volume = 0.55;
      audioRef.current.play().catch(() => {
        // autoplay was blocked (e.g. gesture didn't carry over) — the mute
        // button doubles as a manual play trigger in that case
      });
    }
  }, [revealed]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setMuted(false);
      return;
    }
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");

    const size = () => {
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      ctx.fillStyle = "#cbb894";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(94,70,50,0.6)";
      ctx.font = "600 14px Nunito, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("scratch here ✦", canvas.width / 2, canvas.height / 2);
    };
    size();

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      return { x: cx, y: cy };
    };
    const scratchAt = (x, y) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    };
    const computeProgress = () => {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 4 * 20) {
        total++;
        if (data[i] === 0) cleared++;
      }
      const pct = total ? Math.round((cleared / total) * 100) : 0;
      setRevealPercent((prev) => (pct > prev ? pct : prev));
      if (cleared / total > 0.45) {
        setRevealed(true);
      }
    };
    const start = (e) => {
      scratching.current = true;
      const p = getPos(e);
      scratchAt(p.x, p.y);
      e.preventDefault();
    };
    const move = (e) => {
      if (!scratching.current) return;
      const p = getPos(e);
      scratchAt(p.x, p.y);
      const now = performance.now();
      if (now - lastCheck.current > 120) {
        lastCheck.current = now;
        computeProgress();
      }
      e.preventDefault();
    };
    const end = () => {
      if (scratching.current) {
        scratching.current = false;
        computeProgress();
      }
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      canvas.removeEventListener("touchend", end);
    };
  }, []);

  const onContinue = () => {
    unlock("letter");
    navigate("/quest/letter");
  };

  const goBack = () => navigate(-1);

  const dodge = () => {
    const wrap = btnWrapRef.current;
    if (!wrap) return;
    const maxX = Math.max(wrap.clientWidth - 80, 40);
    const maxY = Math.max(wrap.clientHeight - 60, 40);
    const x = (Math.random() - 0.5) * maxX * 1.6;
    const y = Math.random() * maxY * 0.9;
    setPos({ x, y });
  };

  const sparkles = [
    { top: "-8%", left: "18%", size: "10px", delay: "0.55s" },
    { top: "6%", left: "82%", size: "13px", delay: "0.65s" },
    { top: "70%", left: "-6%", size: "9px", delay: "0.75s" },
    { top: "82%", left: "88%", size: "11px", delay: "0.6s" },
    { top: "38%", left: "94%", size: "8px", delay: "0.85s" },
    { top: "44%", left: "2%", size: "10px", delay: "0.9s" },
  ];

  return (
    <div className="relative">
      {/* ambient falling hearts — page-level backdrop, always visible */}
      <HeartRain count={20} />

      {/* background music — starts once the scratch card is revealed */}
      <audio ref={audioRef} src="/audio/proposal-bgm.mp3" loop preload="auto" />
      {revealed && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute music" : "Mute music"}
          className="fixed top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-sm message-in"
          style={{
            background: "rgba(255,255,255,0.75)",
            boxShadow: "0 4px 10px rgba(94,70,50,0.2)",
            color: COLORS.rust,
            backdropFilter: "blur(4px)",
          }}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      )}

      {/* Rose — desktop version, only enters once revealed */}
      {revealed && (
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
      )}

      {/* Rose — mobile version, smaller, tucked top-right */}
      {revealed && (
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
      )}

      <div className="relative z-10">
        <BackButton onClick={goBack} />

        {!revealed && (
          <>
            <Tag>last surprise</Tag>
            <h2 className="mt-2 italic text-xl sm:text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              scratch to reveal
            </h2>

            <div
              ref={wrapRef}
              className="relative w-64 h-40 sm:w-72 sm:h-44 mx-auto mt-5 rounded-xl overflow-hidden"
              style={{ boxShadow: "0 16px 30px rgba(94,70,50,0.25)" }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center text-center px-4 text-lg sm:text-xl"
                style={{ background: `linear-gradient(135deg, ${COLORS.cream}, ${COLORS.creamDeep})`, fontFamily: "'Alex Brush', cursive", color: COLORS.rust }}
              >
                <span className="quest-editable">will you marry me?</span>
              </div>
              <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ touchAction: "none", cursor: "grab" }}
              />
            </div>

            <div className="w-64 sm:w-72 mx-auto mt-3">
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(94,70,50,0.15)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-200 ease-out"
                  style={{
                    width: `${Math.min(revealPercent, 100)}%`,
                    background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.rust})`,
                  }}
                />
              </div>
              <div className="mt-1.5 text-xs" style={{ color: COLORS.brownSoft }}>
                {revealPercent}% revealed
              </div>
            </div>

            <div className="mt-2 text-sm" style={{ color: COLORS.brownSoft }}>
              rub your finger / mouse over the card
            </div>
          </>
        )}

        {revealed && (
          <div className="proposal-in flex flex-col items-center px-4">
            <div className="relative w-full max-w-xs sm:max-w-sm flex items-center justify-center">
              {sparkles.map((s, i) => (
                <span
                  key={i}
                  className="absolute sparkle-pop"
                  style={{
                    top: s.top,
                    left: s.left,
                    fontSize: s.size,
                    color: COLORS.gold,
                    animationDelay: s.delay,
                  }}
                >
                  ✦
                </span>
              ))}
              {/* hero illustration — the proposal scene, replaces the plain ring emoji */}
              <img
                src="/images/proposal-scene.png"
                alt="a boy surprised as a girl kneels and offers a ring"
                className="w-full h-auto select-none ring-drop"
                style={{ filter: "drop-shadow(0 10px 18px rgba(94,70,50,0.25))" }}
                draggable={false}
              />
            </div>

            <h2
              className="mt-4 italic text-2xl sm:text-3xl text-center px-2 message-in"
              style={{ fontFamily: "'Alex Brush', cursive", color: COLORS.rust }}
            >
              will you marry me?
            </h2>

            <div className="flex items-center gap-3 mt-4 mb-1 w-full max-w-[180px] message-in" style={{ animationDelay: "0.15s" }}>
              <div className="h-px flex-1" style={{ background: COLORS.rustSoft, opacity: 0.5 }} />
              <span style={{ color: COLORS.rustSoft, opacity: 0.85 }}>♥</span>
              <div className="h-px flex-1" style={{ background: COLORS.rustSoft, opacity: 0.5 }} />
            </div>

            <p
              className="mt-2 text-sm italic text-center max-w-xs message-in"
              style={{ fontFamily: "'Playfair Display', serif", color: COLORS.brownSoft, animationDelay: "0.25s" }}
            >
              every surprise led to this one question ♥
            </p>

            {!accepted && (
              <div
                ref={btnWrapRef}
                className="relative h-24 mt-6 w-full max-w-xs flex flex-row flex-nowrap gap-6 justify-center items-start message-in"
                style={{ animationDelay: "0.35s" }}
              >
                <div className="shrink-0 inline-block">
                  <Btn onClick={() => setAccepted(true)} className="rounded-full glow-pulse whitespace-nowrap">
                    Yes
                  </Btn>
                </div>
                <div
                  className="shrink-0 inline-block transition-transform duration-150"
                  style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                >
                  <Btn
                    ghost
                    onMouseOver={dodge}
                    onClick={dodge}
                    onTouchStart={dodge}
                    className="whitespace-nowrap"
                  >
                    No
                  </Btn>
                </div>
              </div>
            )}

            {accepted && (
              <div className="mt-2" style={{ animation: "popIn 0.55s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                <p className="text-sm mt-1.5 text-center" style={{ color: COLORS.brownSoft }}>
                 You have no other option, you’re stuck with me now! <span className="heartbeat">♥</span>
                </p>
                <Btn onClick={onContinue} className="mt-3.5 proposal-btn-in">
                  continue →
                </Btn>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes heartFall {
          0% { transform: translateY(-8vh) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: var(--maxOpacity, 0.35); }
          85% { opacity: var(--maxOpacity, 0.35); }
          100% { transform: translateY(108vh) translateX(var(--drift, 20px)) rotate(var(--spin, 180deg)); opacity: 0; }
        }
        .heart-rain-flake {
          position: absolute;
          top: -10%;
          will-change: transform, opacity;
          animation-name: heartFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes roseGiven {
          0% { opacity: 0; transform: translateY(60px) rotate(-8deg) scale(0.9); }
          60% { opacity: 1; transform: translateY(-8px) rotate(8deg) scale(1.02); }
          80% { transform: translateY(2px) rotate(4deg) scale(0.995); }
          100% { opacity: 1; transform: translateY(0) rotate(6deg) scale(1); }
        }
        .rose-enter {
          animation: roseGiven 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }

        @keyframes roseGivenMobile {
          0% { opacity: 0; transform: translateY(-30px) rotate(6deg) scale(0.9); }
          100% { opacity: 0.55; transform: translateY(0) rotate(-4deg) scale(1); }
        }
        .rose-enter-mobile {
          animation: roseGivenMobile 1.3s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }

        @keyframes proposalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .proposal-in {
          animation: proposalFadeIn 0.5s ease-out both;
        }

        @keyframes ringDrop {
          0%   { opacity: 0; transform: translateY(-30px) rotate(-6deg) scale(0.85); }
          55%  { opacity: 1; transform: translateY(6px) rotate(2deg) scale(1.04); }
          75%  { transform: translateY(-2px) rotate(-1deg) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
        .ring-drop {
          animation: ringDrop 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }

        @keyframes sparklePop {
          0%   { opacity: 0; transform: scale(0.3) rotate(0deg); }
          50%  { opacity: 1; transform: scale(1.15) rotate(120deg); }
          100% { opacity: 0; transform: scale(0.8) rotate(200deg); }
        }
        .sparkle-pop {
          animation: sparklePop 1.4s ease-out both;
        }

        @keyframes messageRise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .message-in {
          animation: messageRise 0.5s ease-out 0.05s both;
        }

        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 6px 16px rgba(168,69,58,0.35), 0 0 0 0 rgba(168,69,58,0.35); }
          50% { box-shadow: 0 6px 20px rgba(168,69,58,0.5), 0 0 0 8px rgba(168,69,58,0); }
        }
        .glow-pulse {
          animation: glowPulse 2.4s ease-in-out infinite;
        }

        .heartbeat {
          display: inline-block;
          animation: heartBeat 2.2s ease-in-out infinite;
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.25); }
          28% { transform: scale(1); }
          42% { transform: scale(1.18); }
          70% { transform: scale(1); }
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7) translateY(6px); }
          60% { opacity: 1; transform: scale(1.06) translateY(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes proposalBtnIn {
          0%   { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .proposal-btn-in {
          animation: proposalBtnIn 0.4s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .rose-enter, .rose-enter-mobile, .proposal-in, .ring-drop,
          .sparkle-pop, .message-in, .proposal-btn-in, .glow-pulse,
          .heartbeat, .heart-rain-flake { animation: none !important; }
        }
      `}</style>
    </div>
  );
}