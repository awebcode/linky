import React, { useCallback, useRef, useState, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import IconButton from "../common/IconButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMessageStore } from "@/hooks/useMessageStorage";
import { useShallow } from "zustand/react/shallow";
import { WithDropdown } from "../common/WithDropdown";
import { useChatStore } from "@/hooks/useChatStore";
import dynamic from "next/dynamic";
import { SmileyInput } from "smiley-input";
import { useSocket } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";
import { SocketEvents } from "@/types/socketEvents";
import { v7 as uuid } from "uuid";
import { MessageStatus } from "@prisma/client";
import { useTabStore } from "@/hooks/useTabStore";

const UppyFilesUploader = dynamic(() => import("../common/UppyFilesUploader"), {
  ssr: false,
});

export function ChatInput() {
  const isMobile = useIsMobile();
  const { user } = useUser();
  const socket = useSocket();
  const { message, setMessage, setMessages, setFiles, totalMessagesCount } =
    useMessageStore(useShallow((state) => state));
  const { selectedChat, updateLastMessage } = useChatStore(useShallow((state) => state));
  const { activeTab } = useTabStore(useShallow((state) => state));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const chatId = selectedChat?.chatId || "";

  const sendMessage = useCallback(
    (content = "", files = []) => {
      if (!chatId || (!content && files.length === 0)) return;

      const newMessage = {
        id: uuid(),
        tempId: uuid(),
        content: files.length > 0 ? `${user.name} sent ${files.length} file(s)` : content,
        status: MessageStatus.SENT,
        sender: {
          id: user.id,
          name: user.name,
          image: user.image as string,
          status: user.status,
          lastActive: new Date().toISOString(),
        },
        sentAt: new Date().toISOString(),
        files,
      };

      socket.emit(SocketEvents.MESSAGE_SENT, {
        ...newMessage,
        chatId,
        isGroup: selectedChat?.isGroup,
        receiverId: selectedChat?.isGroup ? null : selectedChat?.user.id,
      });

      setMessages(chatId, [newMessage], totalMessagesCount[chatId] + 1);
      updateLastMessage(
        chatId,
        {
          id: uuid(),
          content:
            files.length > 0 ? `${user.name} sent ${files.length} file(s)` : content,
          senderId: user.id,
          sentAt: new Date(),
        },
        activeTab
      );
      setMessage(chatId, "");
      if (files.length > 0) setFiles(chatId, files);
    },
    [
      chatId,
      selectedChat,
      socket,
      user,
      setMessages,
      setMessage,
      setFiles,
      totalMessagesCount,
      updateLastMessage,
    ]
  );

  const handleSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      const content = message[chatId]?.trim();
      sendMessage(content);
    },
    [chatId, message, sendMessage]
  );

  const handleFilesUploaded = useCallback(
    (data: any) => {
      const files = data.results.map((file: any) => file.secure_url);
      sendMessage("", files);
      setIsDropdownOpen(false);
    },
    [sendMessage]
  );

  /**
   * @description Send typing event to the server
   * SIMPLE
   */
  const typingData = {
    chatId,
    userInfo: {
      name: user.name,
      image: user.image,
      id: user.id,
      status: user.status,
    },
  };
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newMessage = message[chatId]?.trim();

    // Send typing event if there is any input
    if (newMessage && newMessage.length > 0) {
      socket.emit(SocketEvents.USER_START_TYPING, typingData);
    }

    // Clear previous typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing event after delay (2000ms)
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SocketEvents.USER_STOP_TYPING, typingData);
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, chatId, socket]);

  return (
    <div className="flex items-center gap-2 p-2 border-t">
      <WithDropdown
        trigger={
          <IconButton onClick={() => setIsDropdownOpen((open) => !open)}>
            <Paperclip className="w-5 h-5" />
          </IconButton>
        }
        open={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        className="w-full max-w-[80vw] md:max-w-[45vw] mx-auto rounded-xl md:mb-8"
        side={isMobile ? "top" : "right"}
        align="center"
      >
        <UppyFilesUploader onFilesUploaded={handleFilesUploaded} />
      </WithDropdown>

      <div className="flex-1">
        <SmileyInput
          value={message[chatId] || ""}
          setValue={(value) => setMessage(chatId, value)}
          keepOpened={false}
          placeholder="Type a message..."
          pickerOptions={{ theme: "auto" }}
          emojiButtonElement={"😎"}
          className="w-full min-h-[40px] max-h-60 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-y custom-scrollbar overflow-y-auto"
        />
      </div>

      <IconButton
        disabled={!message[chatId]?.trim()}
        onClick={handleSubmit}
        aria-label="Send message"
        className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
      >
        <Send className="w-5 h-5" />
      </IconButton>
    </div>
  );
}
