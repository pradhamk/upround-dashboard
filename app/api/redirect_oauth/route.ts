import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function GET() {
    const client = await createClient();
    const { data } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000/api/auth_callback"
        }
    });

    if(!data.url) {
        return Response.json({ message: 'An error occurred with Google OAuth' }, { status: 500 })
    }
    redirect(data.url);
}