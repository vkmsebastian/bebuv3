import { useContext, useEffect } from "react";
import { PlayerContext } from "@/app/player/hooks/usePlayerLogic";
import { NotyfContext } from "@/app/layout";

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
    const { track_window: trackInfo } = playbackData ?? {};
    const { duration: durationMs, position: positionMs } = playbackData ?? {};
    setCurrentTrackDuration?.(durationMs ?? 0);
    setCurrentTrackTime?.(positionMs ?? 0);

    if (!trackInfo) {
      return;
    }
    const { current_track: currentTrack } = trackInfo;

    if (!currentTrack) {
      return;
    }

    setCurrentTrack?.(currentTrack);

    if (intervalRef?.current) {
      clearInterval(intervalRef?.current);
    }

    if (
      intervalRef === undefined ||
      currentTrackTime === undefined ||
      currentTrackDuration === undefined
    ) {
      return;
    }

    intervalRef.current = setInterval(() => {
      if (
        !playerRef?.current ||
        playbackData?.paused ||
        currentTrackTime >= currentTrackDuration
      ) {
        return;
      }
      setCurrentTrackTime?.((prev: number) => {
        const newTime = prev + 1000;
        setProgressPercent?.((newTime / currentTrackDuration) * 100);
        return newTime;
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
