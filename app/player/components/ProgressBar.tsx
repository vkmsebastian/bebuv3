import { useContext, useEffect } from "react";
import { PlayerContext } from "../page";

export default function ProgressBar() {
  const {
    intervalRef,
    playerRef,
    playbackData,
    currentTrack,
    currentTrackDuration,
    setCurrentTrackDuration,
    currentTrackTime,
    setCurrentTrackTime,
    progressPercent,
    setProgressPercent,
    setCurrentTrack,
  } = useContext(PlayerContext);

  function setTrackTime() {
    const { duration: durationMs, position: positionMs } = playbackData;
    setCurrentTrackDuration(durationMs ?? 0);
    setCurrentTrackTime(positionMs ?? 0);
  }

  function runProgressBar() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (
        playerRef.current &&
        !playbackData.paused &&
        currentTrackTime < currentTrackDuration
      ) {
        setCurrentTrackTime((prev) => {
          const newTime = prev + 1000;
          setProgressPercent((newTime / currentTrackDuration) * 100);
          return newTime;
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }

  function toMmSs(milliseconds: number) {
    if (!milliseconds || milliseconds === 0) return "0:00";
    const minutes = Math.floor(milliseconds / 59999);
    const seconds = ((milliseconds % 59999) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  }

  const progressStyle = {
    width: `${progressPercent}%`,
  };

  useEffect(() => {
    const { track_window: trackInfo } = playbackData ?? {};
    setTrackTime();
    runProgressBar();
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
    <div className="grid h-[45px] w-3/5 place-items-stretch pt-2">
      <div className="w-full">
        <div className="w-full h-1.5 border-t rounded shadow-2xs flex justify-start">
          <span
            className={`h-full dark:bg-black bg-white rounded`}
            style={progressStyle}></span>
        </div>
        <div className="flex flex-row justify-between text-xs">
          <p>{`${toMmSs(currentTrackTime)}`}</p>
          <p>{`${toMmSs(currentTrackDuration)}`}</p>
        </div>
      </div>
    </div>
  );
}
