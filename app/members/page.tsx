import ServerErrorDialog from "@/components/dialogs/ErrorDialog";
import MemberCard from "@/components/member_card";
import { MemberSearchInput } from "@/components/search_bar";
import { createClient } from "@/utils/supabase/server";
import { getAllMembers } from "@/utils/supabase/utils";
import { MemberProfile } from "@/utils/utils";

export default async function Members() {
    let error_open = false;
    const client = await createClient();
    const { data , error } = await getAllMembers();

    if(!data) {
        error_open = true;
    }

    const members = data?.filter((person) => person.completed) || [];
    let board = {
        "board" : members.filter((member) => member.club_roles.includes('board')),
    };
    let club = {
        "fund": members.filter((member) => member.club_roles.includes('fund') && !board.board.includes(member)),
        "accelerator": members.filter((member) => member.club_roles.includes('accelerator') && !board.board.includes(member)),
        "dealflow": members.filter((member) => member.club_roles.includes('dealflow') && !board.board.includes(member)),
    }
    const roles = {
        ...board,
        ...club
    }

    const Section = ({ title, members }: { title: string; members: MemberProfile[] }) => (
        members.length > 0 && (
            <div className="mb-16">
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
            <MemberSearchInput members={members} />
            
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