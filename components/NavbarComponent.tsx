import { connection } from "next/server"
import { auth, signOut } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"



export default async function NavbarComponent() {
    await connection()
    const session = await auth()
    const userName = session?.user?.name || "User"
    const userInisial = userName.charAt(0).toUpperCase()
    return (
        <>
            <nav className="border-b border-slate-100 bg-white relative z-50 w-full">
                <div className="mx-auto px-4 sm:px-6 md:px-8 h-20 md:gap-4 gap-3 flex items-center justify-between">
                    <div className="gap-1 md:gap-1.5 p-2 flex">
                        <div className="bg-yellow-300 rounded-full p-1 md:p-1.5"></div>
                        <div className="bg-green-300 rounded-full p-1 md:p-1.5"></div>
                        <div className="bg-red-300 rounded-full p-1 md:p-1.5"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-400 rounded-full text-white flex items-center justify-center w-9 h-9 p-1 md:p-1.5">{userInisial}</div>
                        <p>{userName}</p>
                    </div>
                </div>


            </nav>

        </>
    )
}