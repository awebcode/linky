import { create } from "zustand";


// Extract the `id` type from SIDEBAR_TABS
export type TabId =  "all" | "unread" | "favorite" | "groups"

// Zustand store with properly typed state
interface TabState {
  activeTab: TabId; // Enforce valid tab IDs
  setActiveTab: (tab: TabId) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: "all", // Default value must match TabId type
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
