import "./globals.css";
import "notyf/notyf.min.css";
import Navigation from "./navigation/Navigation";
import { Analytics } from "@vercel/analytics/react";
import { ListContext, useListLogic } from "../contexts/ListContext";
import { PlayerContext, usePlayerLogic } from "../contexts/PlayerContext";
import { NotyfContext, useNotyfContextLogic } from "../contexts/NotyfContext";
import {
  SystemContext,
  useSystemContextLogic,
} from "../contexts/SystemContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const systemContextValue = useSystemContextLogic();
  const playerContextValue = usePlayerLogic();
  const playerListContextValue = useListLogic();
  const { notyf } = useNotyfContextLogic();

  return (
    <html lang="en">
      <body className="bg-white dark:bg-black dark:text-white overflow-hidden antialiased">
        <SystemContext.Provider value={systemContextValue}>
          <NotyfContext.Provider value={notyf}>
            <ListContext.Provider value={playerListContextValue}>
              <PlayerContext.Provider value={playerContextValue}>
                <Navigation />
                {children}
                <Analytics />
              </PlayerContext.Provider>
            </ListContext.Provider>
          </NotyfContext.Provider>
        </SystemContext.Provider>
      </body>
    </html>
  );
}
