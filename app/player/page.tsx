"use client";
import Script from "next/script";
import { PlayerContext } from "@/app/contexts/PlayerContext";

import usePlayerLogic from "./hooks/usePlayerLogic";
import SpotifyPlayer from "./components/SpotifyPlayer";
import SpotifyList from "./components/SpotifyList";
import { useContext } from "react";
import { SystemContext } from "../contexts/SystemContext";

export default function Player() {
  const contextValue = usePlayerLogic();
  const { playerScript } = contextValue;
  const { isMobile } = useContext(SystemContext);

  return (
    <PlayerContext.Provider value={contextValue}>
      <div className="flex flex-row">
        <SpotifyPlayer />
        {!isMobile && <SpotifyList />}
      </div>
      <Script src={playerScript} strategy="afterInteractive" />
    </PlayerContext.Provider>
  );
}
