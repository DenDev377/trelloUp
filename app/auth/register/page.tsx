"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { registerUser } from "@/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state for live validation cues
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isPasswordLongEnough = password.length >= 6;
  const isPasswordMatching =
    confirmPassword.length > 0 && password === confirmPassword;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await registerUser(formData);

      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      if (result.success) {
        setSuccessMessage(
          "Akun Anda berhasil didaftarkan! Mengalihkan ke halaman login..."
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      }
    });
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50/80 px-4 py-12 antialiased">
      <div className="w-full max-w-[440px]">
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
            Mulai dengan TrelloUp
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Daftar gratis untuk mengelola dan menganalisis board Trello Anda
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
            {/* Field Nama */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled={isPending}
                placeholder="John Doe"
                autoComplete="name"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Field Email */}
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
                disabled={isPending}
                placeholder="nama@perusahaan.com"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {/* Field Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  disabled={isPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password requirement hint */}
              {password.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                  <span
                    className={
                      isPasswordLongEnough
                        ? "text-emerald-600 font-medium"
                        : "text-slate-500"
                    }
                  >
                    {isPasswordLongEnough ? "✓" : "•"} Minimal 6 karakter
                  </span>
                </div>
              )}
            </div>

            {/* Field Konfirmasi Password */}
            <div>
              <label
                htmlFor="passwordConfirmation"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  required
                  disabled={isPending}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan konfirmasi password"
                      : "Tampilkan konfirmasi password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password match hint */}
              {confirmPassword.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                  <span
                    className={
                      isPasswordMatching
                        ? "text-emerald-600 font-medium"
                        : "text-amber-600"
                    }
                  >
                    {isPasswordMatching
                      ? "✓ Password cocok"
                      : "• Password belum cocok"}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-gray-500 active:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mendaftarkan akun...</span>
                  </>
                ) : (
                  <>
                    <span>Buat Akun</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Note */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400 text-center">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>Kredensial dan data Anda dienkripsi dengan aman</span>
          </div>
        </div>

        {/* Footer / Login Link */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Sudah punya akun?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-red-600 hover:text-red-500 transition-colors underline-offset-4 hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}