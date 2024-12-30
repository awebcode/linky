import { MessageCircle } from "lucide-react";

export function NoChatSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-semibold text-foreground mb-2">No Chat Selected</h1>
      <p className="text-muted-foreground">
        Select a chat to start messaging. Your conversations will appear here.
      </p>
    </div>
  );
}
