"use client";
import { Notyf, NotyfNotification } from "notyf";
import { createContext, useEffect, useRef, useState } from "react";
import { usePlayerLogic } from "./PlayerContext";
import { Oswald } from "next/font/google";

const notyfFont = Oswald({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const NotyfContext = createContext(
  {} as ReturnType<typeof useNotyfContextLogic>
);

export function useNotyfContextLogic() {
  const [notyf, setNotyf] = useState<Notyf | null>(null);
  const nowPlayingNotyfRef = useRef<NotyfNotification | null>(null);

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

  return {
    notyf,
    nowPlayingNotyfRef,
  };
}
