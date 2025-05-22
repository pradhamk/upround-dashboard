import CreateMemo from "@/components/CreateMemo";
import MemoList from "@/components/MemoList";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/utils/supabase/utils";
import { EnrichedMemoType } from "@/utils/utils";

export default async function Memos() {
    const client = await createClient();
    const { data: memos }: { data: EnrichedMemoType[] | null } = await client
                                .schema('dealflow')
                                .from('memo_and_startups')
                                .select('*');    
    const groupedMemos = memos?.reduce<Record<string, EnrichedMemoType[]>>((acc, memo) => {
        const key = memo.company_name;

        if (!acc[key]) {
            acc[key] = [memo];
        } else {
            const index = acc[key].findIndex(existing => new Date(existing.created_at) < new Date(memo.created_at)); // Janky attempt at sorting but it works
            if (index === -1) {
                acc[key].push(memo);
            } else {
                acc[key].splice(index, 0, memo);
            }
        }

        return acc;
    }, {});

    const is_admin = await isAdmin(client);

    return (
        <main className="w-full flex flex-col items-center justify-center">
            <div className="w-3/4 flex justify-between mt-10">
                <h1 className="font-bold text-3xl">Memos</h1>
                <CreateMemo />
            </div>
            <MemoList memos={groupedMemos} is_admin={is_admin}/>
        </main>
    )
}