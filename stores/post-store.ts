import { create } from "zustand"
import type { PaginationMeta, Post } from "@/types"
import { postService } from "@/lib/api"
import { useAuthStore } from "./auth-store"

interface PostState {
  posts: Post[]
  myPosts: Post[]
  meta: PaginationMeta | null
  myMeta: PaginationMeta | null
  isLoading: boolean
  isMyPostsLoading: boolean

  fetchPosts: (page?: number) => Promise<void>
  fetchMyPosts: (page?: number) => Promise<void>
  addPost: (post: Post) => void
  updatePost: (post: Post) => void
  removePost: (id: number) => void
  toggleReaction: (postId: number) => Promise<void>
  incrementCommentCount: (postId: number) => void
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  myPosts: [],
  meta: null,
  myMeta: null,
  isLoading: false,
  isMyPostsLoading: false,

  fetchPosts: async (page = 1) => {
    set({ isLoading: true })

    try {
      const response = await postService.getAll(page)

      set((state) => ({
        posts: page === 1 ? response.data : [...state.posts, ...response.data],
        meta: response.meta,
      }))
    } finally {
      set({ isLoading: false })
    }
  },

  fetchMyPosts: async (page = 1) => {
    set({ isMyPostsLoading: true })

    try {
      const response = await postService.getMyPosts(page)

      set((state) => ({
        myPosts: page === 1 ? response.data : [...state.myPosts, ...response.data],
        myMeta: response.meta,
      }))
    } finally {
      set({ isMyPostsLoading: false })
    }
  },

  addPost: (post) => {
    set((state) => ({
      posts: [post, ...state.posts],
      myPosts: [post, ...state.myPosts],
    }))
    useAuthStore.getState().fetchProfile()
  },

  updatePost: (updatedPost) => {
    const updater = (post: Post) =>
      post.id === updatedPost.id ? updatedPost : post
    set((state) => ({
      posts: state.posts.map(updater),
      myPosts: state.myPosts.map(updater),
    }))
  },

  removePost: (id) => {
    const filterer = (post: Post) => post.id !== id
    set((state) => ({
      posts: state.posts.filter(filterer),
      myPosts: state.myPosts.filter(filterer),
    }))
    useAuthStore.getState().fetchProfile()
  },

  toggleReaction: async (postId) => {
    try {
      const result = await postService.toggleReaction(postId)

      const updater = (post: Post) =>
        post.id === postId
          ? {
              ...post,
              is_reacted: result.is_reacted,
              reactions_count: result.reactions_count,
            }
          : post

      set((state) => ({
        posts: state.posts.map(updater),
        myPosts: state.myPosts.map(updater),
      }))
      useAuthStore.getState().fetchProfile()
    } catch (error) {
      console.error("Failed to toggle reaction:", error)
    }
  },

  incrementCommentCount: (postId) => {
    const updater = (post: Post) =>
      post.id === postId
        ? {
            ...post,
            comments_count: (post.comments_count || 0) + 1,
          }
        : post

    set((state) => ({
      posts: state.posts.map(updater),
      myPosts: state.myPosts.map(updater),
    }))
    useAuthStore.getState().fetchProfile()
  },
}))
