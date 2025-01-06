import React, { useEffect, useState } from "react";
import { useTypingStore } from "@/hooks/useTypingStore";
import { useChatStore } from "@/hooks/useChatStore";
import { useShallow } from "zustand/react/shallow";

const CardTypingIndicator = () => {
  const currentUserId = "1";
  const { typingUsers } = useTypingStore(useShallow((state) => state));
  const { selectedChat } = useChatStore(useShallow((state) => state));
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    // Filter typing users for the current chat and exclude the current user
    const filteredTypingUsers = typingUsers
      // .filter((typingUser) => typingUser?.chatId === selectedChat?.chatId)
      .filter((user) => user.userInfo.id !== currentUserId);

    if (filteredTypingUsers.length === 0) {
      setDisplayText(""); // No typing users
    } else if (filteredTypingUsers.length === 1) {
      // Single user typing
      setDisplayText(`${filteredTypingUsers[0].userInfo.name} is typing...`);
    } else if (filteredTypingUsers.length === 2) {
      // Two users typing
      setDisplayText(
        `${filteredTypingUsers[0].userInfo.name} and ${filteredTypingUsers[1].userInfo.name} are typing...`
      );
    } else {
      // More than two users typing
      const additionalCount = filteredTypingUsers.length - 2;
      setDisplayText(
        `${filteredTypingUsers[0].userInfo.name}, ${filteredTypingUsers[1].userInfo.name} and ${additionalCount} more are typing...`
      );
    }
  }, [typingUsers, selectedChat, currentUserId]);

  if (!displayText) return null; // Don't render if no users are typing

  return (
    <p className="text-sm text-primary animate-pulse font-medium">
      {displayText}
    </p>
  );
};

export default CardTypingIndicator;
