"use client"

import { List, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SidebarComponent() {
    const pathname = usePathname()

    const menuItem = [
        {
            name: "Board",
            href: "/dashboard/board-trello",
            icon: List

        },
        {
            name: "Setting",
            href: "/dashboard/settings",
            icon: Settings
        }
    ]

    return (
        <aside className="bg-white min-h-screen border-r border-slate-200 w-72 flex-col md:flex hidden shrink-0 relative">
            <div className="flex items-center border-b h-20 border-slate-100 px-6">
                <Link
                    href="/dashboard/board-trello"
                    className="flex items-center gap-3 mx-auto group cursor-pointer"
                >
                    <div className="h-11 w-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
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
                    <div className="text-center">
                        <div className="text-lg font-semibold text-slate-900 tracking-tight">Trello</div>
                    </div>
                </Link>
            </div>
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-1.5">
                    {menuItem.map((item, index) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                        const Icon = item.icon

                        return (
                            <li key={index}>
                                <Link
                                    href={item.href}
                                    className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200"
                                    }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                                            isActive
                                                ? "text-white"
                                                : "text-slate-500 group-hover:text-slate-900"
                                        }`}
                                    />
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}