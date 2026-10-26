"use client"
import { useState } from "react"
import { SyncBoard } from "@/actions/board/action"
import { useRouter } from "next/navigation"


export default function SyncButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSync() {
        setLoading(true)
        const result = await SyncBoard()
        setLoading(false)

        if (!result.success) {
            alert(result.error)
        }
        alert(result.message);
        router.refresh();
    }

    return (
        <button
            onClick={handleSync}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 transition-colors text-white px-4 py-2 rounded-lg"
        >
            {loading ? "Menyinkronkan..." : "Sinkronisasi Board"}
        </button>
    )

}