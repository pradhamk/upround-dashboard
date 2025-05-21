"use client";

import { Plus, UserRoundPlus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import MemberRolesSelect from "./MemberRolesSelect";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddMember() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState(["Member"]);
    const router = useRouter();

    const submit = async () => {
        const res = await fetch('/api/admin/add_member', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                roles: selectedRoles,
                is_admin: isAdmin
            })
        })

        if(res.status === 200) {
            setDialogOpen(false);
            router.push('/admin')
        } else {
            const err = await res.json();
            toast(err['error']);
        }
    }

    return (
        <>
            <Button size={"icon"} variant={"outline"} onClick={() => setDialogOpen(true)}>
                <UserRoundPlus />
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a New Member</DialogTitle>
                        <DialogDescription>You can add new members to the UpRound DB from here. This will allow them to access the dashboard.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label className="font-bold">Member Email</Label>
                            <p className="text-xs text-muted-foreground">Enter the UMich email of the new member.</p>
                            <Input 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="member@umich.edu"
                            />
                        </div>
                        <div>
                            <Label className="font-bold">Member Roles Select</Label>
                            <MemberRolesSelect
                                roles={selectedRoles}
                                setRoles={setSelectedRoles}
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label className="font-bold">Admin Member?</Label>
                            <p className="text-xs text-muted-foreground">Should the new member be an admin (they will have the same permissions you do)?</p>
                            <div className="flex space-x-2 items-center">
                                <span className="text-xs">New Member is Admin: </span>
                                <Checkbox 
                                    checked={isAdmin}
                                    onCheckedChange={(checked) => setIsAdmin(Boolean(checked))}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex justify-end">
                        <Button onClick={submit} disabled={email.trim().length === 0}>
                            Add
                            <Plus />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}