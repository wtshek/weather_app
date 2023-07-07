import { getCurrentTimeString } from "@/utils";
import { useEffect, useState } from "react";

const ONE_MINUTE = 1000 * 60;

export const useCurrentTime = (shouldAutoUpdate?: boolean): string => {
  let interval: NodeJS.Timeout;
  const [currentTime, setCurrentTime] = useState("");

  // init the time
  // need to put in useEffect to avoid server and client difference
  useEffect(() => {
    setCurrentTime(getCurrentTimeString());
  }, []);

  useEffect(() => {
    if (shouldAutoUpdate) {
      interval = setInterval(() => {
        const currentTime = getCurrentTimeString();
        setCurrentTime(currentTime);
      }, ONE_MINUTE);
    } else if (!shouldAutoUpdate && interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [shouldAutoUpdate]);

  return currentTime;
};
