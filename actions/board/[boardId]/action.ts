"use server"
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";


export default async function syncBoardDetail(boardId: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Sesi telah berakhir, silahkan login kembali." }
    }
    const userId = session.user.id
    const cred = await prisma.trelloCredential.findUnique({
        where: { userId: userId }
    })
    if (!cred) {
        return { success: false, error: "Koneksi Trello belum diatur." }

    }

    try {
        const listsRes = await fetch(
            `https://api.trello.com/1/boards/${boardId}/lists?key=${cred.apiKey}&token=${cred.token}`,
            { cache: "no-store" }
        );
        if (!listsRes.ok) throw new Error("Gagal mengambil list")
        const lists = await listsRes.json()

        const cardsRes = await fetch(
            `https://api.trello.com/1/boards/${boardId}/cards?key=${cred.apiKey}&token=${cred.token}`,
            { cache: "no-store" }
        )
        if (!cardsRes.ok) throw new Error("Gagal mengambil cards")
        const cards = await cardsRes.json()

        for (const list of lists) {
            await prisma.trelloList.upsert({
                where: { id: list.id },
                create: {
                    id: list.id,
                    name: list.name,
                    pos: list.pos,
                    closed: list.closed,
                    boardId: boardId,

                },
                update: {
                    name: list.name,
                    pos: list.pos,
                    closed: list.closed,
                    boardId: boardId,

                }
            })
        }

        for (const card of cards) {
            await prisma.card.upsert({
                where: { id: card.id },
                create: {
                    id: card.id,
                    name: card.name,
                    description: card.desc,
                    pos: card.pos,
                    closed: card.closed,
                    due: card.due ? new Date(card.due) : null,
                    listId: card.idList,
                    boardId: boardId,
                },
                update: {
                    name: card.name,
                    description: card.desc,
                    pos: card.pos,
                    closed: card.closed,
                    due: card.due ? new Date(card.due) : null,
                    listId: card.idList,
                    boardId: card.boardId,
                }
            })
        }

        //update
        await prisma.board.update({
            where: { id: boardId },
            data: { syncedAt: new Date() }
        })
        revalidatePath(`/dashboard/board-trello/${boardId}`)
        return { success: true, message: "Board berhasil disinkronisasi" }

    } catch (error) {
        console.error("error saat sync detail board", error)
        return { error: "Terjadi kesalahan saat sinkronisasi" }

    }


}