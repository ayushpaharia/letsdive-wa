import Head from "next/head"

import Sidebar from "components/Sidebar"
import SearchUserModal from "components/SearchUserModal"
import { ReactElement, useState } from "react"
import { NextPageWithLayout } from "./_app"
import EmptyChat from "components/EmptyChat"

const Home: NextPageWithLayout = () => {
  return <EmptyChat />
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <div>
      <Head>
        <title>Chats - letsdive-wa</title>
        <meta name="description" content="Chats - letsdive-wa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid h-screen p-5 max-w-screen place-items-center">
        <main className="relative flex w-full h-full bg-gray-100 rounded-sm">
          <SearchUserModal />
          <Sidebar />
          {page}
        </main>
      </div>
    </div>
  )
}

export default Home
