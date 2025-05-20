"use client";

import { useEffect, useState } from "react";
import StartupCard from "./StartupCard";
import ServerErrorDialog from "./dialogs/ErrorDialog";
import { createClient } from "@/utils/supabase/client";
import { MemberProfile, StartupProfile } from "@/utils/utils";
import CreateStartup from "./CreateStartup";
import DeleteDialog from "./dialogs/DeleteDialog";
import { toast } from "sonner";
import { ListFilterPlus, Search } from "lucide-react";
import { Input } from "./ui/input";
import StartupFilter from "./StartupFilter";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

export default function StartupsList({ is_admin }: { is_admin: boolean }) {
    const client = createClient();
    const [startups, setStartups] = useState<StartupProfile[]>([]);
    const [displayStartups, setDisplayStartups] = useState<StartupProfile[]>([]);
    const [memberMap, setMemberMap] = useState<Map<string, MemberProfile>>(new Map());
    const [errorOpen, setErrorOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [delStartupId, setDelStartupId] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);

    const [search, setSearch] = useState("");

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
        setDisplayStartups(startupsData);

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

    const openDeletePrompt = (id: string) => {
        setDelStartupId(id);
        setDeleteOpen(true);
    }

    const deleteStartup = async () => {
        const res = await fetch('/api/startup_action', {
            method: 'POST',
            body: JSON.stringify({
                method: 'delete',
                company_id: delStartupId,
            })
        })

        if(res.status === 200) {
            await getData();
            setDeleteOpen(false);
        } else {
            const err = await res.json();
            toast(err['error']);
        }
    }

    useEffect(() => {
        (async () => getData())();
    }, []);

    useEffect(() => {
        const trimmedSearch = search.trim().toLowerCase();
        const filtered = startups.filter((startup) => {
            return trimmedSearch === "" || startup.name.toLowerCase().startsWith(trimmedSearch);
        });

        setDisplayStartups(filtered);
    }, [search]);

    return (
        <div className="w-3/4 flex flex-col">
            <div className="flex justify-between mt-10">
                <h1 className="font-bold text-3xl">Startups</h1>
                <div className="space-x-2 flex">
                    <Button size={"icon"} variant={"outline"} className="flex lg:hidden" onClick={() => setFilterOpen(true)}>
                        <ListFilterPlus />
                    </Button>
                    <CreateStartup refresh={getData} />
                </div>
            </div>
            <div className="flex w-full justify-center my-5">
                <div className="relative md:w-1/2 w-2/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={15} />
                    <Input
                        className="pl-10"
                        placeholder="Search for a startup"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex w-full">
                <div className="w-1/2 mr-10 hidden lg:block">
                    <StartupFilter 
                        masterList={startups}
                        startups={displayStartups}
                        setStartups={setDisplayStartups}
                    />
                </div>
                <div className="w-full flex flex-col gap-y-2">
                    {displayStartups.map((startup) => (
                        <StartupCard
                            key={startup.id}
                            startup={startup}
                            member={memberMap.get(startup.sourcer)}
                            can_delete={is_admin}
                            deleteStartup={openDeletePrompt}
                        />
                    ))}
                </div>
            </div>
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
                <DialogTitle></DialogTitle>
                <DialogContent className="block lg:hidden">
                    <div className="py-2">
                        <StartupFilter 
                            masterList={startups}
                            startups={displayStartups}
                            setStartups={setDisplayStartups}
                        />
                    </div>
                </DialogContent>
            </Dialog>
            <DeleteDialog 
                open={deleteOpen}
                setOpen={setDeleteOpen}
                deleteAction={deleteStartup}
                title="Delete the Startup"
                description="Confirming this delete will remove the company from the startups db. Are you sure?"
            />
            <ServerErrorDialog
                open={errorOpen}
                description="The server failed to load the startups. This could be due to your authentication or a server-side error. Please try refreshing the page. If the issue persists, contact an admin."
            />
        </div>
    );
}