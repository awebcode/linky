// components/Events.tsx
"use client"; // This makes this component a client-side component
import { useEffect, useRef } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";

const Events = () => {
  const socket = useSocket(); // Assuming your hook connects the socket
  const { user } = useUser();
  useEffect(() => {
    if (socket && user) {
      socket.emit("user-online", { userId: user.id });
    }

    // Cleanup when the component is unmounted
    return () => {
      if (socket) {
        socket.off("some-event");
      }
    };
  }, [socket, user]);

  return null;
};

export default Events;
