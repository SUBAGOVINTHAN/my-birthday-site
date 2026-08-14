import { Navigate, useParams } from "react-router-dom";
import { ORDER } from "../constants";
import { useQuestProgress } from "../hooks/useQuestProgress";

/**
 * Wraps the <Routes> for /quest/:step. If someone types or bookmarks a
 * URL for a step they haven't reached yet, this bounces them back to
 * the furthest step they've actually unlocked instead of letting them
 * skip ahead.
 */
export default function RouteGuard({ children }) {
  const { step } = useParams();
  const { isUnlocked, unlockedIdx } = useQuestProgress();

  if (!ORDER.includes(step)) {
    return <Navigate to={`/quest/${ORDER[0]}`} replace />;
  }

  if (!isUnlocked(step)) {
    return <Navigate to={`/quest/${ORDER[unlockedIdx]}`} replace />;
  }

  return children;
}