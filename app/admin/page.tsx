import MemberTable from "@/components/MemberTable";
import { createClient } from "@/utils/supabase/server";
import { MemberProfile, WhitelistEntry } from "@/utils/utils";
import AddMember from "@/components/AddMember";

export default async function AdminPage() {
  const client = await createClient();
  const { data: members }: { data: MemberProfile[] | null } = await client
    .schema("members")
    .from("profiles")
    .select("*");

  const { data: whitelist }: { data: WhitelistEntry[] | null } = await client
    .schema("whitelist")
    .from("profiles")
    .select("*");

  return (
    <main className="w-full flex flex-col items-center">
      <div className="w-3/4 mt-10">
        <div className="flex justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <AddMember />
        </div>
        <MemberTable members={members ?? []} whitelist={whitelist ?? []} />
      </div>
    </main>
  );
}
