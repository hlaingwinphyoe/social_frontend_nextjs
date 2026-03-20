"use client"

import { X } from "lucide-react"
import Image from "next/image"

interface MediaPreviewProps {
  src: string
  isVideo?: boolean
  onRemove: () => void
}

export function MediaPreview({
  src,
  isVideo = false,
  onRemove,
}: MediaPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
      >
        <X className="h-4 w-4" />
      </button>
      {isVideo ? (
        <video src={src} controls className="max-h-64 w-full object-cover" />
      ) : (
        <Image
          src={src}
          alt="Upload preview"
          width={600}
          height={400}
          className="max-h-64 w-full object-cover"
          priority
        />
      )}
    </div>
  )
}
