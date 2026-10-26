"use server"
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import z from "zod";


//validasi Zod
const trelloSchema = z.object({
    apiKey: z.string().trim().min(1, "Api Key Wajib diisi"),
    token: z.string().trim().min(1, "Token Wajib diisi"),
})

export type TrelloActionState = {
    success?: boolean
    error?: string
}

export async function trelloAction(
    prevState: TrelloActionState | null,
    formData: FormData
): Promise<TrelloActionState> {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            throw new Error("Sesi telah berakhir, silahkan login kembali.")
        }

        const validated =
            trelloSchema.safeParse({
                apiKey: formData.get("apiKey"),
                token: formData.get("token"),
            })

        if (!validated.success) {
            return { error: validated.error.issues[0]?.message || "Input tidak valid" }
        }

        const { apiKey, token } = validated.data



        const res = await fetch(
            `https://api.trello.com/1/members/me?key=${apiKey}&token=${token}`,
            { cache: "no-store" }
        );
        if (!res.ok) {
            if (res.status === 401) {
                return { error: "API Key atau Token tidak valid menurut Trello." }
            }
            return { error: `Gagal memverifikasi ke Trello (Status : ${res.status})` }
        }

        const member = await res.json()

        //SImpan atau update credential 

        await prisma.trelloCredential.upsert({
            where: {
                userId: session?.user?.id
            },
            create: {
                userId: session?.user?.id,
                apiKey,
                token,
                memberId: member.id,
                username: member.username,
                fullName: member.fullName,
            },
            update: {
                apiKey,
                token,
                memberId: member.id,
                username: member.username,
                fullName: member.fullName,
            },
        })

        revalidatePath("/dashboard/settings")
        return { success: true }


    } catch (error) {
        console.error("Trello action error : ", error)
        return { error: "terjadi kesalahan internal pada server . SIlahkan coba lagi." }
    }
}