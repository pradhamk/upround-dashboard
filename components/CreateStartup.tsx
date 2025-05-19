"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Send } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import { Input } from "./ui/input";
import { DealflowStatus, MemberProfile, MVCLevel } from "@/utils/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { createClient } from "@/utils/supabase/client";
import { MemberShortDisplay } from "./MemberShortDisplay";
import { toast } from "sonner";

type StringInputEntryProps = {
    input: string,
    setInput: Dispatch<SetStateAction<string>>,
    label: string,
    description?: string,
    large?: boolean,
    type?: string,
}

type SelectInputEntryProps = {
    input: any,
    setInput: Dispatch<any>,
    label: string,
    description?: string,
    items: any[],
    value_property?: string
}

const StringInputEntry = ({ input, setInput, label, description, large, type }: StringInputEntryProps) => {
    return (
        <div className="grid w-full items-center gap-1.5">
            <Label>{label}</Label>
            <p className="text-xs text-muted-foreground">{description}</p>
            {
                large ? 
                    <Textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={label}
                        rows={5}
                    /> :
                    <Input
                        type={type || "text"}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={label}
                    />
            }
        </div>
    )
}

const SelectInputEntry = ({ input, items, label, setInput, description, value_property }: SelectInputEntryProps) => {
    return (
        <div className="grid w-full items-center gap-1.5">
            <Label>{label}</Label>
            <p className="text-xs text-muted-foreground">{description}</p>
            <Select onValueChange={(val) => setInput(val)} value={input}>
                <SelectTrigger>
                    <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                    {
                        items.map((item, i) => {
                            return (
                                <SelectItem
                                    key={i}
                                    value={value_property ? item[value_property] : item}
                                >
                                    {typeof item === "string" ? item : <MemberShortDisplay member={item} />}
                                </SelectItem>
                            )
                        })
                    }
                </SelectContent>
            </Select>
        </div>
    )
}

export default function CreateStartup() {
    const client = createClient();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [industry, setIndustry] = useState("");
    const [source, setSource] = useState("");
    const [sourcer, setSourcer] = useState("");
    const [status, setStatus] = useState("");
    const [mvc_level, setMVCLevel] = useState("");
    const [date, setDate] = useState("");
    const [website, setWebsite] = useState("");
    const [tagline, setTagline] = useState("");
    const [description, setDescription] = useState("");
    const [contact, setContact] = useState("");

    const [members, setMembers] = useState<MemberProfile[] | null>();
    const [step, setStep] = useState(1);
    const total_steps = 2;

    const isStep1Valid = () =>
        name.trim() !== "" &&
        industry.trim() !== "" &&
        tagline.trim() !== "" &&
        description.trim() !== "" &&
        website.trim() !== "" &&
        contact.trim() !== "";

    const isStep2Valid = () =>
        sourcer.trim() !== "" &&
        source.trim() !== "" &&
        date.trim() !== "" &&
        status.trim() !== "" &&
        mvc_level.trim() !== "";

    const validateStep = (): boolean => {
        let valid = true;
        if (step === 1) {
            if (!name.trim()) { toast("Company Name is required."); valid = false; }
            if (!industry.trim()) { toast("Industry is required."); valid = false; }
            if (!tagline.trim()) { toast("Tagline is required."); valid = false; }
            if (!description.trim()) { toast("Description is required."); valid = false; }
            if (!website.trim()) { toast("Website is required."); valid = false; }
            if (!contact.trim()) { toast("Contact is required."); valid = false; }
        }

        if (step === 2) {
            if (!sourcer.trim()) { toast("Sourcer is required."); valid = false; }
            if (!source.trim()) { toast("Source is required."); valid = false; }
            if (!date.trim()) { toast("Date Sourced is required."); valid = false; }
            if (!status.trim()) { toast("Dealflow Status is required."); valid = false; }
            if (!mvc_level.trim()) { toast("MVC Level is required."); valid = false; }
        }
        return valid;
    }

    const submitStartup = () => {
        if(!validateStep()) {
            return;
        }

        setOpen(false);
    }

    useEffect(() => {
        client
            .schema('members')
            .from('profiles')
            .select('*')
            .then(({ data }: { data: MemberProfile[] | null }) => {
                setMembers(data?.filter((member) => member.completed === true));
                console.log(members)
            })
    }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2" />
          New Startup
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-5xl max-h-[80vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>New Startup Profile - Step {step} of {total_steps}</DialogTitle>
          <DialogDescription>
            Add a new startup to the startups page.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 w-full">
            {step === 1 && (
                <div className="gap-4 grid">
                <h1 className="font-semibold">Company Details</h1>
                <StringInputEntry label="Company Name" input={name} setInput={setName} />
                <StringInputEntry label="Industry" input={industry} setInput={setIndustry} />
                <StringInputEntry label="Tagline" input={tagline} setInput={setTagline} description="Provide a short tagline for the company." />
                <StringInputEntry label="Description" input={description} setInput={setDescription} description="Provide a longer description about the company (summary of your analysis in 1-2 paragraphs)" large />
                <StringInputEntry label="Company Website" input={website} setInput={setWebsite} />
                <StringInputEntry label="Contact" input={contact} setInput={setContact} description="What email address did you reach out to?" />
                </div>
            )}

            {step === 2 && (
                <div className="gap-6 grid">
                <h1 className="font-semibold">Analysis Details</h1>
                <SelectInputEntry
                    label="Sourcer"
                    input={sourcer}
                    setInput={setSourcer}
                    items={members || []}
                    description="Which member sourced the company?"
                    value_property={"id"}
                />
                <StringInputEntry label="Source" input={source} setInput={setSource} description="Where did you find the company (pitchbook, etc.)?" />
                <StringInputEntry label="Date Sourced" input={date} setInput={setDate} type="date" />
                <SelectInputEntry
                    label="Dealflow Status"
                    input={status}
                    setInput={setStatus}
                    items={Object.values(DealflowStatus)}
                    description="What is the status of this company?"
                />
                <SelectInputEntry
                    label="MVC Level"
                    input={mvc_level}
                    setInput={setMVCLevel}
                    items={Object.values(MVCLevel)}
                    description="Is this company an option for MVC?"
                />
                </div>
            )}
        </div>

        <div className="flex justify-between">
            {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                    <ChevronLeft />
                    Back
                </Button>
            )}
            {step < total_steps ? (
                <Button onClick={() => {
                    if (validateStep()) {
                        setStep(step + 1);
                    }
                }}>
                    Next
                    <ChevronRight />
                </Button>
            ) : (
                <Button type="submit"  onClick={submitStartup}>
                    Submit
                    <Send />
                </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
