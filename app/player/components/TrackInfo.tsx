import { useContext } from "react";
import { PlayerContext } from "@/app/contexts/PlayerContext";
import { Outfit } from "next/font/google";

const metadataFont = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function TrackInfo() {
  const { currentTrack } = useContext(PlayerContext) || {};

  function getArtistName() {
    const artists = currentTrack?.artists ?? [];

    if (!currentTrack || !artists) {
      return "";
    }

    return artists.map((artist) => artist.name).join(", ");
  }
  return (
    <div className={`${metadataFont.className} w-3/5 select-none`}>
      <p className="text-start text-xl font-bold overflow-hidden text-nowrap ">
        {currentTrack?.name ?? "No track playing"}
      </p>
      <p className="text-start text-xs">
        {currentTrack?.album?.name ?? "No track playing"}
      </p>
      <p className="text-start text-xs">{getArtistName()}</p>
    </div>
  );
}
