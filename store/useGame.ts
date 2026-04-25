import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  connectGameWS,
  sendWS,
  disconnectWS,
  removeListener,
} from "@/lib/gameSocket";

type Winner = {
  name: string;
  card: any[][];
};

type GameState = {
  // ===== GAME =====
  calledNumbers: number[];
  currentNumber: number | null;
  countdown: number;
  card: any[][] | null;
  balance: number;
  // ✅ NEW
  winner: Winner | null;

  // ===== LOBBY =====
  available: number[];
  taken: number[];
  selected: number | null;
  jackpot: number;

  // ===== META =====
  stake: number;
  isConnected: boolean;

  _handler?: (msg: any) => void;

  // ===== ACTIONS =====
  setStake: (stake: number) => void;
  connect: (stake: number, rejoin?: boolean) => void;
  disconnect: () => void;
  sendBingo: () => void;
  selectCard: (cardId: number) => void;

  // ======= rejoin ====
  activeGame: {
    stake: number;
    state: string;
  } | null;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // ===== GAME =====
      calledNumbers: [],
      currentNumber: null,
      countdown: 0,
      card: null,
      balance: 0,
      // ✅ NEW
      winner: null,

      activeGame: null,

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
      // SET STAKE
      // ==========================
      setStake: (stake) => set({ stake }),

      // ==========================
      // CONNECT
      // ==========================
      connect: (stake: number, rejoin = false) => {
        const { isConnected } = get();
        if (isConnected) return;

        // 🔥 IMPORTANT: set active game immediately
        set({
          activeGame: {
            stake,
            state: rejoin ? "playing" : "waiting",
          },
        });
        const handler = (msg: any) => {
          const { type, data } = msg;

          switch (type) {
            // ==========================
            // INIT
            // ==========================
            case "init":
              set({
                calledNumbers: data.called || [],
                countdown: data.countdown || 0,

                // ✅ FIX: restore last number properly
                currentNumber: data.called?.length
                  ? data.called[data.called.length - 1]
                  : null,
              });
              break;
            case "balance":
              set({ balance: data });
              break;
            // ==========================
            // CARD
            // ==========================
            case "card":
              set({ card: data.grid });
              break;

            // ==========================
            // NUMBER CALL
            // ==========================
            case "number":
              set((state) => {
                const exists = state.calledNumbers.includes(data);

                return {
                  currentNumber: data,
                  calledNumbers: exists
                    ? state.calledNumbers
                    : [...state.calledNumbers, data],
                };
              });
              break;

            // ==========================
            // COUNTDOWN
            // ==========================
            case "countdown":
              set((s) => ({
                countdown: data,
                activeGame: s.activeGame
                  ? { ...s.activeGame, state: "countdown" }
                  : null,
              }));
              break;

            // ==========================
            // GAME START (RESET ROUND UI)
            // ==========================
            case "start":
              set((s) => ({
                winner: null,
                calledNumbers: [],
                currentNumber: null,
                countdown: 0,
                activeGame: s.activeGame
                  ? { ...s.activeGame, state: "playing" }
                  : null,
              }));
              break;

            // ==========================
            // WINNER 🎉
            // ==========================
            case "winner":
              set({
                winner: {
                  name: data.name,
                  card: data.card,
                },
              });
              break;

            // ==========================
            // ROUND RESET (SERVER FORCES RESET)
            // ==========================
            case "round_reset":
              set({
                calledNumbers: [],
                currentNumber: null,
                countdown: 0,
                card: null,
                selected: null,
                winner: null,
                activeGame: null, // ✅ important
              });
              break;

            case "active_game":
              set((s) => ({
                activeGame: s.activeGame
                  ? s.activeGame
                  : {
                      stake,
                      state: rejoin ? "playing" : "waiting",
                    },
              }));
              break;
            // ==========================
            // LOBBY
            // ==========================
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
            case "game_finished":
              set({
                activeGame: null,
                calledNumbers: [],
                currentNumber: null,
                countdown: 0,
              });
              break;

            default:
              console.log("⚠️ Unknown WS event:", type);
          }
        };

        connectGameWS(handler, () => {
          sendWS({
            type: "join",
            stake,
          });
        });

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
          winner: null,

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
    }),
    {
      name: "game-storage",

      partialize: (state) => ({
        stake: state.stake,
        activeGame: state.activeGame, // ✅ ADD THIS
      }),
    },
  ),
);
