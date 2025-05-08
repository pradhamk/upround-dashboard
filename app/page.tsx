import InvalidMember from "@/components/dialogs/ErrorDialog";
import UserEditDialog from "@/components/dialogs/UserEditDialog";
import { createClient } from "@/utils/supabase/server";
import { MemberProfile } from "@/utils/utils";

export default async function Home() {
  const client = await createClient();
  const { user: user } = (await client.auth.getUser()).data;

  let initialState = false;
  let errorState = false;

  const { data }: { data: MemberProfile[] | null } = await client
                .schema('members')
                .from('profiles')
                .select('*')
                .eq('email', user?.email);

  if (!data?.length || data?.length === 0) {
    errorState = true;
  } else if (!data[0].completed) {
    initialState = true;
  }

  return (
    <>
      <div className="relative pt-24 pl-16 flex flex-row text-5xl font-semibold">
        <h1>Welcome back,&nbsp;</h1>
        <h1 className="text-[#12AE8A]"> {user?.user_metadata.name}</h1>
      </div>
      <UserEditDialog 
        user={user} 
        dialogOpen={initialState} 
        member_data={data?.[0]} 
        mode="firstlogin"
        key={"First Login Dialog Prompt"}
      />
      <InvalidMember open={errorState} />
    </>
  );
}
