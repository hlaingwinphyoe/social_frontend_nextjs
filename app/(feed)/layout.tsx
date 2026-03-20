import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-svh bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
      </div>
    </AuthGuard>
  )
}
