"use client";
import Script from "next/script";
import { PlayerContext } from "@/app/contexts/PlayerContext";

import usePlayerLogic from "./hooks/usePlayerLogic";
import SpotifyPlayer from "./components/SpotifyPlayer";

export default function Player() {
  const contextValue = usePlayerLogic();
  const { playerScript } = contextValue;

  return (
    <PlayerContext.Provider value={contextValue}>
      <SpotifyPlayer />
      <Script src={playerScript} strategy="afterInteractive" />
    </PlayerContext.Provider>
  );
}
