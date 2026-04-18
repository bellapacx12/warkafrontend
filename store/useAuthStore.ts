import { create } from "zustand";

type User = {
  id: number;
  telegram_id: number;
  name: string;
  phone: string;
  balance: number;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoaded: boolean;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoaded: false,

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({ user: null, token: null });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      set({
        token,
        user: JSON.parse(userStr),
        isLoaded: true,
      });
    } else {
      set({ isLoaded: true });
    }
  },
}));
