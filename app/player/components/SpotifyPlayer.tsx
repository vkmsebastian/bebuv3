import PlayerControls from "./PlayerControls";
import ProgressBar from "./ProgressBar";
import TrackInfo from "./TrackInfo";
import AlbumArt from "./AlbumArt";
import Image from "next/image";

export default function SpotifyPlayer() {
  return (
    <div className="md:w-[450px] md:h-[600px] w-full h-[600px] grid text-shadow-md text-shadow-amber-50 dark:text-shadow-black">
      <div className=" relative flex flex-col items-center md:w-[450px] md:h-[600px] w-full h-full md:place-self-start place-self-center overflow-hidden">
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
  );
}
