import { useState } from "react";
import { COLORS, PUZZLE_REVEAL_MESSAGE } from "../constants";
import Btn from "../shared/Btn";
import puzzlePhoto from "../../../assets/decor/puzzle-photo.jpg";

const GRID = 3;
const TOTAL = GRID * GRID;

function shuffledOrder() {
  let order;
  do {
    order = Array.from({ length: TOTAL }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
  } while (order.every((v, i) => v === i));
  return order;
}

export default function PhotoPuzzleGame({ onDone }) {
  const [started, setStarted] = useState(false);
  const [order, setOrder] = useState(shuffledOrder);
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [justSwapped, setJustSwapped] = useState([]);

  const tileStyle = (pieceIndex) => {
    const row = Math.floor(pieceIndex / GRID);
    const col = pieceIndex % GRID;
    return {
      backgroundImage: `url(${puzzlePhoto})`,
      backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
      backgroundPosition: `${(col * 100) / (GRID - 1)}% ${(row * 100) / (GRID - 1)}%`,
    };
  };

  const tapTile = (slotIndex) => {
    if (solved) return;
    if (selected === null) {
      setSelected(slotIndex);
      return;
    }
    if (selected === slotIndex) {
      setSelected(null);
      return;
    }
    const next = [...order];
    [next[selected], next[slotIndex]] = [next[slotIndex], next[selected]];
    setOrder(next);
    setJustSwapped([selected, slotIndex]);
    setTimeout(() => setJustSwapped([]), 350);
    setSelected(null);

    if (next.every((v, i) => v === i)) {
      setTimeout(() => setSolved(true), 400);
    }
  };

  return (
    <>
      <h2
        className="mt-2 italic text-xl sm:text-2xl text-center px-2"
        style={{ fontFamily: "'Playfair Display', serif", color: COLORS.brown }}
      >
        {solved ? "you solved it" : started ? "swap the tiles back" : "memorize the photo"}
      </h2>

      {!started && (
        <div className="photo-fade-in">
          <div
            className="mt-5 w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden mx-auto"
            style={{ boxShadow: "0 12px 30px rgba(94,70,50,0.25)" }}
          >
            <img src={puzzlePhoto} alt="original" className="w-full h-full object-cover" />
          </div>
          <p className="mt-3 text-xs text-center" style={{ color: COLORS.brownSoft }}>
            take a good look — you'll need to rebuild this
          </p>
          <div className="flex justify-center">
            <Btn onClick={() => setStarted(true)} className="mt-5">
              start
            </Btn>
          </div>
        </div>
      )}

      {started && !solved && (
        <div className="photo-fade-in">
          <div className="mt-4 flex flex-col items-center">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden"
              style={{
                boxShadow: "0 6px 14px rgba(94,70,50,0.3)",
                border: `2px solid ${COLORS.gold}`,
              }}
            >
              <img src={puzzlePhoto} alt="reference" className="w-full h-full object-cover" />
            </div>
            <div className="mt-1 text-[0.65rem] tracking-wide uppercase" style={{ color: COLORS.brownSoft }}>
              match this
            </div>
          </div>

          <div
            className="mt-4 grid gap-1 rounded-2xl overflow-hidden mx-auto"
            style={{
              gridTemplateColumns: `repeat(${GRID}, 1fr)`,
              width: "18rem",
              height: "18rem",
              boxShadow: "0 12px 30px rgba(94,70,50,0.25)",
            }}
          >
            {order.map((pieceIndex, slotIndex) => (
              <button
                key={slotIndex}
                type="button"
                onClick={() => tapTile(slotIndex)}
                className={justSwapped.includes(slotIndex) ? "photo-tile-swap" : ""}
                style={{
                  ...tileStyle(pieceIndex),
                  outline: selected === slotIndex ? `3px solid ${COLORS.gold}` : "none",
                  outlineOffset: "-3px",
                  border: "none",
                  cursor: "pointer",
                  transition: "outline 0.15s ease",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {solved && (
        <div className="photo-solved-in">
          <div
            className="mt-5 w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden mx-auto"
            style={{ boxShadow: "0 12px 30px rgba(94,70,50,0.25)" }}
          >
            <img src={puzzlePhoto} alt="solved" className="w-full h-full object-cover" />
          </div>
          <div
            className="mt-5 max-w-xs text-center text-xl italic px-4 mx-auto"
            style={{ fontFamily: "'Alex Brush', cursive", color: COLORS.rust }}
          >
            "{PUZZLE_REVEAL_MESSAGE}"
          </div>
          <div className="flex justify-center">
            <Btn onClick={onDone} className="mt-5">
              continue
            </Btn>
          </div>
        </div>
      )}

      <style>{`
        @keyframes photoFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .photo-fade-in {
          animation: photoFadeIn 0.4s ease-out both;
        }

        @keyframes photoTileSwap {
          0%   { transform: scale(1); filter: brightness(1); }
          40%  { transform: scale(1.08); filter: brightness(1.25); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        .photo-tile-swap {
          animation: photoTileSwap 0.35s ease-out;
        }

        @keyframes photoSolvedIn {
          0%   { opacity: 0; transform: scale(0.92); }
          60%  { opacity: 1; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
        .photo-solved-in {
          animation: photoSolvedIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .photo-fade-in, .photo-tile-swap, .photo-solved-in { animation: none !important; }
        }
      `}</style>
    </>
  );
}