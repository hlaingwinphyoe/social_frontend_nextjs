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
  user: User
  access_token: string
}

// Post
export interface Post {
  id: number
  user_id: number
  title: string
  content: string
  image: string | null
  reactions_count: number
  comments_count: number
  is_reacted: boolean
  user?: User
  comments?: Comment[]
  created_at: string
}

export interface CreatePostPayload {
  title: string
  content: string
  image?: File | null
}

export interface UpdatePostPayload {
  title: string
  content: string
  image?: File | null
}

// Comment
export interface Comment {
  id: number
  post_id: number
  user_id: number
  content: string
  user?: User
  created_at: string
}

export interface CreateCommentPayload {
  content: string
}

// Pagination
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// API Error
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
