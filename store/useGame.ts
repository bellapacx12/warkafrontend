import { create } from "zustand";
import {
  connectGameWS,
  sendWS,
  disconnectWS,
  removeListener,
} from "@/lib/gameSocket";

type GameState = {
  // ===== GAME =====
  calledNumbers: number[];
  currentNumber: number | null;
  countdown: number;
  card: any[][] | null;

  // ===== LOBBY =====
  available: number[];
  taken: number[];
  selected: number | null;
  jackpot: number;

  // ===== META =====
  stake: number;
  isConnected: boolean;

  // internal
  _handler?: (msg: any) => void;

  // ===== ACTIONS =====
  connect: (stake: number) => void;
  disconnect: () => void;
  sendBingo: () => void;
  selectCard: (cardId: number) => void;
};

export const useGameStore = create<GameState>()((set, get) => ({
  // ===== GAME =====
  calledNumbers: [],
  currentNumber: null,
  countdown: 0,
  card: null,

  // ===== LOBBY =====
  available: [],
  taken: [],
  selected: null,
  jackpot: 0,

  // ===== META =====
  stake: 0,
  isConnected: false,

  _handler: undefined,

  // ==========================
  // CONNECT
  // ==========================
  connect: (stake: number) => {
    const { isConnected, _handler } = get();

    // ✅ prevent duplicate connections
    if (isConnected) return;

    const handler = (msg: any) => {
      const { type, data } = msg;

      switch (type) {
        // ===== GAME =====
        case "init":
          set({
            calledNumbers: data.called || [],
            countdown: data.countdown || 0,
          });
          break;

        case "card":
          set({ card: data.grid });
          break;

        case "number":
          set((state) => ({
            currentNumber: data,
            calledNumbers: [...state.calledNumbers, data],
          }));
          break;

        case "countdown":
          set({ countdown: data });
          break;

        // ===== LOBBY =====
        case "cards":
          set({ available: data.map((c: any) => c.card_id) });
          break;

        case "taken_cards":
          set({ taken: data });
          break;

        case "card_taken":
          set((s) => ({
            taken: s.taken.includes(data) ? s.taken : [...s.taken, data],
          }));
          break;

        case "card_selected":
          set({ selected: data.card_id });
          break;

        case "jackpot":
          set({ jackpot: data });
          break;

        case "start":
          console.log("🎮 Game started!");
          break;

        case "winner":
          console.log("🏆 Winner:", data);
          break;

        default:
          console.log("Unknown:", msg);
      }
    };

    // 🔌 connect WS
    connectGameWS(handler, () => {
      sendWS({
        type: "join",
        stake,
      });
    });

    // store handler safely
    set({
      stake,
      isConnected: true,
      _handler: handler,
    });
  },

  // ==========================
  // DISCONNECT
  // ==========================
  disconnect: () => {
    const { _handler } = get();

    if (_handler) {
      removeListener(_handler);
    }

    disconnectWS();

    set({
      calledNumbers: [],
      currentNumber: null,
      countdown: 0,
      card: null,

      available: [],
      taken: [],
      selected: null,
      jackpot: 0,

      isConnected: false,
      _handler: undefined,
    });
  },

  // ==========================
  // ACTIONS
  // ==========================
  sendBingo: () => {
    sendWS({ type: "bingo" });
  },

  selectCard: (cardId: number) => {
    sendWS({
      type: "select_card",
      card_id: cardId,
    });
  },
}));
