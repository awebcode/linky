import { Phone, Video, Mic, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/hooks/useChatStore";
import UserAvatar from "@/components/common/UserAvatar";
import { useShallow } from "zustand/react/shallow";

interface CallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  callType: "audio" | "video"; // Determines the type of call
}

export function CallDialog({ isOpen, onClose, callType }: CallDialogProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const selectedChat = useChatStore(useShallow((state) => state.selectedChat)); // Assuming this stores the user data for the active chat

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoToggle = () => {
    setIsVideoOff(!isVideoOff);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full m-4 mx-auto sm:w-[520px] md:w-[600px] lg:w-[700px] rounded-lg shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out">
        <DialogHeader className="flex items-center space-x-2 border-b pb-4 mb-4">
          {/* User Information */}
          <UserAvatar
            user={selectedChat?.user}
            className="w-14 h-14 border-2 border-primary rounded-full"
          />
          <div>
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {callType === "audio" ? "Audio Call" : "Video Call"}
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Calling {selectedChat?.user?.name || "User"}
            </p>
          </div>
        </DialogHeader>

        {/* Call Options */}
        <div className="space-y-8 mt-4">
          {callType === "audio" ? (
            <>
              <div className="flex flex-wrap justify-between items-center gap-4">
                <Button
                  variant="ghost"
                
                  onClick={handleMuteToggle}
                  className={cn("text-lg", {
                    "text-red-500": isMuted,
                    "text-gray-800 dark:text-gray-200": !isMuted,
                  })}
                >
                  <Mic className="w-6 h-6" />
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
                <Button
                  variant="default"
                
                  className="bg-primary text-white flex items-center gap-3 hover:bg-primary-dark transition-all duration-200 ease-in-out w-full sm:w-auto"
                >
                  <Phone className="w-6 h-6" />
                  Start Audio Call
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap justify-between items-center gap-4">
                <Button
                  variant="ghost"
                
                  onClick={handleVideoToggle}
                  className={cn("text-lg", {
                    "text-red-500": isVideoOff,
                    "text-gray-800 dark:text-gray-200": !isVideoOff,
                  })}
                >
                  <Camera className="w-6 h-6" />
                  {isVideoOff ? "Turn On Video" : "Turn Off Video"}
                </Button>
                <Button
                  variant="default"
                  className="bg-primary text-white flex items-center gap-3 hover:bg-primary-dark transition-all duration-200 ease-in-out w-full sm:w-auto"
                >
                  <Video className="w-6 h-6" />
                  Start Video Call
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer: Call Controls */}
        <div className="flex flex-wrap justify-between items-center mt-8 space-x-6">
          <Button
            variant="ghost"
          
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 w-full sm:w-auto"
            onClick={onClose}
          >
            End Call
          </Button>
          <div className="flex items-center space-x-4 w-full sm:w-auto mt-4 sm:mt-0">
            <Button
              variant="ghost"
            
              onClick={handleMuteToggle}
              className={cn("text-lg", {
                "text-red-500": isMuted,
                "text-gray-800 dark:text-gray-200": !isMuted,
              })}
            >
              <Mic className="w-6 h-6" />
              {isMuted ? "Unmute" : "Mute"}
            </Button>
            <Button
              variant="ghost"
            
              onClick={handleVideoToggle}
              className={cn("text-lg", {
                "text-red-500": isVideoOff,
                "text-gray-800 dark:text-gray-200": !isVideoOff,
              })}
            >
              <Camera className="w-6 h-6" />
              {isVideoOff ? "Turn On Video" : "Turn Off Video"}
            </Button>
          </div>
        </div>

        {/* Close button */}
        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button
              variant="ghost"
            
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all duration-200 ease-in-out"
            >
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
