import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useChatStore } from "@/hooks/useChatStore";
import { useShallow } from "zustand/shallow";
import UserAvatar from "@/components/common/UserAvatar";

interface InfoSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatInfoSheet({ isOpen, onClose }: InfoSheetProps) {
  const selectedChat = useChatStore(useShallow((state) => state.selectedChat));
  if (!selectedChat) return null;

  const dummyData = {
    user: {
      name: "John Doe",
      avatarUrl: "https://example.com/avatar.jpg",
      bio: "This is a placeholder bio. More details about this user.",
      lastActive: "Yesterday at 6:30 PM",
    },
    sharedFiles: [
      { name: "Document1.pdf", size: 150, url: "https://example.com/file1" },
      { name: "Image.png", size: 200, url: "https://example.com/file2" },
    ],
    sharedPhotos: [
      { url: "https://example.com/photo1.jpg" },
      { url: "https://example.com/photo2.jpg" },
      { url: "https://example.com/photo3.jpg" },
    ],
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={"right"}
        className="w-full sm:w-[540px] p-4 flex flex-col space-y-4 bg-background shadow-xl"
      >
        {/* Sheet Header */}
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="text-lg font-semibold">Chat Info</SheetTitle>
        </SheetHeader>

        {/* Scrollable Content */}
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4 overflow-y-auto">
          <div className="space-y-6">
            {/* User Information */}
            <div className="flex flex-col items-center space-y-4">
              <UserAvatar user={selectedChat.user} size="lg" />
              <h2 className="text-2xl font-semibold">{selectedChat.user.name}</h2>
              <p className="text-sm text-muted-foreground">
                Last active: {selectedChat.timestamp}
              </p>
            </div>

            {/* About */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="text-sm text-muted-foreground">
                {dummyData.user.bio ||
                  "This is a placeholder for the user's bio or additional information."}
              </p>
            </div>

            {/* Shared Files */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Shared Files</h3>
              <p className="text-sm text-muted-foreground">
                {dummyData.sharedFiles.length > 0
                  ? dummyData.sharedFiles.length
                  : "No files shared yet."}
              </p>
              {dummyData.sharedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 text-sm text-primary"
                >
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => downloadFile(file)}
                  >
                    {file.name}
                  </Button>
                  <span className="text-xs text-muted-foreground">({file.size} KB)</span>
                </div>
              ))}
            </div>

            {/* Shared Photos */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Shared Photos</h3>
              <p className="text-sm text-muted-foreground">
                {dummyData.sharedPhotos.length > 0
                  ? dummyData.sharedPhotos.length
                  : "No photos shared yet."}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {dummyData.sharedPhotos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo.url}
                    alt={`Shared Photo ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 space-y-4">
            {/* Block/Unblock */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">User Actions</h4>
              <Button variant="destructive" onClick={handleBlock} size="sm">
                Block User
              </Button>
            </div>

            {/* Mute/Unmute */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Notifications</h4>
              <Button variant="outline" onClick={handleMute} size="sm">
                Mute Notifications
              </Button>
            </div>

            {/* Clear Chat */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Clear Chat</h4>
              <Button variant="outline" onClick={handleClearChat} size="sm">
                Clear Chat
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function downloadFile(file: { name: string; url: string; size: number }) {
  const link = document.createElement("a");
  link.href = file.url;
  link.download = file.name;
  link.click();
}

function handleBlock() {
  // Logic to block user
  alert("User has been blocked.");
}

function handleMute() {
  // Logic to mute notifications
  alert("Notifications are muted.");
}

function handleClearChat() {
  // Logic to clear chat
  alert("Chat has been cleared.");
}
