import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { authApi } from "../api/authApi";
import { User } from "../types";

type AuthState = {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  register: (payload: { fullName: string; phone: string; email?: string; password: string; flatNumber: string }) => Promise<void>;
  refreshMe: () => Promise<void>;
  setSession: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const TOKEN_KEY = "mohalla_token";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isHydrated: false,
  hydrate: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ isHydrated: true });
      return;
    }
    set({ token });
    try {
      await get().refreshMe();
    } finally {
      set({ isHydrated: true });
    }
  },
  setSession: async (user, token) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    set({ user, token });
  },
  login: async (identifier, password) => {
    const response: any = await authApi.login({ identifier, password });
    await get().setSession(response.data.user, response.data.token);
  },
  register: async (payload) => {
    const response: any = await authApi.register(payload);
    await get().setSession(response.data.user, response.data.token);
  },
  refreshMe: async () => {
    const response: any = await authApi.me();
    set({ user: response.data.user });
  },
  logout: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null });
  }
}));
