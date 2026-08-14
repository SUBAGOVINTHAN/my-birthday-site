import { useState } from "react";
import { COLORS, PUZZLE_EMOJIS } from "../constants";
import Btn from "../shared/Btn";

function shuffledDeck() {
  const deck = [...PUZZLE_EMOJIS, ...PUZZLE_EMOJIS].map((val, i) => ({ id: i, val }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MatchPairsGame({ onDone }) {
  const [deck] = useState(shuffledDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [lock, setLock] = useState(false);
  const [shake, setShake] = useState([]);

  const handleFlip = (card) => {
    if (lock || flipped.includes(card.id) || matched.includes(card.id)) return;
    const next = [...flipped, card.id];
    setFlipped(next);
    if (next.length === 2) {
      setLock(true);
      const [a, b] = next.map((id) => deck.find((c) => c.id === id));
      setTimeout(() => {
        if (a.val === b.val) {
          setMatched((m) => [...m, a.id, b.id]);
        } else {
          setShake(next);
          setTimeout(() => setShake([]), 400);
        }
        setFlipped([]);
        setLock(false);
      }, 650);
    }
  };

  const pairsMatched = matched.length / 2;

  return (
    <>
      <h2 className="mt-2 italic text-xl sm:text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
        match the pairs
      </h2>

      <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-5 w-full max-w-xs sm:max-w-sm mx-auto" style={{ perspective: "600px" }}>
        {deck.map((card, i) => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);
          const isShaking = shake.includes(card.id);
          return (
            <div
              key={card.id}
              onClick={() => handleFlip(card)}
              className={`match-card ${isMatched ? "match-card-solved" : ""} ${isShaking ? "match-card-shake" : ""}`}
              style={{
                aspectRatio: "1 / 1",
                cursor: isMatched ? "default" : "pointer",
                animationDelay: isMatched || isShaking ? "0s" : `${i * 0.04}s`,
              }}
            >
              <div className={`match-card-inner ${isFlipped ? "is-flipped" : ""}`}>
                <div
                  className="match-card-face match-card-back"
                  style={{ background: `linear-gradient(135deg, ${COLORS.rust}, ${COLORS.rustSoft})` }}
                >
                  ✦
                </div>
                <div
                  className="match-card-face match-card-front"
                  style={{ background: COLORS.creamDeep }}
                >
                  {card.val}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3.5 text-sm" style={{ color: COLORS.brownSoft }}>
        {pairsMatched === PUZZLE_EMOJIS.length ? "all matched! 🎉" : `${pairsMatched} / ${PUZZLE_EMOJIS.length} pairs matched`}
      </div>

      {pairsMatched === PUZZLE_EMOJIS.length && (
        <Btn onClick={onDone} className="mt-4 match-continue-in">
          continue
        </Btn>
      )}

      <style>{`
        @keyframes matchCardDeal {
          from { opacity: 0; transform: translateY(14px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .match-card {
          animation: matchCardDeal 0.4s ease-out both;
          transition: opacity 0.35s ease, transform 0.25s ease;
        }
        .match-card-solved {
          opacity: 0.35;
          transform: scale(0.94);
        }

        @keyframes matchCardShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .match-card-shake .match-card-inner {
          animation: matchCardShake 0.35s ease-in-out;
        }

        .match-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
        }
        .match-card-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .match-card-face {
          position: absolute;
          inset: 0;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .match-card-back {
          transform: rotateY(0deg);
        }
        .match-card-front {
          transform: rotateY(180deg);
        }

        @keyframes matchContinueIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .match-continue-in {
          animation: matchContinueIn 0.35s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .match-card, .match-card-inner, .match-continue-in { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  );
}