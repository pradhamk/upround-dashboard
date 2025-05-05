import UpRoundLogo from "@/components/upround_logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function Navbar() {
    const client = await createClient();
    const { user: user } = (await client.auth.getUser()).data;

    return (
        <div className="w-full flex items-center justify-between space-x-10 pt-2">
            <div className="pl-10">
              <Link href="/">
                <UpRoundLogo width={50} height={50}/>
              </Link>
            </div>
            <div className="flex space-x-28">
              <Link href="/startups">
                <p>Startups</p>
              </Link>
              <Link href="/memos">
                <p>Memos</p>
              </Link>
              <Link href="/members">
                <p>Members</p>
              </Link>
            </div>
            <div className="pr-10 flex items-center space-x-2">
              <ThemeSwitcher />
              <Avatar className="size-8">
                <AvatarImage src={user?.user_metadata.avatar_url} title={user?.user_metadata.name}/>
                <AvatarFallback>{user?.email}</AvatarFallback>
              </Avatar>
            </div>
        </div>
    )
}