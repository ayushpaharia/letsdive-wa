import { useContext, useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/router"

import { ChatText, MagnifyingGlass, SignOut, House } from "phosphor-react"
import { useAuthState } from "react-firebase-hooks/auth"

import { auth, database } from "@/firebase"

import moment from "moment"
import { onValue, ref, serverTimestamp, set } from "firebase/database"
import { Avatar } from "@/components"
import { IModalContext, ModalContext } from "context/modalContext"
import { ChatContext, IChatRecipientContext } from "context/chatContext"

interface IChatTabData extends IUser {
  recipientId: string
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

  return (
    <div className="flex flex-col max-h-[calc(100vh-3rem)] min-w-[22rem] max-w-[40rem] overflow-y-hidden relative border-r-[1px] border-solid border-[#ebebeb]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-200">
        <Avatar width={50} height={50} src={loggedInUser?.photoURL!} />
        {/* Action Row */}
        <div className="flex items-center gap-5">
          <button
            onClick={closeChat}
            className="p-3 bg-transparent rounded-full active:bg-gray-300"
          >
            <House color="#676767" size={24} weight="bold" />
          </button>
          <button
            onClick={toggleModal}
            className="p-3 bg-transparent rounded-full active:bg-gray-300"
          >
            <ChatText color="#676767" size={24} weight="bold" />
          </button>
          <button className="p-3 bg-transparent rounded-full active:bg-gray-300">
            <SignOut
              onClick={signOut}
              color="#676767"
              size={24}
              weight="bold"
            />
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
        {allChats.map((chatData, idx) => {
          return (
            <ChatTab
              chatId={chatData.uid}
              recipientId={chatData.recipientId}
              key={chatData.uid + chatTabId + idx}
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
}
type IRecipientData = IChatTabProps &
  IUser & {
    lastMessage: string
    lastMessageTime: number
  }

function ChatTab({ recipientId, chatId }: IChatTabProps) {
  const [tabData, setTabData] = useState<IRecipientData>()
  const { setRecipientData } = useContext(ChatContext) as IChatRecipientContext

  const router = useRouter()

  useEffect(() => {
    const userRef = ref(database, `/users/${recipientId}`)
    onValue(userRef, (snapshot) => {
      const val = snapshot.val()
      const user = val && { uid: recipientId, chatId, ...val }
      setTabData(user)
    })
  }, [recipientId, setRecipientData, chatId])

  const lastSeenTime = "last seen " + moment(tabData?.lastSeen).fromNow()

  const openChat = () => {
    router.push(`/${tabData?.chatId}`)
    setRecipientData(tabData as IRecipientData)
  }

  return (
    <div
      onClick={openChat}
      className="flex items-center justify-between p-4 pr-5 cursor-pointer hover:bg-gray-200"
    >
      <span className="">
        <Avatar width={55} height={55} src={tabData?.photoURL} />
      </span>
      <div className="flex flex-col justify-center flex-1 h-full ml-4">
        <h3 className="font-bold text-gray-500 text-md">
          {tabData?.email.split("@")[0]}
        </h3>
        <p className="text-gray-500 truncate text-md">
          {tabData?.online
            ? "online"
            : tabData?.lastSeen
            ? lastSeenTime
            : "..."}
        </p>
      </div>
    </div>
  )
}
