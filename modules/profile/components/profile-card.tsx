import { Card, CardContent } from "@/components/ui/card"
import { DefaultAvatar } from "@/components/ui/default-avatar"
import type { User } from "@/types"

interface ProfileCardProps {
  user: User
}

interface StatItem {
  label: string
  value: number
}

function ProfileStats({ stats }: { stats: StatItem[] }) {
  return (
    <div className="mt-4 flex gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="space-y-0.5 text-center">
          <p className="text-sm font-bold">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export function ProfileCard({ user }: ProfileCardProps) {
  const stats = [
    { label: "Posts", value: user.post_count || 0 },
    { label: "Likes", value: user.reaction_count || 0 },
    { label: "Comments", value: user.comment_count || 0 },
  ]

  return (
    <Card className="rounded-2xl">
      <CardContent className="px-6 py-2">
        <h2 className="mb-4 text-base font-bold">Profile</h2>

        <div className="flex items-center gap-6">
          <DefaultAvatar size={100} />

          <div>
            <h3 className="text-lg font-bold">{user.name}</h3>
            <p className="text-xs text-muted-foreground">{user.email}</p>

            {/*: stats */}
            <ProfileStats stats={stats} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
