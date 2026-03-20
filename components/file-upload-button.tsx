"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

interface FileUploadButtonProps {
  accept: string
  onFileSelect: (file: File) => void
  icon: React.ReactNode
  label: string
  className?: string
}

export function FileUploadButton({
  accept,
  onFileSelect,
  icon,
  label,
  className,
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
    e.target.value = ""
  }

  return (
    <>
      <Button
        size="sm"
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn("flex cursor-pointer items-center gap-2", className)}
        variant="outline"
      >
        {icon}
        <span>{label}</span>
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </>
  )
}
