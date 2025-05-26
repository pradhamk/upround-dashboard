import { createClient } from '@/utils/supabase/server';
import { ClubRoles } from '@/utils/utils';
import { NextResponse } from 'next/server';
import fs from "fs/promises";

async function sendInvite(email: string): Promise<boolean> {
  const template = await fs.readFile("email_templates/invite.html");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_KEY}`,
    },
    body: JSON.stringify({
      from: "UpRound Admin <admin@upround.vc>",
      to: [email],
      subject: "Welcome to UpRound!",
      html: template.toString(),
    }),
  });

  if(res.status === 200) {
    return true
  } else {
    return false
  }
}

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

  const email_sent = await sendInvite(data.email);
  if(!email_sent) {
    return NextResponse.json({ error: 'User was added to db but invite email failed to send' }, { status: 500 });
  }

  return NextResponse.json({ message: 'ok.' }, { status: 200 });
}