import { useContext } from 'react';

import _ from 'lodash';

import { ListContext } from '@/app/contexts/ListContext';
import { SystemContext } from '@/app/contexts/SystemContext';
import { PlayerContext } from '@/app/contexts/PlayerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompactDisc, faListUl, faMusic } from '@fortawesome/free-solid-svg-icons';

import TrackItem from './TrackItem';
import AlbumItem from './AlbumItem';

export default function SpotifyList() {
    const { searchResults, register, trackQueue, handleSearchItemClick, handleSearchItemChange } =
        useContext(ListContext);
    const { isMobile } = useContext(SystemContext);
    const { playerReady } = useContext(PlayerContext);
    const { tracks, albums } = searchResults;
    console.log(trackQueue);
    return (
        <div className="w-full p-1 flex flex-col">
            <div className="h-[10%] mb-1">
                <input
                    type="text"
                    placeholder="Search songs"
                    className="transition-all outline-1 focus:outline-0 focus:bg-neutral-800 w-[15%] focus:w-[20%] outline-offset-1 outline-gray-300 px-2 py-1 m-2 rounded-md"
                    disabled={!playerReady}
                    {...(register('search'), { onChange: handleSearchItemChange })}
                />
            </div>
            <div className="flex md:flex-row flex-col gap-2">
                <div className="md:w-[30%] self-start overflow-clip scrollbar-thin">
                    <p className="ps-1">
                        <FontAwesomeIcon icon={faListUl} />
                        {` Queue`}
                    </p>
                    {/* <div>
                        <TrackItem
                            key={'now_playing'}
                            track={trackQueue.currently_playing}
                            handler={handleSearchItemClick}
                        />
                    </div> */}
                    {!_.isEmpty(trackQueue.queue) &&
                        trackQueue.queue.map((track, index) => (
                            <TrackItem key={`${track?.uri}-${index}`} track={track} handler={handleSearchItemClick} />
                        ))}
                </div>
                <div className="relative md:w-[30%] max-h-1/2 transition-all delay-100 ease-in px-2 overflow-y-auto scrollbar-thin overflow-x-hidden hover:grow">
                    <p className="pb-2 sticky top-0 z-1 dark:bg-black bg-white">
                        <FontAwesomeIcon icon={faMusic} />
                        {` Tracks`}
                    </p>
                    {_.isEmpty(tracks?.items) ? (
                        <p>Nothing here</p>
                    ) : (
                        tracks?.items.map((track, index) => (
                            <TrackItem key={`${track?.uri}-${index}`} track={track} handler={handleSearchItemClick} />
                        ))
                    )}
                </div>
                {!isMobile && (
                    <div className="md:w-[30%] max-h-1/2 transition-all delay-100 ease-in px-2 overflow-y-auto scrollbar-thin overflow-x-hidden hover:grow">
                        <p className="pb-2 sticky top-0 z-1 dark:bg-black bg-white">
                            <FontAwesomeIcon icon={faCompactDisc} />
                            {` Albums`}
                        </p>
                        {_.isEmpty(albums?.items) ? (
                            <p>Nothing here</p>
                        ) : (
                            albums?.items.map((album, index) => (
                                <AlbumItem
                                    key={`${album.uri}-${index}`}
                                    album={album}
                                    handler={handleSearchItemClick}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
