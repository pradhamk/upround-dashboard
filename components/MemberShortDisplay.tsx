"use client";

import { createClient } from "@/utils/supabase/client";
import { MemberProfile } from "@/utils/utils";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function MemberShortDisplay({ uid, sm }: { uid: string, sm?: boolean }) {
    const [member, setMember] = useState<MemberProfile>();
    const client = createClient();

    useEffect(() => {
        const source_promise = client
                            .schema('members')
                            .from('profiles')
                            .select('*')
                            .eq('id', uid)
                            .limit(1)
                            .single();
        source_promise.then(({ data }) => {
            setMember(data)
        })
    })

    return (
        !member ? <></> :
        <div className="flex items-center gap-x-1">
            <Avatar className="size-5">
                <AvatarImage src={member?.pfp as string} />
                <AvatarFallback>{member?.name} Profile</AvatarFallback>
            </Avatar>
            <h3 className={sm ? `text-sm` : ''}>
                {member?.name}
            </h3>
        </div>
    )
}