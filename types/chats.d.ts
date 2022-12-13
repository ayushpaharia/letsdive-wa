interface IChat {
  uid: string
  users: IUser[]
  lastMessage: string
  lastMessageTime: string
  messages: IMessage[]
  createdAt: string
}

type MessageState = "sent" | "delivered" | "read"

interface IMessage {
  uid: string
  chatId: string
  senderId: string
  text: string
  createdAt: string
  state: MessageState
}

interface IUser {
  uid: string
  photoURL: string
  email: string
  name: string
  lastSeen: string
  online: boolean
}
