"use client";

import { SystemContext, useSystemContextLogic } from "./SystemContext";
import { ReactNode } from "react";

export default function SystemProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const systemContextValue = useSystemContextLogic();

  return (
    <SystemContext.Provider value={systemContextValue}>
      {children}
    </SystemContext.Provider>
  );
}
