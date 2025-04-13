"use client";
import { ReactNode } from "react";
import { ListContext, useListLogic } from "./ListContext";

export default function ListProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const contextValue = useListLogic();
  return (
    <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
  );
}
