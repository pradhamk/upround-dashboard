import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js';

async function getUserFromCode(supabase: SupabaseClient, code: string) {
  const { data: user, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !user) {
    throw new Error('Failed to exchange code for session');
  }
  return user;
}

async function getUserProfile(supabase: SupabaseClient, email: string) {
  const { data, error } = await supabase
    .schema('whitelist')
    .from('profiles')
    .select('*')
    .eq('email', email)
    .limit(1)
    .single();

  if (error || !data) {
    throw new Error('User profile not found or invalid');
  }
  return data;
}

async function fetchProfilePicture(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch profile picture');
  }
  return await res.arrayBuffer();
}

async function uploadProfilePicture(supabase: SupabaseClient, buffer: ArrayBuffer, filename: string, contentType: string) {
  const dest = `members/${filename}.png`;
  const uploadRes = await supabase.storage
    .from('pfps')
    .upload(dest, buffer, { 
      contentType, 
      upsert: true,
    });

  if (uploadRes.error) {
    throw new Error('Failed to upload profile picture');
  }

  return await supabase.storage.from('pfps').getPublicUrl(dest);
}

async function updateUserProfile(supabase: SupabaseClient, email: string, pfpUrl: string) {
  const { error } = await supabase
    .schema('members')
    .from('profiles')
    .update({ pfp: pfpUrl })
    .eq('email', email);

  if (error) {
    throw new Error('Failed to update user profile');
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/bad_auth`);
  }

  try {
    const supabase = await createClient();
    const user = await getUserFromCode(supabase, code);
    const userProfile = await getUserProfile(supabase, user.user?.email ?? '');

    if (userProfile.id !== user.user?.id) {
      await supabase.auth.signOut();
      return NextResponse.redirect('https://www.uproundvc.org/join');
    }

    const buffer = await fetchProfilePicture(user.user.user_metadata.picture);
    const pfpRes = await uploadProfilePicture(supabase, buffer, user.user.id, 'image/png');
    
    await updateUserProfile(supabase, user.user.email as string, pfpRes.data.publicUrl);

    return NextResponse.redirect(`${origin}`);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${origin}/bad_auth`);
  }
}
