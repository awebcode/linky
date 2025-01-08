// src/hooks/useMessageCallbacks.ts
import { useEffect, useCallback } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useMessageStore } from "@/hooks/useMessageStorage";
import { useChatStore } from "@/hooks/useChatStore";
import { useTabStore } from "@/hooks/useTabStore";
import { SocketEvents, type SocketEventData } from "@/types/socket.types";
import { useShallow } from "zustand/react/shallow";

const useMessageCallbacks = () => {
  const socket = useSocket(); // Get socket instance
  const { updateLastMessage } = useChatStore(useShallow((state) => state));
  const { setMessages, totalMessagesCount } = useMessageStore(
    useShallow((state) => state)
  );
  const { activeTab } = useTabStore(useShallow((state) => state));

  // Callback to handle message received event
  const handleMessageReceivedCallback = useCallback(
    (data: SocketEventData[SocketEvents.MESSAGE_RECEIVED]) => {
      setMessages(data?.chatId, [data], totalMessagesCount[data?.chatId]);
      updateLastMessage(
        data?.chatId,
        {
          id: data.id,
          content: data?.content,
          senderId: data?.sender?.id,
          sentAt: data?.sentAt,
        },
        activeTab
      );
      console.log("Message received:", data);
    },
    [setMessages, totalMessagesCount, updateLastMessage, activeTab]
  );

  // UseEffect hook to bind socket event listeners
  useEffect(() => {
    if (socket) {
      socket.on(SocketEvents.MESSAGE_RECEIVED, handleMessageReceivedCallback);

      // Cleanup when the component is unmounted
      return () => {
        if (socket) {
          socket.off(SocketEvents.MESSAGE_RECEIVED, handleMessageReceivedCallback);
        }
      };
    }
  }, [socket, handleMessageReceivedCallback]);
};

export default useMessageCallbacks;
