import { ReactNode, useEffect, ReactElement } from "react"
import { NextPage } from "next"
import type { AppProps } from "next/app"

import { ref, serverTimestamp, set } from "firebase/database"
import { auth, database } from "@/firebase"

import "@/css"
import ModalProvider from "context/modalContext"
import { useAuthState } from "react-firebase-hooks/auth"
import Login from "./login"
import ChatProvider from "context/chatContext"

export default function App({ Component, pageProps }: AppProps) {
  const [user] = useAuthState(auth)

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

  if (!user) {
    return <Login />
  }

  return (
    <ChatProvider>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </ChatProvider>
  )
}
