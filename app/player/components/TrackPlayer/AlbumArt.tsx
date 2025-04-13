import { useContext } from "react";
import Image from "next/image";
import { PlayerContext } from "@/contexts/PlayerContext";

export default function AlbumArt() {
  const { currentTrack, defaultAlbumArt } = useContext(PlayerContext) || {};

  return (
    <div className="relative p-4 h-[43%] w-[58%] mt-[90px] dark:border border-black">
      <Image
        src={currentTrack?.album?.images?.[0]?.url ?? defaultAlbumArt ?? ""}
        className="absolute object-fill select-none"
        alt="album art"
        draggable="false"
        fill
      />
    </div>
  );
}
