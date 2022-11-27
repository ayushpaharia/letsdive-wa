import { createContext, Dispatch, SetStateAction, useState } from "react"

interface IRecipientData extends IUser {
  recipientId: string
  chatId: string
}
export interface IChatRecipientContext {
  recipientData: IRecipientData | null
  setRecipientData: Dispatch<SetStateAction<IRecipientData | null | null>>
  [key: string | number | symbol]: unknown
}

export const ChatContext = createContext<IChatRecipientContext | null>(null)

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipientData, setRecipientData] =
    useState<IChatRecipientContext["recipientData"]>(null)

  return (
    <ChatContext.Provider value={{ recipientData, setRecipientData }}>
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
