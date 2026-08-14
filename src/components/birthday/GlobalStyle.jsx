import { COLORS } from "./constants";

export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&family=Nunito:wght@400;500;600;700;800&family=Courier+Prime&display=swap');

      .quest-editable{ border-bottom: 1px dashed rgba(94,70,50,0.35); }

      @keyframes gift-float{ 0%,100%{ transform: translateY(0) rotate(-1deg);} 50%{ transform: translateY(-10px) rotate(1deg);} }
      .gift-float{ animation: gift-float 3.4s ease-in-out infinite; }

      @keyframes gift-bob{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
      .gift-bob{ animation: gift-bob 2.2s ease-in-out infinite; }

      @keyframes gift-wobble{ 0%,100%{ transform: rotate(0deg) scale(1);} 20%{ transform: rotate(-6deg) scale(1.05);} 40%{ transform: rotate(5deg) scale(1.05);} 60%{ transform: rotate(-3deg) scale(1.04);} 80%{ transform: rotate(2deg) scale(1.03);} }
      .gift-wobble{ animation: gift-wobble 0.7s ease-in-out; }

      @keyframes quest-name-in{ from{ opacity:0; transform: translateY(14px);} to{ opacity:1; transform: translateY(0);} }
      .quest-name-in{ animation: quest-name-in 1s ease-out; }

      @keyframes quest-particle-fall{
        0%{ transform: translateY(-10%) translateX(0); opacity:0; }
        10%{ opacity:0.55; }
        90%{ opacity:0.55; }
        100%{ transform: translateY(110vh) translateX(var(--drift)); opacity:0; }
      }
      .quest-particle{ animation-name: quest-particle-fall; animation-timing-function: linear; animation-iteration-count: infinite; }

      .quest-pill-btn:hover{ filter: brightness(1.08); transform: translateX(-50%) scale(1.05); }

      @keyframes quest-sparkle-burst{
        0%{ transform: translate(-50%,-50%) translate(0,0) scale(0.4); opacity:1; }
        100%{ transform: translate(-50%,-50%) translate(var(--sx), var(--sy)) scale(1); opacity:0; }
      }
      .quest-sparkle{ animation: quest-sparkle-burst 0.7s ease-out forwards; font-size: 0.9rem; }

      @keyframes quest-shake{ 10%,90%{transform:translateX(-2px)} 20%,80%{transform:translateX(4px)} 30%,50%,70%{transform:translateX(-8px)} 40%,60%{transform:translateX(8px)} }
      .quest-shake{ animation: quest-shake 0.5s ease; }

      @keyframes quest-blink{ 50%{ opacity:0; } }
      .quest-cursor{ animation: quest-blink 0.9s step-end infinite; }

      @keyframes cake-flicker{ 0%,100%{ transform:translateX(-50%) scale(1) rotate(-2deg);} 50%{ transform:translateX(-50%) scale(1.1) rotate(3deg);} }
      .cake-flame{ background: radial-gradient(circle, #ffd777, ${COLORS.gold} 70%); animation: cake-flicker 1s ease-in-out infinite; }

      .balloon{ border-radius: 50% 50% 50% 50% / 58% 58% 42% 42%; }
      .balloon::after{ content:''; position:absolute; bottom:-14px; left:50%; width:1.5px; height:16px; background: rgba(94,70,50,0.4); transform: translateX(-50%); }
      @keyframes balloon-rise{ from{ transform: translateY(20px);} to{ transform: translateY(-260px);} }
      @keyframes balloon-sway{ 0%,100%{ margin-left:0;} 50%{ margin-left:14px;} }
      .balloon-rise{ animation-name: balloon-rise; animation-timing-function: linear; animation-fill-mode: forwards; }
      .balloon-sway{ animation-name: balloon-sway; animation-duration: 3s; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
      .balloon-pop{ transform: scale(1.6); transition: transform .25s ease, opacity .25s ease; pointer-events:none; }

      @keyframes quest-fall{ to{ transform: translateY(110vh) rotate(360deg); opacity:0.1; } }
      .quest-petal{ animation: quest-fall linear forwards; }

      @media (prefers-reduced-motion: reduce){
        .gift-float, .gift-bob, .quest-cursor, .quest-petal, .cake-flame, .balloon-rise, .balloon-sway,
        .gift-wobble, .quest-name-in, .quest-particle, .quest-sparkle{ animation: none !important; }
      }
    `}</style>
  );
}