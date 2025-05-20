import { createClient } from "./server";
import { MemberProfile } from "../utils";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getUser() {
    const client = await createClient();
    const { user: user } = (await client.auth.getUser()).data;
    return user;
}

export async function getMemberById({ uid }: { uid: string }) {
    const client = await createClient();
    const { data, error }: { data: MemberProfile | null, error: any } = await client
                            .schema('members')
                            .from('profiles')
                            .select('*')
                            .eq('id', uid)
                            .limit(1)
                            .single();
    return { data, error };
}

export async function getMemberByEmail({ email }: { email: string }) {
    const client = await createClient();
    const { data, error }: { data: MemberProfile | null, error: any } = await client
                            .schema('members')
                            .from('profiles')
                            .select('*')
                            .eq('email', email)
                            .limit(1)
                            .single();
    return { data, error };
}

export async function getAllMembers() {
    const client = await createClient();
    const { data, error }: { data: MemberProfile[] | null, error: any } = await client
                            .schema('members')
                            .from('profiles')
                            .select('*');
    return { data, error };
}

export async function getUserProfile(supabase: SupabaseClient, email: string) {
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

export async function isAdmin(supabase: SupabaseClient) {
  const { data } = await supabase.auth.getUser();
  if(!data.user) {
    return false;
  }

  const { data: profile, error } = await supabase
                                    .schema('whitelist')
                                    .from('profiles')
                                    .select('*')
                                    .eq('email', data.user.email)
                                    .limit(1)
                                    .single();

  if (error || !data) {
    return false;
  }
  return profile['is_admin'];
}