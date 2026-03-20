"use client"

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { useEffect } from "react"
import { useAuthStore, usePostStore } from "@/stores"
import { PostCard, PostEmpty } from "@/modules/post"
import { ProfileCard } from "@/modules/profile"
import { PostSkeleton } from "@/modules/post/components/post-skeleton"

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { myPosts, myMeta, isMyPostsLoading, fetchMyPosts } = usePostStore()

  const hasMore = myMeta ? myMeta.current_page < myMeta.last_page : false

  const feedProfileRef = useInfiniteScroll({
    hasMore,
    isLoading: isMyPostsLoading,
    onLoadMore: () => {
      if (myMeta) {
        fetchMyPosts(myMeta.current_page + 1)
      }
    },
  })

  useEffect(() => {
    fetchMyPosts(1)
  }, [fetchMyPosts])

  if (!user) return null

  return (
    <div className="space-y-6">
      <ProfileCard user={user} />

      <div>
        <h4 className="mb-3 text-base font-bold">Your Posts</h4>
        {myPosts.length > 0 ? (
          <div className="space-y-4">
            {myPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {isMyPostsLoading && <PostSkeleton />}
            <div ref={feedProfileRef} className="h-1" />
          </div>
        ) : isMyPostsLoading ? (
          <div className="space-y-4">
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <PostEmpty />
        )}
      </div>
    </div>
  )
}
