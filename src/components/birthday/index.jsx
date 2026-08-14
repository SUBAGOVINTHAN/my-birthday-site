import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { COLORS, ORDER } from "./constants";
import { useQuestProgress } from "./hooks/useQuestProgress";
import { AudioProvider } from "./context/AudioContext";
import GlobalStyle from "./GlobalStyle";
import ConfettiLayer from "./shared/ConfettiLayer";
import ProgressDots from "./shared/ProgressDots";
import RouteGuard from "./shared/RouteGuard";

import WelcomeScreen from "./screens/WelcomeScreen";
import GiftScreen from "./screens/GiftScreen";
import PasswordScreen from "./screens/PasswordScreen";
import MessageScreen from "./screens/MessageScreen";
import GameScreen from "./screens/GameScreen";
import CakeScreen from "./screens/CakeScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import BalloonsScreen from "./screens/BalloonsScreen";
import PuzzleScreen from "./screens/PuzzleScreen";
import ScratchScreen from "./screens/ScratchScreen";
import LetterScreen from "./screens/LetterScreen";

const SCREENS = {
  gift: GiftScreen,
  password: PasswordScreen,
  message: MessageScreen,
  game: GameScreen,
  cake: CakeScreen,
  categories: CategoriesScreen,
  balloons: BalloonsScreen,
  puzzle: PuzzleScreen,
  scratch: ScratchScreen,
  letter: LetterScreen,
};

function QuestStep() {
  const { step } = useParams();
  const Component = SCREENS[step];
  if (!Component) return <Navigate to={`/quest/${ORDER[0]}`} replace />;

  return (
    <RouteGuard>
      <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
        <Component />
      </div>
    </RouteGuard>
  );
}

export default function BirthdayQuest() {
  const location = useLocation();
  const { unlockedIdx } = useQuestProgress();
  const currentStep = location.pathname.split("/").pop();
  const activeIdx = Math.max(ORDER.indexOf(currentStep), 0);

  return (
    <AudioProvider>
      <div
        className="fixed inset-0 w-full h-full overflow-hidden font-sans"
        style={{
          background: `linear-gradient(180deg, ${COLORS.cream} 0%, ${COLORS.creamDeep} 100%)`,
          color: COLORS.brown,
        }}
      >
        <GlobalStyle />
        <ConfettiLayer />
        <ProgressDots activeIdx={Math.max(activeIdx, unlockedIdx)} total={ORDER.length} />

        <div className="relative w-full h-full overflow-y-auto flex items-center justify-center">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/quest/:step" element={<QuestStep />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </AudioProvider>
  );
}