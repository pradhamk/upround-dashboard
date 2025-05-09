"use client";

import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function ServerErrorDialog({ open, description }: { open: boolean, description: string }) {
    return (
        <Dialog open={open}>
            <DialogContent hideClose={true}>                
                <DialogHeader>
                    <DialogTitle>An Error Occurred.</DialogTitle>
                </DialogHeader>
                {description}
            </DialogContent>
        </Dialog>
    )
}