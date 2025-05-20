import MemberInsightsDisplay from "@/components/member_insight";
import { StartupGeniusCard } from "@/components/StartupCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/utils/supabase/utils";
import { EnrichedAnalystInsight, generatePreview, MemberProfile, StartupProfile } from "@/utils/utils";
import { redirect } from "next/navigation";

export default async function StartupProfilePage({ searchParams }: { searchParams?: Promise<{ id: string }> }) {
    const id = (await searchParams)?.id;
    if(!id || typeof id !== 'string') {
        redirect('/startups');
    }

    const client = await createClient();
    const { data, error }: { data: StartupProfile | null, error: any } = await client
                .schema('dealflow')
                .from('startups')
                .select('*')
                .eq('id', id)
                .limit(1)
                .single();

    if(error || !data) {
        redirect('/startups');
    }

    const { data: sourcer }: { data: MemberProfile | null } = await client
                        .schema('members')
                        .from('profiles')
                        .select('*')
                        .eq('id', data.sourcer)
                        .limit(1)
                        .single();

    const user = (await client.auth.getUser()).data.user;
    const is_admin = await isAdmin(client);

    return (
        <main className="w-full flex flex-col-reverse lg:flex-row lg:items-start justify-center mt-12 gap-8 px-4">
            <div className="w-full lg:w-1/2 h-fit flex-grow-0">
                <div className="flex">
                    <Avatar className="rounded-lg size-32">
                        <AvatarImage src={generatePreview(data.website)} />
                        <AvatarFallback>{data.name} Logo</AvatarFallback>
                    </Avatar>
                    <div className="pl-10 flex flex-col space-y-4 w-3/4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold">{data.name}</h1>
                            <h2 className="italic text-lg">{data.industry}</h2>
                        </div>
                        <h3 className="text-xl">{data.tagline}</h3>
                    </div>
                </div>
                <p className="mt-8 whitespace-pre-wrap leading-relaxed lg:mr-10">
                    {data.description}
                </p>
                <div className="lg:pr-10">
                    <MemberInsightsDisplay user={user} company_id={data.id} />
                </div>
            </div>

            <div className="w-full lg:w-1/5">
                <StartupGeniusCard startup={data} member={sourcer} is_admin={is_admin} />
            </div>
        </main>
    ) 
}