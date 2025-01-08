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
import { SocketEvents } from "@/types/socket.types";
// import { v7 as uuid } from "uuid";
import { MessageStatus } from "@prisma/client";
import { useTabStore } from "@/hooks/useTabStore";
import { generateObjectId } from "@/lib/utils";

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

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingTimeRef = useRef<number | null>(null);

  const sendMessage = useCallback(
    (content = "", files = []) => {
      if (!chatId || (!content && files.length === 0)) return;
 const ObjectId=generateObjectId()
      const newMessage = {
        id: ObjectId,
        content: files.length > 0 ? `${user.name} sent ${files.length} file(s)` : content,
        status: MessageStatus.SENT,
        sender: {
          id: user.id,
          name: user.name,
          image: user.image as string,
          status: user.status,
          lastActive: new Date(),
        },
        sentAt: new Date(),
        files,
      };

      socket.emit(SocketEvents.MESSAGE_SENT, {
        ...newMessage,
        chatId,
        isGroup: selectedChat?.isGroup,
        receiverId: selectedChat?.isGroup ? null : selectedChat?.user.id,
      });

      setMessages(
        chatId,
        [{ ...newMessage, status: MessageStatus.PENDING }],
        totalMessagesCount[chatId] + 1
      );
      updateLastMessage(
        chatId,
        {
          id: ObjectId,
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
      activeTab
    ]
  );

  const handleTyping = useCallback(() => {
    const typingData = {
      chatId,
      userInfo: {
        name: user.name,
        image: user.image,
        id: user.id,
        status: user.status,
        content: message[chatId],
      },
    };

    const currentTime = Date.now();

    if (message[chatId]?.trim()) {
      // Emit typing event
      socket.emit(SocketEvents.USER_START_TYPING, typingData);
      lastTypingTimeRef.current = currentTime;

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2000ms of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        const timeDiff = Date.now() - (lastTypingTimeRef.current || 0);
        if (timeDiff >= 2000) {
          socket.emit(SocketEvents.USER_STOP_TYPING, typingData);
        }
      }, 2000);
    } else {
      // Stop typing immediately if the message is cleared
      socket.emit(SocketEvents.USER_STOP_TYPING, typingData);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [chatId, message, socket, user]);

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

  useEffect(() => {
    handleTyping();
  }, [message, chatId, handleTyping]);

  useEffect(() => {
    return () => {
      // Stop typing on component unmount or chat change
      const typingData = {
        chatId,
        userInfo: {
          name: user.name,
          image: user.image,
          id: user.id,
          status: user.status,
          content: "",
        },
      };
      socket.emit(SocketEvents.USER_STOP_TYPING, typingData);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId, socket, user]);

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
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevents adding a newline
              const content = message[chatId]?.trim();
              if (content) {
                sendMessage(content);
              }
            }
          }}
          keepOpened
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
