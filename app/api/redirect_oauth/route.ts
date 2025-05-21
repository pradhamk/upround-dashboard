import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers";

export async function GET() {
    const client = await createClient();
    const redirectURL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/auth_callback` : "http://localhost:3000/api/auth_callback";
    const { data } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: redirectURL
        }
    });
    console.log(redirectURL)

    const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const redirectTo = `${protocol}://${host}/api/auth_callback`;
  console.log("URL: ", redirectTo);

    if(!data.url) {
        return Response.json({ message: 'An error occurred with Google OAuth' }, { status: 500 })
    }
    redirect(data.url);
}