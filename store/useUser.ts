import { create } from "zustand";

type UserState = {
  userId: number;
  setUser: (id: number) => void;
};

export const useUserStore = create<UserState>((set) => ({
  userId: 1, // default (replace with real login later)
  setUser: (id) => set({ userId: id }),
}));
