import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants";
import { useQuestProgress } from "../hooks/useQuestProgress";
import Tag from "../shared/Tag";
import BackButton from "../shared/BackButton";
import PuzzleBackdrop from "../shared/PuzzleBackdrop";
import MatchPairsGame from "../screens/MatchPairsScreen";
import PhotoPuzzleGame from "./PhotoPuzzleGame";

export default function PuzzleScreen() {
  const navigate = useNavigate();
  const { unlock } = useQuestProgress();
  const [mode, setMode] = useState(null); // null | "match" | "photo"

  const onDone = () => {
    unlock("scratch");
    navigate("/quest/scratch");
  };

  const goBack = () => {
    if (mode) setMode(null);
    else navigate(-1);
  };

  return (
    <div className="relative">
      <PuzzleBackdrop />
      <BackButton onClick={goBack} />

      {!mode && (
        <div key="choice" className="puzzle-fade-in">
          <Tag>one more surprise</Tag>
          <h2
            className="mt-2 italic text-xl sm:text-2xl"
            style={{ fontFamily: "'Playfair Display', serif", color: COLORS.brown }}
          >
            pick your puzzle
          </h2>

          <div className="mt-8 w-full max-w-xs mx-auto flex flex-col gap-4">
            <button
              onClick={() => setMode("match")}
              className="puzzle-choice-btn rounded-2xl py-6 px-5 text-left"
              style={{
                background: `linear-gradient(135deg, ${COLORS.rust}, ${COLORS.rustSoft})`,
                color: "#fff",
                animationDelay: "0.05s",
              }}
            >
              <div className="text-lg font-semibold">match the pairs</div>
              <div className="text-xs mt-1 opacity-85">flip cards, find matching pairs</div>
            </button>

            <button
              onClick={() => setMode("photo")}
              className="puzzle-choice-btn rounded-2xl py-6 px-5 text-left"
              style={{
                background: `linear-gradient(135deg, ${COLORS.brown}, ${COLORS.rust})`,
                color: "#fff",
                animationDelay: "0.2s",
              }}
            >
              <div className="text-lg font-semibold">photo puzzle</div>
              <div className="text-xs mt-1 opacity-85">unscramble a special photo</div>
            </button>
          </div>
        </div>
      )}

      {mode === "match" && (
        <div key="match" className="puzzle-fade-in">
          <MatchPairsGame onDone={onDone} />
        </div>
      )}
      {mode === "photo" && (
        <div key="photo" className="puzzle-fade-in">
          <PhotoPuzzleGame onDone={onDone} />
        </div>
      )}

      <style>{`
        @keyframes puzzleFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .puzzle-fade-in {
          animation: puzzleFadeIn 0.4s ease-out both;
        }

        @keyframes puzzleChoiceIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .puzzle-choice-btn {
          border: none;
          cursor: pointer;
          animation: puzzleChoiceIn 0.45s ease-out both;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .puzzle-choice-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 22px rgba(94,70,50,0.25);
        }
        .puzzle-choice-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        @media (prefers-reduced-motion: reduce) {
          .puzzle-fade-in, .puzzle-choice-btn { animation: none !important; }
        }
      `}</style>
    </div>
  );
}