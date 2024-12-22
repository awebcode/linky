import { useState } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import { Input } from "../ui/input";
import IconButton from "../common/IconButton";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
      <IconButton
        type="button"
      >
        <Paperclip className="w-5 h-5" />
      </IconButton>
      <div className="flex-1">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
      </div>
      <IconButton
        type="button"
      >
        <Smile className="w-5 h-5" />
      </IconButton>
        <IconButton
        type="submit"
        className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors"
      >
        <Send className="w-5 h-5" />
      </IconButton>
    </form>
  );
}