import { useContext, useEffect } from "react";
import { PlayerContext } from "@/app/contexts/PlayerContext";
import { NotyfContext } from "@/app/contexts/NotyfContext";

export default function ProgressBar() {
  const {
    nowPlayingNotyfRef,
    playbackData,
    currentTrackDuration,
    currentPosition,
    progressPercent,
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

  return (
    <div className="grid h-[45px] w-3/5 place-items-stretch pt-2">
      <div className="w-full">
        <div className="w-full h-1.5 border-t rounded shadow-2xs flex justify-start">
          <span
            className={`h-full dark:bg-black bg-white rounded`}
            style={progressStyle}></span>
        </div>
        <div className="flex flex-row justify-between text-xs">
          <p>{`${toMmSs(currentPosition.current ?? 0)}`}</p>
          <p>{`${toMmSs(currentTrackDuration ?? 0)}`}</p>
        </div>
      </div>
    </div>
  );
}
