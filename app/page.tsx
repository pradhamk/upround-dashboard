import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const client = await createClient();
  const { user: user } = (await client.auth.getUser()).data;

  return (
    <>
      <h1>Welcome, {user?.user_metadata.name}</h1>
    </>
  );
}
