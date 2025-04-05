import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
import useListLogic from "../hooks/useListLogic";
import _ from "lodash";
import Image from "next/image";

export default function SpotifyList() {
  const contextValue = useListLogic();
  const { searchResults, setSearchInput, handleSearchItemClick } = contextValue;
  const { tracks } = searchResults;
  return (
    <div className="border w-full p-1 flex flex-col">
      <div className="border h-[10%] mb-1">
        <input
          type="text"
          name="search"
          placeholder="Search something..."
          className=" outline-1 -outline-offset-1 outline-gray-300 px-2 py-1 m-2 rounded-md"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>
      <div className="border h-full flex flex-row gap-2">
        <div className="border grow p-2">
          <FontAwesomeIcon icon={faListUl} />
          <p className="ps-1">Your Library</p>
        </div>
        <div className=" grow-2 p-2 bg-neutral-800 rounded-lg">
          {_.isEmpty(tracks?.items) ? (
            <p>Nothing here</p>
          ) : (
            tracks?.items.map((track) => {
              return (
                <div key={track?.uri} className="pb-2 flex flex-row gap-2">
                  <Image
                    draggable={false}
                    src={track?.album?.images[0]?.url}
                    alt="Album Art"
                    width={50}
                    height={50}
                    onClick={() => handleSearchItemClick(track?.uri)}
                  />
                  <div>
                    <p className="select-none">{track?.name}</p>
                    <p className="text-xs select-none">
                      {track?.artists.map((artist) => artist?.name).join(", ")}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="border grow p-2">
          <FontAwesomeIcon icon={faListUl} />
          <p className="ps-1">Your Library</p>
        </div>
      </div>
    </div>
  );
}
