'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import usePlayerLogic from './hooks/usePlayerLogic';
import Image from 'next/image';
import { Outfit } from 'next/font/google';

const metadataFont = Outfit({
    subsets: ['latin'],
    display: 'swap',
    weight: '400',
});

export default function Player() {
    const { authorizeClient, getAccessToken, playerScript, defaultAlbumArt } = usePlayerLogic();
    const [playbackData, setPlaybackData] = useState({});
    const [currentTrack, setCurrentTrack] = useState({});
    const playerRef = useRef<Spotify.Player | null>(null);

    // Toggle play/pause (now works globally)
    const togglePlay = () => {
        if (!playerRef.current) {
            console.error('Player not initialized');
            return;
        }

        console.log('Toggling play');
        playerRef.current.togglePlay().catch((err) => {
            console.error('Playback error:', err);
        });
    };

    const refreshPlayer = () => {
        if (!playerRef.current) {
            console.error('Player not initialized');
            return;
        }

        playerRef.current.getCurrentState().then((state) => {
            console.log('Current state:', state);
        });
    };

    const getArtistName = () => {
        const artists = currentTrack?.artists ?? [];

        if (!currentTrack || !artists) {
            return '';
        }

        return artists.map((artist) => artist.name).join(', ');
    };

    useEffect(() => {
        // Set up the SDK callback
        globalThis.window.onSpotifyWebPlaybackSDKReady = () => {
            const token = getAccessToken();
            if (!token) {
                console.error('No access token. Authorize first.');
                return;
            }

            // Initialize player
            const player = new Spotify.Player({
                name: 'BebuV3 Player',
                getOAuthToken: (cb) => cb(token),
                volume: 0.5,
            });

            // Store player instance
            playerRef.current = player;

            // Event listeners
            const readyListener = player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            const notReadyListener = player.addListener('not_ready', ({ device_id }) => {
                console.log('Device offline', device_id);
            });

            const errorListener = player.addListener('initialization_error', ({ message }) => {
                console.error('Init error:', message);
            });

            const authErrorListener = player.addListener('authentication_error', ({ message }) => {
                console.error('Auth error:', message);
            });

            const accountErrorListener = player.addListener('account_error', ({ message }) => {
                console.error('Account error:', message);
            });

            const playerStateChange = player.addListener('player_state_changed', (data) => {
                setPlaybackData(data);
            });
            // Connect player
            player
                .connect()
                .then(() => {
                    console.log('Player connected');
                })
                .catch((err) => {
                    console.error('Connection failed:', err);
                });

            // Cleanup
            return () => {
                readyListener.remove();
                notReadyListener.remove();
                errorListener.remove();
                authErrorListener.remove();
                accountErrorListener.remove();
                playerStateChange.remove();
                player.disconnect();
                playerRef.current = null;
            };
        };

        // Clean up the global callback
        return () => {
            globalThis.window.onSpotifyWebPlaybackSDKReady = undefined;
        };
    }, [getAccessToken]);

    useEffect(() => {
        const { track_window: trackInfo } = playbackData ?? {};

        if (!trackInfo) {
            return;
        }
        const { current_track: currentTrack } = trackInfo;

        if (!currentTrack) {
            return;
        }

        setCurrentTrack(currentTrack);
    }, [playbackData]);

    return (
        <div className="grid h-[600px]">
            <div className="relative flex flex-col items-center md:w-[450px] md:h-[600px] w-full h-full md:place-self-start place-self-center overflow-hidden">
                <Image
                    src="/images/player_bg.png"
                    alt="player background"
                    className="absolute inset-0 -z-10 object-contain"
                    fill
                />
                <div className="relative p-4 h-[250px] w-[250px] mt-[90px] border dark:border-black border-white border-1">
                    <Image
                        src={currentTrack?.album?.images?.[0]?.url ?? defaultAlbumArt}
                        className="absolute object-fill"
                        alt="album art"
                        fill
                    />
                </div>
                <div className="grid h-[50px] w-3/5 items-center justify-center">
                    <p>{'(progress bar)'}</p>
                </div>
                <div
                    className={`${metadataFont.className} w-3/5 text-shadow-md text-shadow-amber-50 dark:text-shadow-black`}
                >
                    <p className="text-start text-xl font-bold overflow-ellipsis text-nowrap ">
                        {currentTrack?.name ?? 'No track playing'}
                    </p>
                    <p className="text-start text-xs">{currentTrack?.album?.name ?? 'No track playing'}</p>
                    <p className="text-start text-xs">{getArtistName()}</p>
                </div>
                <div className="flex flex-row gap-3 mt-[20px]">
                    <button onClick={togglePlay}>Play/Pause</button>
                    <button onClick={refreshPlayer}>Refresh</button>
                    <button onClick={authorizeClient}>Authorize</button>
                </div>
            </div>
            <Script src={playerScript} strategy="afterInteractive" />
        </div>
    );
}
