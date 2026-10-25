import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


export const instant = false;

export default async function SettingPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/login");
    }

    return (
        <main>
            <h1>Setting</h1>
            <div>
                <p>User: {session.user?.name}</p>
                <p>Email: {session.user?.email}</p>
            </div>
        </main>
    );
}
