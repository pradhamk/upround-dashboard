import { createClient } from '@/utils/supabase/server';
import { ClubRoles } from '@/utils/utils';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();

  let data: { email: string, roles: string[] };
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

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const res = await supabase
                .schema('members')
                .from('profiles')
                .update({ club_roles: data.roles })
                .eq('email', data.email)

  if (res.error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }

  return NextResponse.json({ message: 'ok.' }, { status: 200 });
}