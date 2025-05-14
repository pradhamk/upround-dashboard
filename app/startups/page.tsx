import StartupCard from "@/components/StartupCard";
import { createClient } from "@/utils/supabase/server";
import { StartupProfile } from "@/utils/utils";
import ServerErrorDialog from "@/components/dialogs/ErrorDialog";

export default async function Startups() {
    let error_open = false;
    const client = await createClient();

    const { data, error }: { data: StartupProfile[] | null, error: any } = await client
        .schema('dealflow')
        .from('startups')
        .select('*')

    if (error) {
        error_open = true;
    }

    return (
        <>
            <main className="w-full flex items-center justify-center">
                <div className="w-1/3 flex flex-col gap-y-2">
                    {
                        data?.map((startup, i) => {
                            return <StartupCard key={i} startup={startup}/>
                        })
                    }
                </div>
            </main>
            <ServerErrorDialog
                open={error_open}
                description="The server failed to load the startups. This could be due to your authentication or a server-side error. Please try refreshing the page. If the issue persists, contact an admin."
            />
        </>
    );
}