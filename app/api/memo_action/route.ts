import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

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
    const company_id = form_data.get('company_id') as string;
    
    if(!method || !company_id) {
        return NextResponse.json({ error: 'Invalid form body' }, { status: 400 });
    }

    switch(method) {
        case 'create': {
            const file = form_data.get('memo') as File;

            if(!file) {
                return NextResponse.json({ error: 'Invalid form body' }, { status: 400 });
            }

            const check_res = await supabase
                                .schema('dealflow')
                                .from('startups')
                                .select('*', { count: 'exact' });
            if(check_res.error || check_res.count === 0) {
                return NextResponse.json({ error: 'No such startup exists' }, { status: 400 });
            }

            const auth_client = await auth.getClient() as any;
            if(!auth_client) {
                return NextResponse.json({ error: 'Failed to establish authentication with Google Drive' }, { status: 500 });
            }
            const drive = google.drive({ version: "v3", auth: auth_client })

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
                                created_at: new Date().toISOString().split('T')[0],
                                memo_name: file.name
                            })

            if(res.error) {
                return NextResponse.json({ error: 'Failed to save memo info in db. Please try again later.' }, { status: 400 });
            }

            break;
        }

        case 'edit': {
            break;
        }
    
        default: {
            return NextResponse.json({ error: 'Method is not supported.' }, { status: 400 });
        }
    }

    return NextResponse.json({ message: 'Success' }, { status: 200 });
}