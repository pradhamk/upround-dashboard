"use client";

import { FilePlusIcon, FileText, LoaderCircle, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useEffect, useState } from "react";
import { generatePreview, StartupProfile } from "@/utils/utils";
import { createClient } from "@/utils/supabase/client";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateMemo() {
    const client = createClient();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [company, setCompany] = useState("");
    const [memo, setMemo] = useState<File | null>();
    const [loading, setLoading] = useState(false);
    const [startups, setStartups] = useState<StartupProfile[]>([]);
    const router = useRouter();

    const uploadMemo = async () => {
        if(!memo) return;

        setLoading(true)
        const formData = new FormData();
        formData.append('method', 'create');
        formData.append('company_id', company);
        formData.append('memo', memo);

        const res = await fetch("/api/memo_action", {
            method: "POST",
            body: formData
        });

        setLoading(false);
        if(res.status === 200) {
            toast("Memo uploaded sucessfully.")
            setDialogOpen(false);
            setCompany("");
            setMemo(null);
            router.refresh();

        } else {
            const err = await res.json();
            toast.error(err['error'])
        }
    }

    useEffect(() => {
        const res = client
                        .schema('dealflow')
                        .from('startups')
                        .select('*');
        res.then(({ data }: { data: StartupProfile[] | null }) => {
            setStartups(data ?? []);
        })
    }, [])

    return (
        <>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <FilePlusIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a Memo</DialogTitle>
                        <DialogDescription>Creating a memo will allow other club members to be able to view the memo.</DialogDescription>
                    </DialogHeader>
                    <div className="grid w-full items-center gap-1.5">
                        <Label className="font-bold">Startup</Label>
                        <p className="text-xs text-muted-foreground">Select a startup to attribute the memo towards. Ensure that such a startup has been created first.</p>
                        <Select value={company} onValueChange={(id) => setCompany(id)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a startup" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    startups.map((startup, i) => {
                                        return (
                                            <SelectItem key={i} value={startup.id}>
                                                <div className="flex gap-x-2 items-center">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{startup.name} Logo</AvatarFallback>
                                                        <AvatarImage src={generatePreview(startup.website)}/>
                                                    </Avatar>
                                                    <span>{startup.name}</span>
                                                </div>
                                            </SelectItem>
                                        )
                                    })
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label className="font-bold">Memo File</Label>
                        <p className="text-xs text-muted-foreground">Upload your memo file as a <strong>pdf</strong></p>
                        <input
                            id="memoFile"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setMemo(file)
                                }
                            }}
                            className="hidden"
                        />

                        <Label
                            htmlFor="memoFile"
                            className="border border-dashed border-muted-foreground hover:border-primary flex items-center justify-center cursor-pointer rounded-xl transition-colors w-full h-48 bg-muted/30 px-4 text-center"
                        >
                            {memo ? (
                            <div className="text-muted-foreground text-sm">
                                <p className="font-medium flex items-center gap-x-1">
                                    <FileText size={12}/>
                                    {memo.name}
                                </p>
                                <p className="text-xs mt-1">{(memo.size / 1024).toFixed(2)} KB</p>
                                <p className="text-xs mt-1 italic">Click to change file</p>
                            </div>
                            ) : (
                            <div className="text-center text-muted-foreground">
                                <FilePlusIcon className="mx-auto mb-2 h-6 w-6" />
                                <span className="text-sm">Click to upload PDF memo</span>
                            </div>
                            )}
                        </Label>
                    </div>
                    <div className="flex justify-end">
                        <Button disabled={memo === null || !company} onClick={uploadMemo}>
                            {
                                loading ?
                                <LoaderCircle className="animate-spin"/> :
                                <>
                                    Create
                                    <Plus />
                                </>
                            }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}