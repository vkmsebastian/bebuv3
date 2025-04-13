import "./globals.css";
import "notyf/notyf.min.css";
import Navigation from "./navigation/Navigation";
import { Analytics } from "@vercel/analytics/react";
import SystemProvider from "@/contexts/SystemProvider";
import PlayerProvider from "@/contexts/PlayerProvider";
import NotyfProvider from "@/contexts/NotyfProvider";
import ListProvider from "@/contexts/ListProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BebuV3",
  description: "3rd Year Anniversary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black dark:text-white overflow-hidden antialiased">
        <SystemProvider>
          <NotyfProvider>
            <ListProvider>
              <PlayerProvider>
                <Navigation />
                {children}
                <Analytics />
              </PlayerProvider>
            </ListProvider>
          </NotyfProvider>
        </SystemProvider>
      </body>
    </html>
  );
}
