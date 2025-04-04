import { useContext } from "react";
import { PlayerContext } from "../page";
import Image from "next/image";

export default function AlbumArt() {
  const { currentTrack, defaultAlbumArt } = useContext(PlayerContext);
  return (
    <div className="relative p-4 h-[250px] w-[250px] mt-[90px] dark:border border-black">
      <Image
        src={currentTrack?.album?.images?.[0]?.url ?? defaultAlbumArt}
        className="absolute object-fill select-none"
        alt="album art"
        draggable="false"
        fill
      />
    </div>
  );
}
