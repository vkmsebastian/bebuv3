"use client";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { ListContext } from "./ListContext";
import { NotyfContext } from "./NotyfContext";

export const PlayerContext = createContext(
  {} as ReturnType<typeof usePlayerLogic>
);

export function usePlayerLogic() {
  const router = useRouter();
  const authorizeUrl = process.env.NEXT_PUBLIC_SPOTIFY_AUTHORIZE_URL ?? "";
  const tokenUrl = process.env.NEXT_PUBLIC_SPOTIFY_TOKEN_URL ?? "";
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ?? "";
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? "";
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET ?? "";
  const playerScript = process.env.NEXT_PUBLIC_SPOTIFY_PLAYER_SCRIPT ?? "";
  const playerName = process.env.NEXT_PUBLIC_SPOTIFY_PLAYER_NAME ?? "Bebu V3";
  const defaultAlbumArt = process.env.NEXT_PUBLIC_PLAYER_DEFAULT_ART ?? "";

  const [playbackData, setPlaybackData] = useState({} as Spotify.PlaybackState);

  const [currentTrack, setCurrentTrack] = useState({} as Spotify.Track);
  const [currentTrackTime, setCurrentTrackTime] = useState(0);
  const [currentTrackDuration, setCurrentTrackDuration] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<Spotify.Player | null>(null);
  const currentPosition = useRef(0);

  const { getUserQueue } = useContext(ListContext);
  const { notyf, nowPlayingNotyfRef } = useContext(NotyfContext);

  function generateRandomString(length: number) {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  useEffect(() => {
    if (!getUserQueue) {
      return;
    }
    getUserQueue();
  }, [playbackData]);

  //Now Playing Notyf
  useEffect(() => {
    if (!playbackData || !notyf || nowPlayingNotyfRef.current) {
      return;
    }
    const { track_window: trackInfo } = playbackData;
    const title = trackInfo?.current_track?.name;

    if (!title || playbackData?.paused) {
      return;
    }

    nowPlayingNotyfRef.current = notyf?.success(`Playing: ${title}`) ?? null;
    setTimeout(() => {
      if (nowPlayingNotyfRef.current) {
        nowPlayingNotyfRef.current = null;
      }
    }, 3000);
  }, [playbackData, notyf, nowPlayingNotyfRef]);

  async function authorize() {
    const scope =
      "streaming user-read-email user-read-private user-read-currently-playing user-read-playback-state";
    const state = generateRandomString(16);
    localStorage.setItem("spotify_auth_state", state);

    const requestParams = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
    });

    window.location.href = `${authorizeUrl}${requestParams.toString()}`;
  }

  async function authorizeClient() {
    authorize();
  }

  //Redirect Hook
  useEffect(() => {
    const urlParams = new URL(window.location.href).searchParams;
    async function authenticate() {
      const currentUrl = window.location.href;
      const urlParams = new URL(currentUrl).searchParams;
      const code = urlParams.get("code") ?? "";
      const state = urlParams.get("state") ?? "";

      if (state === localStorage.getItem("spotify_auth_state")) {
        try {
          const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization:
                "Basic " +
                Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
            },
            body: new URLSearchParams({
              code: code,
              redirect_uri: redirectUri,
              grant_type: "authorization_code",
            }).toString(),
          });

          const data = await response.json();
          if (!data?.token_type) return;

          console.log("Authorization successful", data);
          localStorage.setItem("spotify_access_token", data.access_token);
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
          const expiresIn = data.expires_in * 1000;

          refreshIntervalRef.current = setInterval(
            refreshAccessToken,
            expiresIn
          );
          router.push("/player");
        } catch (error) {
          console.log("Authentication failed", error);
        }
      } else {
        console.log("State mismatch");
      }
    }

    async function refreshAccessToken() {
      const refreshToken = localStorage.getItem("spotify_refresh_token");
      if (!refreshToken) {
        console.error("No refresh token available");
        return;
      }
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }).toString(),
      });

      const data = await response.json();

      if (data.access_token) {
        console.log("Access token refreshed:", data.access_token);
        localStorage.setItem("spotify_access_token", data.access_token);
      } else {
        console.error("Failed to refresh access token:", data);
      }
    }
    if (urlParams.has("code")) {
      authenticate();
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [
    tokenUrl,
    redirectUri,
    clientId,
    clientSecret,
    router,
    playerName,
    playerScript,
    defaultAlbumArt,
    authorizeUrl,
  ]);

  //General Player Init
  useEffect(() => {
    function getAccessToken() {
      return localStorage.getItem("spotify_access_token");
    }

    // Set up the SDK callback
    globalThis.window.onSpotifyWebPlaybackSDKReady = () => {
      if (!globalThis.Spotify) {
        console.error("Spotify SDK not loaded");
        return;
      }

      const token = getAccessToken();
      if (!token) {
        console.error("No access token. Authorize first.");
        return;
      }

      // Initialize player
      const player = new Spotify.Player({
        name: playerName,
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

      // Store player instance
      playerRef.current = player;

      // Event listeners
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        localStorage.setItem("spotify_device_id", device_id);
        notyf?.success("Player ready!");
        setPlayerReady(true);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device offline", device_id);
        setPlayerReady(false);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error("Init error:", message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error("Auth error:", message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error("Account error:", message);
      });

      player.addListener("player_state_changed", (data) => {
        setPlaybackData(data);
      });

      // Connect player
      player
        .connect()
        .then(() => {
          console.log("Player connected");
          notyf?.success("Player connected");
        })
        .catch((err) => {
          console.error("Connection failed:", err);
        });

      // Cleanup
      return () => {
        player.removeListener("ready");
        player.removeListener("not_ready");
        player.removeListener("initialization_error");
        player.removeListener("authentication_error");
        player.removeListener("account_error");
        player.removeListener("player_state_changed");
        player.disconnect();
        playerRef.current = null;
      };
    };

    // Clean up the global callback
    return () => {
      globalThis.window.onSpotifyWebPlaybackSDKReady = () => {};
    };
  }, [playerName, playerScript, defaultAlbumArt, playerRef, notyf]);

  //Progress Bar Context
  useEffect(() => {
    const {
      duration: durationMs,
      position: positionMs,
      track_window: trackInfo,
    } = playbackData ?? {};

    if (!trackInfo || !playerRef?.current) {
      return;
    }
    const { current_track: track } = trackInfo;

    currentPosition.current = positionMs;
    setCurrentTrack(track);
    setCurrentTrackDuration(durationMs);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (playbackData?.paused) {
        return;
      }
      currentPosition.current += 1000;

      setProgressPercent(
        (currentPosition.current / currentTrackDuration) * 100
      );
    }, 1000);

    return () => {
      if (intervalRef?.current) {
        clearInterval(intervalRef?.current);
        intervalRef.current = null;
      }
    };
  }, [
    playbackData,
    currentTrackDuration,
    currentTrackTime,
    intervalRef,
    playerRef,
    currentTrack,
    setCurrentTrack,
    setCurrentTrackTime,
    setCurrentTrackDuration,
    setProgressPercent,
  ]);

  return {
    authorizeClient,

    playerName,
    playerScript,
    defaultAlbumArt,

    playbackData,
    setPlaybackData,
    currentTrack,
    setCurrentTrack,
    currentTrackTime,
    setCurrentTrackTime,
    currentTrackDuration,
    setCurrentTrackDuration,
    progressPercent,
    setProgressPercent,
    playerReady,
    setPlayerReady,
    authorizeUrl,
    tokenUrl,
    redirectUri,
    clientId,
    clientSecret,
    playerRef,
    intervalRef,
    currentPosition,
  };
}
