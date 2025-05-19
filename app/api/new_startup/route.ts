import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { DealflowStatus, MVCLevel, StartupProfile } from '@/utils/utils';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    const supabase = await createClient();

    let data: StartupProfile;
    try {
        data = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    //make sure all fields are filled out
    const { id, ...fields } = data;
    for(const [key, value] of Object.entries(fields)) {
        if(!value.trim()) {
            return NextResponse.json({ error: `${key} can't be empty` }, { status: 400 });
        }
    }

    //validate dealflow status and mvc levels
    const validStatuses = Object.values(DealflowStatus);
    if (!validStatuses.includes(data.status as DealflowStatus)) {
        return NextResponse.json({ error: 'Status must be valid' }, { status: 400 });
    }

    const validLevels = Object.values(MVCLevel);
    if (!validLevels.includes(data.mvc_level as MVCLevel)) {
        return NextResponse.json({ error: 'MVC level must be valid' }, { status: 400 });
    }
    
    //validate website url
    try {
        new URL(data.website)
    } catch (_) {
        return NextResponse.json({ error: 'Company website must be a valid url' }, { status: 400 });
    }

    //validate contact email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(data.contact)) {
        return NextResponse.json({ error: 'Contact must be a valid email' }, { status: 400 });
    }

    //ensure existing company doesn't exist
    const existing_company = await supabase
                                .schema('dealflow')
                                .from('startups')
                                .select('*')
                                .eq('name', data.name);
    if(existing_company.data?.length !== 0) {
        return NextResponse.json({ error: 'Startup already exists' }, { status: 400 });
    }

    //check if sourcer exists
    const res = await supabase
                    .schema('members')
                    .from('profiles')
                    .select('*')
                    .eq('id', data.sourcer);
    if(res.data?.length !== 1) {
        return NextResponse.json({ error: 'No such sourcer exists' }, { status: 400 });
    }
    
    const { error } = await supabase
                        .schema('dealflow')
                        .from('startups')
                        .insert(fields);

    if(error) {
        return NextResponse.json({ error: 'Failed to create startup. Try again later.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Success' }, { status: 200 });
}