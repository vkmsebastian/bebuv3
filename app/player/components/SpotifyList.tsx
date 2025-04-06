import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompactDisc,
  faListUl,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import useListLogic from "../hooks/useListLogic";
import _ from "lodash";
import Image from "next/image";

export default function SpotifyList() {
  const contextValue = useListLogic();
  const {
    searchResults,
    register,
    handleSearchItemClick,
    handleSearchItemChange,
  } = contextValue;
  const { tracks, albums } = searchResults;

  return (
    <div className="w-full p-1 flex flex-col">
      <div className="h-[10%] mb-1">
        <input
          type="text"
          placeholder="Search something..."
          className=" outline-1 -outline-offset-1 outline-gray-300 px-2 py-1 m-2 rounded-md"
          {...(register("search"), { onChange: handleSearchItemChange })}
        />
      </div>
      <div className="flex flex-row gap-2">
        <div className="w-[30%] self-start overflow-clip scrollbar-thin">
          <p className="ps-1">
            <FontAwesomeIcon icon={faListUl} />
            {` Queue`}
          </p>
        </div>
        <div className="relative w-[30%] max-h-1/2 transition-all delay-100 ease-in px-2 overflow-y-auto scrollbar-thin overflow-x-hidden hover:grow">
          <p className="pb-2">
            <FontAwesomeIcon icon={faMusic} />
            {` Tracks`}
          </p>
          {_.isEmpty(tracks?.items) ? (
            <p>Nothing here</p>
          ) : (
            tracks?.items.map((track) => {
              const albumArt = track?.album?.images[0]?.url;
              return (
                <button
                  key={track?.uri}
                  className={`w-full relative transition-all ease-in-out delay-500 duration-500 scrollbar-thin mb-2 flex flex-row gap-2 hover:h-[15%] group`}
                  onClick={() => handleSearchItemClick({ uris: [track?.uri] })}>
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
                  <div className="text-start">
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
        <div className="w-[30%] max-h-1/2 transition-all delay-100 ease-in px-2 overflow-y-auto scrollbar-thin overflow-x-hidden hover:grow">
          <p className="pb-2">
            <FontAwesomeIcon icon={faCompactDisc} />
            {` Albums`}
          </p>
          {_.isEmpty(albums?.items) ? (
            <p>Nothing here</p>
          ) : (
            albums?.items.map((album) => {
              return (
                <div
                  key={album?.uri}
                  className="mb-2 flex flex-row gap-2 hover:outline-1">
                  <Image
                    draggable={false}
                    src={album?.images[0]?.url}
                    alt="Album Art"
                    width={45}
                    height={45}
                    onClick={() =>
                      handleSearchItemClick({ context_uri: album?.uri })
                    }
                  />
                  <div>
                    <p className="select-none text-nowrap overflow-hidden">
                      {album?.name}
                    </p>
                    <p className="text-xs select-none">
                      {album?.artists.map((artist) => artist?.name).join(", ")}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
