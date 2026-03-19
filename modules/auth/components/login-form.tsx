"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { useAuthStore } from "@/stores"
import { loginSchema, type LoginFormValues } from "@/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

export function LoginForm() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "demo@example.com", password: "demo123" },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null)

    try {
      await login(values)
      router.replace("/home")
    } catch (error) {
      if (error instanceof AxiosError) {
        setServerError(
          error.response?.data?.message || "Login failed. Please try again."
        )
      } else {
        setServerError("An unexpected error occurred.")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
          {serverError}
        </div>
      )}

      <Field data-invalid={!!errors.email || undefined}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="text"
          placeholder="Enter your email"
          {...register("email")}
        />
        <FieldError errors={[errors.email]} />
      </Field>

      <Field data-invalid={!!errors.password || undefined}>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
        />
        <FieldError errors={[errors.password]} />
      </Field>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  )
}
