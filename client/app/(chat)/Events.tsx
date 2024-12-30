// components/Events.tsx
"use client"; // This makes this component a client-side component
import { useEffect, useRef } from "react";
import { useIsOnline } from "@/hooks/use-online"; // Assuming useIsOnline is your hook for socket
import { useSocket } from "@/hooks/use-socket";

const Events = () => {
  const socket = useSocket(); // Assuming your hook connects the socket
  useIsOnline();
  useEffect(() => {
    if (socket) {
      socket.on("some-event", (data) => {
        console.log("Event received:", data);
      });
    }

    // Cleanup when the component is unmounted
    return () => {
      if (socket) {
        socket.off("some-event");
      }
    };
  }, [socket]);

  return null;
};

export default Events;
