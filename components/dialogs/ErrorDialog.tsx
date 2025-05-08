"use client";

import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function InvalidMember({ open }: { open: boolean }) {
    return (
        <Dialog open={open}>
            <DialogContent hideClose={true}>                
                <DialogHeader>
                    <DialogTitle>An Error Occurred.</DialogTitle>
                </DialogHeader>
                It seems that you weren't added to our members database. Please contact one of our admins or board members to resolve this issue.
            </DialogContent>
        </Dialog>
    )
}