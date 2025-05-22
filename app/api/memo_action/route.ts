import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { MemoType } from '@/utils/utils';

if(!process.env.SERVICE_ACCOUNT) {
    throw new Error("No service account credentials defined.");
}

const auth = new google.auth.GoogleAuth(({
    credentials: JSON.parse(Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString("utf-8")),
    scopes: ['https://www.googleapis.com/auth/drive.file'],
}))

export async function POST(request: Request) {
    const supabase = await createClient();

    const form_data = await request.formData();
    const method = form_data.get('method') as string;
    
    if(!method) {
        return NextResponse.json({ error: 'Invalid form body' }, { status: 400 });
    }

    const auth_client = await auth.getClient() as any;
    if(!auth_client) {
        return NextResponse.json({ error: 'Failed to establish authentication with Google Drive' }, { status: 500 });
    }
    const drive = google.drive({ version: "v3", auth: auth_client })

    
    switch(method) {
        case 'create': {
            const company_id = form_data.get('company_id') as string;
            const file = form_data.get('memo') as File;

            if(!company_id || !file) {
                return NextResponse.json({ error: 'Invalid form body' }, { status: 400 });
            }

            const check_res = await supabase
                                .schema('dealflow')
                                .from('startups')
                                .select('*', { count: 'exact' });
            if(check_res.error || check_res.count === 0) {
                return NextResponse.json({ error: 'No such startup exists' }, { status: 400 });
            }

            let uploadLink;
            try {
                if (!process.env.GDRIVE_FOLDER_ID) {
                    throw new Error('GDRIVE_FOLDER_ID is not set');
                }

                const upload_body = Readable.from(Buffer.from(await file.arrayBuffer()))
                const upload_res = await drive.files.create({
                    requestBody: {
                        name: file.name,
                        mimeType: 'application/pdf',
                        parents: [process.env.GDRIVE_FOLDER_ID]
                    },
                    media: {
                        mimeType: 'application/pdf',
                        body: upload_body
                    },
                    fields: 'webViewLink',
                })

                if(upload_res.status !== 200) {
                    throw new Error('Upload failed')
                }

                const { webViewLink } = upload_res.data;
                uploadLink = webViewLink;
            } catch(e) {
                console.error(e)
                return NextResponse.json({ error: 'Memo upload to Google Drive failed' }, { status: 500 });
            }

            const res = await supabase
                            .schema('dealflow')
                            .from('memos')
                            .insert({
                                file_url: uploadLink,
                                company_id: company_id,
                                created_at: new Date(),
                                memo_name: file.name
                            })

            if(res.error) {
                return NextResponse.json({ error: 'Failed to save memo info in db. Please try again later.' }, { status: 400 });
            }

            break;
        }

        case 'delete': {
            const memo_id = form_data.get('id') as string;
            const remove_file = form_data.get('remove_file') as string;

            if(!memo_id || !remove_file) {
                return NextResponse.json({ error: 'Invalid form body' }, { status: 400 });
            }

            const { data: memo_data, error }: { data: MemoType | null, error: any } = await supabase
                                .schema('dealflow')
                                .from('memos')
                                .select('*')
                                .eq('id', memo_id)
                                .limit(1)
                                .single();
            if(error || !memo_data) {
                return NextResponse.json({ error: 'No such memo exists.' }, { status: 400 });
            }
            
            if(remove_file === 'true') {
                try {
                    const parts = memo_data.file_url.split('/');
                    const file_id = parts[parts.length - 2];

                    const drive_del_res = await drive.files.delete({
                        fileId: file_id
                    })

                    if(drive_del_res.status !== 200 && drive_del_res.status !== 204) {
                        return NextResponse.json({ error: 'Failed to remove file from Google Drive.' }, { status: 500 });
                    }
                } catch(e) {
                    console.error(e)
                    return NextResponse.json({ error: 'Failed to remove file from Google Drive.' }, { status: 500 });
                }
                
            }

            const del_res = await supabase
                                .schema('dealflow')
                                .from('memos')
                                .delete()
                                .eq('id', memo_id);

            if(del_res.error) {
                return NextResponse.json({ error: 'Failed to delete memo. Try again later.' }, { status: 500 });
            }

            break;
        }
    
        default: {
            return NextResponse.json({ error: 'Method is not supported.' }, { status: 400 });
        }
    }

    return NextResponse.json({ message: 'Success' }, { status: 200 });
}