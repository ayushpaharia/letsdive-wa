import { ReactNode, useEffect, ReactElement, useContext } from "react"
import { NextPage } from "next"
import type { AppProps } from "next/app"

import { ref, serverTimestamp, set } from "firebase/database"
import { auth, database } from "@/firebase"

import "@/css"
import ModalProvider from "context/modalContext"
import { useAuthState } from "react-firebase-hooks/auth"
import Login from "./login"
import ChatProvider from "context/chatContext"

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
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
        lastSeen: serverTimestamp(),
        online: true,
      })
    }
  }, [user])

  if (!user) {
    return <Login />
  }

  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ChatProvider>
      <ModalProvider>{getLayout(<Component {...pageProps} />)}</ModalProvider>
    </ChatProvider>
  )
}
