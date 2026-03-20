"use client"

import { useRouter, usePathname } from "next/navigation"
import { Home, LogOut, User } from "lucide-react"
import { useAuthStore } from "@/stores"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DefaultAvatar } from "./ui/default-avatar"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    router.replace("/auth/login")
  }

  const navItems: NavItem[] = [
    { name: "Home", href: "/", icon: Home },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-white">
              S
            </div>
            <h1 className="text-sm font-black sm:text-lg">Social</h1>
          </div>

          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-white" : "text-zinc-500"
                    }`}
                  />
                  <span className={isActive ? "inline" : "hidden sm:inline"}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Actions */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <DefaultAvatar />
              <span className="hidden text-sm font-medium sm:inline">
                {user.name}
              </span>
            </div>

            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 text-gray-500" />
              <span className="hidden text-sm text-gray-500 sm:inline">
                Logout
              </span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
