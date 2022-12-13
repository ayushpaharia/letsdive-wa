import { createContext, Dispatch, SetStateAction, useState } from "react"

interface IRecipientData extends IUser {
  recipientId: string
  chatId: string
}
export interface IChatRecipientContext {
  recipientData: IRecipientData | null
  setRecipientData: Dispatch<SetStateAction<IRecipientData | null>>
  isLoading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  [key: string | number | symbol]: unknown
}

export const ChatContext = createContext<IChatRecipientContext | null>(null)

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipientData, setRecipientData] =
    useState<IChatRecipientContext["recipientData"]>(null)
  const [isLoading, setLoading] = useState<boolean>(false)

  return (
    <ChatContext.Provider
      value={{ recipientData, setRecipientData, isLoading, setLoading }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
