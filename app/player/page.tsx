"use client";
import Script from "next/script";

import SpotifyPlayer from "./components/TrackPlayer/SpotifyPlayer";
import SpotifyList from "./components/TrackList/SpotifyList";
import { useContext } from "react";
import { SystemContext } from "../../contexts/SystemContext";
import { PlayerContext } from "../../contexts/PlayerContext";

export default function Player() {
  const { playerScript } = useContext(PlayerContext);
  const { isMobile } = useContext(SystemContext);

  return (
    <>
      <div className="flex flex-row">
        <SpotifyPlayer />
        {!isMobile && <SpotifyList />}
      </div>
      <Script src={playerScript} strategy="afterInteractive" />
    </>
  );
}
