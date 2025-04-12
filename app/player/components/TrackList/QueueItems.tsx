import { faListUl } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrackItem from "./TrackItem";
import { useContext } from "react";
import { ListContext } from "@/app/contexts/ListContext";
import _ from "lodash";
export default function QueueItems() {
  const { trackQueue, handleSearchItemClick } = useContext(ListContext);
  return (
    <div className="transition-all md:w-[30%] self-start overflow-clip scrollbar-thin hover:md:w-[35%]">
      <p className="ps-1">
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
