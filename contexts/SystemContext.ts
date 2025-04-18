"use client";
import {
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Foldit, Quicksand } from "next/font/google";

const countdownNumberFont = Quicksand({
  weight: "400",
});

const countdownTextFont = Foldit({
  weight: "400",
});

type Countdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export const SystemContext = createContext(
  {} as ReturnType<typeof useSystemContextLogic>
);

export function useSystemContextLogic() {
  const [isMobile, setIsMobile] = useState(false);
  const [countdown, setCountdown] = useState<Countdown>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);

  function formatTime(ms: number): Countdown {
    const totalSeconds = Math.floor(ms / 1000);

    const days = Math.floor(totalSeconds / 86400)
      .toString()
      .padStart(2, "0");
    const hours = Math.floor((totalSeconds % 86400) / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }

  useLayoutEffect(() => {
    const targetDate = new Date("04/30/2025 00:00:00");
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
    }

    countdownTimer.current = setInterval(() => {
      const now = new Date();
      const timeLeft = targetDate.getTime() - now.getTime();
      setCountdown(formatTime(timeLeft));
    }, 1000);

    return () => {
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize); // Check on resize

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup on unmount
    };
  }, []);

  return {
    countdown,
    countdownNumberFont,
    countdownTextFont,
    isMobile,
  };
}
