import { createClient } from '@/utils/supabase/server';
import { ClubRoles } from '@/utils/utils';
import { NextResponse } from 'next/server';

type ReqBody = {
    email: string,
    roles: string[],
    is_admin: boolean,
}

export async function POST(request: Request) {
  const supabase = await createClient();

  let data: ReqBody;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const roles = Object.values(ClubRoles) as string[];
  for(const role of data.roles) {
    if(!roles.includes(role)) {
        return NextResponse.json({ error: `${role} is not a valid role.` }, { status: 400 });
    }
  }

  const { data: user, error } = await supabase
    .schema('members')
    .from('profiles')
    .select('*')
    .eq('email', data.email)
    .limit(1)
    .single();

  if (user) {
    return NextResponse.json({ error: 'Email already in database' }, { status: 400 });
  }

  const res = await supabase
                .schema('members')
                .from('profiles')
                .insert({
                  email: data.email,
                  club_roles: data.roles,
                });

  if (res.error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }

  await supabase
        .schema('whitelist')
        .from('profiles')
        .insert({
          email: data.email,
          is_admin: data.is_admin
        })

  return NextResponse.json({ message: 'ok.' }, { status: 200 });
}