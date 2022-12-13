import {
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useRouter } from "next/router"

import clsx from "clsx"
import moment from "moment"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { useAuthState } from "react-firebase-hooks/auth"
import {
  ArrowDown,
  DotsThreeVertical,
  Paperclip,
  PaperPlaneRight,
  Smiley,
  Spinner,
} from "phosphor-react"
import {
  off,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
  update,
} from "firebase/database"

import { Avatar, ChatMessage, EmptyMessages, EmptyChat } from "@/components"
import { ChatContext, IChatRecipientContext } from "context/chatContext"
import { auth, database } from "@/firebase"

export default function AllChats() {
  const { recipientData, isLoading, setLoading } = useContext(
    ChatContext,
  ) as IChatRecipientContext

  const [messages, setMessages] = useState<IMessage[]>([])

  const chatTextInputRef = useRef<HTMLInputElement>(null)
  const [chatText, setChatText] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const router = useRouter()
  const { chatId } = router.query

  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView()
  }

  const [isGotoBottomVisible, setGotoBottomVisible] = useState<boolean>(false)

  const [loggedInUser] = useAuthState(auth)

  const callbackFunction = useCallback(
    (entries: any[]) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        const messagesRef = ref(database, "chats/" + chatId + "/messages")
        onValue(
          messagesRef,
          (snapshot) => {
            const data = snapshot.val()
            if (data) {
              const messages = Object.entries(data).map(
                ([key, value]: [string, any]) => {
                  return {
                    ...value,
                    uid: key,
                  }
                },
              ) as unknown as IMessage[]
              setMessages(messages)
              setGotoBottomVisible(false)
            }
          },
          {
            onlyOnce: true,
          },
        )
        messages.forEach(({ uid, ...rest }) => {
          const messageRef = ref(
            database,
            "chats/" + chatId + "/messages/" + uid,
          )
          if (rest.senderId === loggedInUser?.uid) {
            update(messageRef, {
              ...rest,
              state: "read",
            })
          }
        })
      } else {
        setGotoBottomVisible(true)
      }
    },
    [chatId, loggedInUser?.uid, messages],
  )
  const options = useMemo(() => {
    return {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options)
    const currentTarget = bottomRef.current
    if (currentTarget) observer.observe(currentTarget)

    return () => {
      if (currentTarget) observer.unobserve(currentTarget)
    }
  }, [options, bottomRef, callbackFunction])

  useEffect(() => {
    recipientData === null && router.push("/")
  }, [recipientData, router])

  useEffect(() => {
    const messagesRef = ref(database, "chats/" + chatId + "/messages")
    onValue(messagesRef, (snapshot) => {
      const val = snapshot.val()
      if (val) {
        const messages = Object.entries(val).map(
          ([key, value]: [string, any]) => {
            return {
              uid: key,
              ...value,
            }
          },
        )
        setMessages(messages)
        scrollToBottom()
        setLoading(false)
      }
    })

    return () => {
      off(messagesRef)
    }
  }, [chatId, setLoading])

  const sendMessage = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && chatText !== "") {
      // set messages
      const messagesRef = ref(database, "chats/" + chatId + "/messages")
      const messageRef = push(messagesRef)
      const message = {
        chatId: chatId,
        text: chatText,
        createdAt: serverTimestamp(),
        senderId: recipientData?.uid,
        state: recipientData?.online ? "delivered" : "sent",
      }

      set(messageRef, message)
      setChatText("")
      scrollToBottom()
      chatTextInputRef.current!.blur()
    }
  }

  const messageSentTime = moment(recipientData?.lastSeen).fromNow()

  if (!recipientData) return <EmptyChat />
  return (
    <div className="flex flex-col items-center w-full h-full max-h-[calc(100vh-3rem)]  text-5xl font-bold text-gray-400">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full px-5 py-3 bg-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Avatar width={50} height={50} src={recipientData?.photoURL} />
          <div className="flex flex-col">
            <h3> {recipientData?.email.split("@")[0]}</h3>
            <p className="text-xs font-light">
              {recipientData?.online
                ? "online"
                : recipientData?.lastSeen
                ? messageSentTime
                : "..."}
            </p>
          </div>
        </div>
        {/* Action Row */}
        <div className="flex items-center gap-5">
          <button className="p-3 bg-transparent rounded-full active:bg-gray-300">
            <Paperclip color="#676767" size={24} weight="bold" />
          </button>
          <button className="p-3 bg-transparent rounded-full active:bg-gray-300">
            <DotsThreeVertical color="#676767" size={24} weight="bold" />
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="relative flex flex-col w-full overflow-y-scroll grow">
        {messages && messages?.length <= 0 ? (
          <EmptyMessages />
        ) : (
          <>
            <div className="relative flex flex-col h-full">
              {!isLoading ? (
                messages.map((message) => (
                  <ChatMessage key={message.uid} message={message} />
                ))
              ) : (
                <div className="absolute mx-auto overflow-x-hidden top-1/2 left-1/2 animate-spin">
                  <Spinner size={32} weight="bold" />
                </div>
              )}
              <div
                ref={bottomRef}
                className="relative text-[10px] mr-10 z-10 w-full h-2 invisible"
              >
                -
              </div>
            </div>
          </>
        )}
      </div>

      {/* Text Bar */}
      <div className="relative flex items-center w-full">
        <button
          onClick={() => scrollToBottom()}
          className={clsx(
            "absolute z-50 bottom-20 left-1/2 -translate-x-1/2 p-3 rounded-full bg-black bg-opacity-5 active:bg-gray-300 hover:-translate-y-1 ease-linear transition-all duration-100",
            !isGotoBottomVisible && "hidden",
          )}
        >
          <ArrowDown color="#676767" size={24} weight="bold" />
        </button>
        <span
          className="flex items-center h-12 pl-4 cursor-pointer"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <Smiley color="#676767" size={24} weight="bold" />
        </span>
        <span
          className={clsx(
            showEmojiPicker ? "block" : "hidden",
            "absolute top-0 -translate-x-[calc(50%-20px)] -translate-y-full",
          )}
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji: { native: string }) => {
              chatTextInputRef.current!.focus()
              setChatText((prev) => prev + emoji.native)
            }}
          />
        </span>
        <div
          className="flex items-center justify-between w-full px-4 py-3 cursor-pointer"
          onClick={() => chatTextInputRef.current!.focus()}
        >
          <input
            ref={chatTextInputRef}
            type="text"
            placeholder="Type a message"
            className="w-full h-12 px-5 text-base font-normal text-gray-900 bg-gray-200 rounded-lg text-ellipsis focus:outline-none"
            onChange={(e) => setChatText(e.target.value)}
            value={chatText}
            onKeyDown={sendMessage}
          />
          <span
            onClick={(e) => {
              sendMessage({ ...e, key: "Enter" } as any)
            }}
            className={clsx(
              !chatText ? "hidden" : "flex",
              "items-center h-12 pl-4",
            )}
          >
            <PaperPlaneRight color="#676767" size={24} weight="bold" />
          </span>
        </div>
      </div>
    </div>
  )
}
