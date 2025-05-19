import StartupCard from "@/components/StartupCard";
import { createClient } from "@/utils/supabase/server";
import { MemberProfile, StartupProfile } from "@/utils/utils";
import ServerErrorDialog from "@/components/dialogs/ErrorDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateStartup from "@/components/CreateStartup";

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

    const sourcerIds = data?.map((s) => s.sourcer);
    const { data: memberProfiles }: { data: MemberProfile[] | null } = await client
                                        .schema('members')
                                        .from('profiles')
                                        .select("*")
                                        .in("id", sourcerIds || []);

    const memberMap = new Map(memberProfiles?.map((m) => [m.id, m]));

    return (
        <>
            <main className="w-full flex flex-col items-center justify-center">
                <div className="w-2/3 flex justify-between mt-10">
                    <h1 className="font-bold text-3xl">Startups</h1>
                    <CreateStartup />
                </div>
                <div className="w-1/3 flex flex-col gap-y-2">
                    {
                        data?.map((startup, i) => {
                            return <StartupCard 
                                        key={i} 
                                        startup={startup}
                                        member={memberMap.get(startup.sourcer)}
                                    />
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