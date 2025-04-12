import { useContext } from "react";
import { ListContext } from "@/app/contexts/ListContext";
import { PlayerContext } from "@/app/contexts/PlayerContext";
import SearchBox from "./SearchBox";
import SearchItems from "./SearchItems";

export default function SpotifyList() {
  const contextValue = useContext(ListContext);
  const { playerReady } = useContext(PlayerContext);

  return (
    <ListContext.Provider value={contextValue}>
      {playerReady && (
        <div className="w-full p-1 flex flex-col">
          <SearchBox />
          <SearchItems />
        </div>
      )}
    </ListContext.Provider>
  );
}
