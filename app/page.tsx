"use client";
import { SystemContext } from "@/contexts/SystemContext";
import { useContext } from "react";

export default function Home() {
  const { countdown, countdownNumberFont, countdownTextFont } =
    useContext(SystemContext);

  return (
    <div
      className={`${countdownNumberFont.className} flex md:flex-row flex-col gap-3 md:text-8xl text-6xl md:justify-center md:items-center md:mt-0 mt-[15%] h-[90%]`}>
      <div className="flex flex-col items-center">
        <p>{countdown.days}</p>
        <p className={`${countdownTextFont.className}`}>days</p>
      </div>
      <div className="flex flex-col items-center">
        <p>{countdown.hours}</p>
        <p className={`${countdownTextFont.className}`}>hours</p>
      </div>
      <div className="flex flex-col items-center">
        <p>{countdown.minutes}</p>
        <p className={`${countdownTextFont.className}`}>minutes</p>
      </div>
      <div className="flex flex-col items-center">
        <p>{countdown.seconds}</p>
        <p className={`${countdownTextFont.className}`}>seconds</p>
      </div>
    </div>
  );
}
