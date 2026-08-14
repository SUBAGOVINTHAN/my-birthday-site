import { createContext, useContext, useRef, useState } from "react";

const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startAudio = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.volume = 0.6;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <AudioCtx.Provider value={{ startAudio, stopAudio, isPlaying }}>
      <audio ref={audioRef} src="/audio/Mube-Vaa-BGM.m4a" loop preload="auto" />
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}