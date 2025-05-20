"use client";

import { generatePreview, MemberProfile, StartupProfile } from "@/utils/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ReactNode, useState } from "react";
import { ChevronRight, CalendarDays, Handshake, LinkIcon, Mail, UserSearch, SearchCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { MemberShortDisplay } from "./MemberShortDisplay";
import UpRoundLogo from "@/components/upround_logo";
import { Button } from "./ui/button";
import DeleteDialog from "./dialogs/DeleteDialog";
import { toast } from "sonner";
import { useRouter } from 'next/navigation'

type StartupCardProps = {
  startup: StartupProfile,
  member: MemberProfile | undefined,
  can_delete: boolean,
  deleteStartup: (id: string) => void
};

export default function StartupCard({ startup, member, can_delete, deleteStartup }: StartupCardProps) {
  return (
    <Link href={`/startup_profile?id=${startup.id}`}>
      <Card className="w-full rounded-2xl flex relative cursor-pointer shadow">
        <CardContent className="flex items-center w-full gap-4 p-4">
          <div>
            <Avatar className="size-14">
              <AvatarImage src={generatePreview(startup.website)} />
              <AvatarFallback>{startup.name} Logo</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full overflow-hidden h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-x-2">
                <h1 className="text-lg font-semibold">{startup.name}</h1>
                <span className="text-xs text-gray-600">{startup.industry}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <MemberShortDisplay member={member} sm/>
                {can_delete && (
                  <Button
                    className="p-1 hover:bg-red-100 text-red-600"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {e.preventDefault(); deleteStartup(startup.id)}}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm opacity-85 truncate w-11/12">{startup.tagline}</p>
          </div>
        </CardContent>
        <ChevronRight className="absolute right-3 bottom-3 size-5"/>
      </Card>
    </Link>
  );
}

type InfoRowProps = {
  icon: ReactNode;
  label: string;
  children: ReactNode;
};

const InfoRow = ({ icon, label, children }: InfoRowProps) => (
  <div className="flex flex-col 2xl:flex-row justify-between">
    <div className="flex items-center space-x-1 2xl:justify-center">
      {icon}
      <h2 className="font-bold">{label}</h2>
    </div>
    <h2>{children}</h2>
  </div>
);

const SocialButton = ({ url, children }: { url: string, children: ReactNode }) => (
    <Button variant={"outline"} asChild size={"icon"}>
        <Link href={url} target="_blank">
            { children }
        </Link>
    </Button>
)

export function StartupGeniusCard({ startup, member, is_admin }: { startup: StartupProfile, member: MemberProfile | null, is_admin: boolean }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();
  
  const deleteStartup = async () => {
    const res = await fetch('/api/startup_action', {
        method: 'POST',
        body: JSON.stringify({
            method: 'delete',
            company_id: startup.id,
        })
    })

    if(res.status === 200) {
        setDeleteOpen(false);
        router.push('/startups')
    } else {
        const err = await res.json();
        toast(err['error']);
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <h1 className="text-left font-bold text-xl">{startup.name}</h1>
            <Avatar className="rounded-lg size-12">
                <AvatarImage src={generatePreview(startup.website)}/>
                <AvatarFallback>{startup.name} Logo</AvatarFallback>
            </Avatar>
        </CardHeader>
        <CardContent className="space-y-4">
            <InfoRow icon={<CalendarDays size={14} />} label="Sourced Date:">
                {(() => {
                  const [year, month, day] = startup.date_sourced.split("-").map(Number);
                  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                })()}
            </InfoRow>
            <InfoRow icon={<UserSearch size={14} />} label="Sourced By:">
                <MemberShortDisplay member={member} />
            </InfoRow>
            <InfoRow icon={<SearchCheck size={14} />} label="Sourced From:">
                { startup.source }
            </InfoRow>
            <InfoRow icon={<Handshake size={14} />} label="Dealflow Status:">
                {startup.status}
            </InfoRow>
            <InfoRow icon={<UpRoundLogo width={14} height={14} colorWithTheme/>} label="MVC Level:">
                <div className="flex items-center space-x-1">
                  <div
                      className={`w-3 h-3 rounded-full ${
                      startup.mvc_level === "Yes"
                          ? "bg-green-500"
                          : startup.mvc_level === "No"
                          ? "bg-red-500"
                          : "bg-orange-400"
                      }`}
                  />
                  <span>{startup.mvc_level}</span>
                </div>
            </InfoRow>
            <div className="border-t border-gray-200 my-2" />
        </CardContent>
        <CardFooter className="flex justify-center space-x-10">
            <SocialButton url={startup.website}>
                <LinkIcon />
            </SocialButton>
            <SocialButton url={`mailto:${startup.contact}`}>
                <Mail />
            </SocialButton>
            {
              is_admin &&
              <Button size={"icon"} variant={"destructive"} onClick={() => setDeleteOpen(true)}>
                  <Trash2 />
              </Button>
            }
        </CardFooter>
    </Card>
    <DeleteDialog 
      open={deleteOpen}
      setOpen={setDeleteOpen}
      title="Delete the Startup"
      description="Confirming this delete will remove the company from the startups db. Are you sure?"
      deleteAction={deleteStartup}
    />
    </>
  )
}