import Image from "next/image"
import { User } from "phosphor-react"

interface IAvatarProps {
  src?: string
  width?: number
  height?: number
}

export default function Avatar({ src, width = 60, height = 60 }: IAvatarProps) {
  return (
    <>
      {src ? (
        <Image
          alt="avatar"
          className="object-contain h-auto rounded-full"
          width={width}
          height={height}
          src={src as string}
        />
      ) : (
        <span className="flex items-center justify-center h-[50px] w-[50px] bg-gray-300 rounded-full">
          <User size={32} weight="fill" color="#888" />
        </span>
      )}
    </>
  )
}
