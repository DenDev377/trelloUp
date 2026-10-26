import NavbarComponent from "@/components/NavbarComponent";
import SidebarComponent from "@/components/SidebarComponent";
import { Divide } from "lucide-react";
import { Suspense } from "react";

export const instant = false;

export default function DashboardLayout({
    children,
}: {children: React.ReactNode}){
    return(
        <div className = "flex min-h-screen bg-[#F8FAFC]">
            <SidebarComponent/>
            <div className = "flex flex-col flex-1 min-w-0">
                <Suspense fallback={<div className="h-16 bg-white border-b border-slate-100" />}>
                    <NavbarComponent />
                </Suspense>
                <main className = "flex-1 p-4 md:p-7 overflow-y-auto">{children}</main>
            </div>
        </div>
    )

}
