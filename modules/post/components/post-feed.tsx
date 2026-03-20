"use client"

import { useCallback, useEffect, useRef } from "react"
import { usePostStore } from "@/stores"
import { PostCard } from "./post-card"
import { PostEmpty } from "./post-empty"

import { PostSkeleton } from "./post-skeleton"

export function PostFeed() {
  const { posts, meta, isLoading, fetchPosts } = usePostStore()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const feedPostsRef = useRef<HTMLDivElement | null>(null)

  const hasMore = meta ? meta.current_page < meta.last_page : false

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (!entry.isIntersecting || isLoading || !hasMore || !meta) return

      fetchPosts(meta.current_page + 1)
    },
    [isLoading, hasMore, meta, fetchPosts]
  )

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
    })

    if (feedPostsRef.current) {
      observerRef.current.observe(feedPostsRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [handleObserver])

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
          <div className="h-6 w-6 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
}
