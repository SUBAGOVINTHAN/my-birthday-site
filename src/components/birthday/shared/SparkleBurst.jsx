import { useMemo } from "react";
import { COLORS } from "../constants";

export default function SparkleBurst() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        return {
          id: i,
          x: Math.cos(angle) * (40 + Math.random() * 30),
          y: Math.sin(angle) * (40 + Math.random() * 30),
        };
      }),
    []
  );
  return (
    <div className="absolute left-1/2 top-1/2 z-[7] pointer-events-none">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="quest-sparkle absolute"
          style={{ "--sx": `${s.x}px`, "--sy": `${s.y}px`, color: COLORS.gold }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}