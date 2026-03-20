"use client"

import { useState } from "react"
import type { Comment, Post } from "@/types"
import { Heart, MessageCircle, Trash2 } from "lucide-react"
import { useAuthStore, usePostStore } from "@/stores"
import Image from "next/image"

import { CommentForm } from "./comment-form"
import { CommentList } from "./comment-list"
import { Button } from "@/components/ui/button"
import { DefaultAvatar } from "@/components/ui/default-avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { postService } from "@/lib/api"
import { AxiosError } from "axios"
import { Skeleton } from "@/components/ui/skeleton"

interface PostCardProps {
  post: Post
}

import { useEffect } from "react"

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuthStore()
  const toggleReaction = usePostStore((s) => s.toggleReaction)
  const removePost = usePostStore((s) => s.removePost)
  const incrementCommentCount = usePostStore((s) => s.incrementCommentCount)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleReaction = async () => {
    await toggleReaction(post.id)
  }

  const handleNewComment = (comment: Comment) => {
    setComments((prev) => [comment, ...prev])
    incrementCommentCount(post.id)
  }

  useEffect(() => {
    if (showComments && comments.length === 0) {
      const fetchComments = async () => {
        setIsLoadingComments(true)
        try {
          const response = await postService.getComments(post.id, 20)
          setComments(response.data)
        } catch (error) {
          console.error("Failed to load comments:", error)
        } finally {
          setIsLoadingComments(false)
        }
      }
      fetchComments()
    }
  }, [showComments, post.id, comments.length])

  const handleDeletePost = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await postService.delete(post.id)
      removePost(post.id)
      toast.success("Post deleted successfully")
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to delete post!")
      } else {
        toast.error("Failed to delete post!")
      }
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DefaultAvatar size={40} />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {post.user?.name || "Unknown User"}
              </p>
              <p className="text-xs text-muted-foreground">{post.created_at}</p>
            </div>
          </div>
          {post.user_id === user?.id && (
            <Button variant="ghost" size="icon" onClick={handleDeletePost}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
        {/* Content */}
        <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
          {post.content}
        </p>
      </div>
      {post.image && (
        <div className="relative aspect-video w-full border-y bg-gray-50">
          <Image
            src={post.image}
            alt="Post media"
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            priority
          />
        </div>
      )}

      <hr />

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-2">
        <Button
          variant="ghost"
          onClick={handleToggleReaction}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            post.is_reacted
              ? "text-red-500"
              : "text-muted-foreground hover:text-red-500"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${post.is_reacted ? "fill-current" : ""}`}
          />
          <span>{post.reactions_count}</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments_count}</span>
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4 border-t p-4">
          <CommentForm postId={post.id} onSuccess={handleNewComment} />
          {isLoadingComments ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-2">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                  <Skeleton className="h-14 grow rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <CommentList comments={comments} />
          )}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirm()
              }}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
