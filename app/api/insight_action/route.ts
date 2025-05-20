import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { InsightActionBody } from '@/utils/utils';

export async function POST(request: Request) {
    const supabase = await createClient();

    let data: InsightActionBody;
    try {
        data = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { data: userData } = await supabase.auth.getUser();
    const userEmail = userData?.user?.email;

    const { data: memberProfile, error: memberError } = await supabase
        .schema('members')
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .single();

    if (memberError || !memberProfile) {
        return NextResponse.json({ error: 'Failed to get member profile' }, { status: 400 });
    }

    const { data: company, error: companyError } = await supabase
        .schema('dealflow')
        .from('startups')
        .select('id')
        .eq('id', data.company_id)
        .single();

    if (companyError || !company) {
        return NextResponse.json({ error: 'Startup does not exist' }, { status: 404 });
    }

    switch(data.method) {
        case 'create': {
            const { error: insertError } = await supabase
                .schema('dealflow')
                .from('insights')
                .insert({
                    member: memberProfile.id,
                    company: data.company_id,
                    notes: data.notes,
                });

            if(insertError) {
                return NextResponse.json({ error: 'Failed to create insight' }, { status: 400 });
            }
            break;
        }

        case 'edit': {
            if(!data.insight_id) {
                return NextResponse.json({ error: 'Missing insight_id for update' }, { status: 400 });
            }

            const { error: updateError } = await supabase
                .schema('dealflow')
                .from('insights')
                .update({ notes: data.notes })
                .eq('id', data.insight_id)
                .select();

            if(updateError) {
                return NextResponse.json({ error: 'Failed to update insight' }, { status: 400 });
            }
            break;
        }

        case 'delete': {
            if(!data.insight_id) {
                return NextResponse.json({ error: 'Missing insight_id for delete' }, { status: 400 });
            }

            const { error: deleteError } = await supabase
                .schema('dealflow')
                .from('insights')
                .delete()
                .eq('id', data.insight_id)
                .select();

            if(deleteError) {
                return NextResponse.json({ error: 'Failed to delete insight' }, { status: 400 });
            }
            break;
        }

        default: {
            return NextResponse.json({ error: 'Unsupported method' }, { status: 400 });
        }
    }

    return NextResponse.json({ message: 'Success' }, { status: 200 });
}