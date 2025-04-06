import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
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
      <div className="h-full flex flex-row gap-2 border">
        <div className="w-[30%] self-start overflow-clip border">
          <p className="ps-1">
            <FontAwesomeIcon icon={faListUl} />
            {` Queue`}
          </p>
        </div>
        <div className="w-[30%] border self-start transition-all delay-100 ease-in px-2 overflow-clip hover:grow">
          <p className="pb-2">Tracks</p>
          {_.isEmpty(tracks?.items) ? (
            <p>Nothing here</p>
          ) : (
            tracks?.items.map((track) => {
              return (
                <div
                  key={track?.uri}
                  className="mb-2 flex flex-row gap-2 hover:outline-1">
                  <Image
                    draggable={false}
                    src={track?.album?.images[0]?.url}
                    alt="Album Art"
                    width={45}
                    height={45}
                    onClick={() =>
                      handleSearchItemClick({ uris: [track?.uri] })
                    }
                  />
                  <div>
                    <p className="select-none text-nowrap overflow-hidden">
                      {track?.name}
                    </p>
                    <p className="text-xs select-none">
                      {track?.artists.map((artist) => artist?.name).join(", ")}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="w-[30%] border self-center transition-all delay-100 ease-in px-2 overflow-clip hover:grow">
          <p className="pb-2">Albums</p>
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
