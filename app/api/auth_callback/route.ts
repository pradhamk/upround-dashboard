import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(`${origin}/bad_auth`)
    }

    const user_email = user.user?.email;
    const { data } = await supabase
                    .schema('whitelist')
                    .from('profiles')
                    .select("*")
                    .eq('email', user_email)
                    .limit(1)
                    .single();

    if(!data || data.id !== user.user?.id) {
      return NextResponse.redirect('https://www.uproundvc.org/join');
    }

    return NextResponse.redirect(`${origin}`)
  }

  return NextResponse.redirect(`${origin}/bad_auth`)
}