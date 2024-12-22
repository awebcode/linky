import { create } from 'zustand';

interface SidebarStore {
  isOpen: boolean;
  width: number;
  setWidth: (width: number) => void;
  toggle: () => void;
}
const WIDTH=320
const SIDEBAR_WIDTH_MOBILE = 280
const SIDEBAR_WIDTH_DESKTOP = 480

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: true,
  width: WIDTH,
  setWidth: (width) => set({ width: Math.max(SIDEBAR_WIDTH_MOBILE, Math.min(width, SIDEBAR_WIDTH_DESKTOP)) }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));