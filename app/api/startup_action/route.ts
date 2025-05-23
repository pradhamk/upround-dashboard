import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { DealflowStatus, MVCLevel, StartupProfile } from '@/utils/utils';
import { isAdmin } from '@/utils/supabase/utils';

type CreateReqBody = {
    method: 'create',
    profile: StartupProfile
};

type DeleteReqBody = {
    method: 'delete',
    company_id: string,
}

type UpdateReqBody = { // For now, only the dealflow status can be updated
    method: 'update',
    status: string,
    company_id: string,
}

export async function POST(request: Request) {
    const supabase = await createClient();

    let data: CreateReqBody | DeleteReqBody | UpdateReqBody;
    try {
        data = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    switch(data.method) {
        case 'create': {
            //make sure all fields are filled out
            const { id, ...profile } = data.profile;
            for(const [key, value] of Object.entries(profile)) {
                if(!value.trim()) {
                    return NextResponse.json({ error: `${key} can't be empty` }, { status: 400 });
                }
            }

            //validate dealflow status and mvc levels
            const validStatuses = Object.values(DealflowStatus);
            if (!validStatuses.includes(profile.status as DealflowStatus)) {
                return NextResponse.json({ error: 'Status must be valid' }, { status: 400 });
            }

            const validLevels = Object.values(MVCLevel);
            if (!validLevels.includes(profile.mvc_level as MVCLevel)) {
                return NextResponse.json({ error: 'MVC level must be valid' }, { status: 400 });
            }
            
            //validate website url
            try {
                new URL(profile.website)
            } catch (_) {
                return NextResponse.json({ error: 'Company website must be a valid url' }, { status: 400 });
            }

            //validate contact email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(profile.contact)) {
                return NextResponse.json({ error: 'Contact must be a valid email' }, { status: 400 });
            }

            //ensure existing company doesn't exist
            const existing_company = await supabase
                                        .schema('dealflow')
                                        .from('startups')
                                        .select('*')
                                        .eq('name', profile.name);
            if(existing_company.data?.length !== 0) {
                return NextResponse.json({ error: 'Startup already exists' }, { status: 400 });
            }

            //check if sourcer exists
            const res = await supabase
                            .schema('members')
                            .from('profiles')
                            .select('*')
                            .eq('id', profile.sourcer);
            if(res.data?.length !== 1) {
                return NextResponse.json({ error: 'No such sourcer exists' }, { status: 400 });
            }
            
            const { error } = await supabase
                                    .schema('dealflow')
                                    .from('startups')
                                    .insert(profile);
            if(error) {
                return NextResponse.json({ error: 'Failed to create startup. Try again later.' }, { status: 400 });
            }

            break;
        }
        
        case 'delete': {
            //check if user is an admin or not
            if(!isAdmin(supabase)) {
                return NextResponse.json({ error: 'You do not have permissions to perform this action' }, { status: 401 });
            }

            const res = await supabase
                            .schema('dealflow')
                            .from('startups')
                            .delete()
                            .eq('id', data.company_id);

            if(res.error) {
                return NextResponse.json({ error: 'Failed to delete startup. Try again later.' }, { status: 400 });
            }

            break;
        };

        case 'update': {
            if(!Object.values(DealflowStatus).includes(data.status as DealflowStatus)) {
                return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
            }

            const res = await supabase
                            .schema('dealflow')
                            .from('startups')
                            .update({
                                status: data.status
                            })
                            .eq('id', data.company_id);
                            
            if(res.error) {
                return NextResponse.json({ error: 'Failed to update startup. Try again later.' }, { status: 400 });
            }

            break;

        };

        default: {
            return NextResponse.json({ error: 'Method is not supported.' }, { status: 400 });
        }
    }

    return NextResponse.json({ message: 'Success' }, { status: 200 });
}