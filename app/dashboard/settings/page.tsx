

export default async function SettingPage() {

    const session = await getServerSession(authOptions);

    return (
        <main>
            <h1>Setting</h1>
            <div>
                <p>User: {session?.user?.name}</p>
                <p>Email: {session?.user?.email}</p>
            </div>
        </main>
    )
}