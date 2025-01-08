import { useCallback, useEffect } from "react";
import { useTypingStore } from "@/hooks/useTypingStore"; // Assuming useTypingStore is defined elsewhere
import { useShallow } from "zustand/react/shallow";
import { SocketEventData, SocketEvents } from "@/types/socket.types"; // Assuming correct types are imported
import { useSocket } from "@/hooks/use-socket";

const useTypingCallbacks = () => {
  const socket = useSocket(); // Assuming socket instance is provided by this custom hook
  const { startTyping, stopTyping } = useTypingStore(useShallow((state) => state)); // Typing state

  // Callback to handle the start of typing
  const handleUserStartTyping = useCallback(
    (data: SocketEventData[SocketEvents.USER_START_TYPING]) => {
      startTyping(data);
      console.log("User started typing:", data);
    },
    [startTyping]
  );

  // Callback to handle the stop of typing
  const handleUserStopTyping = useCallback(
    (data: SocketEventData[SocketEvents.USER_STOP_TYPING]) => {
      stopTyping(data.userInfo.id, data.chatId);
      console.log("User stopped typing:", data);
    },
    [stopTyping]
  );

  // useEffect hook to bind socket event listeners
  useEffect(() => {
    if (socket) {
      // Bind event listeners for socket events

      socket.on(SocketEvents.USER_START_TYPING, handleUserStartTyping);
      socket.on(SocketEvents.USER_STOP_TYPING, handleUserStopTyping);

      // Cleanup function to unbind event listeners when component is unmounted
      return () => {
        socket.off(SocketEvents.USER_START_TYPING, handleUserStartTyping);
        socket.off(SocketEvents.USER_STOP_TYPING, handleUserStopTyping);
      };
    }
  }, [
    socket, // Rebind if socket instance changes
    handleUserStartTyping,
    handleUserStopTyping,
  ]);
};

export default useTypingCallbacks;
