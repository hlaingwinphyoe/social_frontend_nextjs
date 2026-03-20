import { z } from "zod"

// Create / Update Post Schema
export const postSchema = z.object({
  title: z.string().min(0),
  content: z
    .string()
    .min(1, "Post content is required")
    .max(500, "Must be 500 characters or fewer"),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) =>
        !file ||
        file.type.startsWith("image/") ||
        file.type.startsWith("video/"),
      "Only image or video allowed"
    )
    .refine((file) => !file || file.size <= 10 * 1024 * 1024, "Max 10MB"),
})

export type PostFormValues = z.infer<typeof postSchema>

// Comment Schema
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment is required")
    .max(500, "Must be 500 characters or fewer"),
})

export type CommentFormValues = z.infer<typeof commentSchema>
