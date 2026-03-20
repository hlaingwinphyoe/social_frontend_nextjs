"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { postService } from "@/lib/api"
import { commentSchema, type CommentFormValues } from "@/validations"
import type { Comment } from "@/types"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { DefaultAvatar } from "@/components/ui/default-avatar"

interface CommentFormProps {
  postId: number
  onSuccess: (comment: Comment) => void
}

export function CommentForm({ postId, onSuccess }: CommentFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  })

  const onSubmit = async (values: CommentFormValues) => {
    setIsLoading(true)

    try {
      const comment = await postService.createComment(postId, values)
      onSuccess(comment)
      reset()
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "Failed to create comment!"
        )
      } else {
        toast.error("Failed to create comment!")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
      <DefaultAvatar />
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <Field>
            <Input
              {...field}
              placeholder="Write a comment…"
              className="h-8 bg-white!"
            />
            <FieldError errors={[errors.content]} />
          </Field>
        )}
      />

      <Button type="submit" size="icon" disabled={isLoading}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
