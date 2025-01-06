import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Create a global reference for the socket
let socket: Socket | null = null;

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(socket);

  // Initialize socket only once and keep it across renders
  if (!socketRef.current) {
    socketRef.current = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      auth: {
        token: localStorage.getItem("token"),
      },
      query: {
        userId: localStorage.getItem("userId"),
      },
      transports: ["websocket", "polling", "xhr-polling", "webtransport"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1500,
      reconnectionDelayMax: 8000,
      reconnectionAttempts: Infinity,
      upgrade: true,
      rememberUpgrade: true,
    });

    // Set the socket reference for future use
    socket = socketRef.current;
  }

  useEffect(() => {
    const socket = socketRef.current;

    if (socket) {
      // Event listener for debugging (attach it early in the lifecycle)
      const handleConnect = () => {
        console.log(`Connected with ID: ${socket.id}`);
      };

      // Attach the event listener before any connection happens
      socket.on("connect", handleConnect);

      // Tab has focus
      const handleFocus = async () => {
        socket.emit("online", { socketId: socket.id });
      };

      // Tab closed
      const handleBlur = () => {
        socket.emit("offline", { socketId: socket.id });
      };

      // Clean up the socket event listeners and tab events on unmount
      window.addEventListener("focus", handleFocus);
      window.addEventListener("blur", handleBlur);

      return () => {
        socket.removeListener("connect", handleConnect); // Remove the listener on cleanup
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("blur", handleBlur);
      };
    }
  }, []);

  return socketRef.current;
};
