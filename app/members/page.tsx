import ServerErrorDialog from "@/components/dialogs/ErrorDialog";
import { createClient } from "@/utils/supabase/server";
import { MemberProfile } from "@/utils/utils";

export default async function Startups() {
    let error_open = false;
    const client = await createClient();
    const { data }: { data: MemberProfile[] | null } = await client
                            .schema('members')
                            .from('profiles')
                            .select('*');
    if(!data) {
        error_open = true;
    }

    const members = data?.filter((person) => person.completed);


    return (
        <>
            <main>
                <h1>test</h1>
            </main>

            <ServerErrorDialog 
                open={error_open}
                description="The server failed to load the members data. This could be due to your authentication or a server-side error. Please try refreshing the page. If the issue persists, contact an admin."
            />
        </>
    );
}