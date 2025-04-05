import Image from "next/image";
import { MouseEventHandler, useContext } from "react";
import { PlayerContext } from "@/app/contexts/PlayerContext";

const ControlButtons = ({
  state,
  handler,
}: {
  state: string;
  handler: (action: string) => void;
}) => {
  return (
    <div className="flex flex-row gap-3">
      <Image
        src={`/images/controls/prev.png`}
        width={50}
        height={50}
        alt="play/pause"
        onClick={() => handler("prev")}
      />
      <Image
        src={`/images/controls/${state}.png`}
        width={50}
        height={50}
        alt="play/pause"
        onClick={() => handler("play-pause")}
      />
      <Image
        src={`/images/controls/next.png`}
        width={50}
        height={50}
        alt="play/pause"
        onClick={() => handler("next")}
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
  const {
    authorizeClient,
    playerRef,
    playerReady,
    playbackData,
    refreshAccessToken,
  } = useContext(PlayerContext) || {};

  // Toggle play/pause (now works globally)
  const handleControl = (action: string) => {
    if (!playerRef?.current) {
      console.error("Player not initialized");
      return;
    }
    if (action === "prev") {
      playerRef.current.previousTrack().catch((err) => {
        console.error("Playback error:", err);
      });
    } else if (action === "next") {
      playerRef.current.nextTrack().catch((err) => {
        console.error("Playback error:", err);
      });
    } else if (action === "play-pause") {
      playerRef.current.togglePlay().catch((err) => {
        console.error("Playback error:", err);
      });
    }
  };

  const state = playbackData?.paused ? "pause" : "play";

  return (
    <div className="flex flex-row gap-3 mt-[10px]">
      {playerReady ? (
        <ControlButtons state={state} handler={handleControl} />
      ) : (
        <AuthButtons authorizeClient={authorizeClient} />
      )}
    </div>
  );
}
