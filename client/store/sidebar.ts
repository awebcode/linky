import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  width: number;
  setWidth: (width: number) => void;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  width: 320,
  setWidth: (width) => set({ width: Math.max(280, Math.min(width, 600)) }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));