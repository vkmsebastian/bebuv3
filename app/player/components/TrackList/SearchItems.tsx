import QueueItems from "./QueueItems";
import TrackItems from "./TrackItems";
import AlbumItems from "./AlbumItems";
import { useContext } from "react";
import { ListContext } from "@/contexts/ListContext";
import _ from "lodash";

export default function SearchItems() {
  const { searchResults } = useContext(ListContext);
  return (
    <>
      {!_.isEmpty(searchResults) && (
        <div className="flex md:flex-row flex-col gap-1 justify-evenly">
          <QueueItems />
          <TrackItems />
          <AlbumItems />
        </div>
      )}
    </>
  );
}
