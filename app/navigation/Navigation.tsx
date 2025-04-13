"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSystemContextLogic } from "../../contexts/SystemContext";
import {
  Love_Light,
  Alumni_Sans_Pinstripe,
  Moon_Dance,
} from "next/font/google";
import NavLink from "./components/NavLink";

const navlinkFont = Moon_Dance({
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

const links = [
  { href: "/", title: "Home" },
  { href: "/player", title: "Player" },
  { href: "/tracks", title: "Tracks" },
  { href: "/photos", title: "Photos" },
  { href: "/about", title: "About" },
];

export default function Navigation() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isMobile } = useSystemContextLogic();
  const titleText = process.env.NEXT_PUBLIC_TITLE_TEXT;

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
    <div className="border-b border-gray-600 flex sm:flex-row flex-col sm:justify-between sm:py-2 sm:px-3 w-full">
      <div className="flex flex-row items-center justify-center px-3 my-3 sm:my-0">
        <p className={`${mainTitle.className} text-6xl pe-2 border-r`}>
          {titleText}
        </p>
        <p className={`${alumniSans.className} text-2xl ps-2`}>Year 3</p>
      </div>
      <div className="sm:w-1/3 flex sm:justify-between">
        <div
          className={`${navlinkFont.className} flex flex-auto justify-evenly items-center md:text-3xl text-2xl`}>
          {links.map((link) => {
            if (!isMobile && link?.title === "Tracks") return;
            return <NavLink key={link.href} {...link} />;
          })}
        </div>
        <div className="flex w-[60px]">
          <button onClick={toggleDarkMode}>
            <Image
              src={`/images/${isDarkMode ? "dark-mode" : "light-mode"}.png`}
              width={50}
              height={50}
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
