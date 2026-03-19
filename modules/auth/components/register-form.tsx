"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { useAuthStore } from "@/stores"
import { registerSchema, type RegisterFormValues } from "@/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

export function RegisterForm() {
  const router = useRouter()
  const registerUser = useAuthStore((s) => s.register)
  const isLoading = useAuthStore((s) => s.isLoading)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null)

    try {
      await registerUser(values)
      router.replace("/home")
    } catch (error) {
      if (error instanceof AxiosError) {
        const data = error.response?.data

        if (data?.errors) {
          const fieldErrors = data.errors as Record<string, string[]>

          Object.entries(fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof RegisterFormValues, {
              message: messages[0],
            })
          })
        } else {
          setServerError(
            data?.message || "Registration failed. Please try again."
          )
        }
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

      <Field data-invalid={!!errors.name || undefined}>
        <FieldLabel htmlFor="name">Username</FieldLabel>
        <Input
          id="name"
          type="text"
          placeholder="Choose a username"
          {...register("name")}
        />
        <FieldError errors={[errors.name]} />
      </Field>

      <Field data-invalid={!!errors.email || undefined}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
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
          placeholder="Create a password"
          {...register("password")}
        />
        <FieldError errors={[errors.password]} />
      </Field>

      <Field data-invalid={!!errors.password_confirmation || undefined}>
        <FieldLabel htmlFor="password_confirmation">
          Confirm Password
        </FieldLabel>
        <Input
          id="password_confirmation"
          type="password"
          placeholder="Confirm your password"
          {...register("password_confirmation")}
        />
        <FieldError errors={[errors.password_confirmation]} />
      </Field>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  )
}
