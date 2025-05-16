"use client";

import { EnrichedAnalystInsight } from "@/utils/utils";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Pencil } from "lucide-react";
import MemberInsightAction from "./MemberInsightAction";

type MemberInsightProps = {
    insight: EnrichedAnalystInsight,
    editable?: boolean,
    onEditClick: (id: string) => void
}

export default function MemberInsightsDisplay({ insights, user }: { insights: EnrichedAnalystInsight[] | null, user: User | null }) {
    const [editOpen, setEditOpen] = useState(false);
    const [selectedInsight, setSelectedInsight] = useState<{
        id?: string,
        notes?: string,
    }>({});

    const handleEditClick = (id: string) => {
        const insight = insights?.find(insight => insight.id === id);
        if(insight) {
            setSelectedInsight({
                id: insight.id,
                notes: insight.notes
            });
            setEditOpen(true);
        }
    }

    return (
        <div className="mt-10">
            <h1 className="font-bold text-xl mb-5">Analyst Insights:</h1>
            {
                !insights || insights.length === 0 ?
                <h1 className="opacity-75">There are no comments for this company.</h1> : 
                <div className="space-y-3 mb-10">
                    {
                        insights?.map((insight, i) => {
                            return <MemberInsight 
                                        key={i}
                                        insight={insight}
                                        editable={insight.user_email === user?.email}
                                        onEditClick={handleEditClick}
                                    />
                        })
                    }
                </div>
            }
            <MemberInsightAction 
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                insight_id={selectedInsight.id}
                insight_notes={selectedInsight.notes}
                mode="edit"
            />
        </div>
    )
}

export function MemberInsight({ insight, editable, onEditClick }: MemberInsightProps) {
    return (
        <Card className="relative">
            <CardHeader className="flex flex-row space-x-3 items-center">
                <Avatar>
                    <AvatarImage src={insight.user_pfp}/>
                    <AvatarFallback>{insight.user_name} Profile</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="font-bold">{insight.user_name}</h1>
                    <h3 className="opacity-75 text-sm">
                        {new Date(insight.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </h3>
                </div>
            </CardHeader>
            <CardContent>
                {insight.notes}
            </CardContent>
            {
                editable &&
                <Pencil 
                    className="absolute right-5 top-5 cursor-pointer" 
                    size={15}
                    onClick={() => onEditClick(insight.id)}
                />
            }
        </Card>
    )
}