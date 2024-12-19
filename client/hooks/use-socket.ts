import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    // Initialize the socket only once
    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      timeout: 50000,
      ackTimeout: 5000,
      transports: ["websocket", "polling", "xhr-polling", "webtransport"],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1500,
      reconnectionDelayMax: 8000,
      reconnectionAttempts: Infinity,

      // Connection options
      upgrade: true, // Allow upgrading transport method
      rememberUpgrade: true, // Use WebSocket as default transport

      // Debugging
      autoUnref: false, // Prevent process exit if socket is open
    });
  }

  useEffect(() => {
    const socket = socketRef.current;

    if (socket) {
      // Event listeners for debugging
      socket.on("connect", () => {
        console.log(`Connected with ID: ${socket.id}`);
      });

      // Tab has focus
      const handleFocus = async () => {
        socket.emit("online", {
          socketId: socket.id,
        });
      };

      // Tab closed
      const handleBlur = () => {
        // if (user) {
          socket.emit("offline", {
            socketId: socket.id
          });
        // }
      };

      // Clean up the socket instance on component unmount
      window.addEventListener("focus", handleFocus);
      window.addEventListener("blur", handleBlur);

      return () => {
        socket.disconnect();
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("blur", handleBlur);
      };
    }
  }, []);

  return socketRef.current;
};
