import Head from "next/head"
import { NextPage } from "next"

import {
  EmptyChat,
  ImageUploadModal,
  SearchUserModal,
  Sidebar,
} from "@/components"

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Chats - yolo-chat</title>
        <meta name="description" content="Chats - yolo-chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid h-screen p-5 max-w-screen place-items-center">
        <main className="relative flex w-[calc(100vw-2.5rem)] h-full bg-white rounded-sm grow">
          <SearchUserModal />
          <ImageUploadModal />
          <Sidebar />
          <EmptyChat />
        </main>
      </div>
    </div>
  )
}

export default Home
