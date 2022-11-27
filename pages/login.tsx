import Head from "next/head"
import Image from "next/image"
import router from "next/router"

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

import { auth } from "@/firebase"

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

  return (
    <div>
      <Head>
        <title>Login - letsdive-wa</title>
        <meta name="description" content="Login - letsdive-wa" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid min-h-screen p-8 max-w-screen place-items-center">
        <main className="flex p-10 rounded-lg shadow-lg bg-gray-50">
          <button
            className="flex items-center justify-center h-10 gap-10 p-10 text-3xl font-bold text-gray-800 rounded-lg hover:bg-white"
            onClick={() => signin()}
          >
            <Image
              width={50}
              height={50}
              alt="google login"
              src="/google.png"
            />
            Sign In With Google
          </button>
        </main>
      </div>
    </div>
  )
}
