"use server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"


export type BoardActionState = {
    success?: boolean
    error?: string
    message?: string
}

export async function SyncBoard(prevState?: BoardActionState | null): Promise<BoardActionState> {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { error: "Sesi telah berakhir, silahkan login kembali." }
        }

        const userId = session.user.id

        const cred = await prisma.trelloCredential.findUnique({
            where: {
                userId: userId
            }
        })
        if (!cred) {
            return { success: false, error: "Koneksi Trello belum diatur." }
        }

        const res = await fetch(
            `https://api.trello.com/1/members/me/boards?key=${cred.apiKey}&token=${cred.token}&fields=name,desc,url,closed`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            return { success: false, error: "Gagal mengambil data dari Trello" };
        }

        const boards = await res.json();

        if (!Array.isArray(boards) || boards.length === 0) {
            return { success: true, message: "Tidak ada board yang ditemukan" };
        }

        await Promise.all(
            boards.map((board: any) =>
                prisma.board.upsert({
                    where: { id: board.id },
                    create: {
                        id: board.id,
                        name: board.name,
                        description: board.desc || null,
                        url: board.url,
                        closed: board.closed,
                        userId: userId,
                        syncedAt: new Date(),
                    },
                    update: {
                        name: board.name,
                        description: board.desc || null,
                        url: board.url,
                        closed: board.closed,
                        syncedAt: new Date(),
                    },
                })
            )
        )

        revalidatePath("/dashboard/board-trello")
        return { success: true, message: `Berhasil menyinkronkan ${boards.length} board.` }


    }

    catch (err) {
        console.error("Error saat sync board", err)
        return { success: false, error: "Terjadi kesalahan saat sinkronisasi" }
    }


}

