import Portal from "./Portal";
import { COLORS } from "../constants";

export default function PuzzleBackdrop() {
  return (
    <Portal containerId="puzzle-backdrop-root" zIndex={-1}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 15% 15%, rgba(255,255,255,0.3), transparent 45%), " +
            "radial-gradient(circle at 85% 80%, rgba(255,255,255,0.18), transparent 50%), " +
            `linear-gradient(160deg, ${COLORS.cream} 0%, #f3d9b8 40%, #e4b088 75%, ${COLORS.rustSoft} 100%)`,
        }}
      />
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="puzzle-sparkle"
            style={{
              left: `${(i * 29) % 100}%`,
              top: `${100 + (i % 5) * 6}%`,
              fontSize: `${10 + (i % 4) * 4}px`,
              animationDuration: `${9 + (i % 6) * 2}s`,
              animationDelay: `${-(i * 2.3)}s`,
              color: COLORS.gold,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      <style>{`
        @keyframes puzzleSparkleRise {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.55; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-115vh) rotate(180deg); opacity: 0; }
        }
        .puzzle-sparkle {
          position: absolute;
          animation-name: puzzleSparkleRise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .puzzle-sparkle { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
    </Portal>
  );
}