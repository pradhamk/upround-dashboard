import { EnrichedAnalystInsight } from "@/utils/utils";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function MemberInsight({ insight }: { insight: EnrichedAnalystInsight }) {
    return (
        <Card>
            <CardHeader className="flex flex-row space-x-3 items-center">
                <Avatar>
                    <AvatarImage src={insight.user_pfp}/>
                    <AvatarFallback>{insight.user_name} Profile</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="font-bold">{insight.user_name}</h1>
                    <h3 className="opacity-75 text-sm">
                        {new Date(insight.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </h3>
                </div>
            </CardHeader>
            <CardContent>
                {insight.notes}
            </CardContent>
        </Card>
    )
}