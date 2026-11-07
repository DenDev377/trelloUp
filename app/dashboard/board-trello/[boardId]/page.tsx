import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import SyncBoardButton from "@/components/SyncBoardButton";

export default async function BoardDetailPage({ params }: { params: Promise<{ boardId: string }> }) {
    const boardId = await params
    const session = await auth()
    if (!session?.user?.id) {
        redirect("/auth/login")
    }
    const userId = session.user.id

    const board = await prisma.board.findUnique({
        where: { id: boardId.boardId, userId: userId },
        include: {
            trelloLists: {
                orderBy: { pos: "asc" }
            },
            _count: {
                select: { cards: true }
            }
        }
    })

    if (!board) notFound()

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{board.name}</h1>
                    <p className="text-slate-600">{board.trelloLists.length} Lists | {board._count.cards} Card tersimpan</p>
                </div>
                <div className="flex gap-4">
                    <SyncBoardButton boardId={board.id} />

                </div>

            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="font-semibold mb-4">Daftar List (Kolom)</h2>
                {board.trelloLists.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                        Belum ada data list. Klik "Sync Data Board" di atas.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {board.trelloLists.map((list) => (
                            <li key={list.id} className="p-3 bg-gray-50 rounded border">
                                {list.name}
                            </li>
                        ))}
                    </ul>
                )}

            </div>

        </div>
    )
}
