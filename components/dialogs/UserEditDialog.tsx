"use client";

import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { MoveRight } from "lucide-react";
import { Button } from "../ui/button";
import { BASE_LINKEDIN_URL, MemberProfile } from "@/utils/utils";
import { toast } from "sonner";
import MemberCard from "../member_card";
import UpRoundLogo from "../upround_logo";

interface DialogProps {
    user: User | null,
    member_data: MemberProfile | undefined,
    dialogOpen: boolean,
    setDialogOpen?: Dispatch<SetStateAction<boolean>>,
    mode: "edit" | "firstlogin"
}

export default function UserEditDialog({ user, member_data, dialogOpen, setDialogOpen, mode }: DialogProps) {
    const [internalOpen, setInternalOpen] = useState(dialogOpen);
    const [memberData, setMemberData] = useState<MemberProfile>(createMemberData(member_data, user));
    
    const submitForm = async () => {
        const body: MemberProfile = memberData;

        const res = await fetch(
            '/api/member_profile',
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'Application/JSON'
                }
            }
        )

        if(res.status === 200) {
            if(setDialogOpen) {
                setDialogOpen(false);
            } else {
                setInternalOpen(false);
            }
        } else {
            const err = await res.json();
            toast(err['error']);
        }
    }

    useEffect(() => {
        if (setDialogOpen === undefined) {
            setInternalOpen(dialogOpen);
        }
    }, [dialogOpen, setDialogOpen]);

    useEffect(() => {
        if(!member_data) return;
        setMemberData(createMemberData(member_data, user));
    }, [member_data])

    return (
        <Dialog open={setDialogOpen ? dialogOpen : internalOpen} onOpenChange={setDialogOpen ?? setInternalOpen}>
            <DialogContent hideClose={mode === 'firstlogin' ? true : false}>
                <DialogHeader>
                    <DialogTitle className="flex justify-between">
                        { mode === 'firstlogin' ?
                            <>
                                Welcome to UpRound!
                                <UpRoundLogo width={20}/>
                            </> 
                            : "Edit your Profile." 
                        }
                    </DialogTitle>
                    <DialogDescription>Before proceeding, please complete or confirm the following details. This information will be displayed on the members page exactly as seen below.</DialogDescription>
                </DialogHeader>

                <MemberCard 
                    editable={true}
                    member_data={memberData}
                    setMemberData={setMemberData}
                />
                <div className="flex justify-end">
                    <Button className="w-1/4" onClick={submitForm}>
                        Submit
                        <MoveRight />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function createMemberData(member_data: MemberProfile| undefined, user: User | null): MemberProfile {
    return {
        id: member_data?.id as string,
        email: member_data?.email || user?.email as string,
        name: member_data?.name || user?.user_metadata.full_name,
        about: member_data?.about || null,
        club_roles: member_data?.club_roles as string[],
        completed: member_data?.completed as boolean,
        graduation_date: member_data?.graduation_date || 2028,
        major: member_data?.major || null,
        linkedin: member_data?.linkedin || BASE_LINKEDIN_URL,
        pfp: member_data?.pfp || user?.user_metadata.picture,
        phone: member_data?.phone || null
    }
}