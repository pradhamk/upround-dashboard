"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type EditProps = {
    editOpen: boolean,
    setEditOpen: Dispatch<SetStateAction<boolean>>,
    insight_id?: string,
    insight_notes?: string,
    mode: 'create' | 'edit'
}

export default function MemberInsightAction({ editOpen, setEditOpen, insight_id, insight_notes, mode }: EditProps) {
    const [editInput, setEditInput] = useState(insight_notes || "");
    const isCreateMode = mode === 'create';

    const submitAction = () => {

    }

    useEffect(() => {
        if(!editOpen) { return; }
        setEditInput(insight_notes || "");
    }, [editOpen, insight_notes])

    return (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit your Insight.
                    </DialogTitle>
                    <DialogDescription>
                            You can update the content of your insight here. Once saved, your changes will be visible to other team members who have access to this company profile.
                    </DialogDescription>
                </DialogHeader>
                <Textarea 
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                />
                <div className="w-full flex justify-end">
                    <Button onClick={submitAction}>
                        Submit
                        <Send />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}