"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Oswald,
  Love_Light,
  Alumni_Sans_Pinstripe,
  Fredericka_the_Great,
} from "next/font/google";

import { Notyf } from "notyf";

import "./globals.css";
import "notyf/notyf.min.css";
import { NotyfContext } from "./contexts/NotyfContext";
import { SystemContext, useSystemContextLogic } from "./contexts/SystemContext";
import { PlayerContext, usePlayerLogic } from "./contexts/PlayerContext";
import { ListContext, useListLogic } from "./contexts/ListContext";

const fredericka = Fredericka_the_Great({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const alumniSans = Alumni_Sans_Pinstripe({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const mainTitle = Love_Light({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const notyfFont = Oswald({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const links = [
  { href: "/", title: "Home" },
  { href: "/player", title: "Player" },
  { href: "/tracks", title: "Tracks" },
  { href: "/photos", title: "Photos" },
  { href: "/about", title: "About" },
];

const titleText = process.env.NEXT_PUBLIC_TITLE_TEXT;

function NavLink({ title, href }: Readonly<{ title: string; href: string }>) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`${isActive ? "font-bold text-lg" : ""} hover:text-blue-300`}>
      {title}
    </Link>
  );
}

function Navigation() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isMobile } = useSystemContextLogic();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialMode = storedTheme ? storedTheme === "dark" : systemDark;

      setIsDarkMode(initialMode);
      document.documentElement.classList.toggle("dark", initialMode);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <div className="border-b border-gray-600 flex sm:flex-row flex-col sm:justify-between sm:py-3 sm:px-5">
      <div className="flex flex-row items-center justify-center px-3 my-3 sm:my-0">
        <p className={`${mainTitle.className} text-6xl`}>{titleText}</p>
        <p className={`${alumniSans.className} text-2xl ps-4`}>Year 3</p>
      </div>
      <div className="sm:w-1/3 flex sm:justify-between">
        <div
          className={`${fredericka.className} flex flex-auto justify-evenly items-center`}>
          {links.map((link) => {
            if (!isMobile && link?.title === "Tracks") return;
            return <NavLink key={link.href} {...link} />;
          })}
        </div>
        <div className="flex items-center px- w-[60px]">
          <button onClick={toggleDarkMode}>
            <Image
              src={`/images/${isDarkMode ? "dark-mode" : "light-mode"}.png`}
              width={60}
              height={60}
              alt="logo"
              onLoad={() => setIsImageLoaded(true)}
              className={`${isImageLoaded ? "" : "img-spinner"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [notyf, setNotyf] = useState<Notyf | null>(null);
  const systemContextValue = useSystemContextLogic();
  const playerContextValue = usePlayerLogic();
  const playerListContextValue = useListLogic();

  useEffect(() => {
    const notyfInstance = new Notyf({
      duration: 2000,
      ripple: true,
      position: { x: "right", y: "bottom" },
      dismissible: false,
      types: [
        {
          type: "success",
          background: "#212121",
          className: `text-md ${notyfFont.className}`,
          icon: false,
        },
        {
          type: "error",
          background: "#F44336",
          icon: false,
        },
      ],
    });
    setNotyf(notyfInstance);
  }, []);

  return (
    <html lang="en">
      <body className="bg-white dark:bg-black dark:text-white overflow-hidden antialiased">
        <SystemContext.Provider value={systemContextValue}>
          <NotyfContext.Provider value={notyf}>
            <ListContext.Provider value={playerListContextValue}>
              <PlayerContext.Provider value={playerContextValue}>
                <Navigation />
                {children}
              </PlayerContext.Provider>
            </ListContext.Provider>
          </NotyfContext.Provider>
        </SystemContext.Provider>
      </body>
    </html>
  );
}
