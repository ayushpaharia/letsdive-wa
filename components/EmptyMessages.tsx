import { Envelope } from "phosphor-react"

export default function EmptyMessages() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-2xl font-bold text-gray-400 justify itesm-center hover:animate-pulse">
      <Envelope size={128} weight="bold" />
      Send the first message!
    </div>
  )
}
