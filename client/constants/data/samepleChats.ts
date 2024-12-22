import type { ChatThread } from "@/components/chat/v0/types";
export const currentUser = {
    id: "1",
    name: "You",
    avatar: "/placeholder.svg",
}
export const sampleChats: ChatThread[] = [
  {
    id: "1",
    user: {
      id: "2",
      name: "Patrick Hendricks",
      avatar: "/placeholder.svg",
      online: true,
    },
    lastMessage: {
      id: "1",
      content: "Hey! How are you doing?",
      timestamp: "02:50 PM",
      sender: currentUser,
    },
    timestamp: "02:50 PM",
    unreadCount: 0,
  },
  {
    id: "2",
    user: {
      id: "3",
      name: "Emily Johnson",
      avatar: "/placeholder.svg",
      online: false,
    },
    lastMessage: {
      id: "2",
      content: "Can we reschedule our meeting?",
      timestamp: "10:23 AM",
      sender: { id: "3", name: "Emily Johnson", avatar: "/placeholder.svg" },
    },
    timestamp: "10:23 AM",
    unreadCount: 2,
  },
  {
    id: "3",
    user: {
      id: "4",
      name: "Alex Thompson",
      avatar: "/placeholder.svg",
      online: true,
    },
    lastMessage: {
      id: "3",
      content: "I've sent you the project files.",
      timestamp: "Yesterday",
      sender: { id: "4", name: "Alex Thompson", avatar: "/placeholder.svg" },
    },
    timestamp: "Yesterday",
    unreadCount: 0,
  },
  {
    id: "4",
    user: {
      id: "5",
      name: "Sarah Parker",
      avatar: "/placeholder.svg",
      online: false,
    },
    lastMessage: {
      id: "4",
      content: "Great job on the presentation!",
      timestamp: "Monday",
      sender: currentUser,
    },
    timestamp: "Monday",
    unreadCount: 0,
  },
  {
    id: "5",
    user: {
      id: "6",
      name: "Michael Roberts",
      avatar: "/placeholder.svg",
      online: true,
    },
    lastMessage: {
      id: "5",
      content: "Are we still on for lunch tomorrow?",
      timestamp: "Sunday",
      sender: { id: "6", name: "Michael Roberts", avatar: "/placeholder.svg" },
    },
    timestamp: "Sunday",
    unreadCount: 1,
  },
];
