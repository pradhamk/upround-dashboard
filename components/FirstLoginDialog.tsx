"use client";

import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { User } from "@supabase/supabase-js";
import UpRoundLogo from "./upround_logo";
import Link from "next/link";
import { Check, Linkedin, Mail, MoveRight, Pencil, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MemberProfile } from "@/utils/utils";
import { Textarea } from "./ui/textarea";

interface DialogProps {
    user: User | null,
    initialState: boolean,
    member_data: MemberProfile | undefined
}

export default function FirstLoginDialog({ user, initialState, member_data }: DialogProps) {
    const [dialogOpen, setDialogOpen] = useState(initialState);

    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState(user?.user_metadata?.full_name);
    
    const [editingMajor, setEditingMajor] = useState(false);
    const [major, setMajor] = useState(member_data?.major || '[MAJOR]');

    const [editingYear, setEditingYear] = useState(false);
    const [year, setYear] = useState(member_data?.graduation_date || 2028);

    const [editingAbout, setEditingAbout] = useState(false);
    const [about, setAbout] = useState(member_data?.about || 'About Me...');
    
    return (
        <Dialog open={dialogOpen}>
            <DialogContent hideClose={true}>
                <DialogHeader>
                    <DialogTitle className="flex justify-between">
                        Welcome to UpRound!
                        <UpRoundLogo width={20} height={20}/>
                    </DialogTitle>
                    <DialogDescription>Before proceeding, please complete or confirm the following details. This information will be displayed on the members page exactly as seen below.</DialogDescription>
                </DialogHeader>

                <Card>
                    <CardHeader className="flex flex-col items-center pb-5">
                        <Avatar className="size-24">
                            <AvatarImage 
                                src={user?.user_metadata.avatar_url}
                                title={user?.user_metadata.name}
                            />
                            <AvatarFallback>{user?.email}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="relative flex items-center justify-between w-full">
                            <div className="flex-grow text-center">
                                {
                                    editingName ? <Input 
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="text-center inline-block w-fit"
                                                    /> :
                                    <span>{name}</span>
                                }
                            </div>
                            <div className="cursor-pointer absolute right-0" onClick={() => setEditingName(!editingName)}>
                                {
                                    editingName ? <Check size={15}/> : <Pencil width={15}/>
                                }
                            </div>
                        </CardTitle>
                        <CardDescription className="w-full flex flex-col">
                            <div className="text-center relative flex items-center">
                                <div className="flex-grow text-center">
                                    {
                                        editingMajor ? <Input 
                                                            type="text"
                                                            value={major}
                                                            onChange={(e) => setMajor(e.target.value)}
                                                            className="text-center inline-block w-fit"
                                                        /> :
                                        <span>{major}</span>
                                    }
                                </div>
                                <div className="cursor-pointer absolute right-0" onClick={() => setEditingMajor(!editingMajor)}>
                                    {
                                        editingMajor ? <Check size={15}/> : <Pencil width={15}/>
                                    }
                                </div>
                            </div>
                            
                            <div className="text-center relative flex items-center">
                                <div className="flex-grow text-center">
                                    {
                                        editingYear ? 
                                        <>
                                            <span className="pr-2">Class of</span>
                                            <Input 
                                                type="number"
                                                value={year}
                                                onChange={(e) => setYear(e.target.value.length > 0 ? parseInt(e.target.value) : 2028)}
                                                className="text-center inline-block w-fit"
                                            /> 
                                        </> :
                                        <span>Class of {year}</span>
                                    }
                                </div>
                                <div className="cursor-pointer absolute right-0" onClick={() => setEditingYear(!editingYear)}>
                                    {
                                        editingYear ? <Check size={15}/> : <Pencil width={15}/>
                                    }
                                </div>
                            </div>
                        </CardDescription>
                        <div className="flex space-x-3">
                            <p>Admin</p>
                            <p>Accelerator</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-6">
                        <div className="text-center relative flex items-center w-full">
                            <div className="flex-grow text-center">
                                {
                                    editingAbout ? 
                                    <>
                                        <Textarea 
                                            value={about}
                                            onChange={(e) => setAbout(e.target.value)}
                                            className="text-center inline-block w-3/4"
                                        /> 
                                    </> :
                                    <span>{about}</span>
                                }
                            </div>
                            <div className="cursor-pointer absolute right-0" onClick={() => setEditingAbout(!editingAbout)}>
                                {
                                    editingAbout ? <Check size={15}/> : <Pencil width={15}/>
                                }
                            </div>
                        </div>
                        
                        <div className="flex space-x-20">
                            <Link href={'/'}>
                                <Mail />
                            </Link>
                            <Link href={'/'}>
                                <Phone />
                            </Link>
                            <Link href={'/'}>
                                <Linkedin />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end">
                    <Button className="w-1/4">
                        Submit
                        <MoveRight />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}