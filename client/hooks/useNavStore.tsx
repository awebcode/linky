import { create } from "zustand";
import { MessageSquare, Phone, Users, Bell, Settings, UserCog } from "lucide-react";
import { createJSONStorage, persist } from "zustand/middleware";

// NavId type from NAVIGATION_MENUS

export interface Nav {
  id: NavId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  navPosition: NavPosition;
  isMobile: boolean;
}

// Zustand store for active Nav
interface NavState {
  activeNav: NavId;
  setActiveNav: (nav: NavId) => void;
}

export const useNavStore = create<NavState>()(
  persist(
    (set) => ({
      activeNav: "chats", // Default Nav
      setActiveNav: (nav) => set({ activeNav: nav }),
    }),
    {
      name: "nav-storage", // Key used to store the state in sessionStorage
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
    }
  )
);

// Type definitions
export type NavPosition = "top" | "middle" | "bottom";

export const NAVIGATION_MENUS = [
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
] as const;

export type NavId = (typeof NAVIGATION_MENUS)[number]["id"]; // Infer