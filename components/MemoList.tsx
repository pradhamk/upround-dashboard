"use client";

import { convertDate, generatePreview, GroupedMemos } from "@/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export default function MemoList({ memos }: { memos: GroupedMemos | undefined }) {
    return (
        <div className="w-1/3 space-y-3">
            {
                memos ? Object.entries(memos).map(([name, memos]) => (
                    <Card key={name} className="hover:shadow-md transition-shadow duration-200 rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="w-full text-base">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">{name}</span>
                                <span className="text-xs text-muted-foreground">{convertDate(memos[0].created_at)}</span>
                            </div>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-0 space-y-2 flex flex-col">
                            {
                                memos.map((memo, i) => {
                                    return (
                                        <Link href={memo.file_url} target="_blank" key={i}>
                                            <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={generatePreview(memo.company_website)} />
                                                        <AvatarFallback>{memo.company_name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-x-2">
                                                        <span className="text-sm font-medium">{memo.memo_name}</span>
                                                        { i === 0 && <Badge variant={"outline"}>Recent</Badge> }
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-muted-foreground" />
                                            </div>
                                        </Link>
                                    )        
                                })
                            }
                        </CardContent>
                    </Card>  
                )) :
                <h1>There are currently no memos within the database.</h1>
            }
        </div>
    )
}