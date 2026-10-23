"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    if (!email || !password) {
      setErrorMessage("Email dan password wajib diisi.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (result?.error) {
          if (result.error === "CredentialsSignin") {
            setErrorMessage("Email atau password yang Anda masukkan salah.");
          } else {
            setErrorMessage("Terjadi kesalahan saat login. Silakan coba lagi.");
          }
          return;
        }

        if (result?.ok) {
          setSuccessMessage("Login berhasil! Mengalihkan ke dashboard...");
          router.refresh();
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage("Terjadi masalah jaringan atau server. Silakan coba lagi.");
      }
    });
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50/80 px-4 py-12 antialiased">
      <div className="w-full max-w-110">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-11 w-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-sm mb-4">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="3.5" width="7.5" height="17" rx="2" fill="white" />
              <rect
                x="13.5"
                y="3.5"
                width="7.5"
                height="10"
                rx="2"
                fill="white"
                fillOpacity="0.45"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Masuk ke TrelloUp
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Masuk untuk mengelola dan menganalisis board Trello Anda
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-7 sm:p-9">
          {/* Error Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-3 p-3.5 mb-6 text-sm text-red-700 bg-red-50 border border-red-200/80 rounded-xl animate-in fade-in duration-200"
            >
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div
              role="status"
              className="flex items-start gap-3 p-3.5 mb-6 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in duration-200"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Alamat Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={isPending || !!successMessage}
                placeholder="nama@perusahaan.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  disabled={isPending || !!successMessage}
                  placeholder="Masukkan password Anda"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending || !!successMessage}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending || !!successMessage}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-gray-500 active:bg-gray-700 text-white px-4 py-2.5 text-sm font-semibold shadow-sm shadow-blue-600/20 transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Masuk...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400 text-center">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>Kredensial dan sesi Anda terlindungi dengan aman</span>
          </div>
        </div>

        {/* Footer / Register Link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Belum punya akun?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-blue-600 hover:text-blue-500 transition-colors underline-offset-4 hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
