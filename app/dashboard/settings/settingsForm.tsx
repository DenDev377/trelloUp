"use client";
import { useActionState, useState } from "react";
import { trelloAction, TrelloActionState } from "@/actions/trello/action";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsForm({
    initialData,
}: {
    initialData?: {
        apiKey: string;
        token: string;
    };
}) {
    const [state, formAction, isPending] = useActionState<TrelloActionState | null, FormData>(
        trelloAction,
        null
    );

    const [showToken, setShowToken] = useState(false);

    return (
        <form action={formAction} className="space-y-5 max-w-lg">
            {/* Alert Error */}
            {state?.error && (
                <div className="p-3.5 bg-red-50/80 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <span>{state.error}</span>
                </div>
            )}

            {/* Alert Sukses */}
            {state?.success && (
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Kredensial Trello berhasil diverifikasi dan disimpan!</span>
                </div>
            )}

            {/* Input API Key */}
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                    API Key
                </label>
                <input
                    name="apiKey"
                    type="text"
                    required
                    defaultValue={initialData?.apiKey || ""}
                    placeholder="Contoh: 8a7f92b..."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono placeholder:font-sans"
                />
            </div>

            {/* Input Token dengan Toggle Show/Hide */}
            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                    Token
                </label>
                <div className="relative">
                    <input
                        name="token"
                        type={showToken ? "text" : "password"}
                        required
                        defaultValue={initialData?.token || ""}
                        placeholder="Contoh: ATATT..."
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono placeholder:font-sans"
                    />
                    <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                    >
                        {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Tombol Submit dengan Spinner */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Memverifikasi Akun...</span>
                        </>
                    ) : (
                        <span>Simpan Pengaturan</span>
                    )}
                </button>
            </div>
        </form>
    );
}
