import { create } from "zustand";
import { MessageSquare, Phone, Users, Bell, Settings, UserCog } from "lucide-react";
import { createJSONStorage, persist } from "zustand/middleware";
// Zustand store for active Nav
interface NavState {
  activeNav: NavId;
  setActiveNav: (Nav: NavId) => void;
}

export const useNavStore = create<NavState>()(
  persist(
    (set) => ({
      activeNav: "chats", // Default Nav
      setActiveNav: (Nav) => set({ activeNav: Nav }),
    }),
    {
      name: "nav-storage", // Key used to store the state in localStorage or sessionStorage
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export const NAVIGATION_MENUS: Nav[] = [
  {
    id: "chats",
    label: "Chats",
    icon: MessageSquare,
    navPosition: "top",
    isMobile: true, // Show on mobile
  },
  {
    id: "groups",
    label: "Groups",
    icon: Users,
    navPosition: "top",
    isMobile: false, // Show on mobile
  },
  {
    id: "profile",
    label: "Profile",
    icon: UserCog,
    navPosition: "middle",
    isMobile: true, // Show on mobile
  },
  {
    id: "calls",
    label: "Calls",
    icon: Phone,
    navPosition: "middle",
    isMobile: false, // Show on mobile
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: Users,
    navPosition: "middle",
    isMobile: true, // Show on mobile
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    navPosition: "bottom",
    isMobile: false, // Hide on mobile
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    navPosition: "bottom",
    isMobile: true, // Hide on mobile
  },
];


export type NavId = "chats" | "groups" | "profile"| "calls" | "contacts" | "notifications" | "settings";
export type navPosition = "top" | "middle" | "bottom";

export interface Nav {
  id: NavId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  navPosition: navPosition;
  isMobile: boolean;
}