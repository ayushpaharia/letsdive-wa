import Head from "next/head"
import { NextPage } from "next"

import { EmptyChat, SearchUserModal, Sidebar } from "@/components"

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Chats - yolo-chat</title>
        <meta name="description" content="Chats - yolo-chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid h-screen p-5 max-w-screen place-items-center">
        <main className="relative flex w-full h-full bg-gray-100 rounded-sm">
          <SearchUserModal />
          <Sidebar />
          <EmptyChat />
        </main>
      </div>
    </div>
  )
}

export default Home
