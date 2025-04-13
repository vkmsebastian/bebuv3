"use client";
import { createContext, useEffect, useState } from "react";

export const SystemContext = createContext(
  {} as ReturnType<typeof useSystemContextLogic>
);

export function useSystemContextLogic() {
  const [isMobile, setIsMobile] = useState(false);

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
    isMobile,
  };
}
