import ServerErrorDialog from "@/components/dialogs/ErrorDialog";
import MemberCard from "@/components/member_card";
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
            <main className="w-full flex flex-col justify-center items-center">
                <div className="w-5/6 mt-10">
                    <h1 className="text-4xl font-bold">Members</h1>
                </div>
                <div className="flex space-x-3">
                    {
                        members?.map((member, i) => {
                            return (
                                <MemberCard 
                                    key={member.name}
                                    editable={false}
                                    member_data={member}
                                />
                            )
                        })
                    }
                </div>
            </main>

            <ServerErrorDialog 
                open={error_open}
                description="The server failed to load the members data. This could be due to your authentication or a server-side error. Please try refreshing the page. If the issue persists, contact an admin."
            />
        </>
    );
}