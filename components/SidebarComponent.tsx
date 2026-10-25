import { Settings } from "lucide-react"
import Link from "next/link"


export default function SidebarComponent() {

    const menuItem = [
        {
            name: "Setting",
            href: "/dashboard/settings",
            icon: Settings
        }
    ]
    return (
        <aside className="bg-white min-h-screen border-r border-slate-200 w-72 flex-col md:flex hidden shrink-0 relative">
            <div className="flex items-center border-b h-20 border-slate-100 px-6">
                <div className="flex items-center gap-3 mx-auto">
                    <div className="h-11 w-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-sm">
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
                        <div className="text-lg font-semibold text-slate-900">Trello</div>
                    </div>
                </div>
            </div>
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItem.map((item, index) => (
                        <li key={index}>
                            <Link href={item.href} className="flex items-center gap-3">
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

            </nav>

        </aside>
    )
}