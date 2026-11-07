"use client"
import { useState } from "react"
import syncBoardDetail from "@/actions/board/[boardId]/action"
import { useRouter } from "next/navigation"

export default function SyncBoardButton({ boardId }: { boardId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleClick() {
        setLoading(true);
        const result = await syncBoardDetail(boardId)
        setLoading(false);

        if (result.error) {
            alert(result.error)
            return
        }
        alert(result.message)
        router.refresh()
    }

    return (
        <button onClick={handleClick} disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white disabled:bg-gray-400 px-4 py-2 rounded-lg">
            {loading ? "Loading.." : "Sync Detail"}

        </button>
    )
}