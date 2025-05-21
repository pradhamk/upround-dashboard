"use client";

import { MemberProfile } from "@/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function MemberShortDisplay({
  sm,
  member,
}: {
  sm?: boolean;
  member?: MemberProfile | null;
}) {
  if (!member) return null;

  return (
    <div className={`${sm ? 'hidden xl:flex' : 'flex'} items-center gap-x-1`}>
      <Avatar className="size-5">
        <AvatarImage src={member.pfp as string} />
        <AvatarFallback>{member.name} Profile</AvatarFallback>
      </Avatar>
      <h3 className={sm ? `text-sm` : ""}>{member.name || "Unknown"}</h3>
    </div>
  );
}
