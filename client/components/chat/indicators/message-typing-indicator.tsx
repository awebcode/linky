import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTypingStore } from "@/hooks/useTypingStore";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/hooks/useChatStore";

const MessageTypingIndicator = () => {
  const currentUserId = "1";
  const { typingUsers } = useTypingStore(useShallow((state) => state));
  const { selectedChat } = useChatStore(useShallow((state) => state));
  const [additionalTypingUsers, setAdditionalTypingUsers] = useState<number>(0);
  const DISPLAY_USERS_COUNT = 5;

  useEffect(() => {
    if (typingUsers.length > DISPLAY_USERS_COUNT) {
      setAdditionalTypingUsers(typingUsers.length - DISPLAY_USERS_COUNT);
    } else {
      setAdditionalTypingUsers(0);
    }
  }, [typingUsers]);

  // Filter out duplicate users based on `userId`
  const filteredTypingUsers = typingUsers
    .filter((typingUser) => typingUser?.chatId === selectedChat?.chatId)
    .filter((user) => user.userInfo.id !== currentUserId)
    .slice(0, DISPLAY_USERS_COUNT); // Limit displayed users

  if (filteredTypingUsers.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 p-3  rounded-lg shadow-sm">
      {/* Display avatars of typing users */}
      <div className="flex space-x-2">
        {filteredTypingUsers.map((typingUser) => (
          <div key={typingUser?.userInfo?.id} className="relative flex items-center">
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarImage src={typingUser?.userInfo?.image || ""} />
              <AvatarFallback className="bg-gray-400 text-white">
                {typingUser?.userInfo?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        ))}
      </div>

      {/* Display how many more users are typing */}
      {additionalTypingUsers > 0 && (
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          +{additionalTypingUsers} more
        </span>
      )}

      {/* Typing indicator animation */}
      <div className="flex items-center space-x-1 ml-auto">
        <div className="flex space-x-1">
          <div className="typing-indicator">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageTypingIndicator;
