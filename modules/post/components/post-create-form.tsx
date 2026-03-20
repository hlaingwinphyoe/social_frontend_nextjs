"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sparkles } from "lucide-react"
import { usePostStore } from "@/stores"
import { postService } from "@/lib/api"
import { postSchema, type PostFormValues } from "@/validations"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldDescription, FieldError } from "@/components/ui/field"
import { Card, CardContent } from "@/components/ui/card"
import { MediaUpload } from "@/components/media-upload"
import { toast } from "sonner"
import { AxiosError } from "axios"

const MAX_CONTENT_LENGTH = 500

export function CreatePostForm() {
  const addPost = usePostStore((s) => s.addPost)
  const [isLoading, setIsLoading] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "" },
  })

  const contentValue = watch("content")
  const characterCount = contentValue?.length ?? 0
  const isContentEmpty = characterCount === 0
  const isOverLimit = characterCount > MAX_CONTENT_LENGTH
  const isVideo = mediaFile?.type.startsWith("video/")

  const generateTitle = (content: string): string => {
    const firstSentence = content.match(/^[^.!?]+[.!?]/)
    if (firstSentence) return firstSentence[0].trim()

    return content.length > 60 ? `${content.slice(0, 60)}…` : content
  }

  const onSubmit = async (values: PostFormValues) => {
    setIsLoading(true)

    try {
      const title = generateTitle(values.content)
      const post = await postService.create({
        ...values,
        title,
        image: mediaFile,
      })
      addPost(post)
      reset()
      handleRemoveMedia()
      toast.success("Post created successfully!")
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to create post!")
      } else {
        toast.error("Failed to create post!")
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
    if (mediaPreview) URL.revokeObjectURL(mediaPreview)
    setMediaFile(null)
    setMediaPreview(null)
  }

  return (
    <Card className="rounded-2xl shadow-xl">
      <CardContent>
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-white">
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </div>
          <h2 className="text-sm font-medium sm:text-lg">Create a post</h2>
        </div>

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
            disabled={isLoading || isContentEmpty}
          >
            {isLoading ? "Posting…" : "Share Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
