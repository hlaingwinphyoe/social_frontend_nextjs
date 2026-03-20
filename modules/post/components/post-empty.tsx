import { FileText } from "lucide-react"

export function PostEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-16 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
        <FileText className="h-6 w-6 text-zinc-400" />
      </div>
      <h3 className="text-base font-semibold text-zinc-800">No posts yet</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Be the first to share something with the community!
      </p>
    </div>
  )
}
