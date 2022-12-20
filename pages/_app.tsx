import { useEffect } from "react"
import type { AppProps } from "next/app"

import NextNProgress from "nextjs-progressbar"

import { ref, serverTimestamp, set } from "firebase/database"
import { auth, database } from "@/firebase"

import "@/css/globals.css"

import ModalProvider from "context/modalContext"
import { useAuthState } from "react-firebase-hooks/auth"
import Login from "pages/login"
import ChatProvider from "context/chatContext"
import { Spinner, SunHorizon } from "phosphor-react"

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    const onBeforeUnload = async () => {
      set(ref(database, "/users/" + user?.uid), {
        email: user?.email,
        photoURL: user?.photoURL,
        lastSeen: serverTimestamp(),
        online: false,
      })
    }

    window.addEventListener("beforeunload", onBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      set(ref(database, "/users/" + user?.uid), {
        email: user?.email,
        photoURL: user?.photoURL,
        name: user?.displayName,
        lastSeen: serverTimestamp(),
        online: true,
      })
    }
  }, [user])

  if (loading) {
    return (
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <h3 className="flex items-center gap-4 text-4xl font-black before:content-[''] relative before:w-64 before:h-64 z-20 before:animate-ping before:-z-10 before:bg-gray-200 before:rounded-full before:absolute ">
          <SunHorizon size={64} color="#8247E5" weight="bold" />
          yolo chat
        </h3>
      </div>
    )
  }

  if (!loading && !user) {
    return <Login />
  }

  return (
    <ChatProvider>
      <ModalProvider>
        <div className="bg-white">
          <NextNProgress />
          <Component {...pageProps} />
        </div>
      </ModalProvider>
    </ChatProvider>
  )
}
