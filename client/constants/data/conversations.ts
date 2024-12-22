export const conversations = [
  {
    id: 1,
    name: "Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    lastMessage: "Sure, let's meet tomorrow!",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    lastMessage: "The project is coming along nicely",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    lastMessage: "Thanks for your help!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 4,
    name: "Team Chat",
    avatar: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=150&h=150&fit=crop",
    lastMessage: "Meeting at 3 PM",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    unreadCount: 5,
    isOnline: true,
  }
];