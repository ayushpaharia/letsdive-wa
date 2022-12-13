import {
  ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { useRouter } from "next/router"

import {
  ChatText,
  MagnifyingGlass,
  SignOut,
  House,
  Check,
  Checks,
} from "phosphor-react"
import { useAuthState } from "react-firebase-hooks/auth"

import { auth, database } from "@/firebase"

import moment from "moment"
import { onValue, ref, serverTimestamp, set } from "firebase/database"
import { Avatar } from "@/components"
import { IModalContext, ModalContext } from "context/modalContext"
import { ChatContext, IChatRecipientContext } from "context/chatContext"
import clsx from "clsx"

interface IChatTabData extends IUser {
  recipientId: string
  isActive: boolean
  lastMessage: string
  lastMessageTime: number
}

export default function Sidebar() {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { toggleModal } = useContext(ModalContext) as IModalContext
  const { setRecipientData } = useContext(ChatContext) as IChatRecipientContext

  const [allChats, setAllChats] = useState<IChatTabData[]>([])

  const chatTabId = useId()

  const [loggedInUser] = useAuthState(auth)

  useEffect(() => {
    // Get all Chats
    const userChatsRef = ref(database, "/chats")
    onValue(userChatsRef, (snapshot) => {
      const val = snapshot.val()
      if (val) {
        const chats = Object.entries(val).map(([key, value]: [string, any]) => {
          return {
            uid: key,
            users: value.users,
            ...value,
          }
        })

        // Filter all loggedInUser's chats
        const userChats = chats.filter((chat) => {
          return chat.users.includes(loggedInUser?.uid)
        })

        // Get recipientId
        const chatTabData = userChats.map((chat) => {
          const recipientId = chat.users.find(
            (user: string) => user !== loggedInUser?.uid,
          )
          return {
            ...chat,
            recipientId,
          }
        })
        setAllChats(chatTabData)
      }
    })
  }, [loggedInUser?.uid])

  const signOut = () => {
    auth.signOut()
    set(ref(database, "/users/" + loggedInUser?.uid), {
      email: loggedInUser?.email,
      photoURL: loggedInUser?.photoURL,
      lastSeen: serverTimestamp(),
      online: false,
    })
  }

  const closeChat = () => {
    setRecipientData(null)
    router.push("/")
  }

  // Sort chats by last message
  // const sortChatByLastMessage = (a: IChatTabData, b: IChatTabData) => {
  //   if (a.lastMessageTime > b.lastMessageTime) {
  //     return -1
  //   } else if (a.lastMessageTime < b.lastMessageTime) {
  //     return 1
  //   } else {
  //     return 0
  //   }
  // }

  return (
    <div className="flex flex-col max-h-[calc(100vh-3rem)] min-w-[22rem] max-w-[40rem] overflow-y-hidden relative border-r-[1px] border-solid border-[#ebebeb]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-200">
        <Avatar width={50} height={50} src={loggedInUser?.photoURL!} />
        {/* Action Row */}
        <div className="flex items-center gap-5">
          <button
            title="Home"
            onClick={closeChat}
            className="p-3 bg-transparent rounded-full active:bg-gray-300"
          >
            <House color="#676767" size={24} weight="bold" />
          </button>
          <button
            title="Find Chat"
            onClick={toggleModal}
            className="p-3 bg-transparent rounded-full active:bg-gray-300"
          >
            <ChatText color="#676767" size={24} weight="bold" />
          </button>
          <button
            title="Sign Out"
            onClick={signOut}
            className="p-3 bg-transparent rounded-full active:bg-gray-300"
          >
            <SignOut color="#676767" size={24} weight="bold" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => searchInputRef.current!.focus()}
      >
        <span className="flex items-center h-12 pl-4 bg-gray-200 rounded-l-lg">
          <MagnifyingGlass color="#676767" size={24} weight="bold" />
        </span>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search or start new chat"
          className="w-full h-12 px-5 text-lg bg-gray-200 rounded-r-lg focus:outline-none"
        />
      </div>

      {/* All Chats */}
      <div className="flex flex-col flex-1 py-3 overflow-y-scroll divide-y-2 scrollbar-hide">
        {allChats
          // .sort(sortChatByLastMessage)
          .map((chatData, idx) => {
            return (
              <ChatTab
                chatId={chatData.uid}
                recipientId={chatData.recipientId}
                key={chatData.uid + chatTabId + idx}
                isActive={chatData.uid === router.query.chatId}
              />
            )
          })}
      </div>
    </div>
  )
}

interface IChatTabProps {
  recipientId: string
  chatId: string
  isActive: boolean
  lastMessageTime?: number
  lastMessage?: string
  lastMessageState?: MessageState
}
type IRecipientData = IChatTabProps & IUser

function ChatTab({ recipientId, chatId, isActive }: IChatTabProps) {
  const [tabData, setTabData] = useState<IRecipientData>()
  const { setRecipientData, setLoading } = useContext(
    ChatContext,
  ) as IChatRecipientContext

  const router = useRouter()

  useEffect(() => {
    const userRef = ref(database, `/users/${recipientId}`)
    const chatRef = ref(database, `/chats/${chatId}`)

    onValue(userRef, (snapshot) => {
      const val = snapshot.val()
      const userValue = val && { uid: recipientId, chatId, ...val }
      setTabData((prev) => ({ ...prev, ...userValue }))
    })

    onValue(chatRef, (snapshot) => {
      const val = snapshot.val()
      const messages = ((val &&
        val?.messages &&
        Object.values(val?.messages)) ||
        []) as {
        text: string
        state: MessageState
        createdAt: number
      }[]

      const lastMessage = messages[messages.length - 1]

      setTabData((prev: any) => ({
        ...prev,
        lastMessageTime: lastMessage?.createdAt,
        lastMessage: lastMessage?.text,
        lastMessageState: lastMessage?.state,
      }))
    })
  }, [recipientId, setRecipientData, chatId])

  const lastSeenTime = "last seen " + moment(tabData?.lastSeen).fromNow()

  const openChat = () => {
    router.push(`/${tabData?.chatId}`)
    setRecipientData(tabData as IRecipientData)
    setLoading(true)
  }

  const messageByState = (state: MessageState) => {
    const messageStates: Record<MessageState, JSX.Element> = {
      sent: <Check size={15} weight="bold" />,
      delivered: <Checks size={15} weight="bold" />,
      read: <Checks color="#1476d1" size={15} weight="bold" />,
    }
    return (
      messageStates[state] || <>{tabData?.isActive ? "online" : lastSeenTime}</>
    )
  }

  const getLastActivityState = (): ReactNode => {
    return (
      <span className="flex items-center gap-2">
        {messageByState(tabData?.lastMessageState!)}
        {tabData?.lastMessage}
      </span>
    )
  }

  return (
    <div
      onClick={openChat}
      className={clsx(
        isActive && "bg-gray-200",
        "flex items-center justify-between p-4 pr-5 cursor-pointer hover:bg-gray-200 group",
      )}
    >
      <span className="">
        <Avatar width={55} height={55} src={tabData?.photoURL} />
      </span>
      <div className="flex flex-col justify-center flex-1 h-full ml-4">
        <h3 className="font-bold text-gray-500 truncate text-md">
          {tabData?.name || `${tabData?.email?.split("@")[0] || "..."}`}
        </h3>
        <p className="text-gray-500 truncate text-md group-hover:hidden">
          {getLastActivityState()}
        </p>
        <p className="hidden text-gray-500 truncate group-hover:flex text-md">
          {lastSeenTime}
        </p>
      </div>
    </div>
  )
}
