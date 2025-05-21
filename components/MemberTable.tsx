"use client";

import { ClubRoles, MemberProfile, WhitelistEntry } from "@/utils/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { MemberShortDisplay } from "./MemberShortDisplay";
import { useState } from "react";
import { Button } from "./ui/button";
import { Pencil, UserPen, UserRoundX } from "lucide-react";
import DeleteDialog from "./dialogs/DeleteDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import MemberRolesSelect from "./MemberRolesSelect";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export default function MemberTable({ members, whitelist }: { members: MemberProfile[], whitelist: WhitelistEntry[] }) {
    const [selected, setSelected] = useState<string | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [editOpen, setEditOpen] = useState(false);
    const [delOpen, setDelOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    const openEditPrompt = (email: string) => {
      const target = members.find(member => member.email === email);
      if (!target) return;

      setSelected(email);
      setIsAdmin(whitelist.find(entry => entry.email === target.email)?.is_admin || false);
      setSelectedRoles(target.club_roles);
      setEditOpen(true);
    };

    const openDeletePrompt = (email: string) => {
      setSelected(email);
      setDelOpen(true);
    }
  
    const deleteMember = async () => {
      const res = await fetch('/api/admin/delete_member', {
        method: "POST",
        body: JSON.stringify({
          email: selected
        })
      })

      if(res.status === 200) {
        setDelOpen(false);
        router.push('/admin')
      } else {
        const err = await res.json();
        toast(err['error']);
      }
    }

    const editRoles = async () => {
      const res = await fetch('/api/admin/edit_member', {
        method: "POST",
        body: JSON.stringify({
          email: selected,
          roles: selectedRoles,
          is_admin: isAdmin
        })
      })

      if(res.status === 200) {
        setEditOpen(false);
        router.push('/admin')
      } else {
        const err = await res.json();
        toast(err['error']);
      }
    }

    return (
      <>
        <Table>
          <TableCaption>UpRound Member Database</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Logged In Before</TableHead>
              <TableHead className="hidden md:table-cell">Is Admin</TableHead>
              <TableHead className="hidden md:table-cell">Roles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map((member, i) => {
              const admin_status = whitelist.find((entry) => entry.email === member.email)?.is_admin
              return (
                <TableRow key={i}>
                  <TableCell className="w-fit">
                    <MemberShortDisplay member={member} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {String(member.completed)
                      .charAt(0)
                      .toUpperCase() + String(member.completed).slice(1)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {
                      String(admin_status)
                        .charAt(0)
                        .toUpperCase() + String(admin_status).slice(1)
                    }
                    </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {member.club_roles.map((role, i) => (
                        <Badge
                          variant="secondary"
                          key={i}
                          className="w-fit"
                        >
                          {role[0].toUpperCase() + role.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label="Edit member's roles" onClick={() => openEditPrompt(member.email as string)}>
                              <UserPen className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">
                            Edit member's roles
                          </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-100"
                        onClick={() => openDeletePrompt(member.email as string)}
                      >
                        <UserRoundX />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Member Roles</DialogTitle>
              <DialogDescription>Modify the roles a member has on the dashboard.</DialogDescription>
            </DialogHeader>
             <MemberRolesSelect 
                roles={selectedRoles}
                setRoles={setSelectedRoles}
             />
            <div className="grid w-full items-center gap-1.5">
                <Label className="font-bold">Admin Member?</Label>
                <p className="text-xs text-muted-foreground">Should the new member be an admin (they will have the same permissions you do)?</p>
                <div className="flex space-x-2 items-center">
                    <span className="text-xs">New Member is Admin: </span>
                    <Checkbox 
                        checked={isAdmin}
                        onCheckedChange={(checked) => setIsAdmin(Boolean(checked))}
                    />
                </div>
            </div>
             <div className="flex justify-end">
                <Button onClick={editRoles}>
                  Edit
                  <Pencil />
                </Button>
             </div>
          </DialogContent>
        </Dialog>

        <DeleteDialog 
          open={delOpen}
          setOpen={setDelOpen}
          title="Delete Member"
          description="Confirming this action will remove this member from UpRound's DB. Are you sure?"
          deleteAction={deleteMember}
        />
      </>
    )
}