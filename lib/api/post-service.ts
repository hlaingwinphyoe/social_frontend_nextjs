import type {
  Comment,
  CreateCommentPayload,
  CreatePostPayload,
  PaginatedResponse,
  Post,
  UpdatePostPayload,
} from "@/types"
import apiClient from "./api"

export const postService = {
  async getAll(page = 1, limit = 7): Promise<PaginatedResponse<Post>> {
    const { data } = await apiClient.get<PaginatedResponse<Post>>("/posts", {
      params: { page, limit },
    })
    return data
  },

  async getMyPosts(page = 1, limit = 7): Promise<PaginatedResponse<Post>> {
    const { data } = await apiClient.get<PaginatedResponse<Post>>("/my-posts", {
      params: { page, limit },
    })
    return data
  },

  async create(payload: CreatePostPayload): Promise<Post> {
    const formData = new FormData()
    formData.append("title", payload.title)
    formData.append("content", payload.content)

    if (payload.image) {
      formData.append("image", payload.image)
    }

    const { data } = await apiClient.post<{ post: Post }>("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data.post
  },

  async update(id: number, payload: UpdatePostPayload): Promise<Post> {
    const formData = new FormData()
    formData.append("title", payload.title)
    formData.append("content", payload.content)
    formData.append("_method", "PUT")

    if (payload.image) {
      formData.append("image", payload.image)
    }

    const { data } = await apiClient.post<{ post: Post }>(
      `/posts/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    return data.post
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/posts/${id}`)
  },

  // Reaction
  async toggleReaction(
    postId: number,
    type: string = "like"
  ): Promise<{ is_reacted: boolean; reactions_count: number }> {
    const { data } = await apiClient.post<{ status: string; count: number }>(
      `/posts/${postId}/reaction`,
      { type }
    )
    return {
      is_reacted: data.status === "added",
      reactions_count: data.count,
    }
  },

  async getComments(
    postId: number,
    limit = 10
  ): Promise<PaginatedResponse<Comment>> {
    const { data } = await apiClient.get<PaginatedResponse<Comment>>(
      `/posts/${postId}/comments`,
      { params: { limit } }
    )
    return data
  },

  // Comments
  async createComment(
    postId: number,
    payload: CreateCommentPayload
  ): Promise<Comment> {
    const { data } = await apiClient.post<{ comment: Comment }>(
      `/posts/${postId}/comments`,
      payload
    )
    return data.comment
  },
}
