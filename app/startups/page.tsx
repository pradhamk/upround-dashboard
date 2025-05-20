import StartupsList from "@/components/StartupsList";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/utils/supabase/utils";

export default async function Startups() {
    const client = await createClient();
    const is_admin = await isAdmin(client);

    return (
        <>
            <main className="w-full flex flex-col items-center justify-center">
                <StartupsList is_admin={is_admin} /> 
            </main>
        </>
    );
}