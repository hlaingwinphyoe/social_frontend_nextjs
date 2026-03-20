import { create } from "zustand"
import type { PaginationMeta, Post } from "@/types"
import { postService } from "@/lib/api"

interface PostState {
  posts: Post[]
  meta: PaginationMeta | null
  isLoading: boolean

  fetchPosts: (page?: number) => Promise<void>
  addPost: (post: Post) => void
  updatePost: (post: Post) => void
  removePost: (id: number) => void
  toggleReaction: (postId: number) => Promise<void>
  incrementCommentCount: (postId: number) => void
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  meta: null,
  isLoading: false,

  fetchPosts: async (page = 1) => {
    set({ isLoading: true })

    try {
      const response = await postService.getAll(page)
      const currentPosts = page === 1 ? [] : get().posts

      set({
        posts: [...currentPosts, ...response.data],
        meta: response.meta,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  addPost: (post) => {
    set((state) => ({ posts: [post, ...state.posts] }))
  },

  updatePost: (updatedPost) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    }))
  },

  removePost: (id) => {
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== id),
    }))
  },

  toggleReaction: async (postId) => {
    try {
      const result = await postService.toggleReaction(postId)

      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_reacted: result.is_reacted,
                reactions_count: result.reactions_count,
              }
            : post
        ),
      }))
    } catch (error) {
      console.error("Failed to toggle reaction:", error)
    }
  },

  incrementCommentCount: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments_count: (post.comments_count || 0) + 1,
            }
          : post
      ),
    }))
  },
}))
