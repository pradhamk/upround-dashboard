"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InsightActionBody } from "@/utils/utils";
import { toast } from "sonner";
import DeleteDialog from "./dialogs/DeleteDialog";

type EditProps = {
    dialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
    insight_id?: string;
    insight_notes?: string;
    company_id: string;
    mode: "create" | "edit" | 'delete';
    refresh_insights: () => void;
};

export function MemberInsightAction({
    dialogOpen,
    setDialogOpen,
    insight_id,
    insight_notes,
    mode,
    company_id,
    refresh_insights,
}: EditProps) {
    const [editInput, setEditInput] = useState(insight_notes || "");
    const isCreateMode = mode === "create";

    const submitAction = async () => {
        const body: InsightActionBody = {
            method: isCreateMode ? 'create' : 'edit',
            company_id: company_id,
            notes: editInput,
            ...(!isCreateMode && { insight_id: insight_id })
        }
        
        const res = await fetch('/api/insight_action', {
            method: 'POST',
            body: JSON.stringify(body)
        })

        if(res.status === 200) {
            refresh_insights();
            setDialogOpen(false);
        } else {
            const err = await res.json();
            toast(err['error'])
        }
    };

    useEffect(() => {
        if (dialogOpen) {
            setEditInput(insight_notes || "");
        }
    }, [dialogOpen, insight_notes]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isCreateMode ? "Add a New Insight" : "Edit Your Insight"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreateMode
                            ? "Provide your analysis or comment for this company."
                            : "Update your insight. Changes will be visible to team members."}
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    placeholder={
                        isCreateMode
                            ? "Write your insight here..."
                            : "Edit your insight..."
                    }
                    rows={5}
                />
                <div className="w-full flex justify-end">
                    <Button onClick={submitAction} disabled={!editInput.trim()}>
                        {isCreateMode ? "Submit Insight" : "Update Insight"}
                        <Send className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function MemberInsightDelete({ dialogOpen, insight_id, company_id, refresh_insights, setDialogOpen }: EditProps) {
    const deleteAction = async () => {
        const body: InsightActionBody = {
            method: 'delete',
            company_id: company_id,
            notes: "",
            insight_id: insight_id,
        }
        
        const res = await fetch('/api/insight_action', {
            method: 'POST',
            body: JSON.stringify(body)
        })

        if(res.status === 200) {
            refresh_insights();
            setDialogOpen(false);
        } else {
            const err = await res.json();
            toast(err['error'])
        }
    };

    return (
        <DeleteDialog 
            open={dialogOpen}
            setOpen={setDialogOpen}
            title="Delete your Insight"
            description="Confirming this delete will remove your insight from this company. Are you sure?"
            deleteAction={deleteAction}
        />
    );
}