import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, full_name, role, company_id } = await request.json();

    if (!email || !full_name) {
      return NextResponse.json({ error: 'E-Mail und vollständiger Name sind erforderlich.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseKey) {
      return NextResponse.json({ error: 'Supabase Service Role Key ist nicht konfiguriert.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Create user in Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { full_name, role }
    });

    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 500 });
    }

    const userId = authData.user.id;

    // Create profile row
    const avatar_url = full_name.trim().charAt(0).toUpperCase();
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: full_name.trim(),
        role,
        company_id: company_id || null,
        avatar_url
      })
      .select('*, companies(id, name)')
      .single();

    if (profileErr) {
      // Transactional rollback: Cleanup the auth user if profile insertion fails
      await supabase.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: `Fehler beim Erstellen des Profils: ${profileErr.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
