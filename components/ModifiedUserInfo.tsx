"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import Link from "next/link";
import { Check, Linkedin, Mail, MoveRight, Pencil, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MemberProfile, MAX_ABOUT_SIZE, MAX_INPUT_SIZE } from "@/utils/utils";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface DialogProps {
    user: User | null,
    initialState: boolean,
    member_data: MemberProfile | undefined
}

const BASE_LINKEDIN_URL = "https://linkedin.com/in/";

export default function ModifiedUserInfo({ user, initialState, member_data }: DialogProps) {
    const [dialogOpen, setDialogOpen] = useState(initialState);

    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState(user?.user_metadata?.full_name);
    
    const [editingMajor, setEditingMajor] = useState(false);
    const [major, setMajor] = useState(member_data?.major || '[MAJOR]');

    const [editingYear, setEditingYear] = useState(false);
    const [year, setYear] = useState(member_data?.graduation_date || 2028);

    const [editingAbout, setEditingAbout] = useState(false);
    const [about, setAbout] = useState(member_data?.about || 'About Me...');

    const [editingSocials, setEditingSocials] = useState(false);
    const [linkedin, setLinkedin] = useState(member_data?.linkedin || BASE_LINKEDIN_URL);
    const [phone, setPhone] = useState(member_data?.phone || "PHONE #");
    
    const submitForm = async () => {
        const body: MemberProfile = {
            id: member_data?.id as string,
            name: name,
            phone: phone,
            about: about,
            club_roles: member_data?.club_roles as string[],
            email: member_data?.email as string,
            graduation_date: year,
            linkedin: linkedin,
            major: major,
            pfp: user?.user_metadata.avatar_url,
            completed: member_data?.completed as boolean
        };

        const res = await fetch(
            '/api/member_profile',
            {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'Application/JSON'
                }
            }
        )

        if(res.status === 200) {
            setDialogOpen(false);
        } else {
            const err = await res.json();
            toast(err['error']);
        }
    }

    const handleLinkedin = (val: string) => {
        if(!val.startsWith(BASE_LINKEDIN_URL)) {
            return;
        }
        setLinkedin(val);
    }

    return (
        <Dialog open={dialogOpen}>
            <DialogContent hideClose={true}>
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
                                                        maxLength={MAX_INPUT_SIZE}
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
                                                            maxLength={MAX_INPUT_SIZE}
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
                            {
                                member_data?.club_roles.map((entry) => {
                                    return <Badge variant={"secondary"} key={entry}>{entry}</Badge>
                                })
                            }
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
                                            maxLength={MAX_ABOUT_SIZE}
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

                        <div className="text-center relative flex items-center w-full">
                            <div className="flex-grow">
                                {
                                    editingSocials ? 
                                    <div className="space-y-3">
                                        <div className="flex justify-center items-center space-x-2">
                                            <Phone />
                                            <Input 
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="text-center inline-block w-fit"
                                            /> 
                                        </div>
                                        <div className="flex justify-center items-center space-x-2">
                                            <Linkedin />
                                            <Input 
                                                type="url"
                                                value={linkedin}
                                                onChange={(e) => handleLinkedin(e.target.value)}
                                                className="text-center inline-block w-fit"
                                            />
                                        </div>
                                    </div> :
                                    <div className="flex justify-center space-x-20">
                                        <Link href={`mailto:${user?.email}`} className="hover:text-secondary" target="_blank">
                                            <Mail />
                                        </Link>
                                        <Link href={`tel:${phone}`} className="hover:text-secondary" target="_blank">
                                            <Phone />
                                        </Link>
                                        <Link href={linkedin} className="hover:text-secondary" target="_blank">
                                            <Linkedin />
                                        </Link>
                                    </div>
                                }
                            </div>
                            <div className="cursor-pointer absolute right-0" onClick={() => setEditingSocials(!editingSocials)}>
                                {
                                    editingSocials ? <Check size={15}/> : <Pencil width={15}/>
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end">
                    <Button className="w-1/4" onClick={submitForm}>
                        Submit
                        <MoveRight />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}