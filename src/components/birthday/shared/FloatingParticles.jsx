import { useMemo } from "react";
import { COLORS } from "../constants";

export default function FloatingParticles() {
  const particles = useMemo(() => {
    const glyphs = ["✦", "♡", "✧", "★", "•"];
    return Array.from({ length: 38 }).map((_, i) => ({
      id: i,
      glyph: glyphs[i % glyphs.length],
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
      size: 0.7 + Math.random() * 1.3,
      drift: (Math.random() - 0.5) * 80,
      opacity: 0.55 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="quest-particle absolute top-0"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}rem`,
            color: p.glyph === "♡" ? COLORS.rust : COLORS.gold,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--drift": `${p.drift}px`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}