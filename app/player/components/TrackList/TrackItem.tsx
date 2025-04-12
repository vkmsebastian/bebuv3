import Image from "next/image";

export default function TrackItem({ track, handler }) {
  if (!track) return;
  
  const albumArt = track?.album?.images[0]?.url;
  return (
    <button
      key={track?.uri}
      className={`w-full relative transition-all ease-in-out delay-500 duration-500 scrollbar-thin mb-2 flex flex-row gap-2 hover:h-[25%] group`}
      onClick={() =>
        handler({
          uris: [track.uri],
        })
      }>
      <Image
        className="group-hover:hidden"
        draggable={false}
        src={albumArt}
        alt="Album Art"
        width={45}
        height={45}
      />
      <Image
        className="invisible group-hover:visible -z-1 object-cover"
        draggable={false}
        src={albumArt}
        alt="Album Art"
        fill={true}
      />
      <div className="text-start text-shadow-md text-shadow-zinc-950">
        <p className="select-none text-nowrap overflow-hidden">{track?.name}</p>
        <p className="text-xs select-none">
          {track?.artists.map((artist) => artist?.name).join(", ")}
        </p>
      </div>
    </button>
  );
}
