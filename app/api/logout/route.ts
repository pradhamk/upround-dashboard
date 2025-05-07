import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if(error) {
        return NextResponse.json({ message: "Error occurred during logout" }, { status: 500 });
    }

    return NextResponse.redirect('https://uproundvc.org'); // TODO: This won't work for now due to CORS; will be fixed when dashboard is live
}