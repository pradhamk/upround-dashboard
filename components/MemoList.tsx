"use client";

import { convertDate, EnrichedMemoType, generatePreview, GroupedMemos } from "@/utils/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ChevronDown, ChevronRight, ChevronUp, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import DeleteDialog from "./dialogs/DeleteDialog";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

export default function MemoList({ memos, is_admin }: { memos: GroupedMemos | undefined, is_admin: boolean }) {
    const [search, setSearch] = useState("");
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteID, setDeleteID] = useState("");
    const [removeFile, setRemoveFile] = useState(false);
    const router = useRouter();

    const openDeletePrompt = (id: string) => {
        setDeleteID(id);
        setDeleteOpen(true);
    }

    const deleteMemo = async () => {
        const formData = new FormData();
        formData.append('method', 'delete');
        formData.append('id', deleteID);
        formData.append('remove_file', String(removeFile));

        const res = await fetch('/api/memo_action', {
            method: 'POST',
            body: formData
        });

        if(res.status === 200) {
            toast('Successfully deleted memo.')
            setDeleteOpen(false);
            router.refresh();
        } else {
            const err = await res.json();
            toast.error(err['error']);
        }
    }

    return (
        <>
            <div className="space-y-3 flex flex-col items-center w-full">
                <div className="relative w-2/3 md:w-1/3 mb-3 mt-5">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={15} />
                    <Input
                        className="pl-10"
                        placeholder="Search for a memo"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-5/6 px-4 items-start">
                    {
                        memos && Object.entries(memos)
                            .filter(([name, memos]) => {
                                const normalizedSearch = search.toLowerCase();
                                return (
                                    name.toLowerCase().startsWith(normalizedSearch) ||
                                    memos.some(memo => memo.memo_name.toLowerCase().startsWith(normalizedSearch))
                                );
                            })
                            .map(([name, memos], i) => (
                                <MemoCard 
                                    key={i} 
                                    name={name} 
                                    memos={memos} 
                                    can_delete={is_admin} 
                                    openDelete={openDeletePrompt}
                                />
                        ))
                    }
                </div>
            </div>
            <DeleteDialog 
                open={deleteOpen}
                setOpen={setDeleteOpen}
                title="Delete Memo"
                description="Confirming this action will remove this memo from the UpRound db. Are you sure?"
                deleteAction={deleteMemo}
            >
                <div>
                    <Label className="font-bold">Remove Memo from Google Drive?</Label>
                    <p className="text-xs text-muted-foreground">Clicking this option will also remove the memo pdf from the Google Drive.</p>
                    <div className="flex space-x-2 items-center">
                        <span className="text-xs">Remove from Google Drive:</span>
                        <Checkbox 
                            checked={removeFile}
                            onCheckedChange={(checked) => setRemoveFile(Boolean(checked))}
                        />
                    </div>
                </div>
            </DeleteDialog>
        </>
    )
}

function MemoCard({ name, memos, can_delete, openDelete }: { name: string, memos: EnrichedMemoType[], can_delete: boolean, openDelete: (id: string) => void }) {
    const [collapseOpen, setCollapseOpen] = useState(false);
    const recentMemo = memos[0];
    const remainingMemos = memos.slice(1);

    return (
        <Card key={name} className="hover:shadow-md transition-shadow duration-200 rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="w-full text-base">
                <div className="flex justify-between items-center">
                    <span className="font-bold">{name}</span>
                    <div className="flex items-center">
                        <span className="text-xs text-muted-foreground">{convertDate(recentMemo.created_at)}</span>
                    </div>
                </div>
                </CardTitle>
            </CardHeader>

            <Collapsible open={collapseOpen} onOpenChange={setCollapseOpen}>
                <CardContent className="pt-0 space-y-2 flex flex-col">
                    <MemoLink 
                        memo={recentMemo} 
                        can_delete={can_delete}
                        openDelete={openDelete}
                        recent 
                    />
                    <CollapsibleContent>
                        {
                            remainingMemos.map((memo, i) => {
                                return (
                                    <MemoLink 
                                        memo={memo} 
                                        key={i} 
                                        can_delete={can_delete}
                                        openDelete={openDelete}
                                    />
                                )        
                            })
                        }
                    </CollapsibleContent>
        
                </CardContent>

                <CardFooter className="flex justify-end">
                    {remainingMemos.length > 0 && (
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-1 text-sm">
                                Show { collapseOpen ? "Less" : "More" }
                                {
                                    collapseOpen ?
                                    <ChevronUp className="h-4 w-4" /> :
                                    <ChevronDown className="h-4 w-4" />
                                }
                            </Button>
                        </CollapsibleTrigger>
                    )}
                </CardFooter>
            </Collapsible>
        </Card>  
    )
}

export function MemoLink({ memo, recent, can_delete, openDelete }: { memo: EnrichedMemoType, recent?: boolean, can_delete: boolean, openDelete: (id: string) => void }) {
    return (
        <Link href={memo.file_url} target="_blank">
            <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={generatePreview(memo.company_website)} />
                        <AvatarFallback>{memo.company_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-x-2">
                        <span className="text-sm font-medium">{memo.memo_name}</span>
                        { recent && <Badge variant={"outline"}>Recent</Badge> }
                    </div>
                </div>
                <div className="flex space-x-2 items-center">
                    {
                        can_delete &&
                        <Button 
                            className="p-1 hover:bg-red-100 text-red-600"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {e.preventDefault(); openDelete(memo.id)}}
                        >
                            <Trash2 size={16} />
                        </Button>
                    }
                    <ChevronRight size={16} className="text-muted-foreground" />
                </div>
            </div>
        </Link>
    )
}