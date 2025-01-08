// import React, { useEffect, useState } from "react";
// import { useTypingStore } from "@/hooks/useTypingStore";
// import { useChatStore } from "@/hooks/useChatStore";
// import { useShallow } from "zustand/react/shallow";

// const CardTypingIndicator = () => {
//   const currentUserId = "1";
//   const { typingUsers } = useTypingStore(useShallow((state) => state));
//   const { selectedChat } = useChatStore(useShallow((state) => state));
//   const [displayText, setDisplayText] = useState("");

//   useEffect(() => {
//     // Filter typing users for the current chat and exclude the current user
//     const filteredTypingUsers = typingUsers
//       // .filter((typingUser) => typingUser?.chatId === selectedChat?.chatId)
//       .filter((user) => user.userInfo.id !== currentUserId);

//     if (filteredTypingUsers.length === 0) {
//       setDisplayText(""); // No typing users
//     } else if (filteredTypingUsers.length === 1) {
//       // Single user typing
//       setDisplayText(
//         `${filteredTypingUsers[0].userInfo.name} is typing... - ${filteredTypingUsers[0].userInfo?.content}`
//       );
//     } else if (filteredTypingUsers.length === 2) {
//       // Two users typing
//       setDisplayText(
//         `${filteredTypingUsers[0].userInfo.name} and ${filteredTypingUsers[1].userInfo.name} are typing...`
//       );
//     } else {
//       // More than two users typing
//       const additionalCount = filteredTypingUsers.length - 2;
//       setDisplayText(
//         `${filteredTypingUsers[0].userInfo.name}, ${filteredTypingUsers[1].userInfo.name} and ${additionalCount} more are typing...`
//       );
//     }
//   }, [typingUsers, selectedChat, currentUserId]);

//   if (!displayText) return null; // Don't render if no users are typing

//   return (
//     <p className="text-sm w-full  text-primary animate-pulse font-medium">
//       {displayText}
//     </p>
//   );
// };

// export default CardTypingIndicator;
import React, { useEffect, useState } from "react";
import { useTypingStore } from "@/hooks/useTypingStore";
import { useShallow } from "zustand/react/shallow";

interface CardTypingIndicatorProps {
  chatId: string;
  userId?: string;
  
}
const CardTypingIndicator = ({ chatId, userId }: CardTypingIndicatorProps) => {
  const { typingUsers } = useTypingStore(useShallow((state) => state));
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    // Filter typing users for the current chat and exclude the current user
    const filteredTypingUsers = typingUsers
      .filter((typingUser) => typingUser?.chatId === chatId)
      .filter((user) => user.userInfo.id !== userId);

    if (filteredTypingUsers.length === 0) {
      setDisplayText(""); // No typing users
    } else {
      const typingContent = filteredTypingUsers.map(
        (user) => `${user.userInfo.name}: ${user.userInfo.content}`
      );

      if (filteredTypingUsers.length === 1) {
        setDisplayText(`${typingContent[0]} is typing...`); 
      } else if (filteredTypingUsers.length === 2) {
        setDisplayText(`${typingContent[0]} and ${typingContent[1]} are typing...`);
      } else {
        const additionalCount = filteredTypingUsers.length - 2;
        setDisplayText(
          `${typingContent[0]}, ${typingContent[1]}, and ${additionalCount} more are typing...`
        );
      }
    }
  }, [typingUsers, chatId, userId]);

  if (!displayText) return null; // Don't render if no users are typing

  return (
    <span className="text-sm break-all  text-primary animate-pulse font-medium">{displayText.slice(0, 80)+"..."}</span>
  );
};

export default CardTypingIndicator;
