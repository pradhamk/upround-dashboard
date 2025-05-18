import UpRoundLogo from "@/components/upround_logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import UserSelect from "./user-select";
import { Sheet, SheetContent, SheetFooter, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Building2, Calendar1, Icon, LucideIcon, Menu, NotepadText, Users } from "lucide-react";
import React from "react";

const CALENDAR = "https://calendar.google.com/calendar/embed?src=c_6c061cb479b2083c2c2001fa4d889282e7a25aad50037f2c6ccac7b785a62772%40group.calendar.google.com&ctz=America%2FLos_Angeles";

type NavItemProps = {
  href: string,
  children: React.ReactNode,
  external?: boolean,
}

const NavItem = ({ href, children, external = false }: NavItemProps) => {
  return (
    <Link
      href={href}
      target={external ? "_blank" : "_self"}
      className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </Link>
  )
}

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

          <div className="hidden md:flex items-center space-x-10">
            <div className="flex space-x-8">
              <Link href="/startups" className="hover:text-[#12AE8A] hover:underline">
                <p>Startups</p>
              </Link>
              <Link href="/memos" className="hover:text-[#12AE8A] hover:underline">
                <p>Memos</p>
              </Link>
              <Link href={CALENDAR} target="_blank" className="hover:text-[#12AE8A] hover:underline">
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

          {/* Menu for mobile users */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger>
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-full h-full p-6 flex flex-col" title="Mobile Navigation Menu">
                <SheetTitle className="text-xl font-bold">
                  Navigation
                </SheetTitle>
                <div className="flex w-full justify-between">
                  <UserSelect user={user} full_display={true} />
                  <ThemeSwitcher />
                </div>
                <div className="flex flex-col space-y-6 text-lg pt-12">
                  <NavItem href="/startups">
                    <Building2 />
                    Startups
                  </NavItem>
                  <NavItem href="/memos">
                    <NotepadText />
                    Memos
                  </NavItem>
                  <NavItem href={CALENDAR}>
                    <Calendar1 />
                    Calendar
                  </NavItem>
                  <NavItem href="/members">
                    <Users />
                    Members
                  </NavItem>
                </div>
              </SheetContent>
            </Sheet>
          </div>

      </div>
  );
}