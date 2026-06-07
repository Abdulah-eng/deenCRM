import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Benutzer-ID ist erforderlich.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseKey) {
      return NextResponse.json({ error: 'Supabase Service Role Key ist nicht konfiguriert.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Delete the public profile row first
    const { error: profileErr } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileErr) {
      console.warn("Warning deleting profile row:", profileErr.message);
    }

    // Delete the user from Supabase Auth
    const { error: authErr } = await supabase.auth.admin.deleteUser(id);

    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
