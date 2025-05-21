import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function GET() {
    const client = await createClient();
    const redirectURL = process.env.VERCEL_PROD_URL ? `https://${process.env.VERCEL_PROD_URL}/api/auth_callback` : "http://localhost:3000/api/auth_callback";
    const { data } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: redirectURL
        }
    });

    if(!data.url) {
        return Response.json({ message: 'An error occurred with Google OAuth' }, { status: 500 })
    }
    redirect(data.url);
}