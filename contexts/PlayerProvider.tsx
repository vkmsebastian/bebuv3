"use client";
import { ReactNode } from "react";
import { PlayerContext, usePlayerLogic } from "./PlayerContext";

export default function PlayerProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const contextValue = usePlayerLogic();

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
}
