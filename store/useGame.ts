import { create } from "zustand";

type GameState = {
  stake: number | null;
  setStake: (stake: number) => void;
};

export const useGameStore = create<GameState>((set) => ({
  stake: null,
  setStake: (stake) => set({ stake }),
}));
