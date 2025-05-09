"use client";

import { MemberProfile, MAX_ABOUT_SIZE, MAX_INPUT_SIZE, BASE_LINKEDIN_URL } from "@/utils/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Linkedin, Mail, Pencil, Phone } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EditableField, ReadOnlyField } from "./user_fields";

interface CardProps {
    member_data: MemberProfile | undefined,
    editable: boolean,
    setMemberData?: Dispatch<SetStateAction<MemberProfile>>
}

export default function MemberCard({ member_data, editable, setMemberData } : CardProps) {
    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState(member_data?.name);
    
    const [editingMajor, setEditingMajor] = useState(false);
    const [major, setMajor] = useState(member_data?.major || '[MAJOR]');

    const [editingYear, setEditingYear] = useState(false);
    const [year, setYear] = useState(member_data?.graduation_date || 2028);

    const [editingAbout, setEditingAbout] = useState(false);
    const [about, setAbout] = useState(member_data?.about || 'About Me...');

    const [editingSocials, setEditingSocials] = useState(false);
    const [linkedin, setLinkedin] = useState(member_data?.linkedin || BASE_LINKEDIN_URL);
    const [phone, setPhone] = useState(member_data?.phone || "PHONE #");

    useEffect(() => {
        if (editable) {
            setMemberData?.({
                id: member_data?.id as string,
                about: about,
                phone: phone,
                linkedin: linkedin,
                club_roles: member_data?.club_roles as string[],
                email: member_data?.email as string,
                graduation_date: year,
                major: major,
                name: name as string,
                pfp: member_data?.pfp as string,
                completed: member_data?.completed as boolean
            });
        }
    }, [name, major, year, about, phone, linkedin]);
    
    const handleLinkedin = (val: string) => {
        if(!val.startsWith(BASE_LINKEDIN_URL)) {
            return;
        }
        setLinkedin(val);
    }

    return (
        <Card>
            <CardHeader className="flex flex-col items-center pb-5">
                <Avatar className="size-24">
                    <AvatarImage 
                        src={member_data?.pfp as string}
                        title={member_data?.name as string}
                    />
                    <AvatarFallback>{member_data?.email}</AvatarFallback>
                </Avatar>
                <CardTitle className="relative flex items-center justify-between w-full">
                    {
                        editable ? 
                        <EditableField 
                            key="Name"
                            editing={editingName}
                            value={name as string}
                            onChange={setName}
                            toggleEdit={setEditingName}
                            maxLength={MAX_INPUT_SIZE}
                        /> :
                        <ReadOnlyField>{name}</ReadOnlyField>
                    }
                    
                </CardTitle>
                <CardDescription className="w-full flex flex-col">
                    <div className="text-center relative flex items-center">
                        {
                            editable ? 
                            <EditableField 
                                key="Major"
                                editing={editingMajor}
                                value={major as string}
                                onChange={setMajor}
                                toggleEdit={setEditingMajor}
                                maxLength={MAX_INPUT_SIZE}
                            /> :
                            <ReadOnlyField>{major}</ReadOnlyField>
                        }
                    </div>
                    
                    <div className="text-center relative flex items-center">
                        {
                            editable ? 
                            <EditableField 
                                key="Year"
                                editing={editingYear}
                                value={year}
                                onChange={(val) => setYear(val.length > 0 ? parseInt(val) : 2028)}
                                toggleEdit={setEditingYear}
                                maxLength={MAX_INPUT_SIZE}
                                prefix={"Class of "}
                                inputType="number"
                            /> :
                            <ReadOnlyField>Class of {year}</ReadOnlyField>
                        }
                        
                    </div>
                </CardDescription>
                <div className="flex space-x-3">
                    {
                        member_data?.club_roles?.map((entry) => {
                            return <Badge variant={"secondary"} key={entry}>{entry}</Badge>
                        })
                    }
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6">
                <div className="text-center relative flex items-center w-full">
                    {
                        editable ? 
                        <EditableField 
                            key="About"
                            editing={editingAbout}
                            value={about as string}
                            onChange={setAbout}
                            toggleEdit={setEditingAbout}
                            maxLength={MAX_ABOUT_SIZE}
                            multiline
                        /> :
                        <ReadOnlyField>{about}</ReadOnlyField>
                    }
                </div>

                <div className="text-center relative flex items-center w-full">
                    {
                        editable ? 
                        <>
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
                                    <MemberSocials 
                                        email={member_data?.email as string}
                                        linkedin={linkedin}
                                        phone={phone}
                                    /> 
                                }
                            </div>
                            <div className="cursor-pointer absolute right-0" onClick={() => setEditingSocials(!editingSocials)}>
                                {
                                    editingSocials ? <Check size={15}/> : <Pencil width={15}/>
                                }
                            </div>   
                        </> :
                        <MemberSocials 
                            email={member_data?.email as string}
                            linkedin={linkedin}
                            phone={phone}
                        /> 
                    }
                </div>
            </CardContent>
        </Card>
    )
}

export function MemberSocials({ email, linkedin, phone } : { email: string, linkedin: string, phone: string }) {
    return (
        <div className="flex justify-center space-x-20">
            <Link href={`mailto:${email}`} className="hover:text-secondary" target="_blank">
                <Mail />
            </Link>
            <Link href={`tel:${phone}`} className="hover:text-secondary" target="_blank">
                <Phone />
            </Link>
            <Link href={linkedin} className="hover:text-secondary" target="_blank">
                <Linkedin />
            </Link>
        </div>
    )
}