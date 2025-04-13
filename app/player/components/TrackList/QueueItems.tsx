import { faListUl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrackItem from "./TrackItem";
import { useContext } from "react";
import { ListContext } from "@/contexts/ListContext";
import _ from "lodash";
export default function QueueItems() {
  const { trackQueue, handleSearchItemClick } = useContext(ListContext);
  return (
    <div className="max-w-full md:w-[30%] max-h-1/2 transition-all delay-100 ease-in px-2 overflow-y-auto scrollbar-thin overflow-x-hidden hover:md:w-[35%]">
      <p className="pb-2 sticky top-0 z-1 dark:bg-black bg-white text-xl">
        <FontAwesomeIcon icon={faListUl} />
        {` Queue`}
      </p>
      <div>
        <TrackItem
          track={trackQueue.currently_playing}
          handler={handleSearchItemClick}
        />
      </div>
      {!_.isEmpty(trackQueue.queue) &&
        trackQueue.queue.map((track, index) => (
          <TrackItem
            key={`${track.uri}-${index}`}
            track={track}
            handler={handleSearchItemClick}
          />
        ))}
    </div>
  );
}
