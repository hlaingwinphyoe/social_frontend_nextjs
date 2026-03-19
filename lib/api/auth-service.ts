import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types"
import apiClient from "./api"

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/login", payload)
    return data
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/register", payload)
    return data
  },

  async logout(): Promise<void> {
    await apiClient.post("/logout")
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<{ data: User }>("/profile")
    return data.data
  },
}
