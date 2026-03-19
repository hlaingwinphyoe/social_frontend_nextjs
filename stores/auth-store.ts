import { create } from "zustand"
import type { LoginPayload, RegisterPayload, User } from "@/types"
import { authService } from "@/lib/api"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  fetchProfile: () => Promise<void>
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isLoading: false,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false,

  setAuth: (user, token) => {
    localStorage.setItem("token", token)
    set({ user, token, isAuthenticated: true })
  },

  clearAuth: () => {
    localStorage.removeItem("token")
    set({ user: null, token: null, isAuthenticated: false })
  },

  login: async (payload) => {
    set({ isLoading: true })

    try {
      const { user, access_token } = await authService.login(payload)
      localStorage.setItem("token", access_token)
      set({ user, token: access_token, isAuthenticated: true })
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (payload) => {
    set({ isLoading: true })

    try {
      const { user, access_token } = await authService.register(payload)
      localStorage.setItem("token", access_token)
      set({ user, token: access_token, isAuthenticated: true })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    set({ isLoading: true })

    try {
      await authService.logout()
    } finally {
      localStorage.removeItem("token")
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },

  fetchProfile: async () => {
    set({ isLoading: true })

    try {
      const user = await authService.getProfile()
      set({ user, isAuthenticated: true })
    } catch {
      localStorage.removeItem("token")
      set({ user: null, token: null, isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },
}))
