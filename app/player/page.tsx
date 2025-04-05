"use client";
import Image from "next/image";
import Script from "next/script";
import usePlayerLogic, {
  PlayerContext,
  PlayerLogicContextType,
} from "./hooks/usePlayerLogic";
import PlayerControls from "./components/PlayerControls";
import ProgressBar from "./components/ProgressBar";
import TrackInfo from "./components/TrackInfo";
import AlbumArt from "./components/AlbumArt";

export default function Player() {
  const contextValue: PlayerLogicContextType = usePlayerLogic();

  const { playerScript } = contextValue;

  return (
    <PlayerContext.Provider value={contextValue}>
      <div className="grid h-[600px] text-shadow-md text-shadow-amber-50 dark:text-shadow-black">
        <div className="relative flex flex-col items-center md:w-[450px] md:h-[600px] w-full h-full md:place-self-start place-self-center overflow-hidden">
          <Image
            src="/images/player_bg.png"
            alt="player background"
            className="absolute inset-0 -z-10 object-contain"
            fill
          />
          <AlbumArt />
          <ProgressBar />
          <TrackInfo />
          <PlayerControls />
        </div>
      </div>
      <Script src={playerScript} strategy="afterInteractive" />
    </PlayerContext.Provider>
  );
}
