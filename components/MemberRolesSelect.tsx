"use client";

import { ClubRoles } from "@/utils/utils";
import { Badge } from "./ui/badge";
import { Dispatch, SetStateAction } from "react";

export default function MemberRolesSelect({ roles, setRoles }: { roles: string[], setRoles: Dispatch<SetStateAction<string[]>> }) {
    const toggleRole = (role: string) => {
      setRoles((prev) =>
        prev.includes(role)
          ? prev.filter((r) => r !== role)
          : [...prev, role]
    )};

    return (
        <div className="flex flex-wrap gap-2 items-center justify-center">
            {Object.values(ClubRoles).map((role) => (
                <Badge
                    key={role}
                    variant={roles.includes(role) ? 'default' : 'outline'}
                      className={`text-sm ${role === 'Member' ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                      onClick={role === 'Member' ? undefined : () => toggleRole(role)}
                >
                {role}
                </Badge>
            ))}
        </div>
    )
}