import { useEffect, useState } from "react";
import { useSocket } from "./use-socket";
import { useUser } from "./use-user";

export const useIsOnline = () => {
  const socket = useSocket();
  const { user } = useUser();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    if (!user) return;
    socket.emit("user_online", { userId: user?.id });
    setIsOnline(true);

    const handleUnload = () => {
      // socket.emit("user_offline", { userId });
      socket.emit("user_offline", { userId: user?.id });
      setIsOnline(false);
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      socket.off("heartbeat");
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [socket, user]);

  return isOnline;
};
