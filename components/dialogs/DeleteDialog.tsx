import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type dialogProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    deleteAction: () => void
    description: string,
    title: string,
    children?: React.ReactNode
};

export default function DeleteDialog({ open, setOpen, deleteAction, description, title, children }: dialogProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
                <div className="w-full flex justify-end">
                    <Button onClick={deleteAction} variant="destructive">
                        Delete
                        <Trash2 className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}