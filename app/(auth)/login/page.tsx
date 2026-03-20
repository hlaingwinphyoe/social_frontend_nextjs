"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LoginForm, RegisterForm } from "@/modules/auth"

export default function LoginPage() {
  return (
    <div
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-4"
      style={{
        backgroundImage: "url('/auth-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-orange-600 via-purple-300 to-blue-500 opacity-50"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center text-black">
          <h1 className="text-3xl font-bold tracking-tight">Social</h1>
          <p className="mt-1 text-sm text-black/80">
            Connect with friends and share your moments
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="mb-2 grid w-full grid-cols-2 rounded-xl bg-gray-500/30">
            <TabsTrigger
              value="login"
              className="rounded-xl text-foreground! data-active:bg-white! data-active:text-foreground"
            >
              Login
            </TabsTrigger>

            <TabsTrigger
              value="register"
              className="rounded-xl text-foreground! data-active:bg-white! data-active:text-foreground"
            >
              Register
            </TabsTrigger>
          </TabsList>

          <Card className="rounded-2xl bg-white/40 shadow-xl backdrop-blur-xl">
            <CardContent className="px-4 py-1">
              <TabsContent value="login">
                <h2 className="text-lg font-semibold">Welcome back</h2>
                <p className="mb-4 text-sm text-black/50">
                  Enter your credentials to access your account
                </p>
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <h2 className="text-lg font-semibold">Create an account</h2>
                <p className="mb-4 text-sm text-black/50">
                  Fill in your details to get started
                </p>
                <RegisterForm />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
        <div className="mt-4 rounded-xl bg-linear-to-r from-purple-200/50 to-blue-300 p-3 text-center text-xs text-white shadow backdrop-blur-xl">
          <p className="font-medium text-white">Demo account for testing:</p>
          <p className="text-white">
            Email: demo@example.com, Password: demo123
          </p>
        </div>
      </div>
    </div>
  )
}
