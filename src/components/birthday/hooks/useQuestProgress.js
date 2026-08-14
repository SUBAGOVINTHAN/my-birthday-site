import { useCallback, useSyncExternalStore } from "react";
import { ORDER } from "../constants";

const STORAGE_KEY = "birthday-quest-progress";

// Tiny external store so every component reading progress re-renders
// when it changes, even across components (not just the one that set it).
let listeners = new Set();

function readStoredIndex() {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const idx = raw === null ? 0 : parseInt(raw, 10);
  if (Number.isNaN(idx) || idx < 0) return 0;
  return Math.min(idx, ORDER.length - 1);
}

function writeStoredIndex(idx) {
  window.localStorage.setItem(STORAGE_KEY, String(idx));
  listeners.forEach((l) => l());
}

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Returns:
 *  - unlockedIdx: furthest step index the visitor has reached
 *  - isUnlocked(id): whether a given step id is reachable
 *  - unlock(id): mark a step as reached (call this when a step completes)
 *  - reset(): clear progress (handy for testing / a "restart" link)
 */
export function useQuestProgress() {
  const unlockedIdx = useSyncExternalStore(subscribe, readStoredIndex, () => 0);

  const isUnlocked = useCallback(
    (id) => ORDER.indexOf(id) <= unlockedIdx,
    [unlockedIdx]
  );

  const unlock = useCallback((id) => {
    const idx = ORDER.indexOf(id);
    if (idx < 0) return;
    const current = readStoredIndex();
    if (idx > current) writeStoredIndex(idx);
  }, []);

  const reset = useCallback(() => writeStoredIndex(0), []);

  return { unlockedIdx, isUnlocked, unlock, reset };
}