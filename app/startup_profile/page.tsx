import { MemberShortDisplay } from "@/components/MemberShortDisplay";
import { StartupGeniusCard } from "@/components/StartupCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { generatePreview, StartupProfile } from "@/utils/utils";
import {  } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function StartupProfilePage({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {
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

    return (
        <main className="w-full flex justify-center mt-12">
            <div className="w-1/2 h-fit flex-grow-0">
                <div className="flex">
                    <Avatar className="rounded-lg size-32">
                        <AvatarImage src={generatePreview(data.website)}/>
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
                <p className="mt-8 whitespace-pre-wrap leading-relaxed mr-10">
                    {data.description}
                </p>
                <div className="mt-10">
                    <h1 className="font-bold text-xl">Analyst Insights:</h1>
                </div>
            </div>
            <div className="w-1/5">
                <StartupGeniusCard startup={data} />
            </div>
        </main>
    ) 
}