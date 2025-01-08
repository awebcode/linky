import { useCallback, useEffect } from "react";

import { useChatStore } from "@/hooks/useChatStore"; // Assuming useChatStore is defined elsewhere
import { useShallow } from "zustand/react/shallow";
import { SocketEventData, SocketEvents } from "@/types/socket.types"; // Assuming correct types are imported
import { useSocket } from "@/hooks/use-socket";

const useUserCallbacks = () => {
  const socket = useSocket(); // Assuming socket instance is provided by this custom hook
  
  const { bulkUpdateConversationsForOnlineOffline } = useChatStore(
    useShallow((state) => state)
  ); // Chat state

  // Callback to handle user going online
  const handleUserOnline = useCallback(
    (data: SocketEventData[SocketEvents.USER_ONLINE]) => {
      if (data?.chatIds) {
        bulkUpdateConversationsForOnlineOffline(data.chatIds, data.user);
        console.log("User status changed: Online", data);
      }
    },
    [bulkUpdateConversationsForOnlineOffline]
  );

  // Callback to handle user going offline
  const handleUserOffline = useCallback(
    (data: SocketEventData[SocketEvents.USER_OFFLINE]) => {
      if (data?.chatIds) {
        bulkUpdateConversationsForOnlineOffline(data.chatIds, data.user);
        console.log("User status changed: Offline", data);
      }
    },
    [bulkUpdateConversationsForOnlineOffline]
  );

  

  

  // useEffect hook to bind socket event listeners
  useEffect(() => {
    if (socket) {
      // Bind event listeners for socket events
      socket.on(SocketEvents.USER_ONLINE, handleUserOnline);
      socket.on(SocketEvents.USER_OFFLINE, handleUserOffline);
     

      // Cleanup function to unbind event listeners when component is unmounted
      return () => {
        socket.off(SocketEvents.USER_ONLINE, handleUserOnline);
        socket.off(SocketEvents.USER_OFFLINE, handleUserOffline);
      
      };
    }
  }, [
    socket, // Rebind if socket instance changes
    handleUserOnline,
    handleUserOffline
    
  ]);
};

export default useUserCallbacks;
