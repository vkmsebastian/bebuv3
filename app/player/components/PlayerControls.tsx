import { MouseEventHandler, useContext } from "react";
import { PlayerContext } from "@/app/player/hooks/usePlayerLogic";
import Image from "next/image";
import { NotyfContext } from "@/app/layout";

const ControlButtons = ({
  state,
  handleNext,
  handlePlayPause,
}: {
  state: string;
  handleNext: MouseEventHandler;
  handlePlayPause: MouseEventHandler;
}) => {
  return (
    <div className="flex flex-row gap-3">
      <Image
        src={`/images/controls/prev.png`}
        width={50}
        height={50}
        alt="play/pause"
        onClick={handlePlayPause}
      />
      <Image
        src={`/images/controls/${state}.png`}
        width={50}
        height={50}
        alt="play/pause"
        onClick={handlePlayPause}
      />
      <Image
        src={`/images/controls/next.png`}
        width={50}
        height={50}
        alt="play/pause"
        onClick={handleNext}
      />
    </div>
  );
};

const AuthButtons = ({
  authorizeClient,
}: {
  authorizeClient: MouseEventHandler;
}) => {
  return (
    <div className="flex flex-row gap-3">
      <Image
        src="/images/spotify.png"
        alt="spotify"
        width={50}
        height={50}
        onClick={authorizeClient}
      />
    </div>
  );
};

export default function PlayerControls() {
  const { authorizeClient, playerRef, playerReady, playbackData } =
    useContext(PlayerContext) || {};

  const notyf = useContext(NotyfContext);

  // const refreshPlayer = () => {
  //   if (!playerRef?.current) {
  //     console.error("Player not initialized");
  //     return;
  //   }

  //   playerRef.current.getCurrentState().then((state) => {
  //     console.log("Current state:", state);
  //   });
  // };

  // Toggle play/pause (now works globally)
  const togglePlay = () => {
    if (!playerRef?.current) {
      console.error("Player not initialized");
      return;
    }

    console.log("Toggling play");
    playerRef.current.togglePlay().catch((err) => {
      console.error("Playback error:", err);
    });
  };

  const handlePlayPause = () => {
    togglePlay();
  };

  const handleNext = () => {
    console.log(notyf);
    notyf?.success("Next track");
  };

  const state = playbackData?.paused ? "pause" : "play";

  return (
    <div className="flex flex-row gap-3 mt-[20px]">
      {playerReady ? (
        <ControlButtons
          state={state}
          handleNext={handleNext}
          handlePlayPause={handlePlayPause}
        />
      ) : (
        <AuthButtons authorizeClient={authorizeClient} />
      )}
    </div>
  );
}
