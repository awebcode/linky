import { useCallback, useState } from "react";
import { Send, Paperclip } from "lucide-react";
import IconButton from "../common/IconButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMessageStore } from "@/hooks/useMessageStorage";
import { useShallow } from "zustand/react/shallow";
import { WithDropdown } from "../common/WithDropdown";
import { useChatStore } from "@/hooks/useChatStore";
import dynamic from "next/dynamic";
// const InputEmoji = dynamic(() => import("react-input-emoji-v2"), { ssr: false });
const UppyFilesUploader = dynamic(() => import("../common/UppyFilesUploader"), {
  ssr: false,
});
import { SmileyInput } from "smiley-input";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const isMobile = useIsMobile();
  const { message, setMessage, setFiles } = useMessageStore(useShallow((state) => state));
  const selectedChat = useChatStore(useShallow((state) => state.selectedChat));

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChat?.id && message[selectedChat.id]?.trim()) {
      onSendMessage(message[selectedChat.id]); // Send message
      setMessage(selectedChat.id, ""); // Clear draft
    }
  };

  const handleFilesUploaded = useCallback(
    (data: { resuls: { public_id: string; secure_url: string } }) => {
      if (selectedChat?.id) {
        setFiles(selectedChat.id, data.resuls as any);
        setIsDropdownOpen(false);
      }
    },
    [setFiles, selectedChat?.id]
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
      <WithDropdown
        trigger={
          <IconButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Paperclip className="w-5 h-5" />
          </IconButton>
        }
        open={isDropdownOpen}
        onOpenChange={(open) => setIsDropdownOpen(open)}
        className="w-full max-w-[80vw] md:max-w-[45vw] mx-auto rounded-xl md:mb-8"
        side={isMobile ? "top" : "right"}
        align="center"
      >
        <UppyFilesUploader onFilesUploaded={handleFilesUploaded} />
      </WithDropdown>

      <div className="flex-1">
       
        <SmileyInput
          value={message[selectedChat?.id || ""] || ""}
          setValue={(value) => selectedChat?.id && setMessage(selectedChat.id, value)}
          placeholder="Type a message..."
          pickerOptions={{
            theme: "auto",
          }}
        />
      </div>

      <IconButton
        type="submit"
        className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
      >
        <Send className="w-5 h-5" />
      </IconButton>
    </form>
  );
}
