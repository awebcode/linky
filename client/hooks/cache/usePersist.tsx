import { StateStorage } from "zustand/middleware";
import { get, set, del, clear } from "idb-keyval";

export const zustandIndexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};


// Function to reset all persisted Zustand states
export const resetZustandPersistedState = async (): Promise<void> => {
  try {
    await clear(); // Clears all data from IndexedDB
    console.log("Persisted state cleared!");
  } catch (error) {
    console.error("Failed to clear persisted state:", error);
  }
};
