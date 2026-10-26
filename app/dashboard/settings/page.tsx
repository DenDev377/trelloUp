import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SettingsForm from "./settingsForm";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { connection } from "next/server";

export default async function SettingPage() {
    const session = await auth();
    await connection();

    // 1. Validasi sesi terlebih dahulu sebelum query DB
    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    // 2. Ambil kredensial Trello
    const credential = await prisma.trelloCredential.findUnique({
        where: {
            userId: session.user.id,
        },
    });

    return (
        <div className="flex flex-col max-w-7xl mx-auto p-4 md:p-6 space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
                    Pengaturan Integrasi
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Hubungkan akun Trello Anda untuk sinkronisasi otomatis papan dan kartu kerja.
                </p>
            </div>

            {/* Status Akun Terhubung */}
            {credential?.memberId && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-emerald-950">
                                Akun Trello Terhubung
                            </p>
                            <p className="text-xs text-emerald-700">
                                {credential.fullName} ({credential.username ? `@${credential.username}` : credential.memberId})
                            </p>
                        </div>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2.5 py-1 rounded-full">
                        Aktif
                    </span>
                </div>
            )}

            {/* Form Pengaturan */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="mb-6 pb-5 border-b border-slate-100">
                    <h2 className="text-lg font-medium text-slate-900">Kredensial API Trello</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Dapatkan API Key dan generate Token Anda melalui{" "}
                        <a
                            href="https://trello.com/app-key"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 font-medium hover:underline"
                        >
                            Trello Developer Portal
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </p>
                </div>

                <SettingsForm
                    initialData={{
                        apiKey: credential?.apiKey || "",
                        token: credential?.token || "",
                    }}
                />
            </div>
        </div>
    );
}
