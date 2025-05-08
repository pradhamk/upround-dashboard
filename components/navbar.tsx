import UpRoundLogo from "@/components/upround_logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
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
              <Link href="/calendar" className="hover:text-[#12AE8A] hover:underline">
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