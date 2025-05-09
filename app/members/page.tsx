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

    const members = data?.filter((person) => person.completed) || [];
    const roles = {
        "board": members.filter((member) => member.club_roles.includes('board')),
        "fund": members.filter((member) => member.club_roles.includes('fund')),
        "accelerator": members.filter((member) => member.club_roles.includes('accelerator')),
        "dealflow": members.filter((member) => member.club_roles.includes('dealflow')),
    };

    const Section = ({ title, members }: { title: string; members: MemberProfile[] }) => (
        members.length > 0 && (
            <div className="mt-16">
                <h1 className="text-4xl font-bold">{title[0].toUpperCase() + title.slice(1)}</h1>
                <div className="grid flex-wrap gap-y-4 grid-cols-4 gap-x-2 mt-4">
                    {members.map((member) => (
                        <MemberCard
                            key={member.name}
                            editable={false}
                            member_data={member}
                        />
                    ))}
                </div>
            </div>
        )
    );

    return (
        <>
            <main className="w-full flex flex-col justify-center items-center">
                <div className="w-11/12 flex flex-col pb-10">
                    {Object.entries(roles).map(([title, members]) => (
                        <Section key={title} title={title} members={members} />
                    ))}
                </div>
            </main>

            <ServerErrorDialog 
                open={error_open}
                description="The server failed to load the members data. This could be due to your authentication or a server-side error. Please try refreshing the page. If the issue persists, contact an admin."
            />
        </>
    );
}