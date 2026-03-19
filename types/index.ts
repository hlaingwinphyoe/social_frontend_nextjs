// Auth
export interface User {
  id: number
  name: string
  email: string
  posts_count: number
  reactions_count: number
  comments_count: number
  created_at: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  message: string
  user: User
  access_token: string
}

// API Error ----
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
