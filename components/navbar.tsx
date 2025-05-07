import UpRoundLogo from "@/components/upround_logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import UserSelect from "./user-select";

export default async function Navbar() {
  const client = await createClient();
  const { user: user } = (await client.auth.getUser()).data;

  return (
      <div className="w-full flex items-center justify-between px-10 pt-2">
          <div>
            <Link href="/">
              <UpRoundLogo width={50} height={50} />
            </Link>
          </div>

          <div className="flex items-center space-x-10">
            <div className="flex space-x-8">
              <Link href="/startups" className="hover:text-[#12AE8A] hover:underline">
                <p>Startups</p>
              </Link>
              <Link href="/memos" className="hover:text-[#12AE8A] hover:underline">
                <p>Memos</p>
              </Link>
              <Link href="https://calendar.google.com/calendar/embed?src=c_6c061cb479b2083c2c2001fa4d889282e7a25aad50037f2c6ccac7b785a62772%40group.calendar.google.com&ctz=America%2FLos_Angeles" target="_blank" className="hover:text-[#12AE8A] hover:underline">
                <p>Calendar</p>
              </Link>
              <Link href="/members" className="hover:text-[#12AE8A] hover:underline">
                <p>Members</p>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeSwitcher />
              <UserSelect user={user} />
            </div>
          </div>
      </div>
  );
}