"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { UserSelectProps } from "@/utils/utils";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";



export default function UserSelect({ user }: UserSelectProps) {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/api/logout');
    }

    return (
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
                <DropdownMenuItem className="justify-between opacity-55" onClick={handleLogout}>
                    Log out
                    <LogOut />
                </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}