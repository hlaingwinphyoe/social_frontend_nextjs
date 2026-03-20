import { Card, CardContent } from "@/components/ui/card"
import { DefaultAvatar } from "@/components/ui/default-avatar"
import type { Comment } from "@/types"

interface CommentListProps {
  comments: Comment[]
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) return null

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        return (
          <div key={comment.id} className="flex gap-2">
            <DefaultAvatar className="h-fit" />

            <Card className="w-full">
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <p className="text-xs font-semibold text-gray-800">
                    {comment.user?.name}
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    {comment.created_at}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
