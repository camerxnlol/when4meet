import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const { username, available, if_needed} = await req.json()
    var { data, error } = await supabase
        .from('user_availability')
        .upsert([{username, available, if_needed}], {
            onConflict: 'username',
        });

    if (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }

    return NextResponse.json({data})
}