"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { MemberProfile, UserSelectProps } from "@/utils/utils";
import { LogOut, UserPen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserEditDialog from "./dialogs/UserEditDialog";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function UserSelect({ user }: UserSelectProps) {
    const router = useRouter();
    const client = createClient();
    const [profileEditOpen, setProfileEditOpen] = useState(false);
    const [memberData, setMemberData] = useState<MemberProfile | undefined>()

    const handleLogout = () => {
        router.push('/api/logout');
    }

    const handleEditProfile = async () => {
        const { data }: { data: MemberProfile | null } = await client.schema('members')
                            .from('profiles')
                            .select('*')
                            .eq('email', user?.email)
                            .limit(1)
                            .single();
        if(!data) {
            toast('Error: Failed to get member data.');
            return;
        }
        setMemberData(data)
        setProfileEditOpen(true);
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="size-8 cursor-pointer">
                    <AvatarImage
                        src={user?.user_metadata.avatar_url}
                        title={user?.user_metadata.name}
                    />
                    <AvatarFallback>{user?.email}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="text-sm text-center">
                    {user?.user_metadata.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="justify-between opacity-55" onClick={handleEditProfile}>
                            Edit Profile
                            <UserPen />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="justify-between opacity-55" onClick={handleLogout}>
                            Log out
                            <LogOut />
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <UserEditDialog 
                dialogOpen={profileEditOpen} 
                setDialogOpen={setProfileEditOpen} 
                member_data={memberData} 
                user={user}
                mode="edit"
                key={"User Profile Edit Prompt"}
            />
        </> 
    )
}