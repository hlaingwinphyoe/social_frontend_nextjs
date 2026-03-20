"use client"

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { useEffect } from "react"
import { usePostStore } from "@/stores"
import { PostCard } from "./post-card"
import { PostEmpty } from "./post-empty"
import { PostSkeleton } from "./post-skeleton"
import { Spinner } from "@/components/ui/spinner"

export function PostFeed() {
  const { posts, meta, isLoading, fetchPosts } = usePostStore()

  const hasMore = meta ? meta.current_page < meta.last_page : false

  const feedPostsRef = useInfiniteScroll({
    hasMore,
    isLoading,
    rootMargin: "200px",
    onLoadMore: () => {
      if (meta) {
        fetchPosts(meta.current_page + 1)
      }
    },
  })

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    )
  }

  // Empty state
  if (posts.length === 0 && !isLoading) {
    return <PostEmpty />
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <div ref={feedPostsRef} className="h-1" />

      {isLoading && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </div>
  )
}
