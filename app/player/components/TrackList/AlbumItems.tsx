import { ListContext } from "@/app/contexts/ListContext";
import { SystemContext } from "@/app/contexts/SystemContext";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import Image from "next/image";
export default function AlbumItems() {
  const { searchResults, handleSearchItemClick } = useContext(ListContext);
  const { isMobile } = useContext(SystemContext);
  const { albums } = searchResults;

  return (
    <>
      {!isMobile && (
        <div className="md:w-[30%] max-h-1/2 transition-all delay-100 ease-in px-2 overflow-y-auto scrollbar-thin overflow-x-hidden hover:md:w-[35%]">
          <p className="pb-2 sticky top-0 z-1 dark:bg-black bg-white">
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
      )}
    </>
  );
}
