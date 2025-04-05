import { MouseEventHandler, useContext } from "react";
import { PlayerContext } from "@/app/player/hooks/usePlayerLogic";
import Image from "next/image";

const ControlButtons = ({
  state,
  handleClick,
}: {
  state: string;
  handleClick: MouseEventHandler;
}) => {
  return (
    <div className="flex flex-row gap-3">
      <Image
        src={`/images/controls/prev.png`}
        width={50}
        height={50}
        alt="play/pause"
        onClick={handleClick}
      />
      <Image
        src={`/images/controls/${state}.png`}
        width={50}
        height={50}
        alt="play/pause"
        onClick={handleClick}
      />
      <Image
        src={`/images/controls/next.png`}
        width={50}
        height={50}
        alt="play/pause"
        onClick={handleClick}
      />
    </div>
  );
};

const AuthButtons = ({
  refreshPlayer,
  authorizeClient,
}: {
  refreshPlayer: MouseEventHandler;
  authorizeClient: MouseEventHandler;
}) => {
  return (
    <div className="flex flex-row gap-3">
      <button onClick={refreshPlayer}>Refresh</button>
      <button onClick={authorizeClient}>Authorize</button>
    </div>
  );
};

export default function PlayerControls() {
  const { authorizeClient, playerRef, playerReady, playbackData } =
    useContext(PlayerContext) || {};

  const refreshPlayer = () => {
    if (!playerRef?.current) {
      console.error("Player not initialized");
      return;
    }

    playerRef.current.getCurrentState().then((state) => {
      console.log("Current state:", state);
    });
  };

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

  const handleClick = () => {
    console.log(playerRef?.current ?? {});
    togglePlay();
  };

  const state = playbackData?.paused ? "pause" : "play";

  return (
    <div className="flex flex-row gap-3 mt-[20px]">
      {playerReady ? (
        <ControlButtons state={state} handleClick={handleClick} />
      ) : (
        <AuthButtons
          authorizeClient={authorizeClient}
          refreshPlayer={refreshPlayer}
        />
      )}
    </div>
  );
}
