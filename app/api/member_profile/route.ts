import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server';
import { MemberProfile, MAX_ABOUT_SIZE, MAX_INPUT_SIZE } from '@/utils/utils';

export async function POST(request: Request) {
    const supabase = await createClient();
    let member_data: MemberProfile;
    try {
        member_data = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { data: user } = await supabase.auth.getUser();
    const { data } = await supabase
        .schema('members')
        .from('profiles')
        .select('*')
        .eq('id', member_data.id)
        .limit(1)
        .single();

    if (!data || member_data.email !== user.user?.email) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Input data validation
    if(member_data.name?.length as number > MAX_INPUT_SIZE) {
        return NextResponse.json({ error: 'Error: Name is too long.' }, { status: 400 });
    }
    if(member_data.major?.length as number > MAX_INPUT_SIZE) {
        return NextResponse.json({ error: 'Error: Major is too long.' }, { status: 400 });
    }
    if(Math.abs(member_data.graduation_date - new Date().getFullYear()) > 10) {
        return NextResponse.json({ error: 'Error: Graduation year is unreasonable.' }, { status: 400 });
    }
    if(!/^\+?[0-9]{1,4}?[-. ]?(\(?\d{3}\)?[-. ]?)?[\d-. ]{7,10}$/.test(member_data.phone as string)) {
        return NextResponse.json({ error: 'Error: Phone number is invalid.' }, { status: 400 });
    }
    if(!/^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]{3,100}\/?$/.test(member_data.linkedin as string)) {
        return NextResponse.json({ error: 'Error: Linkedin profile link is invalid.' }, { status: 400 });
    }
    if(member_data.about?.length as number > MAX_ABOUT_SIZE) {
        return NextResponse.json({ error: 'Error: About is too long.' }, { status: 400 });
    }

    let completed = true;
    for (const key of Object.keys(member_data) as (keyof MemberProfile)[]) {
        const value = member_data[key];
        if (
            value === null ||
            value === undefined ||
            (typeof value === 'string' && value.trim() === '')
        ) {
            completed = false;
            break;
        }
    }

    const res = await supabase
        .schema('members')
        .from('profiles')
        .update({
            name: member_data.name,
            linkedin: member_data.linkedin,
            pfp: member_data.pfp,
            major: member_data.major,
            graduation_date: member_data.graduation_date,
            about: member_data.about,
            phone: member_data.phone,
            completed: completed
        })
        .eq('id', member_data.id);

    if(res.error) {
        return NextResponse.json({ error: 'Failed to complete update' }, { status: 503 });
    }

    return NextResponse.json({ error: 'ok.' }, { status: 200 });
}