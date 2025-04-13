import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { ListContext } from "@/contexts/ListContext";
import Image from "next/image";
import _ from "lodash";
export default function TrackItems() {
  const { searchResults, handleSearchItemClick } = useContext(ListContext);
  const { tracks } = searchResults;
  return (
    <div className="max-w-full md:w-[30%] max-h-1/2 transition-all delay-100 ease-in px-2 overflow-y-auto scrollbar-thin overflow-x-hidden hover:md:w-[35%]">
      <p className="pb-2 sticky top-0 z-1 dark:bg-black bg-white text-xl">
        <FontAwesomeIcon icon={faMusic} />
        {` Tracks`}
      </p>
      {_.isEmpty(tracks?.items) ? (
        <p>Nothing here</p>
      ) : (
        tracks?.items.map((track, index) => {
          const albumArt = track?.album?.images[0]?.url;
          return (
            <button
              key={track?.uri}
              className={`w-full relative transition-all ease-in-out delay-500 duration-500 scrollbar-thin mb-2 flex flex-row gap-2 hover:h-[25%] group`}
              onClick={() =>
                handleSearchItemClick({
                  uris: _.slice(tracks.items, index).map((track) => track.uri),
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
              <div className="text-start text-shadow-md dark:text-shadow-zinc-950 text-shadow-amber-50">
                <p className="select-none text-nowrap overflow-hidden">
                  {track?.name}
                </p>
                <p className="text-xs select-none">
                  {track?.artists.map((artist) => artist?.name).join(", ")}
                </p>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
