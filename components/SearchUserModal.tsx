import { useContext, useEffect, useRef, useState } from "react"

import {
  onValue,
  orderByKey,
  push,
  query,
  ref,
  serverTimestamp,
  set,
} from "firebase/database"
import { MagnifyingGlass } from "phosphor-react"

import { auth, database } from "@/firebase"
import clsx from "clsx"

import { IModalContext, ModalContext } from "context/modalContext"
import Avatar from "./Avatar"
import { useAuthState } from "react-firebase-hooks/auth"
import moment from "moment"

export default function SearchUserModal() {
  const { isModalVisible, toggleModal } = useContext(
    ModalContext,
  ) as IModalContext

  const [users, setUsers] = useState<IUser[]>([])

  const searchInputRef = useRef<HTMLInputElement>(null)

  const [loggedInUser, loading] = useAuthState(auth)

  const startChat = (userId: string) => {
    // start chat with user
    const chatsRef = ref(database, "/chats")
    const newChatRef = push(chatsRef)

    // Check if Chat already exists
    onValue(chatsRef, (snapshot) => {
      const val = snapshot.val()
      const chats =
        val &&
        Object.entries(val).map(([key, value]: [string, any]) => ({
          uid: key,
          ...value,
        }))
      const chatExists = chats?.find((chat: any) => {
        return (
          (chat.users[0] === loggedInUser?.uid && chat.users[1] === userId) ||
          (chat.users[1] === loggedInUser?.uid && chat.users[0] === userId)
        )
      })
      if (!chatExists) {
        set(newChatRef, {
          users: [loggedInUser?.uid, userId],
          createdAt: serverTimestamp(),
        })
          .catch((err) => console.log(err))
          .finally(() => {
            toggleModal()
          })
      } else {
        toggleModal()
      }
    })
  }

  useEffect(() => {
    const usersRef = query(ref(database, "users/"), orderByKey())
    onValue(
      usersRef,
      (snapshot) => {
        setUsers(() => {
          const usersArray = Object.entries(snapshot.val())
            .map(([key, value]: [string, any]) => {
              return {
                uid: key,
                ...value,
              }
            })
            .filter((user) => user.uid !== loggedInUser?.uid)
          return usersArray
        })
      },
      {
        onlyOnce: true,
      },
    )
  }, [loggedInUser])

  return (
    <div
      onClick={toggleModal}
      className={clsx(
        {
          hidden: !isModalVisible,
        },
        "fixed w-screen h-screen inset-0 backdrop-blur-[1.2px] z-10 grid place-items-center",
      )}
    >
      {/* Modal */}
      <div
        className="min-w-[500px] w-[40vw] bg-gray-200 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer "
          onClick={() => searchInputRef.current!.focus()}
        >
          <span className="flex items-center h-12 pl-4 bg-gray-100 rounded-l-lg">
            <MagnifyingGlass color="#676767" size={24} weight="bold" />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search users and start a new chat"
            className="w-full h-12 px-10 text-lg bg-gray-100 rounded-r-lg focus:outline-none"
          />
        </div>
        <div className="flex flex-col flex-1 overflow-y-scroll divide-y-2 h-[50vh] scrollbar-hide">
          {users.map((user, idx) => {
            return (
              <div
                key={user.uid + idx}
                onClick={() => startChat(user?.uid)}
                className="flex items-center justify-between p-4 pr-5 bg-gray-100 cursor-pointer hover:bg-gray-100"
              >
                <span className="">
                  <Avatar width={55} height={55} src={user.photoURL} />
                </span>
                <div className="flex flex-col justify-center flex-1 h-full ml-4">
                  <h3 className="text-xl">{user.email.split("@")[0]}</h3>
                  <p className="text-gray-500 truncate text-md">{user.email}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
