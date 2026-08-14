import { useEffect, useRef } from "react";

export default function ConfettiLayer() {
  const layerRef = useRef(null);

  useEffect(() => {
    window.questBurst = () => {
      const layer = layerRef.current;
      if (!layer) return;
      const emojis = ["🌸", "💐", "✨", "🎂", "♡", "🎉"];
      for (let i = 0; i < 50; i++) {
        const el = document.createElement("div");
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.className = "quest-petal absolute -top-6";
        el.style.left = Math.random() * 100 + "vw";
        el.style.fontSize = 1 + Math.random() * 1.2 + "rem";
        el.style.animationDuration = 2.5 + Math.random() * 2 + "s";
        layer.appendChild(el);
        setTimeout(() => el.remove(), 5000);
      }
    };
    return () => {
      delete window.questBurst;
    };
  }, []);

  return <div ref={layerRef} className="fixed inset-0 pointer-events-none z-[60]" />;
}