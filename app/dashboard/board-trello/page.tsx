import SyncButton from "@/components/syncButton";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function boardPage() {
    await connection();
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/auth/login")

    }
    const userId = session.user.id
    const boards = await prisma.board.findMany({
        where: {
            userId: userId, closed: false
        },
        orderBy: {
            name: "asc"
        }
    })
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Boards Trello</h1>
                    <p className="text-slate-600">Daftar board yang tersinkronisasi dari Trello</p>
                </div>
                <SyncButton />

            </div>

            {boards.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed rounded-lg bg-gray-50">
                    <p className="text-gray-500">Belum ada board. Klik "Sync Trello" untuk mengambil data.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {boards.map((board) => (
                        <div key={board.id} className="p-4 border-gray-200 border rounded-lg shadow-sm bg-white">
                            <h2 className="font-bold text-lg">{board.name}</h2>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {board.description || "Tidak ada deskripsi"}
                            </p>
                            <p className="text-xs text-gray-400 mt-3">
                                Terakhir sync: {board.syncedAt?.toLocaleString("id-ID") || "-"}
                            </p>
                        </div>
                    ))}
                </div>
            )}


        </div>
    )
}