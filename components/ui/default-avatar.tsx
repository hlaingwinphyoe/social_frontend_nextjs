import { cn } from "@/lib/utils"
import Image from "next/image"

export function DefaultAvatar({
  size = 32,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <Image
      src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
      alt="User Avatar"
      width={size}
      height={size}
      className={cn("rounded-full", className)}
      priority
    />
  )
}
