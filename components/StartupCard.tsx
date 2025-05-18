"use client";

import { generatePreview, MemberProfile, StartupProfile } from "@/utils/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ReactNode } from "react";
import { ChevronRight, CalendarDays, Handshake, LinkIcon, Mail, UserSearch, SearchCheck } from "lucide-react";
import Link from "next/link";
import { MemberShortDisplay } from "./MemberShortDisplay";
import UpRoundLogo from "@/components/upround_logo";
import { Button } from "./ui/button";


export default function StartupCard({ startup, member }: { startup: StartupProfile, member: MemberProfile | undefined }) {
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
              <MemberShortDisplay member={member} sm />
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
  <div className="flex justify-between">
    <div className="flex items-center space-x-1 justify-center">
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

export function StartupGeniusCard({ startup, member }: { startup: StartupProfile, member: MemberProfile | null }) {
  return (
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
              {new Date(startup.date_sourced).toLocaleDateString("en-us", {
              year: "numeric",
              month: "long",
              day: "numeric",
              })}
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
      </CardFooter>
  </Card>
  )
}