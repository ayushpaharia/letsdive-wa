import { Armchair } from "phosphor-react"

export default function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-2xl font-bold text-gray-400 grow justify hover:animate-pulse">
      <Armchair size={128} weight="bold" />
      Looks like no one is here
    </div>
  )
}
