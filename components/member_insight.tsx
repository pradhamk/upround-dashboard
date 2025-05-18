"use client";

import { EnrichedAnalystInsight } from "@/utils/utils";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { MessageSquareDiff, Pencil, Trash2 } from "lucide-react";
import { MemberInsightAction, MemberInsightDelete } from "./MemberInsightAction";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";

type MemberInsightProps = {
    insight: EnrichedAnalystInsight,
    editable?: boolean,
    onEditClick: (mode: 'edit' | 'create' | 'delete', id?: string) => void
}

export default function MemberInsightsDisplay({ user, company_id }: { user: User | null, company_id: string }) {
    const client = createClient();
    const [insights, setInsights] = useState<EnrichedAnalystInsight[] | null>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [actionMode, setActionMode] = useState<'edit' | 'create' | 'delete'>('create');
    const [selectedInsight, setSelectedInsight] = useState<{
        id?: string,
        notes?: string,
    }>({});

    const handleClick = (mode: 'edit' | 'create' | 'delete', id?: string) => {
        setActionMode(mode);
        if (mode === 'create') {
            setSelectedInsight({});
            setDialogOpen(true);
            return;
        }

        const insight = insights?.find(insight => insight.id === id);
        if (!insight) return;

        setSelectedInsight({
            id: insight.id,
            notes: insight.notes,
        });

        if (mode === 'delete') {
            setDeleteOpen(true);
        } else {
            setDialogOpen(true);
        }
    };


    const getInsights = () => {
        client
            .schema('dealflow')
            .from('enriched_insights')
            .select('*')
            .eq('company', company_id)
            .then(({ data }: { data: EnrichedAnalystInsight[] | null }) => {
                setInsights(data)
            })
    }

    useEffect(() => {
        getInsights();
    }, [])

    return (
        <div className="mt-10">
            <div className="flex justify-between w-full">
                <h1 className="font-bold text-xl mb-5">Analyst Insights:</h1>
                <Button size="icon" onClick={() => handleClick('create')}>
                    <MessageSquareDiff />
                </Button>
            </div>
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
                                        onEditClick={handleClick}
                                    />
                        })
                    }
                </div>
            }
            <MemberInsightAction 
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                company_id={company_id}
                insight_id={selectedInsight.id}
                insight_notes={selectedInsight.notes}
                mode={actionMode}
                refresh_insights={getInsights}
            />
            <MemberInsightDelete 
                dialogOpen={deleteOpen}
                setDialogOpen={setDeleteOpen}
                company_id={company_id}
                insight_id={selectedInsight.id}
                insight_notes=""
                mode='delete'
                refresh_insights={getInsights}
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
                <div className="absolute right-5 top-5 flex space-x-3">
                    <Pencil 
                        className="cursor-pointer" 
                        size={15}
                        onClick={() => onEditClick('edit', insight.id)}
                    />
                    <Trash2 
                        className="cursor-pointer" 
                        size={15}
                        onClick={() => onEditClick('delete', insight.id)}
                    />
                </div>
            }
        </Card>
    )
}