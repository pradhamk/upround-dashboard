import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const client = await createClient();
  const { user: user } = (await client.auth.getUser()).data;

  return (
    <div className="relative pt-24 pl-16 flex flex-row text-5xl font-semibold">
      <h1>Welcome back,&nbsp;</h1>
      <h1 className="text-[#12AE8A]"> {user?.user_metadata.name}</h1>
    </div>
  );
}
