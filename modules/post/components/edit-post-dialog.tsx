"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sparkles } from "lucide-react"
import type { Post } from "@/types"
import { usePostStore } from "@/stores"
import { postService } from "@/lib/api"
import { postSchema, type PostFormValues } from "@/validations"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldDescription, FieldError } from "@/components/ui/field"
import { MediaUpload } from "@/components/media-upload"
import { toast } from "sonner"
import { AxiosError } from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const MAX_CONTENT_LENGTH = 500

interface EditPostDialogProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPostDialog({ post, open, onOpenChange }: EditPostDialogProps) {
  const updatePost = usePostStore((s) => s.updatePost)
  const [isLoading, setIsLoading] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(post.image || null)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: post.title || "", content: post.content },
  })

  useEffect(() => {
    if (open) {
      reset({ title: post.title || "", content: post.content })
      setMediaPreview(post.image || null)
      setMediaFile(null)
    }
  }, [open, post, reset])

  const contentValue = watch("content")
  const characterCount = contentValue?.length ?? 0
  const isContentEmpty = characterCount === 0
  const isOverLimit = characterCount > MAX_CONTENT_LENGTH
  const isVideo = mediaFile?.type.startsWith("video/") || false // simplified, can check original vs new if needed

  const generateTitle = (content: string): string => {
    const firstSentence = content.match(/^[^.!?]+[.!?]/)
    if (firstSentence) return firstSentence[0].trim()

    return content.length > 60 ? `${content.slice(0, 60)}…` : content
  }

  const onSubmit = async (values: PostFormValues) => {
    setIsLoading(true)

    try {
      const title = generateTitle(values.content)
      const updatedPost = await postService.update(post.id, {
        ...values,
        title,
        image: mediaFile || undefined,
      })
      updatePost(updatedPost)
      toast.success("Post updated successfully!")
      onOpenChange(false)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to update post!")
      } else {
        toast.error("Failed to update post!")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (file: File) => {
    setMediaFile(file)
    setMediaPreview(URL.createObjectURL(file))
  }

  const handleRemoveMedia = () => {
    if (mediaPreview && mediaPreview.startsWith("blob:")) URL.revokeObjectURL(mediaPreview)
    setMediaFile(null)
    setMediaPreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="default">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-white">
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </div>
            <DialogTitle>Edit post</DialogTitle>
          </div>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Field>
                <Textarea
                  {...field}
                  placeholder="What's happening in your world?"
                  className="bg-white!"
                  rows={5}
                />
                <FieldDescription
                  className={`text-right ${isOverLimit ? "text-destructive" : ""}`}
                >
                  {characterCount}/{MAX_CONTENT_LENGTH}
                </FieldDescription>
                <FieldError errors={[errors.content]} />
              </Field>
            )}
          />

          <MediaUpload
            onFileSelect={handleFileSelect}
            onFileRemove={handleRemoveMedia}
            preview={mediaPreview}
            isVideo={isVideo}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isContentEmpty || isOverLimit}
          >
            {isLoading ? "Updating…" : "Update Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
