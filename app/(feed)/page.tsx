"use client"

import { CreatePostForm, PostFeed } from "@/modules/post"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <CreatePostForm />
      <PostFeed />
    </div>
  )
}
