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
  rooms: any[];

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
  persistSession: {
    stake: number;
    inGame: boolean;
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
      persistSession: null,
      // ===== LOBBY =====
      available: [],
      taken: [],
      selected: null,
      jackpot: 0,
      rooms: [],
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
        const { _handler } = get();

        // 🔥 ALWAYS clean previous connection
        if (_handler) {
          removeListener(_handler);
        }

        disconnectWS();

        // 🔥 set session state
        set({
          stake,
          activeGame: {
            stake,
            state: rejoin ? "playing" : "waiting",
          },
          persistSession: {
            stake,
            inGame: true,
          },
        });

        const handler = (msg: any) => {
          const { type, data } = msg;

          switch (type) {
            // ==========================
            // LOBBY ROOMS
            // ==========================
            case "rooms":
              set({ rooms: data });
              break;

            // ==========================
            // CARD (FIXED)
            // ==========================
            case "card":
              set({ card: data }); // ✅ backend sends raw card
              break;

            // ==========================
            // INIT
            // ==========================
            case "init":
              set({
                calledNumbers: data.called || [],
                countdown: data.countdown || 0,
                currentNumber: data.called?.length
                  ? data.called[data.called.length - 1]
                  : null,
              });
              break;

            // ==========================
            // NUMBER
            // ==========================
            case "number":
              set((state) => {
                if (state.calledNumbers.includes(data)) return state;

                return {
                  currentNumber: data,
                  calledNumbers: [...state.calledNumbers, data],
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
            // START
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
            // WINNER
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
            // RESET
            // ==========================
            case "round_reset":
            case "game_finished":
              set({
                calledNumbers: [],
                currentNumber: null,
                countdown: 0,
                card: null,
                selected: null,
                winner: null,
                activeGame: null,
                persistSession: null,
              });
              break;

            // ==========================
            // LOBBY CARDS
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

            default:
              console.log("⚠️ Unknown WS event:", type);
          }
        };

        // 🔥 connect fresh every time
        connectGameWS(handler, () => {
          if (rejoin) {
            sendWS({ type: "rejoin", stake });
          } else {
            sendWS({ type: "join", stake });
          }
        });

        set({
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
