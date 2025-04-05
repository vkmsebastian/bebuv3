import { useContext, useEffect } from "react";
import { PlayerContext } from "@/app/contexts/PlayerContext";
import { NotyfContext } from "@/app/contexts/NotyfContext";
import _ from "lodash";

export default function ProgressBar() {
  const {
    nowPlayingNotyfRef,
    intervalRef,
    playerRef,
    playbackData,
    currentTrackDuration,
    setCurrentTrackDuration,
    currentTrackTime,
    setCurrentTrackTime,
    progressPercent,
    setProgressPercent,
    currentTrack,
    setCurrentTrack,
  } = useContext(PlayerContext) ?? {};

  const notyf = useContext(NotyfContext);

  function toMmSs(milliseconds: number) {
    if (!milliseconds || milliseconds === 0) return "0:00";
    const minutes = Math.floor(milliseconds / 59999);
    const seconds = ((milliseconds % 59999) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  }

  const progressStyle = {
    width: `${progressPercent}%`,
  };

  // This effect is used to show a notification when the track changes
  useEffect(() => {
    if (!playbackData || !notyf || nowPlayingNotyfRef.current) {
      return;
    }
    const { track_window: trackInfo } = playbackData;
    const title = trackInfo?.current_track?.name;

    if (!title || playbackData?.paused) {
      return;
    }

    nowPlayingNotyfRef.current = notyf?.success(`${title}`) ?? null;
    setTimeout(() => {
      if (nowPlayingNotyfRef.current) {
        nowPlayingNotyfRef.current = null;
      }
    }, 3000);
  }, [playbackData, notyf, nowPlayingNotyfRef]);

  useEffect(() => {
    const {
      duration: durationMs,
      position: positionMs,
      track_window: trackInfo,
      timestamp,
    } = playbackData ?? {};

    if (!trackInfo) {
      return;
    }

    const { current_track: track } = trackInfo;

    if (!track) {
      return;
    }

    if (
      intervalRef === undefined ||
      currentTrackTime === undefined ||
      currentTrackDuration === undefined
    ) {
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!playerRef?.current || playbackData?.paused) {
        return;
      }

      setCurrentTrackTime?.((prev: number) => {
        let oldTime = prev;
        if (currentTrack?.timestamp < playbackData?.timestamp) {
          oldTime = playbackData?.position ?? 0;
        }
        const newTime = oldTime + 1000;
        setProgressPercent?.((newTime / currentTrackDuration) * 100);
        return newTime;
      });

      setCurrentTrack?.((prev) => {
        let data = prev;
        if (prev?.name !== track?.name || _.isEmpty(prev)) {
          setCurrentTrackTime?.(positionMs);
          setCurrentTrackDuration?.(durationMs);
          data = { ...track, timestamp };
        }

        return data;
      });
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
    currentTrack?.timestamp,
    setCurrentTrack,
    setCurrentTrackTime,
    setCurrentTrackDuration,
    setProgressPercent,
  ]);

  return (
    <div className="grid h-[45px] w-3/5 place-items-stretch pt-2">
      <div className="w-full">
        <div className="w-full h-1.5 border-t rounded shadow-2xs flex justify-start">
          <span
            className={`h-full dark:bg-black bg-white rounded`}
            style={progressStyle}></span>
        </div>
        <div className="flex flex-row justify-between text-xs">
          <p>{`${toMmSs(currentTrackTime ?? 0)}`}</p>
          <p>{`${toMmSs(currentTrackDuration ?? 0)}`}</p>
        </div>
      </div>
    </div>
  );
}
