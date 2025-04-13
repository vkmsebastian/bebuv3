"use client";
import { Notyf } from "notyf";
import { createContext, useEffect, useState } from "react";
import { usePlayerLogic } from "./PlayerContext";
import { Oswald } from "next/font/google";

const notyfFont = Oswald({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const NotyfContext = createContext<Notyf | null>(null);

export function useNotyfContextLogic() {
  const [notyf, setNotyf] = useState<Notyf | null>(null);

  const { playbackData, nowPlayingNotyfRef } = usePlayerLogic();

  useEffect(() => {
    const notyfInstance = new Notyf({
      duration: 2000,
      ripple: true,
      position: { x: "right", y: "bottom" },
      dismissible: false,
      types: [
        {
          type: "success",
          background: "#212121",
          className: `text-md ${notyfFont.className}`,
          icon: false,
        },
        {
          type: "error",
          background: "#F44336",
          icon: false,
        },
      ],
    });
    setNotyf(notyfInstance);
  }, []);
  useEffect(() => {
    if (!playbackData || !notyf || nowPlayingNotyfRef.current) {
      return;
    }
    const { track_window: trackInfo } = playbackData;
    const title = trackInfo?.current_track?.name;

    if (!title || playbackData?.paused) {
      return;
    }

    nowPlayingNotyfRef.current = notyf?.success(`Playing: ${title}`) ?? null;
    setTimeout(() => {
      if (nowPlayingNotyfRef.current) {
        nowPlayingNotyfRef.current = null;
      }
    }, 3000);
  }, [playbackData, notyf, nowPlayingNotyfRef]);

  return {
    notyf,
  };
}
