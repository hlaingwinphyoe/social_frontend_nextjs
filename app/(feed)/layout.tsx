import { AuthGuard } from "@/components/auth-guard"

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
