import { COLORS } from "../constants";

export default function ProgressDots({ activeIdx, total }) {
  return (
    <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-50">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-all duration-300"
          style={{ background: i <= activeIdx ? COLORS.rust : "rgba(94,70,50,0.2)" }}
        />
      ))}
    </div>
  );
}