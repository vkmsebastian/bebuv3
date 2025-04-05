import { createContext } from "react";

import usePlayerLogic from "../player/hooks/usePlayerLogic";

export const PlayerContext = createContext(
  {} as ReturnType<typeof usePlayerLogic>
);
