// components/Events.tsx
"use client"; // This makes this component a client-side component
import { useEffect, useRef } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";
import { SocketEvents } from "@/types/socketEvents";
import { useMessageStore } from "@/hooks/useMessageStorage";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/hooks/useChatStore";
import { useTabStore } from "@/hooks/useTabStore";
import { useTypingStore } from "@/hooks/useTypingStore";
import { useOnlineConversationsStore } from "@/hooks/useOnlineConversations";
/**
 * Global Socket events handler for the app
 */
const Events = () => {
  const socket = useSocket(); // Assuming your hook connects the socket
  const { user } = useUser();
  const { updateLastMessage } = useChatStore(useShallow((state) => state));
  const { setMessages, totalMessagesCount } = useMessageStore(
    useShallow((state) => state)
  );
  const {addOnlineConversation,removeOnlineConversation}=useOnlineConversationsStore(useShallow((state) => state));
  const { activeTab } = useTabStore(useShallow((state) => state));
  const {startTyping,stopTyping}=useTypingStore(useShallow((state) => state));

  useEffect(() => {
    if (socket) {
      // Listen for "user_status_changed" event
      socket.on(SocketEvents.USER_ONLINE, (data) => {
        addOnlineConversation(data);
        // Handle user status change event
        console.log("User status changed:", data);
      });
      socket.on(SocketEvents.USER_OFFLINE, (data) => {
        removeOnlineConversation(data);
        // Handle user status change event
        console.log("User status changed:", data);
      });
      socket.on(SocketEvents.MESSAGE_RECEIVED, (data) => {
        console.log({ msgReceived: data });
        // Handle user status change event
        if (data.sender?.id === user?.id) return;
        //set incoming message on the client side
        setMessages(data?.chatId, [data], totalMessagesCount[data?.chatId] + 1);
        updateLastMessage(data?.chatId, { // Update the last message on the chat lists
          id: data.id,
          content: data?.content,
          senderId: user.id,
          sentAt: new Date(),
        },activeTab);
        console.log("Message received:", data);
      });

      socket.on(SocketEvents.USER_START_TYPING, (data) => {
        startTyping(data);
        console.log("User is typing:", data);
      })
      socket.on(SocketEvents.USER_STOP_TYPING, (data) => {
        stopTyping(data.userInfo.id,data.chatId);
        console.log("User stopped typing:", data);
      })
    }

    // Cleanup when the component is unmounted
    return () => {
      if (socket) {
        socket.off(SocketEvents.USER_ONLINE);
        socket.off(SocketEvents.USER_OFFLINE);
        socket.off(SocketEvents.MESSAGE_RECEIVED);
        socket.off(SocketEvents.USER_START_TYPING);
        socket.off(SocketEvents.USER_STOP_TYPING);
      }
    };
  }, [socket,user]);

  return null;
};

export default Events;
