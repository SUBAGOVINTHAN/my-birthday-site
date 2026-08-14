import { useEffect, useState } from "react";
import { nextBirthday } from "../constants";

export function useCountdown() {
  const [target] = useState(nextBirthday);
  const [diff, setDiff] = useState(target - new Date());

  useEffect(() => {
    const id = setInterval(() => setDiff(target - new Date()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (diff <= 0) return null;
  return {
    d: String(Math.floor(diff / 86400000)).padStart(2, "0"),
    h: String(Math.floor(diff / 3600000) % 24).padStart(2, "0"),
    m: String(Math.floor(diff / 60000) % 60).padStart(2, "0"),
    s: String(Math.floor(diff / 1000) % 60).padStart(2, "0"),
  };
}