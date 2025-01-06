import { useState, useEffect } from "react";

export function useIsOnline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Fallback: Polling method
    const interval = setInterval(updateOnlineStatus, 3000); // Check every 3 seconds

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  return isOnline;
}

