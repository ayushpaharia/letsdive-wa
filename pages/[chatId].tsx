import { NextPage } from "next"
import Head from "next/head"

import {
  ChatWindow,
  Sidebar,
  SearchUserModal,
  ImageUploadModal,
} from "@/components"

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Chats - yolo-chat</title>
        <meta name="description" content="Chats - letsdive-wa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid h-screen p-5 max-w-screen place-items-center">
        <main className="relative flex w-[calc(100vw-2.5rem)] h-full bg-gray-100 rounded-sm">
          <SearchUserModal />
          <ImageUploadModal />
          <Sidebar />
          <ChatWindow />
        </main>
      </div>
    </div>
  )
}

export default Home
