import { Phone, Video,  ArrowLeft, Info } from "lucide-react";

import UserAvatar from "../common/UserAvatar";
import { useChatStore } from "@/hooks/useChatStore";
import { useShallow } from "zustand/shallow";

import IconButton from "../common/IconButton";
import { useState } from "react";
import ChatInfoSheet from "./rightside/chat-info-sheet";
import { CallDialog } from "./dialog/call-dialog";
import { useMessageStore } from "@/hooks/useMessageStorage";
import CardTypingIndicator from "./indicators/card-typing-indicator";
import { useTypingStore } from "@/hooks/useTypingStore";

interface ChatHeaderProps {
  className?: string;
}

export function ChatHeader({}: ChatHeaderProps) {
  const selectedChat = useChatStore(useShallow((state) => state.selectedChat));
  const { typingUsers } = useTypingStore(useShallow((state) => state));
  const { totalMessagesCount } = useMessageStore(useShallow((state) => state));
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const [isRightSheetOpen, setRightSheetOpen] = useState(false); // Track sheet state
   const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
   const [callType, setCallType] = useState<"audio" | "video">("audio");
  if (!selectedChat) return null;

  const handleAudioCall = () => {
    setCallType("audio");
    setIsCallDialogOpen(true);
  };

  const handleVideoCall = () => {
    setCallType("video");
    setIsCallDialogOpen(true);
  };

  const {
    isGroup,
    user: { name, image, status },
    groupInfo,
  } = selectedChat;

  // Handle back button click to set selectedChat to null
  const handleBackButtonClick = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-3">
        {/* Back Button */}
        <IconButton onClick={handleBackButtonClick} className="w-fit text-primary">
          <ArrowLeft className="w-5 h-5" />
        </IconButton>

        {/* Avatar and Chat Info */}
        {isGroup ? (
          <UserAvatar src={groupInfo?.groupImage} fallback={groupInfo?.groupName} />
        ) : (
          <UserAvatar src={image} fallback={name} />
        )}
        <div>
          <h2 className="font-semibold">{isGroup ? groupInfo?.groupName : name}</h2>
          <p className="text-sm text-muted-foreground"></p>
          {typingUsers.filter((user) => user.chatId === selectedChat?.chatId).length >
          0 ? (
            <CardTypingIndicator />
          ) : isGroup ? (
            `${selectedChat.membersCount} members`
          ) : (
            status
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex">
          <IconButton onClick={handleAudioCall}>
            <Phone className="w-5 h-5" />
          </IconButton>
          <IconButton onClick={handleVideoCall}>
            <Video className="w-5 h-5" />
          </IconButton>
          {/* Call Dialog */}
          <CallDialog
            isOpen={isCallDialogOpen}
            onClose={() => setIsCallDialogOpen(false)}
            callType={callType}
          />
          <IconButton onClick={() => setRightSheetOpen(true)}>
            <Info className="w-5 h-5" />
          </IconButton>
          {isRightSheetOpen && (
            <ChatInfoSheet
              isOpen={isRightSheetOpen}
              onClose={() => setRightSheetOpen(false)}
            />
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          Messages: {totalMessagesCount[selectedChat!.chatId]}
        </span>

        {/* <UserActionDropdown
          trigger={
            <Button variant={"ghost"} size={"icon"}>
              <MoreVertical className="w-5 h-5" />
            </Button>
          }
          items={chatRightSideMenuItems}
        /> */}
      </div>
    </div>
  );
}
