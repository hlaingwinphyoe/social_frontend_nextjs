"use client"

import { ImageIcon, Video } from "lucide-react"
import { FileUploadButton } from "@/components/file-upload-button"
import { MediaPreview } from "@/components/media-preview"

interface MediaUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  preview: string | null
  isVideo?: boolean
}

export function MediaUpload({
  onFileSelect,
  onFileRemove,
  preview,
  isVideo = false,
}: MediaUploadProps) {
  return (
    <div className="space-y-4">
      {preview && (
        <MediaPreview src={preview} isVideo={isVideo} onRemove={onFileRemove} />
      )}

      <div className="flex items-center gap-2">
        <FileUploadButton
          accept="image/*"
          onFileSelect={onFileSelect}
          icon={<ImageIcon className="h-4 w-4" />}
          label="Photo"
        />
        <FileUploadButton
          accept="video/*"
          onFileSelect={onFileSelect}
          icon={<Video className="h-4 w-4" />}
          label="Video"
        />
      </div>
    </div>
  )
}
