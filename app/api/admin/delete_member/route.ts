import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  let data: { email: string };
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { data: user, error } = await supabase
    .schema('members')
    .from('profiles')
    .select('*')
    .eq('email', data.email)
    .limit(1)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const res = await supabase
                .schema('members')
                .from('profiles')
                .delete()
                .eq('email', data.email)

  if (res.error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }

  await supabase
    .schema('whitelist')
    .from('profiles')
    .delete()
    .eq('email', data.email)

  return NextResponse.json({ message: 'ok.' }, { status: 200 });
}