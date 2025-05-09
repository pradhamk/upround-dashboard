import { Input } from "@/components/ui/input";
import { Check, Pencil } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { Textarea } from "./ui/textarea";

interface EditableFieldProps {
    value: string | number,
    editing: boolean,
    onChange: (val: string) => void,
    toggleEdit: Dispatch<SetStateAction<boolean>>,
    inputType?: string,
    maxLength?: number,
    prefix?: React.ReactNode,
    multiline?: boolean,
}

export function EditableField({ value, editing, onChange, toggleEdit, inputType = "text", maxLength, prefix = "", multiline = false }: EditableFieldProps) {
    return (
        <div className="text-center relative flex items-center w-full">
            <div className="flex-grow text-center">
                {
                    editing ? (
                        <div className="flex items-center justify-center space-x-2">
                            {prefix}
                            {
                                multiline ? 
                                <Textarea 
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="text-center inline-block w-3/4"
                                    maxLength={maxLength}
                                /> :
                                <Input
                                    type={inputType}
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    className="text-center inline-block w-fit"
                                    maxLength={maxLength}
                                />
                            }
                        </div>
                    ) : (
                        <span>{prefix}{value}</span>
                    )
                }
            </div>
            <div className="cursor-pointer absolute right-0" onClick={() => toggleEdit(!editing)}>
                {editing ? <Check size={15}/> : <Pencil width={15}/>}
            </div>
        </div>
    );
}

export function ReadOnlyField({ children, isAbout } : { children: React.ReactNode, isAbout?: boolean }) {
    return (
        <span className={`flex-grow text-center ${isAbout ? 'text-sm' : ''}`}>
            {children}
        </span>
    )
}