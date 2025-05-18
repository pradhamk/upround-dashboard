"use client";

import { createClient } from "@/utils/supabase/client";
import { MemberProfile } from "@/utils/utils";
import { useEffect, useState } from "react";
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
    <div className="flex items-center gap-x-1">
      <Avatar className="size-5">
        <AvatarImage src={member.pfp as string} />
        <AvatarFallback>{member.name} Profile</AvatarFallback>
      </Avatar>
      <h3 className={sm ? `text-sm` : ""}>{member.name}</h3>
    </div>
  );
}
