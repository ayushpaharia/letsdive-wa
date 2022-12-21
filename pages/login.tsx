import Head from "next/head"
import router from "next/router"

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

import { auth, database } from "@/firebase"
import {
  ChatsTeardrop,
  Handshake,
  MagnifyingGlass,
  MonitorPlay,
  PhoneCall,
  SunHorizon,
} from "phosphor-react"
import { useEffect, useId, useState } from "react"
import clsx from "clsx"
import { onValue, ref } from "firebase/database"
import { Avatar } from "@/components"

export default function Login() {
  const provider = new GoogleAuthProvider()
  const signin = () =>
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user
        if (user) router.push("/")
        console.log("logged in")
      })
      .catch(() => {
        console.log("error logging in")
      })

  const [activeTab, setActiveTab] = useState<"home" | "explore">("home")

  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    // Get all Chats
    const userRef = ref(database, "/users")
    onValue(
      userRef,
      (snapshot) => {
        const val = snapshot.val()
        if (val) setUsers(val)
      },
      {
        onlyOnce: true,
      },
    )
  }, [])

  return (
    <div>
      <Head>
        <title>Login - yolo-chat</title>
        <meta name="description" content="Login - yolo-chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen ">
        <nav className="flex items-center gap-12 px-8 border-b-2 border-solid">
          <h3 className="flex items-center gap-2 text-lg font-black whitespace-nowrap">
            <SunHorizon size={32} color="#8247E5" weight="bold" />
            yolo chat
          </h3>
          <ul className="flex items-stretch font-medium text-[#79809E] text-sm gap-5 ">
            <li
              className={clsx(
                activeTab === "home" && "text-black c-b-border",
                "py-6 cursor-pointer relative",
              )}
              onClick={() => setActiveTab("home")}
            >
              Home
            </li>
            <li
              className={clsx(
                activeTab === "explore" && "text-black c-b-border",
                "py-6 cursor-pointer relative",
              )}
              onClick={() => setActiveTab("explore")}
            >
              Explore
            </li>
          </ul>
          <span className="flex items-center gap-2 pl-3 mx-auto rounded-lg bg-slate-100 cursor-text">
            <MagnifyingGlass color="#676767" size={18} weight="bold" />
            <input
              type="text"
              name="search-bar"
              className="flex items-center py-3 pr-3 text-sm rounded-r-lg outline-none bg-slate-100"
              placeholder="Search for people"
            />
          </span>
          <button
            onClick={() => signin()}
            className="font-extrabold text-white bg-[#8247E5] py-3 px-4 rounded-lg"
          >
            Connect with Google
          </button>
        </nav>
        <main className="w-full px-8 py-10 bg-white grow">
          {activeTab === "home" && <Home />}
          {activeTab === "explore" && <Explore users={users} />}
        </main>
      </div>
    </div>
  )
}

function Home() {
  return (
    <>
      <h1 className="text-4xl font-black leading-relaxed tracking-tight">
        Join this App and start chatting!
        <br />
        Find out what you can do.
      </h1>
      <div className="grid w-full grid-cols-4 gap-10">
        <div className="cursor-pointer hover:scale-[1.05] active:scale-[1] gap-4 c-bg-rotate w-full h-[250px] bg-gradient-to-r from-[#b6fff6]  via-[#53baf2] to-[#b6fff6] flex flex-col items-center justify-center text-center text-white text-4xl rounded-lg font-black tracking-tight mt-10">
          Yolo <br />
          Chat
          <ChatsTeardrop size={64} weight="bold" />
        </div>
        <div className="cursor-pointer hover:scale-[1.05] active:scale-[1] relative gap-4 opacity-60 c-bg-rotate w-full h-[250px] bg-gradient-to-r from-[#439cfb]  via-[#f187fb] to-[#439cfb] flex flex-col items-center justify-center text-center text-white text-4xl rounded-lg font-black tracking-tight mt-10">
          Yolo <br />
          Share
          <Handshake size={64} weight="bold" />
          <p className="absolute mx-auto text-sm font-semibold tracking-normal bottom-3">
            available soon
          </p>
        </div>
        <div className="cursor-pointer hover:scale-[1.05] active:scale-[1] relative gap-4 opacity-60 c-bg-rotate w-full h-[250px] bg-gradient-to-r from-[#57ebde]  via-[#aefb2a] to-[#57ebde] flex flex-col items-center justify-center text-center text-white text-4xl rounded-lg font-black tracking-tight mt-10">
          Yolo <br />
          Call
          <PhoneCall size={64} weight="bold" />
          <p className="absolute mx-auto text-sm font-semibold tracking-normal bottom-3">
            available soon
          </p>
        </div>
        <div className="cursor-pointer hover:scale-[1.05] active:scale-[1] relative gap-4 opacity-60 c-bg-rotate w-full h-[250px] bg-gradient-to-r from-[#ff0f7b]  via-[#f89b29] to-[#ff0f7b] flex flex-col items-center justify-center text-center text-white text-4xl rounded-lg font-black tracking-tight mt-10">
          Yolo <br />
          Video
          <MonitorPlay size={64} weight="bold" />
          <p className="absolute mx-auto text-sm font-semibold tracking-normal bottom-3">
            available soon
          </p>
        </div>
      </div>
    </>
  )
}
function Explore({ users }: { users: IUser[] }) {
  const userId = useId()

  return (
    <>
      <h1 className="text-4xl font-black leading-relaxed tracking-tight">
        Others who have already joined!
      </h1>
      <div className="grid w-full grid-cols-4 gap-8 my-4 overflow-x-scroll place-items-center">
        {Object.entries(users).map(([id, user]) => {
          return (
            <div key={userId + id} className="min-w-[150px] min-h-[150px] p-3">
              <Avatar width={300} height={300} src={user.photoURL} />
            </div>
          )
        })}
      </div>
    </>
  )
}
