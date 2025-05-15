import { createClient } from "./server";
import { MemberProfile } from "../utils";

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