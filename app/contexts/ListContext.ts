import { createContext, useCallback, useState } from 'react';
import _ from 'lodash';
import { useForm } from 'react-hook-form';

export const ListContext = createContext({} as ReturnType<typeof useListLogic>);

interface Track {
    uri: string;
    name: string;
    album: {
        images: { url: string }[];
    };
    artists: { name: string }[];
}

interface Album {
    uri: string;
    name: string;
    images: { url: string }[];
    artists: { name: string }[];
}

interface SearchResults {
    tracks: {
        items: Track[];
    };
    albums: {
        items: Album[];
    };
}

type SearchInput = {
    search: string;
};

interface TrackQueue {
    currently_playing: object;
    queue: Spotify.Track[];
}

export function useListLogic() {
    const [searchResults, setSearchResults] = useState({} as SearchResults);
    const [trackQueue, setTrackQueue] = useState({} as TrackQueue);
    const searchUrl = process.env.NEXT_PUBLIC_SPOTIFY_SEARCH_URL;
    const { register } = useForm<SearchInput>();

    const handleSearchItemClick = async (uri) => {
        const requestUrl = 'https://api.spotify.com/v1/me/player/play?';
        const params = new URLSearchParams({
            device_id: localStorage.getItem('spotify_device_id') ?? '',
        }).toString();

        await fetch(`${requestUrl}${params}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('spotify_access_token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                offset: { position: 0 },
                position_ms: 0,
                ...uri,
            }),
        }).then(() => getUserQueue());
    };

    const fetchSearchResults = _.debounce(async (url) => {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('spotify_access_token')}`,
            },
        });

        const data = await response.json();
        if (response.ok) {
            setSearchResults(data);
        }
    }, 500);

    const handleSearchItemChange = useCallback(
        (data) => {
            const value = data?.target?.value ?? '';
            if (value.length > 0) {
                const searchParams = new URLSearchParams({
                    q: value,
                    type: 'track,artist,album',
                    limit: '20',
                }).toString();

                fetchSearchResults(`${searchUrl}${searchParams}`);
            }
        },
        [fetchSearchResults, searchUrl]
    );

    const getUserQueue = async () => {
        const response = await fetch('https://api.spotify.com/v1/me/player/queue', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('spotify_access_token')}`,
            },
        });

        const data = await response.json();
        if (response.ok) {
            setTrackQueue(data);
        }
    };

    return {
        register,

        searchResults,
        setSearchResults,
        trackQueue,
        setTrackQueue,

        getUserQueue,
        handleSearchItemClick,
        handleSearchItemChange,
    };
}
