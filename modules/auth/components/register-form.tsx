"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { useAuthStore } from "@/stores"
import { registerSchema, type RegisterFormValues } from "@/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { toast } from "sonner"

export function RegisterForm() {
  const router = useRouter()
  const registerUser = useAuthStore((s) => s.register)
  const isLoading = useAuthStore((s) => s.isLoading)

  const {
    control,
    handleSubmit,
    formState: { errors },
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
    try {
      await registerUser(values)
      router.replace("/")
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        )
      } else {
        toast.error("An unexpected error occurred.")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.name || undefined}>
            <FieldLabel htmlFor="name">Username</FieldLabel>
            <Input
              {...field}
              id="name"
              type="text"
              placeholder="Choose a username"
            />
            <FieldError errors={[errors.name]} />
          </Field>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.email || undefined}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...field}
              id="email"
              type="email"
              placeholder="Enter your email"
            />
            <FieldError errors={[errors.email]} />
          </Field>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.password || undefined}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              {...field}
              id="password"
              type="password"
              placeholder="Create a password"
            />
            <FieldError errors={[errors.password]} />
          </Field>
        )}
      />

      <Controller
        name="password_confirmation"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.password_confirmation || undefined}>
            <FieldLabel htmlFor="password_confirmation">
              Confirm Password
            </FieldLabel>
            <Input
              {...field}
              id="password_confirmation"
              type="password"
              placeholder="Confirm your password"
            />
            <FieldError errors={[errors.password_confirmation]} />
          </Field>
        )}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  )
}
