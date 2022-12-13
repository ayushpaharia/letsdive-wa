import clsx from "clsx"
import moment from "moment"
import { useAuthState } from "react-firebase-hooks/auth"
import { Check, Checks } from "phosphor-react"

import { auth } from "@/firebase"

interface IChatMessageProps {
  message: IMessage
}

export default function ChatMessage({ message }: IChatMessageProps) {
  const [loggedInUser] = useAuthState(auth)

  const messageSentTime = moment(message.createdAt).fromNow()

  return (
    <div
      className={clsx(
        loggedInUser?.uid !== message.senderId && "justify-end",
        "flex w-full px-4",
      )}
    >
      <div
        className={clsx(
          loggedInUser?.uid !== message.senderId
            ? "bg-[#dcf8c6]"
            : "bg-gray-200",
          "relative max-w-[100ch] h-full w-fit min-w-[20ch] text-sm rounded-xl p-4 pb-[1.5rem] overflow-hidden text-black font-normal",
        )}
      >
        {message.text}
        <div className="flex items-center gap-3 text-gray-400 whitespace-nowrap text-[10px] absolute bottom-0 right-0 text-right p-2 uppercase">
          <p className="mt-1">{messageSentTime}</p>
          {loggedInUser?.uid !== message.senderId && (
            <span>{messageByState(message.state)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

const messageByState = (state: MessageState) => {
  const messageStates: Record<MessageState, JSX.Element> = {
    sent: <Check size={15} weight="bold" />,
    delivered: <Checks size={15} weight="bold" />,
    read: <Checks color="#1476d1" size={15} weight="bold" />,
  }
  return messageStates[state] || messageStates["sent"]
}
