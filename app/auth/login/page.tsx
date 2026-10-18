import Link from "next/link";
import { Kanban } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50/80 px-4 py-12 antialiased">
      <div className="w-full max-w-[440px] text-center">
        <div className = "flex flex-col mb-8 items-center">
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
        </div>

          
        
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-7">
          <p className="text-sm text-slate-600">
            Belum punya akun?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
