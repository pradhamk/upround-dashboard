"use client";

import { useEffect, useState } from "react";
import StartupCard from "./StartupCard";
import ServerErrorDialog from "./dialogs/ErrorDialog";
import { createClient } from "@/utils/supabase/client";
import { MemberProfile, StartupProfile } from "@/utils/utils";
import CreateStartup from "./CreateStartup";

export default function StartupsList() {
    const client = createClient();
    const [startups, setStartups] = useState<StartupProfile[]>([]);
    const [memberMap, setMemberMap] = useState<Map<string, MemberProfile>>(new Map());
    const [errorOpen, setErrorOpen] = useState(false);

    const getData = async () => {
        const { data: startupsData, error: startupError } = await client
        .schema("dealflow")
        .from("startups")
        .select("*");

        if (startupError || !startupsData) {
            setErrorOpen(true);
            return;
        }

        setStartups(startupsData);

        const sourcerIds = startupsData.map((s) => s.sourcer);
        const { data: membersData, error: membersError } = await client
            .schema("members")
            .from("profiles")
            .select("*")
            .in("id", sourcerIds);

        if (membersError || !membersData) {
            setErrorOpen(true);
            return;
        }

        const map = new Map(membersData.map((m) => [m.id, m]));
        setMemberMap(map);
    }

    useEffect(() => {
        (async () => getData())();
    }, []);

    return (
        <>
            <div className="w-2/3 flex justify-between mt-10">
                <h1 className="font-bold text-3xl">Startups</h1>
                <CreateStartup refresh={getData} />
            </div>
            <div className="w-1/3 flex flex-col gap-y-2">
                {startups.map((startup) => (
                    <StartupCard
                        key={startup.id}
                        startup={startup}
                        member={memberMap.get(startup.sourcer)}
                    />
                ))}
            </div>
            <ServerErrorDialog
                open={errorOpen}
                description="The server failed to load the startups. This could be due to your authentication or a server-side error. Please try refreshing the page. If the issue persists, contact an admin."
            />
        </>
    );
}