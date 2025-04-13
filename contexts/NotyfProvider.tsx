"use client";
import { ReactNode } from "react";
import { NotyfContext, useNotyfContextLogic } from "./NotyfContext";

export default function NotyfProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const contextValue = useNotyfContextLogic();

  return (
    <NotyfContext.Provider value={contextValue}>
      {children}
    </NotyfContext.Provider>
  );
}
