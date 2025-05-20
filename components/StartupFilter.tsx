"use client";

import { DealflowStatus, MVCLevel, StartupProfile } from "@/utils/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ListFilterPlus } from "lucide-react";
import { Input } from "./ui/input";

export default function StartupFilter({ masterList, startups, setStartups }: { masterList: StartupProfile[], startups: StartupProfile[], setStartups: Dispatch<SetStateAction<StartupProfile[]>> }) {
    const [industrySearch, setIndustrySearch] = useState("");
    const [dateSearch, setDateSearch] = useState("");
    const [sourceSearch, setSourceSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    
    const clearSearches = () => {
        setIndustrySearch("");
        setDateSearch("");
        setSourceSearch("");
        setSelectedStatus("");
        setSelectedLevel("");
    }

    useEffect(() => {
        const trimmedIndustry = industrySearch.trim().toLowerCase();
        const trimmedSource = sourceSearch.trim().toLowerCase();

        const filtered = masterList.filter((startup) => {
            const matchesIndustry = trimmedIndustry === "" || (startup.industry?.toLowerCase().startsWith(trimmedIndustry));
            const matchesSource = trimmedSource === "" || (startup.source?.toLowerCase().includes(trimmedSource));
            const matchesDate = dateSearch === "" || (startup.date_sourced?.startsWith(dateSearch));
            const matchesStatus = selectedStatus === "" || startup.status === selectedStatus;
            const matchesLevel = selectedLevel === "" || startup.mvc_level === selectedLevel;

            return (
                matchesIndustry &&
                matchesSource &&
                matchesDate &&
                matchesStatus &&
                matchesLevel
            );
        });

        setStartups(filtered);
    }, [industrySearch, dateSearch, sourceSearch, selectedStatus, selectedLevel]);

    return (
        <Card className="p-4 space-y-4">
            <CardContent className="space-y-6 p-0">
                <CardHeader className="p-0">
                    <CardTitle className="flex items-center justify-between text-xl font-semibold">
                        Filter
                        <ListFilterPlus size={20} />
                    </CardTitle>
                    <CardDescription>
                        Retrieved {startups.length} {startups.length === 1 ? "result" : "results"}
                    </CardDescription>
                </CardHeader>

                <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Industry</span>
                    <Input
                        value={industrySearch}
                        onChange={(e) => setIndustrySearch(e.target.value)}
                        placeholder="Defense, Fintech, etc."
                    />
                </div>

                <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Sourced Date</span>
                    <Input
                        type="date"
                        value={dateSearch}
                        onChange={(e) => setDateSearch(e.target.value)}
                        placeholder="Date"
                    />
                </div>

                <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Source</span>
                    <Input
                        value={sourceSearch}
                        onChange={(e) => setSourceSearch(e.target.value)}
                        placeholder="Pitchbook, YC, etc."
                    />
                </div>

                <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Dealflow Status</span>
                    <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(DealflowStatus).map((val, i) => (
                                <SelectItem key={i} value={val}>
                                {val}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">MVC Level</span>
                    <Select onValueChange={setSelectedLevel} value={selectedLevel}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(MVCLevel).map((val, i) => (
                                <SelectItem key={i} value={val}>
                                {val}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full flex justify-end">
                    <Button variant={"outline"} onClick={clearSearches}>
                        Clear
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}