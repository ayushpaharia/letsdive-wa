import { useEffect } from "react"
import type { AppProps } from "next/app"

import NextNProgress from "nextjs-progressbar"

import { ref, serverTimestamp, set } from "firebase/database"
import { auth, database } from "@/firebase"

import "@/css"
import ModalProvider from "context/modalContext"
import { useAuthState } from "react-firebase-hooks/auth"
import Login from "pages/login"
import ChatProvider from "context/chatContext"
import { Spinner } from "phosphor-react"

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
      <div className="absolute mx-auto overflow-x-hidden -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <Spinner
          size={100}
          color="#676767"
          weight="bold"
          className="animate-spin"
        />
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <ChatProvider>
      <ModalProvider>
        <NextNProgress />
        <Component {...pageProps} />
      </ModalProvider>
    </ChatProvider>
  )
}
